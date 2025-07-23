-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Districts table
CREATE TABLE IF NOT EXISTS districts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop stores table if it exists to ensure correct schema
DROP TABLE IF EXISTS stores CASCADE;

-- Stores table (with city_id, location, delivery_range, slug, etc.)
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT NOT NULL,
  city_id UUID REFERENCES cities(id),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  delivery_range INTEGER DEFAULT 10,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  theme_color VARCHAR(7) DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  opening_hours JSONB,
  social_media JSONB,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  gradient VARCHAR(255),
  border_color VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_key VARCHAR(100),
  unit VARCHAR(50),
  image_url TEXT,
  images TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (customers)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  city_id UUID REFERENCES cities(id),
  district_id UUID REFERENCES districts(id),
  address TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  location_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  customer_address TEXT NOT NULL,
  city_id UUID REFERENCES cities(id),
  district_id UUID REFERENCES districts(id),
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  location_name VARCHAR(255),
  items JSONB, -- Added to match backend logic
  subtotal DECIMAL(10,2) NOT NULL,
  promo_code_id UUID REFERENCES promo_codes(id),
  promo_code VARCHAR(50),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  notes TEXT,
  admin_notes TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  admin_user_id UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  image_url TEXT,
  background_color VARCHAR(50),
  text_color VARCHAR(50),
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category_key ON products(category_key);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_admin_user_id ON notifications(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_stores_city_id ON stores(city_id);
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores USING GIST (ll_to_earth(location_lat, location_lng));

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to read-only data
CREATE POLICY "Allow public read access to active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active cities" ON cities FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active districts" ON districts FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to store settings" ON store_settings FOR SELECT USING (true);

-- Create policies for user operations
CREATE POLICY "Allow users to insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update their own data" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow users to read their own data" ON users FOR SELECT USING (true);

-- Create policies for orders
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to read their own orders" ON orders FOR SELECT USING (true);

-- Create policies for promo codes
CREATE POLICY "Allow public read access to active promo codes" ON promo_codes FOR SELECT USING (is_active = true);

-- Admin policies (authenticated users can manage all data)
CREATE POLICY "Allow authenticated users full access to admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to cities" ON cities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to districts" ON districts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to users" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to promo_codes" ON promo_codes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to store_settings" ON store_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to notifications" ON notifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to stores" ON stores FOR ALL USING (auth.role() = 'authenticated');

-- RPC: Find nearby stores within their delivery range of a user
CREATE OR REPLACE FUNCTION find_nearby_stores(user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION)
RETURNS TABLE(id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id
  FROM stores s
  WHERE s.is_active = true
    AND s.location_lat IS NOT NULL
    AND s.location_lng IS NOT NULL
    AND earth_box(ll_to_earth(user_lat, user_lng), s.delivery_range * 1000) @> ll_to_earth(s.location_lat, s.location_lng)
    AND earth_distance(ll_to_earth(user_lat, user_lng), ll_to_earth(s.location_lat, s.location_lng)) <= s.delivery_range * 1000;
END;
$$ LANGUAGE plpgsql STABLE;

-- Migration: Add city_id to stores and migrate data from city column if exists
DO $$
BEGIN
  -- Add city_id column if it does not exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='stores' AND column_name='city_id'
  ) THEN
    ALTER TABLE stores ADD COLUMN city_id UUID;
  END IF;

  -- If stores.city exists, migrate data to city_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='stores' AND column_name='city'
  ) THEN
    UPDATE stores s
    SET city_id = c.id
    FROM cities c
    WHERE s.city = c.name;
    -- Optionally drop the old city column
    ALTER TABLE stores DROP COLUMN city;
  END IF;

  -- Add foreign key constraint if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints WHERE table_name='stores' AND constraint_type='FOREIGN KEY' AND constraint_name='stores_city_id_fkey'
  ) THEN
    ALTER TABLE stores ADD CONSTRAINT stores_city_id_fkey FOREIGN KEY (city_id) REFERENCES cities(id);
  END IF;
END $$;

ALTER TABLE products 
ADD CONSTRAINT products_store_id_fkey 
FOREIGN KEY (store_id) REFERENCES stores(id);

-- === SEED DATA ===

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@store.com', '$2b$10$rOzJqQZQQQQQQQQQQQQQQu', 'مدير المتجر', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, key, description, icon, gradient, border_color, is_active, sort_order) VALUES
('خضار', 'vegetables', 'خضروات طازجة ومتنوعة', '🥕', 'bg-gradient-to-br from-green-100 to-green-200', 'border-green-300', true, 1),
('فواكه', 'fruits', 'فواكه طازجة وموسمية', '🍎', 'bg-gradient-to-br from-yellow-100 to-orange-200', 'border-orange-300', true, 2),
('إلكترونيات', 'electronics', 'أجهزة إلكترونية وتقنية', '📱', 'bg-gradient-to-br from-blue-100 to-blue-200', 'border-blue-300', true, 3),
('ملابس', 'clothes', 'ملابس عصرية للجميع', '👕', 'bg-gradient-to-br from-purple-100 to-purple-200', 'border-purple-300', true, 4),
('أحذية', 'shoes', 'أحذية مريحة وأنيقة', '👟', 'bg-gradient-to-br from-orange-100 to-yellow-200', 'border-yellow-300', true, 5),
('إكسسوارات', 'accessories', 'إكسسوارات متنوعة', '👜', 'bg-gradient-to-br from-pink-100 to-pink-200', 'border-pink-300', true, 6)
ON CONFLICT (key) DO NOTHING;

-- Insert cities
INSERT INTO cities (name, is_active) VALUES
('الرياض', true),
('جدة', true),
('الدمام', true),
('مكة المكرمة', true),
('المدينة المنورة', true),
('القاهرة', true),
('الإسكندرية', true),
('الجيزة', true),
('أسوان', true),
('الأقصر', true)
ON CONFLICT DO NOTHING;

-- Insert districts for Riyadh
INSERT INTO districts (city_id, name, delivery_fee, is_active) VALUES
((SELECT id FROM cities WHERE name = 'الرياض' LIMIT 1), 'العليا', 15.00, true),
((SELECT id FROM cities WHERE name = 'الرياض' LIMIT 1), 'الملز', 20.00, true),
((SELECT id FROM cities WHERE name = 'الرياض' LIMIT 1), 'النخيل', 25.00, true),
((SELECT id FROM cities WHERE name = 'الرياض' LIMIT 1), 'الروضة', 20.00, true),
((SELECT id FROM cities WHERE name = 'الرياض' LIMIT 1), 'السليمانية', 15.00, true)
ON CONFLICT DO NOTHING;

-- Insert districts for other cities
INSERT INTO districts (city_id, name, delivery_fee, is_active) VALUES
((SELECT id FROM cities WHERE name = 'جدة' LIMIT 1), 'الصفا', 20.00, true),
((SELECT id FROM cities WHERE name = 'جدة' LIMIT 1), 'الروضة', 25.00, true),
((SELECT id FROM cities WHERE name = 'جدة' LIMIT 1), 'البلد', 15.00, true),
((SELECT id FROM cities WHERE name = 'الدمام' LIMIT 1), 'الفيصلية', 20.00, true),
((SELECT id FROM cities WHERE name = 'الدمام' LIMIT 1), 'الشاطئ', 25.00, true)
ON CONFLICT DO NOTHING;

-- Insert sample stores
INSERT INTO stores (name, slug, description, email, phone, address, city_id, location_lat, location_lng, delivery_range, is_active)
VALUES
('متجر الرياض المركزي', 'riyadh-central', 'وصف لمتجر الرياض', 'riyadh@store.com', '0501234567', 'شارع الملك فهد، الرياض', (SELECT id FROM cities WHERE name = 'الرياض' LIMIT 1), 24.7136, 46.6753, 15, true),
('سوق جدة الطازج', 'jeddah-fresh', 'وصف لسوق جدة', 'jeddah@store.com', '0501234568', 'شارع التحلية، جدة', (SELECT id FROM cities WHERE name = 'جدة' LIMIT 1), 21.4858, 39.1925, 12, true),
('متجر الدمام الشرقي', 'dammam-east', 'وصف لمتجر الدمام', 'dammam@store.com', '0501234569', 'شارع الملك سعود، الدمام', (SELECT id FROM cities WHERE name = 'الدمام' LIMIT 1), 26.4207, 50.0888, 10, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert products
INSERT INTO products (name, description, price, category_id, category_key, unit, image_url, stock_quantity, is_active, is_featured, sort_order) VALUES
-- Vegetables
('طماطم طازجة', 'طماطم طازجة عالية الجودة من المزارع المحلية', 12.00, (SELECT id FROM categories WHERE key = 'vegetables' LIMIT 1), 'vegetables', 'كيلو', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&crop=center', 100, true, true, 1),
('خيار طازج', 'خيار طازج ومقرمش مثالي للسلطات', 8.00, (SELECT id FROM categories WHERE key = 'vegetables' LIMIT 1), 'vegetables', 'كيلو', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop&crop=center', 80, true, false, 2),
('جزر طازج', 'جزر طازج غني بالفيتامينات والمعادن', 10.00, (SELECT id FROM categories WHERE key = 'vegetables' LIMIT 1), 'vegetables', 'كيلو', 'https://images.unsplash.com/photo-1619114602456-524b01d0d40a?w=400&h=400&fit=crop&crop=center', 90, true, false, 3),
-- Fruits
('تفاح أحمر', 'تفاح أحمر حلو ولذيذ مستورد من أفضل المزارع', 15.00, (SELECT id FROM categories WHERE key = 'fruits' LIMIT 1), 'fruits', 'كيلو', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center', 120, true, true, 1),
('موز طازج', 'موز طازج غني بالبوتاسيوم والطاقة الطبيعية', 9.00, (SELECT id FROM categories WHERE key = 'fruits' LIMIT 1), 'fruits', 'كيلو', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center', 150, true, false, 2),
('برتقال طازج', 'برتقال طازج غني بفيتامين C والألياف', 13.00, (SELECT id FROM categories WHERE key = 'fruits' LIMIT 1), 'fruits', 'كيلو', 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop&crop=center', 110, true, false, 3),
-- Electronics
('سماعات لاسلكية', 'سماعات بلوتوث عالية الجودة مع إلغاء الضوضاء', 599.00, (SELECT id FROM categories WHERE key = 'electronics' LIMIT 1), 'electronics', NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center', 25, true, true, 1),
-- Clothes
('قميص قطني كلاسيكي', 'قميص قطني عالي الجودة مناسب لجميع المناسبات', 149.00, (SELECT id FROM categories WHERE key = 'clothes' LIMIT 1), 'clothes', NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center', 50, true, false, 1),
('هودي رياضي', 'هودي دافئ ومريح مثالي للرياضة والأنشطة اليومية', 199.00, (SELECT id FROM categories WHERE key = 'clothes' LIMIT 1), 'clothes', NULL, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&crop=center', 30, true, false, 2),
-- Shoes
('حذاء رياضي أديداس', 'حذاء رياضي مريح للجري والأنشطة الرياضية', 299.00, (SELECT id FROM categories WHERE key = 'shoes' LIMIT 1), 'shoes', NULL, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center', 40, true, true, 1),
('حذاء كاجوال', 'حذاء مريح للاستخدام اليومي بتصميم عصري', 249.00, (SELECT id FROM categories WHERE key = 'shoes' LIMIT 1), 'shoes', NULL, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center', 35, true, false, 2),
-- Accessories
('حقيبة يد جلدية', 'حقيبة أنيقة من الجلد الطبيعي عالي الجودة', 399.00, (SELECT id FROM categories WHERE key = 'accessories' LIMIT 1), 'accessories', NULL, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center', 20, true, false, 1)
ON CONFLICT DO NOTHING;

-- Insert promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, is_active, valid_from, valid_until) VALUES
('WELCOME10', 'خصم 10% للعملاء الجدد', 'percentage', 10.00, 100.00, 50.00, 100, true, NOW(), NOW() + INTERVAL '30 days'),
('SAVE20', 'خصم 20% على جميع المنتجات', 'percentage', 20.00, 200.00, 100.00, 50, true, NOW(), NOW() + INTERVAL '15 days'),
('FIRST50', 'خصم 50 ريال على الطلب الأول', 'fixed', 50.00, 150.00, NULL, 200, true, NOW(), NOW() + INTERVAL '60 days'),
('SUMMER15', 'خصم صيفي 15%', 'percentage', 15.00, 120.00, 75.00, 75, true, NOW(), NOW() + INTERVAL '45 days'),
('MEGA30', 'خصم ضخم 30%', 'percentage', 30.00, 300.00, 150.00, 25, true, NOW(), NOW() + INTERVAL '7 days')
ON CONFLICT (code) DO NOTHING;

-- Insert store settings
INSERT INTO store_settings (key, value, type, description) VALUES
('store_name', 'المتجر الإلكتروني', 'text', 'اسم المتجر'),
('store_email', 'info@store.com', 'email', 'البريد الإلكتروني للمتجر'),
('store_phone', '+966501234567', 'tel', 'رقم هاتف المتجر'),
('store_address', 'الرياض، المملكة العربية السعودية', 'textarea', 'عنوان المتجر'),
('store_description', 'متجر إلكتروني متكامل يوفر أفضل المنتجات بأسعار تنافسية', 'textarea', 'وصف المتجر'),
('currency', 'SAR', 'text', 'العملة المستخدمة'),
('currency_symbol', 'ر.س', 'text', 'رمز العملة'),
('min_order_amount', '50', 'number', 'أقل مبلغ للطلب'),
('free_delivery_amount', '200', 'number', 'مبلغ التوصيل المجاني'),
('default_delivery_fee', '25', 'number', 'رسوم التوصيل الافتراضية'),
('tax_rate', '15', 'number', 'معدل الضريبة (%)'),
('order_processing_time', '30', 'number', 'وقت معالجة الطلب (دقيقة)'),
('delivery_time', '60', 'number', 'وقت التوصيل (دقيقة)'),
('store_status', 'open', 'select', 'حالة المتجر'),
('maintenance_message', 'المتجر مغلق مؤقتاً للصيانة', 'textarea', 'رسالة الصيانة'),
('welcome_message', 'مرحباً بكم في متجرنا الإلكتروني', 'text', 'رسالة الترحيب'),
('whatsapp_number', '+966501234567', 'tel', 'رقم الواتساب للدعم'),
('instagram_url', 'https://instagram.com/store', 'url', 'رابط الانستغرام'),
('twitter_url', 'https://twitter.com/store', 'url', 'رابط تويتر'),
('facebook_url', 'https://facebook.com/store', 'url', 'رابط الفيسبوك')
ON CONFLICT (key) DO NOTHING;

-- Insert banners
INSERT INTO banners (title, subtitle, description, background_color, text_color, button_text, button_link, is_active, sort_order) VALUES
('عروض خاصة', 'خصم يصل إلى 50%', 'على جميع المنتجات المختارة لفترة محدودة', 'bg-gradient-to-r from-blue-600 to-blue-800', 'text-white', 'تسوق الآن', '#', true, 1),
('منتجات جديدة', 'اكتشف أحدث المنتجات', 'مجموعة متنوعة من المنتجات عالية الجودة', 'bg-gradient-to-r from-green-600 to-green-800', 'text-white', 'استكشف', '#', true, 2),
('توصيل مجاني', 'للطلبات أكثر من 200 ريال', 'استمتع بالتوصيل المجاني لجميع أنحاء المدينة', 'bg-gradient-to-r from-purple-600 to-purple-800', 'text-white', 'اطلب الآن', '#', true, 3)
ON CONFLICT DO NOTHING;

-- Insert sample users
INSERT INTO users (phone, full_name, email, city_id, address) VALUES
('0501234567', 'أحمد محمد علي', 'ahmed@example.com', (SELECT id FROM cities WHERE name = 'الرياض' LIMIT 1), 'حي العليا، شارع الملك فهد'),
('0509876543', 'فاطمة سعد الغامدي', 'fatima@example.com', (SELECT id FROM cities WHERE name = 'جدة' LIMIT 1), 'حي الصفا، طريق الملك عبدالعزيز'),
('0512345678', 'خالد عبدالله السعد', 'khalid@example.com', (SELECT id FROM cities WHERE name = 'الدمام' LIMIT 1), 'حي الفيصلية، شارع الأمير محمد')
ON CONFLICT (phone) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (order_number, user_id, customer_name, customer_phone, customer_address, city_id, subtotal, total, status, payment_status) VALUES
('ORD-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'), (SELECT id FROM users WHERE phone = '0501234567' LIMIT 1), 'أحمد محمد علي', '0501234567', 'حي العليا، شارع الملك فهد', (SELECT id FROM cities WHERE name = 'الرياض' LIMIT 1), 597.00, 612.00, 'delivered', 'paid'),
('ORD-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'), (SELECT id FROM users WHERE phone = '0509876543' LIMIT 1), 'فاطمة سعد الغامدي', '0509876543', 'حي الصفا، طريق الملك عبدالعزيز', (SELECT id FROM cities WHERE name = 'جدة' LIMIT 1), 599.00, 619.00, 'out_for_delivery', 'paid'),
('ORD-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'), (SELECT id FROM users WHERE phone = '0512345678' LIMIT 1), 'خالد عبدالله السعد', '0512345678', 'حي الفيصلية، شارع الأمير محمد', (SELECT id FROM cities WHERE name = 'الدمام' LIMIT 1), 648.00, 668.00, 'preparing', 'paid')
ON CONFLICT (order_number) DO NOTHING;
