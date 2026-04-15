"""Scrape popular product listings from Allegro.pl using Scrapling."""
import warnings
warnings.filterwarnings("ignore")

import os
import re
import time
from pathlib import Path

dotenv_path = Path(__file__).parent / ".env"
if dotenv_path.exists():
    for line in dotenv_path.read_text().strip().splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())
import hashlib
from datetime import datetime, timezone

from scrapling.fetchers import StealthyFetcher
from supabase import create_client

from scrape_slot import categories_for_this_run, env_int, time_slots_count, current_slot_index

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit("Set SUPABASE_URL and SUPABASE_KEY environment variables")
sb = create_client(SUPABASE_URL, SUPABASE_KEY)


def allegro_limits() -> dict:
    return {
        "max_pages": env_int("ALLEGRO_MAX_PAGES", 10, minimum=1, maximum=250),
        "max_items_total": env_int("ALLEGRO_MAX_ITEMS", 200, minimum=5, maximum=25000),
        "max_items_per_page": env_int("ALLEGRO_MAX_ITEMS_PER_PAGE", 90, minimum=5, maximum=120),
        "page_sleep": env_int("ALLEGRO_PAGE_SLEEP", 2, minimum=1, maximum=30),
    }


def allegro_listing_url(base_url: str, page: int) -> str:
    if page <= 1:
        return base_url
    sep = "&" if "?" in base_url else "?"
    return f"{base_url}{sep}p={page}"


ALLEGRO_CATEGORIES = [
    {"url": "https://allegro.pl/kategoria/smartfony-i-telefony-komorkowe-165", "category_id": "phones", "path": ["Electronics", "Phones"]},
    {"url": "https://allegro.pl/kategoria/laptopy-491", "category_id": "laptops", "path": ["Electronics", "Laptops"]},
    {"url": "https://allegro.pl/kategoria/sluchawki-260767", "category_id": "headphones", "path": ["Electronics", "TV & Audio", "Headphones"]},
    {"url": "https://allegro.pl/kategoria/konsole-256085", "category_id": "consoles", "path": ["Gaming", "Consoles"]},
    {"url": "https://allegro.pl/kategoria/odkurzacze-i-akcesoria-213", "category_id": "appliances", "path": ["Home & Garden", "Appliances"]},
    {"url": "https://allegro.pl/kategoria/perfumy-damskie-261320", "category_id": "perfume", "path": ["Beauty", "Perfume"]},
    {"url": "https://allegro.pl/kategoria/buty-sportowe-meskie-139920", "category_id": "sneakers", "path": ["Fashion", "Shoes", "Sneakers"]},
    {"url": "https://allegro.pl/kategoria/tablety-261011", "category_id": "tablets", "path": ["Electronics", "Tablets"]},
]

def make_slug(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower().strip())
    slug = slug.strip("-")[:80]
    short_hash = hashlib.md5(title.encode()).hexdigest()[:6]
    return f"{slug}-{short_hash}"

def parse_price(text: str) -> float | None:
    if not text:
        return None
    cleaned = re.sub(r"[^\d,.]", "", text.replace(",", ".").replace(" ", ""))
    try:
        return round(float(cleaned), 2)
    except (ValueError, TypeError):
        return None

def _parse_allegro_listing_nodes(items: list, cat_info: dict, cap: int) -> list[dict]:
    products: list[dict] = []
    for item in items[:cap]:
        try:
            link_el = item.css_first("a[href*='/oferta/']") or item.css_first("a[href*='allegro.pl']") or item.css_first("h2 a") or item.css_first("a")
            if not link_el:
                continue

            title = (link_el.attrib.get("title") or link_el.text or "").strip()
            if not title or len(title) < 5:
                alt_title = item.css_first("h2")
                if alt_title:
                    title = (alt_title.text or "").strip()
            if not title or len(title) < 5:
                continue

            href = link_el.attrib.get("href", "")
            product_url = href if href.startswith("http") else f"https://allegro.pl{href}"

            price_el = item.css_first("[aria-label*='cena']") or item.css_first("span.mli8_k4") or item.css_first("span[data-role='price']")
            price = None
            if price_el:
                price = parse_price(price_el.text)

            if not price:
                all_spans = item.css("span")
                for span in all_spans:
                    t = (span.text or "").strip()
                    if re.search(r"\d+[,.]\d{2}\s*zł", t):
                        price = parse_price(t)
                        break

            if not price:
                continue

            img_el = item.css_first("img")
            img_url = ""
            if img_el:
                img_url = img_el.attrib.get("src") or img_el.attrib.get("data-src") or ""

            products.append({
                "title": title[:200],
                "slug": make_slug(title),
                "image_url": img_url,
                "store_name": "Allegro",
                "store_logos": ["AL"],
                "current_price": price,
                "category_id": cat_info["category_id"],
                "category_path": cat_info["path"],
                "deal_type": "online",
                "source_url": product_url,
                "source": "allegro",
                "upvotes": 0,
                "downvotes": 0,
                "engagement": 0,
                "scraped_at": datetime.now(timezone.utc).isoformat(),
            })
        except Exception as e:
            print(f"    Error parsing item: {e}")
            continue
    return products


def scrape_allegro_category(cat_info: dict) -> list[dict]:
    """Scrape Allegro category across multiple listing pages (?p=2, ...)."""
    lim = allegro_limits()
    base_url = cat_info["url"]
    merged: list[dict] = []
    seen_slugs: set[str] = set()

    for page_num in range(1, lim["max_pages"] + 1):
        url = allegro_listing_url(base_url, page_num)
        print(f"  Page {page_num}: {url}")

        try:
            page = StealthyFetcher.fetch(url, headless=True, block_images=True)
        except Exception as e:
            print(f"    Failed to fetch: {e}")
            break

        items = page.css("article[data-analytics-view-custom-context]") or page.css("[data-role='offer']") or page.css(".mgn2_14.m9qz_yp")
        if not items:
            print("    No items with primary selectors, trying broader...")
            items = page.css("article") or []
            items = [i for i in items if i.css_first("a") and i.css_first("span")]

        print(f"    Found {len(items)} raw nodes")
        page_products = _parse_allegro_listing_nodes(items, cat_info, lim["max_items_per_page"])
        added = 0
        for p in page_products:
            if p["slug"] in seen_slugs:
                continue
            seen_slugs.add(p["slug"])
            merged.append(p)
            added += 1

        print(f"    Parsed {added} new products (total {len(merged)})")

        if len(merged) >= lim["max_items_total"] or not items:
            break
        if not page_products:
            break
        if added == 0:
            break

        if page_num < lim["max_pages"]:
            time.sleep(lim["page_sleep"])

    return merged[: lim["max_items_total"]]

def save_products(products: list[dict]):
    """Save products to Supabase."""
    if not products:
        return []

    saved = []
    for p in products:
        try:
            existing = sb.table("products").select("id").eq("slug", p["slug"]).limit(1).execute()
            if existing.data:
                sb.table("products").update({
                    "current_price": p["current_price"],
                    "scraped_at": p["scraped_at"],
                }).eq("slug", p["slug"]).execute()
                saved.append({**p, "id": existing.data[0]["id"]})
            else:
                result = sb.table("products").insert(p).execute()
                if result.data:
                    saved.append(result.data[0])
        except Exception as e:
            print(f"    DB error for '{p.get('title', '?')[:40]}': {e}")
    return saved

def save_price_history(product_id: str, price: float):
    try:
        sb.table("price_history").insert({
            "product_id": product_id,
            "price": price,
            "store_name": "Allegro",
        }).execute()
    except Exception as e:
        print(f"    Price history error: {e}")

def run():
    lim = allegro_limits()
    cats = categories_for_this_run(ALLEGRO_CATEGORIES)
    slots = time_slots_count()
    slot = current_slot_index()
    print("=" * 60)
    print("Allegro.pl Scraper")
    print(f"Categories this run: {len(cats)} / {len(ALLEGRO_CATEGORIES)} (slot {slot}/{slots}, UTC)")
    print(
        f"Limits: max_pages={lim['max_pages']}, max_items_total={lim['max_items_total']}, "
        f"max_items_per_page={lim['max_items_per_page']}, page_sleep={lim['page_sleep']}s"
    )
    print("=" * 60)

    total = 0
    for cat in cats:
        print(f"\nCategory: {cat['path']}")
        products = scrape_allegro_category(cat)
        print(f"  Collected {len(products)} products (pre-save)")

        saved = save_products(products)
        total += len(saved)

        for sp in saved:
            save_price_history(sp["id"], sp["current_price"])

        time.sleep(3)

    print(f"\n{'=' * 60}")
    print(f"Done! Total products saved: {total}")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    run()
