-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for stores, categories, products, banners
CREATE POLICY "Public read access for stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for banners" ON banners FOR SELECT USING (is_active = true);

-- Admin full access (you'll need to implement proper auth)
CREATE POLICY "Admin full access to stores" ON stores FOR ALL USING (true);
CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (true);
CREATE POLICY "Admin full access to products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access to orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admin full access to promo_codes" ON promo_codes FOR ALL USING (true);
CREATE POLICY "Admin full access to banners" ON banners FOR ALL USING (true);
CREATE POLICY "Admin full access to users" ON users FOR ALL USING (true);
CREATE POLICY "Admin full access to admin_users" ON admin_users FOR ALL USING (true);

-- Public insert for orders (customers can place orders)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
