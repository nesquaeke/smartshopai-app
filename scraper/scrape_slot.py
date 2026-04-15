"""Hourly / 24h slot helpers: spread categories across GitHub Actions runs (UTC)."""
from __future__ import annotations

import os
from datetime import datetime, timezone


def _truthy(name: str) -> bool:
    return os.getenv(name, "").strip().lower() in ("1", "true", "yes", "all")


def env_int(name: str, default: int, *, minimum: int = 1, maximum: int | None = None) -> int:
    raw = os.getenv(name)
    if raw is None or str(raw).strip() == "":
        return default
    try:
        v = int(raw)
    except ValueError:
        return default
    v = max(minimum, v)
    if maximum is not None:
        v = min(v, maximum)
    return v


def current_slot_index() -> int:
    """0 .. SCRAPE_TIME_SLOTS-1. Uses UTC hour by default (matches GitHub cron)."""
    slots = time_slots_count()
    override = os.getenv("SCRAPE_SLOT")
    if override is not None and str(override).strip() != "":
        try:
            return int(override) % slots
        except ValueError:
            pass
    return datetime.now(timezone.utc).hour % slots


def time_slots_count() -> int:
    return env_int("SCRAPE_TIME_SLOTS", 24, minimum=1, maximum=168)


def categories_for_this_run(all_categories: list) -> list:
    """Partition categories by slot, or one rotating category if len < slots."""
    if _truthy("SCRAPE_RUN_ALL"):
        return list(all_categories)
    if not all_categories:
        return []
    slots = time_slots_count()
    slot = current_slot_index() % slots
    partitioned = [c for i, c in enumerate(all_categories) if i % slots == slot]
    if partitioned:
        return partitioned
    return [all_categories[slot % len(all_categories)]]
