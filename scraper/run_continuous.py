#!/usr/bin/env python3
"""
Run Ceneo + Allegro scrapers in a loop until stopped (Ctrl+C) or too many failures.

Uses existing scrapers: categories, descriptions, and DB fields are unchanged from
ceneo_scraper / allegro_scraper (set SCRAPE_RUN_ALL=1 each cycle for full category list).

Env:
  SCRAPE_RUN_ALL=1          (set by this script each iteration)
  SCRAPE_LOOP_SLEEP_SEC     seconds between successful full runs (default 900 = 15 min)
  SCRAPE_LOOP_MAX_FAILS     exit after N consecutive errors (default 12)
  SCRAPE_LOOP_JITTER_SEC    random 0..N added to sleep (default 120) to avoid wall-clock sync

Requires scraper/.env with SUPABASE_URL and SUPABASE_KEY (same as other scrapers).
"""
from __future__ import annotations

import os
import random
import signal
import sys
import time
import traceback
from datetime import datetime, timezone

_stop = False


def _handle_sigint(_sig, _frame):
    global _stop
    _stop = True
    print("\n[continuous] Stop requested (Ctrl+C). Finishing current cycle if any, then exit.")


def main() -> None:
    signal.signal(signal.SIGINT, _handle_sigint)
    signal.signal(signal.SIGTERM, _handle_sigint)

    sleep_ok = int(os.getenv("SCRAPE_LOOP_SLEEP_SEC", "900"))
    max_fails = int(os.getenv("SCRAPE_LOOP_MAX_FAILS", "12"))
    jitter = int(os.getenv("SCRAPE_LOOP_JITTER_SEC", "120"))

    os.environ["SCRAPE_RUN_ALL"] = "1"

    fails = 0
    cycle = 0

    print("=" * 60)
    print("SmartShopAI continuous scrape (Scrapling)")
    print(f"Sleep between OK runs: {sleep_ok}s (+ up to {jitter}s jitter)")
    print(f"Exit after {max_fails} consecutive failures")
    print("Ctrl+C to stop calmly")
    print("=" * 60)

    while not _stop:
        cycle += 1
        t0 = time.time()
        print(f"\n--- Cycle {cycle} @ {datetime.now(timezone.utc).isoformat()} UTC ---")

        ok = True
        try:
            from ceneo_scraper import run as run_ceneo

            run_ceneo()
        except Exception as e:
            ok = False
            print(f"[continuous] Ceneo error: {e}")
            traceback.print_exc()

        if _stop:
            break

        try:
            from allegro_scraper import run as run_allegro

            run_allegro()
        except Exception as e:
            ok = False
            print(f"[continuous] Allegro error: {e}")
            traceback.print_exc()

        elapsed = round(time.time() - t0, 1)
        print(f"[continuous] Cycle {cycle} finished in {elapsed}s")

        if ok:
            fails = 0
            if _stop:
                break
            extra = random.randint(0, max(0, jitter))
            wait = sleep_ok + extra
            print(f"[continuous] OK — sleeping {wait}s before next cycle...")
            end = time.time() + wait
            while time.time() < end and not _stop:
                time.sleep(min(30, end - time.time()))
        else:
            fails += 1
            print(f"[continuous] Failures in a row: {fails}/{max_fails}")
            if fails >= max_fails:
                print("[continuous] Too many consecutive failures — exiting.")
                sys.exit(2)
            backoff = min(3600, 120 * fails + random.randint(0, 60))
            print(f"[continuous] Backing off {backoff}s...")
            end = time.time() + backoff
            while time.time() < end and not _stop:
                time.sleep(min(30, end - time.time()))

    print("[continuous] Stopped.")
    sys.exit(0)


if __name__ == "__main__":
    main()
