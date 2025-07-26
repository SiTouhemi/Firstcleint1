-- Drop existing restrictive policies (only for tables that exist)
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
DROP POLICY IF EXISTS "Public read access for banners" ON banners;
DROP POLICY IF EXISTS "Admin full access to stores" ON stores;
DROP POLICY IF EXISTS "Admin full access to categories" ON categories;
DROP POLICY IF EXISTS "Admin full access to products" ON products;
DROP POLICY IF EXISTS "Admin full access to orders" ON orders;
DROP POLICY IF EXISTS "Admin full access to promo_codes" ON promo_codes;
DROP POLICY IF EXISTS "Admin full access to banners" ON banners;
DROP POLICY IF EXISTS "Admin full access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Public insert orders" ON orders;

-- Create more permissive policies for admin access
-- Allow all operations for admin (service role bypasses RLS)
CREATE POLICY "Allow all for admin" ON stores FOR ALL USING (true);
CREATE POLICY "Allow all for admin" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all for admin" ON products FOR ALL USING (true);
CREATE POLICY "Allow all for admin" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all for admin" ON promo_codes FOR ALL USING (true);
CREATE POLICY "Allow all for admin" ON banners FOR ALL USING (true);
CREATE POLICY "Allow all for admin" ON admin_users FOR ALL USING (true);

-- Public read access for categories and banners (for frontend)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (is_active = true);

-- Public insert for orders (customers can place orders)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Optional: Disable RLS for admin tables if needed
-- ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE promo_codes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY; 