"""Seed Supabase categories table with Allegro/Ceneo category structure."""
import warnings
warnings.filterwarnings("ignore")

from supabase import create_client
import os
from pathlib import Path

dotenv_path = Path(__file__).parent / ".env"
if dotenv_path.exists():
    for line in dotenv_path.read_text().strip().splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit("Set SUPABASE_URL and SUPABASE_KEY environment variables")

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

CATEGORIES = [
    # Root categories
    {"id": "electronics", "name": "Electronics", "name_pl": "Elektronika", "slug": "electronics", "icon": "Smartphone", "parent_id": None, "source": "both", "trending": True},
    {"id": "home-garden", "name": "Home & Garden", "name_pl": "Dom i Ogród", "slug": "home-garden", "icon": "House", "parent_id": None, "source": "both", "trending": True},
    {"id": "fashion", "name": "Fashion", "name_pl": "Moda", "slug": "fashion", "icon": "Shirt", "parent_id": None, "source": "both", "trending": True},
    {"id": "gaming", "name": "Gaming", "name_pl": "Gaming", "slug": "gaming", "icon": "Gamepad2", "parent_id": None, "source": "both", "trending": True},
    {"id": "sports", "name": "Sports & Tourism", "name_pl": "Sport i Turystyka", "slug": "sports", "icon": "Dumbbell", "parent_id": None, "source": "both", "trending": False},
    {"id": "beauty", "name": "Beauty", "name_pl": "Uroda", "slug": "beauty", "icon": "Sparkles", "parent_id": None, "source": "both", "trending": False},
    {"id": "kids", "name": "Kids", "name_pl": "Dziecko", "slug": "kids", "icon": "Baby", "parent_id": None, "source": "both", "trending": False},
    {"id": "automotive", "name": "Automotive", "name_pl": "Motoryzacja", "slug": "automotive", "icon": "Car", "parent_id": None, "source": "both", "trending": False},
    {"id": "supermarket", "name": "Supermarket", "name_pl": "Supermarket", "slug": "supermarket", "icon": "ShoppingCart", "parent_id": None, "source": "allegro", "trending": False},
    {"id": "culture", "name": "Culture & Entertainment", "name_pl": "Kultura i Rozrywka", "slug": "culture", "icon": "BookOpen", "parent_id": None, "source": "both", "trending": False},
    {"id": "health", "name": "Health", "name_pl": "Zdrowie", "slug": "health", "icon": "Heart", "parent_id": None, "source": "both", "trending": False},

    # Electronics children
    {"id": "phones", "name": "Phones", "name_pl": "Smartfony", "slug": "phones", "icon": "Phone", "parent_id": "electronics", "source": "both", "trending": True},
    {"id": "laptops", "name": "Laptops", "name_pl": "Laptopy", "slug": "laptops", "icon": "Laptop", "parent_id": "electronics", "source": "both", "trending": True},
    {"id": "tablets", "name": "Tablets", "name_pl": "Tablety", "slug": "tablets", "icon": "Tablet", "parent_id": "electronics", "source": "both", "trending": False},
    {"id": "tv-audio", "name": "TV & Audio", "name_pl": "RTV i Audio", "slug": "tv-audio", "icon": "Tv", "parent_id": "electronics", "source": "both", "trending": False},
    {"id": "cameras", "name": "Cameras", "name_pl": "Aparaty", "slug": "cameras", "icon": "Camera", "parent_id": "electronics", "source": "both", "trending": False},
    {"id": "accessories-electronics", "name": "Accessories", "name_pl": "Akcesoria", "slug": "accessories-electronics", "icon": "Cable", "parent_id": "electronics", "source": "both", "trending": False},
    {"id": "computers", "name": "Computers", "name_pl": "Komputery", "slug": "computers", "icon": "Monitor", "parent_id": "electronics", "source": "ceneo", "trending": False},

    # Phones children
    {"id": "android", "name": "Android", "name_pl": "Android", "slug": "android", "icon": "Cpu", "parent_id": "phones", "source": "both", "trending": False},
    {"id": "ios", "name": "iOS / Apple", "name_pl": "iOS / Apple", "slug": "ios", "icon": "Apple", "parent_id": "phones", "source": "both", "trending": False},
    {"id": "samsung", "name": "Samsung", "name_pl": "Samsung", "slug": "samsung", "icon": "Sparkles", "parent_id": "android", "source": "both", "trending": True},
    {"id": "xiaomi", "name": "Xiaomi", "name_pl": "Xiaomi", "slug": "xiaomi", "icon": "Flame", "parent_id": "android", "source": "both", "trending": False},

    # Laptops children
    {"id": "ultrabooks", "name": "Ultrabooks", "name_pl": "Ultrabooki", "slug": "ultrabooks", "icon": "MonitorSmartphone", "parent_id": "laptops", "source": "both", "trending": False},
    {"id": "gaming-laptops", "name": "Gaming Laptops", "name_pl": "Laptopy gamingowe", "slug": "gaming-laptops", "icon": "Gamepad2", "parent_id": "laptops", "source": "both", "trending": True},

    # Home & Garden children
    {"id": "furniture", "name": "Furniture", "name_pl": "Meble", "slug": "furniture", "icon": "Sofa", "parent_id": "home-garden", "source": "both", "trending": False},
    {"id": "kitchen", "name": "Kitchen", "name_pl": "Kuchnia", "slug": "kitchen", "icon": "ChefHat", "parent_id": "home-garden", "source": "both", "trending": True},
    {"id": "bathroom", "name": "Bathroom", "name_pl": "Łazienka", "slug": "bathroom", "icon": "Bath", "parent_id": "home-garden", "source": "both", "trending": False},
    {"id": "garden", "name": "Garden", "name_pl": "Ogród", "slug": "garden", "icon": "Flower2", "parent_id": "home-garden", "source": "both", "trending": False},
    {"id": "tools", "name": "Tools", "name_pl": "Narzędzia", "slug": "tools", "icon": "Wrench", "parent_id": "home-garden", "source": "both", "trending": False},
    {"id": "cleaning", "name": "Cleaning", "name_pl": "Sprzątanie", "slug": "cleaning", "icon": "SprayCan", "parent_id": "home-garden", "source": "both", "trending": False},
    {"id": "lighting", "name": "Lighting", "name_pl": "Oświetlenie", "slug": "lighting", "icon": "Lightbulb", "parent_id": "home-garden", "source": "ceneo", "trending": False},
    {"id": "decor", "name": "Home Decor", "name_pl": "Dekoracje", "slug": "decor", "icon": "PaintBucket", "parent_id": "home-garden", "source": "both", "trending": False},
    {"id": "appliances", "name": "Appliances", "name_pl": "AGD", "slug": "appliances", "icon": "Refrigerator", "parent_id": "home-garden", "source": "ceneo", "trending": True},

    # Fashion children
    {"id": "womens-clothing", "name": "Women's Clothing", "name_pl": "Odzież damska", "slug": "womens-clothing", "icon": "Shirt", "parent_id": "fashion", "source": "both", "trending": False},
    {"id": "mens-clothing", "name": "Men's Clothing", "name_pl": "Odzież męska", "slug": "mens-clothing", "icon": "Shirt", "parent_id": "fashion", "source": "both", "trending": False},
    {"id": "shoes", "name": "Shoes", "name_pl": "Obuwie", "slug": "shoes", "icon": "Footprints", "parent_id": "fashion", "source": "both", "trending": True},
    {"id": "bags", "name": "Bags & Luggage", "name_pl": "Torby i Bagaż", "slug": "bags", "icon": "Briefcase", "parent_id": "fashion", "source": "both", "trending": False},
    {"id": "jewelry", "name": "Jewelry & Watches", "name_pl": "Biżuteria i Zegarki", "slug": "jewelry", "icon": "Gem", "parent_id": "fashion", "source": "both", "trending": False},
    {"id": "sneakers", "name": "Sneakers", "name_pl": "Sneakersy", "slug": "sneakers", "icon": "Footprints", "parent_id": "shoes", "source": "both", "trending": True},

    # Gaming children
    {"id": "consoles", "name": "Consoles", "name_pl": "Konsole", "slug": "consoles", "icon": "Gamepad2", "parent_id": "gaming", "source": "both", "trending": True},
    {"id": "pc-gaming", "name": "PC Gaming", "name_pl": "PC Gaming", "slug": "pc-gaming", "icon": "Monitor", "parent_id": "gaming", "source": "both", "trending": False},
    {"id": "games", "name": "Games", "name_pl": "Gry", "slug": "games", "icon": "Disc3", "parent_id": "gaming", "source": "both", "trending": False},
    {"id": "gaming-accessories", "name": "Gaming Accessories", "name_pl": "Akcesoria gamingowe", "slug": "gaming-accessories", "icon": "Headphones", "parent_id": "gaming", "source": "both", "trending": False},

    # Sports children
    {"id": "fitness", "name": "Fitness", "name_pl": "Fitness", "slug": "fitness", "icon": "Dumbbell", "parent_id": "sports", "source": "both", "trending": False},
    {"id": "cycling", "name": "Cycling", "name_pl": "Rowery", "slug": "cycling", "icon": "Bike", "parent_id": "sports", "source": "both", "trending": False},
    {"id": "outdoor", "name": "Outdoor", "name_pl": "Outdoor", "slug": "outdoor", "icon": "Mountain", "parent_id": "sports", "source": "both", "trending": False},

    # Beauty children
    {"id": "skincare", "name": "Skincare", "name_pl": "Pielęgnacja", "slug": "skincare", "icon": "Droplets", "parent_id": "beauty", "source": "both", "trending": False},
    {"id": "perfume", "name": "Perfume", "name_pl": "Perfumy", "slug": "perfume", "icon": "Sparkles", "parent_id": "beauty", "source": "both", "trending": True},
    {"id": "makeup", "name": "Makeup", "name_pl": "Makijaż", "slug": "makeup", "icon": "Palette", "parent_id": "beauty", "source": "both", "trending": False},

    # Audio (under electronics)
    {"id": "headphones", "name": "Headphones", "name_pl": "Słuchawki", "slug": "headphones", "icon": "Headphones", "parent_id": "tv-audio", "source": "both", "trending": True},
    {"id": "speakers", "name": "Speakers", "name_pl": "Głośniki", "slug": "speakers", "icon": "Speaker", "parent_id": "tv-audio", "source": "both", "trending": False},
]

def seed():
    # Insert categories (parents first, then children)
    root_cats = [c for c in CATEGORIES if c["parent_id"] is None]
    child_cats = [c for c in CATEGORIES if c["parent_id"] is not None and c["parent_id"] in [r["id"] for r in root_cats]]
    deep_cats = [c for c in CATEGORIES if c not in root_cats and c not in child_cats]

    for batch in [root_cats, child_cats, deep_cats]:
        if batch:
            sb.table("categories").upsert(batch, on_conflict="id").execute()
            print(f"  Inserted {len(batch)} categories")

    total = sb.table("categories").select("id", count="exact").execute()
    print(f"Total categories in DB: {total.count}")

if __name__ == "__main__":
    seed()
