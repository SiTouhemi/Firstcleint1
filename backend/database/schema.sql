-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  address TEXT,
  city VARCHAR(100),
  phone VARCHAR(20),
  delivery_range INTEGER DEFAULT 10, -- in kilometers
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  unit VARCHAR(50),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners table
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_stores_city ON stores(city);
CREATE INDEX idx_stores_active ON stores(is_active);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);

-- Insert sample data
INSERT INTO categories (name, slug, description) VALUES
('خضروات', 'vegetables', 'خضروات طازجة ومتنوعة'),
('فواكه', 'fruits', 'فواكه طازجة وموسمية'),
('لحوم', 'meat', 'لحوم طازجة وعالية الجودة'),
('ألبان', 'dairy', 'منتجات الألبان والأجبان'),
('مخبوزات', 'bakery', 'خبز ومعجنات طازجة'),
('مشروبات', 'beverages', 'مشروبات متنوعة');

INSERT INTO stores (name, slug, city, location_lat, location_lng, address, phone, delivery_range) VALUES
('متجر الرياض المركزي', 'riyadh-central', 'الرياض', 24.7136, 46.6753, 'شارع الملك فهد، الرياض', '0501234567', 15),
('سوق جدة الطازج', 'jeddah-fresh', 'جدة', 21.4858, 39.1925, 'شارع التحلية، جدة', '0501234568', 12),
('متجر الدمام الشرقي', 'dammam-east', 'الدمام', 26.4207, 50.0888, 'شارع الملك سعود، الدمام', '0501234569', 10);

INSERT INTO banners (title, description, image_url, sort_order) VALUES
('عروض الأسبوع', 'خصومات تصل إلى 50% على جميع المنتجات', '/placeholder.svg?height=200&width=400', 1),
('توصيل مجاني', 'توصيل مجاني للطلبات أكثر من 100 ريال', '/placeholder.svg?height=200&width=400', 2);

INSERT INTO products (name, description, price, image_url, category_id, store_id, stock_quantity, unit, available) VALUES
-- Vegetables
('طماطم', 'طماطم طازجة محلية', 8.50, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'vegetables'), (SELECT id FROM stores WHERE slug = 'riyadh-central'), 100, 'كيلو', true),
('خيار', 'خيار طازج ومقرمش', 6.00, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'vegetables'), (SELECT id FROM stores WHERE slug = 'riyadh-central'), 80, 'كيلو', true),
('جزر', 'جزر طازج وحلو', 7.50, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'vegetables'), (SELECT id FROM stores WHERE slug = 'jeddah-fresh'), 60, 'كيلو', true),

-- Fruits
('تفاح أحمر', 'تفاح أحمر طازج ومستورد', 12.00, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'fruits'), (SELECT id FROM stores WHERE slug = 'riyadh-central'), 50, 'كيلو', true),
('موز', 'موز طازج ومستورد', 9.50, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'fruits'), (SELECT id FROM stores WHERE slug = 'jeddah-fresh'), 70, 'كيلو', true),
('برتقال', 'برتقال طازج وعصيري', 10.00, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'fruits'), (SELECT id FROM stores WHERE slug = 'dammam-east'), 90, 'كيلو', true),

-- Dairy
('حليب طازج', 'حليب طازج كامل الدسم', 8.00, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'dairy'), (SELECT id FROM stores WHERE slug = 'riyadh-central'), 30, 'لتر', true),
('جبن أبيض', 'جبن أبيض طازج', 15.00, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'dairy'), (SELECT id FROM stores WHERE slug = 'jeddah-fresh'), 25, 'كيلو', true),

-- Meat
('لحم غنم', 'لحم غنم طازج ومحلي', 45.00, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'meat'), (SELECT id FROM stores WHERE slug = 'riyadh-central'), 20, 'كيلو', true),
('دجاج كامل', 'دجاج طازج ومحلي', 18.00, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'meat'), (SELECT id FROM stores WHERE slug = 'dammam-east'), 40, 'كيلو', true),

-- Bakery
('خبز عربي', 'خبز عربي طازج', 2.50, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'bakery'), (SELECT id FROM stores WHERE slug = 'riyadh-central'), 100, 'رغيف', true),
('كرواسان', 'كرواسان طازج بالزبدة', 3.50, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'bakery'), (SELECT id FROM stores WHERE slug = 'jeddah-fresh'), 50, 'حبة', true),

-- Beverages
('عصير برتقال', 'عصير برتقال طبيعي 100%', 12.00, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'beverages'), (SELECT id FROM stores WHERE slug = 'riyadh-central'), 60, 'لتر', true),
('ماء معدني', 'ماء معدني طبيعي', 1.50, '/placeholder.svg?height=200&width=200', (SELECT id FROM categories WHERE slug = 'beverages'), (SELECT id FROM stores WHERE slug = 'dammam-east'), 200, 'زجاجة', true);
