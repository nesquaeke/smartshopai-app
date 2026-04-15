"""Listing-unique slug so Supabase inserts new rows per product URL (Scrapling listings)."""
from __future__ import annotations

import hashlib
import re


def make_row_slug(title: str, source_url: str) -> str:
    t = (title or "").strip().lower()
    base = re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:72] or "item"
    norm = (source_url or "").strip().split("#", 1)[0].split("?", 1)[0].rstrip("/")
    suffix = hashlib.sha256(norm.encode("utf-8", errors="ignore")).hexdigest()[:14]
    return f"{base}-{suffix}"[:130]
