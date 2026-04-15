"""Mega Ceneo.pl Scraper - Scrapling + Supabase. Pulls products, offers, and prices."""
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

from ceneo_category_urls import CENEO_EXTRA_CATEGORIES
from scrape_slot import categories_for_this_run, env_int, time_slots_count, current_slot_index

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit("Set SUPABASE_URL and SUPABASE_KEY environment variables")
sb = create_client(SUPABASE_URL, SUPABASE_KEY)


def ceneo_limits() -> dict:
    """Tune via env for larger runs (e.g. GitHub hourly job)."""
    return {
        "items": env_int("CENEO_MAX_ITEMS", 180, minimum=5, maximum=12000),
        "pages": env_int("CENEO_MAX_PAGES", 12, minimum=1, maximum=700),
        "offers_per_product": env_int("CENEO_MAX_OFFERS_PER_PRODUCT", 55, minimum=1, maximum=500),
        "offer_products": env_int("CENEO_OFFER_PRODUCTS", 22, minimum=0, maximum=500),
    }

CENEO_CATEGORIES = [
    # Electronics
    {"url": "https://www.ceneo.pl/Smartfony", "category_id": "phones", "path": ["Electronics", "Phones"]},
    {"url": "https://www.ceneo.pl/Laptopy", "category_id": "laptops", "path": ["Electronics", "Laptops"]},
    {"url": "https://www.ceneo.pl/Sluchawki", "category_id": "headphones", "path": ["Electronics", "TV & Audio", "Headphones"]},
    {"url": "https://www.ceneo.pl/Telewizory", "category_id": "tv-audio", "path": ["Electronics", "TV & Audio"]},
    {"url": "https://www.ceneo.pl/Tablety_graficzne", "category_id": "tablets", "path": ["Electronics", "Tablets"]},
    {"url": "https://www.ceneo.pl/Monitory", "category_id": "computers", "path": ["Electronics", "Computers"]},
    {"url": "https://www.ceneo.pl/Aparaty_cyfrowe", "category_id": "cameras", "path": ["Electronics", "Cameras"]},
    {"url": "https://www.ceneo.pl/Glosniki_przenonsne", "category_id": "speakers", "path": ["Electronics", "TV & Audio", "Speakers"]},
    {"url": "https://www.ceneo.pl/Smartwatche", "category_id": "accessories-electronics", "path": ["Electronics", "Accessories"]},
    {"url": "https://www.ceneo.pl/Drukarki", "category_id": "computers", "path": ["Electronics", "Computers"]},
    # Gaming
    {"url": "https://www.ceneo.pl/Konsole_do_gier", "category_id": "consoles", "path": ["Gaming", "Consoles"]},
    {"url": "https://www.ceneo.pl/Gry_na_konsole", "category_id": "games", "path": ["Gaming", "Games"]},
    {"url": "https://www.ceneo.pl/Klawiatury_dla_graczy", "category_id": "gaming-accessories", "path": ["Gaming", "Gaming Accessories"]},
    {"url": "https://www.ceneo.pl/Myszki_dla_graczy", "category_id": "gaming-accessories", "path": ["Gaming", "Gaming Accessories"]},
    {"url": "https://www.ceneo.pl/Fotele_dla_graczy", "category_id": "pc-gaming", "path": ["Gaming", "PC Gaming"]},
    # Home & Garden
    {"url": "https://www.ceneo.pl/Odkurzacze", "category_id": "appliances", "path": ["Home & Garden", "Appliances"]},
    {"url": "https://www.ceneo.pl/Ekspresy_do_kawy", "category_id": "kitchen", "path": ["Home & Garden", "Kitchen"]},
    {"url": "https://www.ceneo.pl/Pralki", "category_id": "appliances", "path": ["Home & Garden", "Appliances"]},
    {"url": "https://www.ceneo.pl/Lodowki", "category_id": "appliances", "path": ["Home & Garden", "Appliances"]},
    {"url": "https://www.ceneo.pl/Zmywarki", "category_id": "appliances", "path": ["Home & Garden", "Appliances"]},
    {"url": "https://www.ceneo.pl/Piekarniki", "category_id": "kitchen", "path": ["Home & Garden", "Kitchen"]},
    {"url": "https://www.ceneo.pl/Frytkownice", "category_id": "kitchen", "path": ["Home & Garden", "Kitchen"]},
    {"url": "https://www.ceneo.pl/Blendery_kielichowe", "category_id": "kitchen", "path": ["Home & Garden", "Kitchen"]},
    {"url": "https://www.ceneo.pl/Oczyszczacze_powietrza", "category_id": "appliances", "path": ["Home & Garden", "Appliances"]},
    {"url": "https://www.ceneo.pl/Meble_ogrodowe", "category_id": "garden", "path": ["Home & Garden", "Garden"]},
    {"url": "https://www.ceneo.pl/Narzedzia_ogrodnicze", "category_id": "garden", "path": ["Home & Garden", "Garden"]},
    # Fashion
    {"url": "https://www.ceneo.pl/Buty_sportowe_meskie", "category_id": "sneakers", "path": ["Fashion", "Shoes", "Sneakers"]},
    {"url": "https://www.ceneo.pl/Torebki_damskie", "category_id": "bags", "path": ["Fashion", "Bags & Luggage"]},
    {"url": "https://www.ceneo.pl/Zegarki_meskie", "category_id": "jewelry", "path": ["Fashion", "Jewelry & Watches"]},
    {"url": "https://www.ceneo.pl/Zegarki_damskie", "category_id": "jewelry", "path": ["Fashion", "Jewelry & Watches"]},
    # Beauty
    {"url": "https://www.ceneo.pl/Perfumy_i_wody_damskie", "category_id": "perfume", "path": ["Beauty", "Perfume"]},
    {"url": "https://www.ceneo.pl/Perfumy_i_wody_meskie", "category_id": "perfume", "path": ["Beauty", "Perfume"]},
    {"url": "https://www.ceneo.pl/Kremy_do_twarzy", "category_id": "skincare", "path": ["Beauty", "Skincare"]},
    {"url": "https://www.ceneo.pl/Szampony", "category_id": "skincare", "path": ["Beauty", "Skincare"]},
    # Sports
    {"url": "https://www.ceneo.pl/Rowery", "category_id": "cycling", "path": ["Sports & Tourism", "Cycling"]},
    {"url": "https://www.ceneo.pl/Bieznie", "category_id": "fitness", "path": ["Sports & Tourism", "Fitness"]},
    {"url": "https://www.ceneo.pl/Hulajnogi_elektryczne", "category_id": "outdoor", "path": ["Sports & Tourism", "Outdoor"]},
    # Kids
    {"url": "https://www.ceneo.pl/Klocki_LEGO", "category_id": "kids", "path": ["Kids"]},
    {"url": "https://www.ceneo.pl/Wozki_dzieciece", "category_id": "kids", "path": ["Kids"]},
    # Health
    {"url": "https://www.ceneo.pl/Cinieniomierze", "category_id": "health", "path": ["Health"]},
    # Automotive
    {"url": "https://www.ceneo.pl/Opony_letnie", "category_id": "automotive", "path": ["Automotive"]},
] + CENEO_EXTRA_CATEGORIES


def _ceneo_product_blurb(title: str, path: list[str]) -> str:
    tail = " › ".join(path[-2:]) if len(path) >= 2 else (path[0] if path else "Ceneo")
    text = f"{title[:160]} — {tail}. Porównanie cen na Ceneo.pl."
    return text[:900]

def make_slug(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower().strip())
    slug = slug.strip("-")[:80]
    short_hash = hashlib.md5(title.encode()).hexdigest()[:6]
    return f"{slug}-{short_hash}"

def fix_image_url(url: str) -> str:
    """Convert small thumbnail to large product image."""
    if not url:
        return ""
    if url.startswith("//"):
        url = f"https:{url}"
    # f- = small, i- = medium, p- = large
    url = re.sub(r"/f-", "/i-", url)
    return url

def parse_price_parts(value_text: str, penny_text: str) -> float | None:
    value = re.sub(r"[^\d]", "", value_text or "")
    penny = re.sub(r"[^\d]", "", penny_text or "0")
    if not value:
        return None
    try:
        return float(f"{value}.{penny}")
    except ValueError:
        return None

def scrape_category_page(url: str) -> tuple[list, bool]:
    """Scrape a single page. Returns (items_data, has_next_page)."""
    try:
        page = StealthyFetcher.fetch(url, headless=True, block_images=True)
    except Exception as e:
        print(f"    Fetch failed: {e}")
        return [], False

    items = page.css(".cat-prod-row")
    has_next = bool(page.css("a.pagination__next") or page.css("[data-testid='pagination-next']"))

    parsed = []
    for item in items:
        try:
            link = item.find("a")
            if not link:
                continue
            title = (link.attrib.get("title") or "").strip()
            href = link.attrib.get("href", "")
            if not title:
                spans = item.css("span")
                for s in spans:
                    t = (s.text or "").strip()
                    if len(t) > 10 and not any(c in t for c in ["zł", "sklep", "wysyłk", "Darmowa"]):
                        title = t
                        break
            if not title or len(title) < 5:
                continue

            product_url = f"https://www.ceneo.pl{href}" if href.startswith("/") else href

            values = item.css(".value")
            pennies = item.css(".penny")
            price = parse_price_parts(
                (values[0].text if values else "") or "",
                (pennies[0].text if pennies else "") or ""
            )
            if not price or price < 1:
                continue

            img_url = ""
            for img in item.css("img"):
                src = img.attrib.get("src", "") or img.attrib.get("data-original", "")
                if src and ("ceneostatic" in src or "product" in src.lower()):
                    img_url = fix_image_url(src)
                    break

            num_offers = 1
            for sn in item.css(".shop-numb"):
                nums = re.findall(r"\d+", sn.text or "")
                if nums:
                    num_offers = int(nums[0])

            parsed.append({
                "title": title[:200],
                "product_url": product_url,
                "price": price,
                "img_url": img_url,
                "num_offers": num_offers,
            })
        except Exception:
            continue

    return parsed, has_next

def scrape_category_listing(cat_info: dict) -> list[dict]:
    """Scrape multiple pages of a category."""
    lim = ceneo_limits()
    max_items = lim["items"]
    max_pages = lim["pages"]
    base_url = cat_info["url"]
    all_items = []

    for page_num in range(1, max_pages + 1):
        url = base_url if page_num == 1 else f"{base_url};0020-30-0-0-0-0-0-0-0.htm?p={page_num}"
        print(f"    Page {page_num}: {url}")

        items, has_next = scrape_category_page(url)
        all_items.extend(items)
        print(f"      Got {len(items)} items (total: {len(all_items)})")

        if not has_next or len(all_items) >= max_items:
            break
        time.sleep(1.5)

    products = []
    seen_slugs = set()
    for item in all_items[:max_items]:
        slug = make_slug(item["title"])
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)

        products.append({
            "title": item["title"],
            "slug": slug,
            "image_url": item["img_url"],
            "store_name": "Ceneo",
            "store_logos": ["Ceneo"],
            "description": _ceneo_product_blurb(item["title"], cat_info["path"]),
            "current_price": item["price"],
            "category_id": cat_info["category_id"],
            "category_path": cat_info["path"],
            "deal_type": "online",
            "source_url": item["product_url"],
            "source": "ceneo",
            "upvotes": 0,
            "downvotes": 0,
            "engagement": 0,
            "scraped_at": datetime.now(timezone.utc).isoformat(),
        })

    return products

def scrape_product_offers(product_url: str) -> list[dict]:
    """Scrape store offers from a Ceneo product detail page."""
    if not product_url or "ceneo.pl" not in product_url:
        return []

    # Clean URL
    clean_url = product_url.split("#")[0].split("?")[0]
    if not re.search(r"/\d+$", clean_url):
        return []

    try:
        # Fetch the offers tab directly
        offers_url = f"{clean_url}#tab=offers"
        page = StealthyFetcher.fetch(offers_url, headless=True, block_images=True)
    except Exception as e:
        print(f"      Offer fetch failed: {e}")
        return []

    offers = []

    # Try multiple selector strategies
    rows = (page.css(".product-offers__list__item") or
            page.css(".product-offer") or
            page.css(".js_productOfferGroupItem") or
            page.css("[data-offer]"))

    if not rows:
        # Fallback: look for offer rows in any table-like structure
        rows = page.css("li.product-offers__list__item") or page.css("ul.product-offers__list li") or []

    max_offers = ceneo_limits()["offers_per_product"]
    for row in rows[:max_offers]:
        try:
            # Store name: try multiple strategies
            store_name = ""

            # Strategy 1: shop name span
            for sel in [".product-offer__store__name", ".js_shop-name", ".offer-shop-name"]:
                found = row.css(sel)
                if found and found[0].text:
                    store_name = found[0].text.strip()
                    break

            # Strategy 2: img alt attribute
            if not store_name:
                for img in row.css("img"):
                    alt = (img.attrib.get("alt") or "").strip()
                    if alt and 3 < len(alt) < 40 and "logo" not in alt.lower() and "star" not in alt.lower():
                        store_name = alt
                        break

            # Strategy 3: data attributes
            if not store_name:
                store_name = (row.attrib.get("data-shopurl") or
                             row.attrib.get("data-shop") or "").strip()

            # Strategy 4: link text
            if not store_name:
                for a in row.css("a"):
                    cls = a.attrib.get("class", "")
                    if "store" in cls or "shop" in cls:
                        store_name = (a.text or "").strip()
                        break

            if not store_name or len(store_name) < 2:
                continue

            # Price
            values = row.css(".value")
            pennies = row.css(".penny")
            price = parse_price_parts(
                values[0].text if values else "",
                pennies[0].text if pennies else ""
            )
            if not price:
                continue

            # Offer URL
            offer_url = product_url
            for a in row.css("a"):
                href = a.attrib.get("href", "")
                if "/Click/Offer" in href or "go-to-shop" in (a.attrib.get("class", "")):
                    offer_url = f"https://www.ceneo.pl{href}" if href.startswith("/") else href
                    break

            # Availability
            in_stock = True
            for el in row.css(".product-availability") + row.css(".product-offer__store__availability"):
                txt = (el.text or el.get_all_text() or "").lower()
                if "niedostępny" in txt or "brak" in txt:
                    in_stock = False

            offers.append({
                "store_name": store_name[:100],
                "price": price,
                "in_stock": in_stock,
                "url": offer_url,
                "scraped_at": datetime.now(timezone.utc).isoformat(),
            })
        except Exception:
            continue

    return offers

def save_products(products: list[dict]) -> list[dict]:
    if not products:
        return []

    saved = []
    for p in products:
        try:
            existing = sb.table("products").select("id").eq("slug", p["slug"]).limit(1).execute()
            if existing.data:
                sb.table("products").update({
                    "current_price": p["current_price"],
                    "image_url": p["image_url"],
                    "scraped_at": p["scraped_at"],
                    "description": p.get("description"),
                }).eq("slug", p["slug"]).execute()
                saved.append({**p, "id": existing.data[0]["id"]})
            else:
                result = sb.table("products").insert(p).execute()
                if result.data:
                    saved.append(result.data[0])
        except Exception as e:
            print(f"    DB error: {str(e)[:80]}")
    return saved

def save_offers(product_id: str, offers: list[dict]):
    if not offers:
        return
    try:
        sb.table("store_offers").delete().eq("product_id", product_id).execute()
    except Exception:
        pass
    for o in offers:
        try:
            sb.table("store_offers").insert({"product_id": product_id, **o}).execute()
        except Exception:
            pass

def save_price_history(product_id: str, price: float, store: str = "Ceneo"):
    try:
        sb.table("price_history").insert({
            "product_id": product_id, "price": price, "store_name": store,
        }).execute()
    except Exception:
        pass

def run():
    lim = ceneo_limits()
    cats = categories_for_this_run(CENEO_CATEGORIES)
    slots = time_slots_count()
    slot = current_slot_index()
    print("=" * 60)
    print("Ceneo.pl MEGA Scraper")
    print(f"Categories this run: {len(cats)} / {len(CENEO_CATEGORIES)} (slot {slot}/{slots}, UTC)")
    print(
        f"Limits: max_items={lim['items']}, max_pages={lim['pages']}, "
        f"offer_products={lim['offer_products']}, max_offers/product={lim['offers_per_product']}"
    )
    print(f"Started: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 60)

    total_products = 0
    total_offers = 0

    for i, cat in enumerate(cats):
        print(f"\n[{i+1}/{len(cats)}] {' > '.join(cat['path'])}")
        products = scrape_category_listing(cat)
        print(f"  Parsed {len(products)} unique products")

        saved = save_products(products)
        total_products += len(saved)
        print(f"  Saved {len(saved)} to DB")

        n_offer = lim["offer_products"]
        offer_candidates = saved[:n_offer] if n_offer else []
        for sp in offer_candidates:
            source_url = sp.get("source_url", "")
            offers = scrape_product_offers(source_url)
            if offers:
                save_offers(sp["id"], offers)
                total_offers += len(offers)
                # Save best price to history
                best_price = min(o["price"] for o in offers)
                save_price_history(sp["id"], best_price, offers[0]["store_name"])
                print(f"    {sp.get('title', '?')[:40]}: {len(offers)} offers, best: {best_price} zł")
            time.sleep(0.8)

        time.sleep(1.5)

    print(f"\n{'=' * 60}")
    print(f"DONE! Products: {total_products}, Offers: {total_offers}")
    print(f"Finished: {datetime.now(timezone.utc).isoformat()}")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    run()
