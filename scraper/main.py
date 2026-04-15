"""SmartShopAI Daily Scraper - Ceneo + Allegro"""
import warnings
warnings.filterwarnings("ignore")

import sys
import time
from datetime import datetime, timezone

def main():
    start = time.time()
    print(f"SmartShopAI Daily Scraper")
    print(f"Started at: {datetime.now(timezone.utc).isoformat()}")
    print()

    errors = []

    try:
        from ceneo_scraper import run as run_ceneo
        run_ceneo()
    except Exception as e:
        print(f"Ceneo scraper failed: {e}")
        errors.append(f"Ceneo: {e}")

    print()

    try:
        from allegro_scraper import run as run_allegro
        run_allegro()
    except Exception as e:
        print(f"Allegro scraper failed: {e}")
        errors.append(f"Allegro: {e}")

    elapsed = round(time.time() - start, 1)
    print(f"\nTotal time: {elapsed}s")

    if errors:
        print(f"Errors ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("All scrapers completed successfully!")

if __name__ == "__main__":
    main()
