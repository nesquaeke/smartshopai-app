-- SmartShopAI Database Schema

-- Categories table (hierarchical)
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_pl text,
  slug text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT 'Sparkles',
  parent_id text REFERENCES categories(id) ON DELETE SET NULL,
  source text DEFAULT 'manual',
  trending boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  store_name text,
  store_logos text[] DEFAULT '{}',
  current_price numeric NOT NULL,
  old_price numeric,
  discount_percent integer,
  category_id text REFERENCES categories(id) ON DELETE SET NULL,
  category_path text[] DEFAULT '{}',
  deal_type text NOT NULL DEFAULT 'online',
  city text,
  description text,
  source_url text,
  source text DEFAULT 'manual',
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  engagement integer DEFAULT 0,
  posted_by_username text DEFAULT 'SmartShopAI',
  posted_by_rank text DEFAULT 'System',
  posted_by_badge text DEFAULT 'Bot',
  scraped_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Price history
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  price numeric NOT NULL,
  store_name text,
  recorded_at timestamptz DEFAULT now()
);

-- Store offers (price comparison)
CREATE TABLE IF NOT EXISTS store_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  store_name text NOT NULL,
  price numeric NOT NULL,
  in_stock boolean DEFAULT true,
  url text NOT NULL,
  shipping_cost numeric DEFAULT 0,
  store_rating numeric,
  scraped_at timestamptz DEFAULT now()
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL DEFAULT 'Anonymous',
  author_badge text DEFAULT 'Member',
  content text NOT NULL,
  upvotes integer DEFAULT 0,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Votes (anonymous, fingerprint-based)
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_fingerprint text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_fingerprint)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_store_offers_product ON store_offers(product_id);
CREATE INDEX IF NOT EXISTS idx_comments_product ON comments(product_id);
CREATE INDEX IF NOT EXISTS idx_votes_product ON votes(product_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: everyone can read, only service role can write products/prices
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can read price_history" ON price_history FOR SELECT USING (true);
CREATE POLICY "Anyone can read store_offers" ON store_offers FOR SELECT USING (true);
CREATE POLICY "Anyone can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update votes" ON votes FOR UPDATE USING (true);

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
