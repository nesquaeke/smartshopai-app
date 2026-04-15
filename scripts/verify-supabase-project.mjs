/**
 * Compares Supabase project URL in scraper/.env vs .env.local (Next.js).
 * Does not print secret keys. Exit 0 if URLs match.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    out[k] = v;
  }
  return out;
}

function normalizeUrl(u) {
  return (u || "").replace(/\/+$/, "").toLowerCase();
}

const scraperPath = path.join(root, "scraper", ".env");
const webPath = path.join(root, ".env.local");

const scraper = readEnvFile(scraperPath);
const web = readEnvFile(webPath);

const uScraper = scraper.SUPABASE_URL || scraper.NEXT_PUBLIC_SUPABASE_URL;
const uWeb = web.NEXT_PUBLIC_SUPABASE_URL || web.SUPABASE_URL;

if (!uScraper) {
  console.error(`Missing SUPABASE_URL in ${path.relative(root, scraperPath)}`);
  process.exit(1);
}
if (!uWeb) {
  console.error(`Missing NEXT_PUBLIC_SUPABASE_URL in ${path.relative(root, webPath)}`);
  process.exit(1);
}

const a = normalizeUrl(uScraper);
const b = normalizeUrl(uWeb);

if (a === b) {
  console.log("OK: Scraper and Next.js point to the same Supabase project URL.");
  const hasAnon = Boolean(web.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasService = Boolean(scraper.SUPABASE_KEY);
  if (!hasAnon) console.warn("Warn: NEXT_PUBLIC_SUPABASE_ANON_KEY missing in .env.local");
  if (!hasService) console.warn("Warn: SUPABASE_KEY missing in scraper/.env (scraper will not write)");
  process.exit(0);
}

console.error("MISMATCH: Supabase project URLs differ.");
console.error(`  scraper/.env SUPABASE_URL → ${uScraper}`);
console.error(`  .env.local NEXT_PUBLIC_SUPABASE_URL → ${uWeb}`);
process.exit(1);
