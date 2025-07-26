-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS extension (if needed)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NULL,
  role VARCHAR(50) NULL DEFAULT 'admin',
  email VARCHAR(255) NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id),
  CONSTRAINT admin_users_email_key UNIQUE (email),
  CONSTRAINT admin_users_username_key UNIQUE (username)
);

-- Create cities table
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT cities_pkey PRIMARY KEY (id),
  CONSTRAINT cities_name_key UNIQUE (name)
);

-- Create districts table
CREATE TABLE public.districts (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  city_id UUID NULL,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT districts_pkey PRIMARY KEY (id),
  CONSTRAINT districts_city_id_name_key UNIQUE (city_id, name),
  CONSTRAINT districts_city_id_fkey FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE
);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NULL,
  description TEXT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  address TEXT NOT NULL,
  city_id UUID NULL,
  location_lat NUMERIC(10, 8) NULL,
  location_lng NUMERIC(11, 8) NULL,
  delivery_range INTEGER NULL DEFAULT 10,
  delivery_fee NUMERIC(10, 2) NULL DEFAULT 0,
  min_order_amount NUMERIC(10, 2) NULL DEFAULT 0,
  theme_color VARCHAR(7) NULL DEFAULT '#3B82F6',
  is_active BOOLEAN NULL DEFAULT true,
  is_featured BOOLEAN NULL DEFAULT false,
  opening_hours JSONB NULL,
  social_media JSONB NULL,
  settings JSONB NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT stores_pkey PRIMARY KEY (id),
  CONSTRAINT stores_slug_key UNIQUE (slug),
  CONSTRAINT stores_city_id_fkey FOREIGN KEY (city_id) REFERENCES cities (id)
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  store_id UUID NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NULL,
  icon VARCHAR(100) NULL,
  image_url TEXT NULL,
  parent_id UUID NULL,
  sort_order INTEGER NULL DEFAULT 0,
  is_active BOOLEAN NULL DEFAULT true,
  is_featured BOOLEAN NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_store_id_slug_key UNIQUE (store_id, slug),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE CASCADE,
  CONSTRAINT categories_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  store_id UUID NULL,
  category_id UUID NULL,
  subcategory_id UUID NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NULL,
  price NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50) NULL,
  image_url TEXT NULL,
  is_active BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
  CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
  CONSTRAINT products_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES categories (id) ON DELETE SET NULL
);

-- Create product_images table
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  product_id UUID NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255) NULL,
  sort_order INTEGER NULL DEFAULT 0,
  is_primary BOOLEAN NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- Create promo_codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  store_id UUID NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT NULL,
  discount_type VARCHAR(20) NOT NULL,
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) NULL DEFAULT 0,
  max_discount_amount NUMERIC(10, 2) NULL,
  usage_limit INTEGER NULL,
  used_count INTEGER NULL DEFAULT 0,
  is_active BOOLEAN NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NULL,
  end_date TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT promo_codes_pkey PRIMARY KEY (id),
  CONSTRAINT promo_codes_store_id_code_key UNIQUE (store_id, code),
  CONSTRAINT promo_codes_discount_type_check CHECK (
    (discount_type)::text = ANY (ARRAY['percentage'::character varying, 'fixed'::character varying])
  ),
  CONSTRAINT promo_codes_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  store_id UUID NULL,
  order_number VARCHAR(50) NOT NULL,
  status VARCHAR(50) NULL DEFAULT 'pending',
  payment_status VARCHAR(50) NULL DEFAULT 'pending',
  payment_method VARCHAR(50) NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  city_id UUID NULL,
  district_id UUID NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) NULL DEFAULT 0,
  delivery_fee NUMERIC(10, 2) NULL DEFAULT 0,
  tax_amount NUMERIC(10, 2) NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  promo_code_id UUID NULL,
  promo_code VARCHAR(50) NULL,
  delivery_date DATE NULL,
  delivery_time_slot VARCHAR(50) NULL,
  delivery_notes TEXT NULL,
  notes TEXT NULL,
  admin_notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_order_number_key UNIQUE (order_number),
  CONSTRAINT orders_promo_code_id_fkey FOREIGN KEY (promo_code_id) REFERENCES promo_codes (id) ON DELETE SET NULL,
  CONSTRAINT orders_district_id_fkey FOREIGN KEY (district_id) REFERENCES districts (id) ON DELETE SET NULL,
  CONSTRAINT orders_city_id_fkey FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE SET NULL,
  CONSTRAINT orders_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
  CONSTRAINT orders_payment_status_check CHECK (
    (payment_status)::text = ANY (ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying, 'refunded'::character varying])
  ),
  CONSTRAINT orders_status_check CHECK (
    (status)::text = ANY (ARRAY['pending'::character varying, 'confirmed'::character varying, 'preparing'::character varying, 'ready'::character varying, 'out_for_delivery'::character varying, 'delivered'::character varying, 'cancelled'::character varying])
  )
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  order_id UUID NULL,
  product_id UUID NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NULL,
  product_id UUID NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  store_id UUID NULL,
  title VARCHAR(255) NULL,
  subtitle VARCHAR(255) NULL,
  description TEXT NULL,
  background_color VARCHAR(255) NULL,
  text_color VARCHAR(255) NULL,
  button_text VARCHAR(100) NULL,
  button_link VARCHAR(255) NULL,
  button_color VARCHAR(50) NULL,
  position VARCHAR(50) NULL DEFAULT 'hero',
  sort_order INTEGER NULL DEFAULT 0,
  is_active BOOLEAN NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NULL,
  end_date TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  offer_text VARCHAR(255) NULL,
  badge_text VARCHAR(50) NULL,
  CONSTRAINT banners_pkey PRIMARY KEY (id),
  CONSTRAINT banners_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB NULL,
  is_read BOOLEAN NULL DEFAULT false,
  admin_user_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_store_status ON public.orders USING btree (store_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders USING btree (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders USING btree (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items USING btree (order_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_session ON public.cart_items USING btree (session_id);

CREATE INDEX IF NOT EXISTS idx_categories_store_parent ON public.categories USING btree (store_id, parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories USING btree (store_id, slug);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images USING btree (product_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_products_store_category ON public.products USING btree (store_id, category_id);
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin (
  to_tsvector('arabic'::regconfig, ((name)::text || ' '::text) || COALESCE(description, ''::text))
);

CREATE INDEX IF NOT EXISTS idx_notifications_admin_user ON public.notifications USING btree (admin_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications USING btree (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications USING btree (created_at DESC);

-- Create PostGIS views (if PostGIS is enabled)
-- These are optional and only needed if you're using PostGIS
CREATE OR REPLACE VIEW public.geography_columns AS
SELECT
  current_database() AS f_table_catalog,
  n.nspname AS f_table_schema,
  c.relname AS f_table_name,
  a.attname AS f_geography_column,
  postgis_typmod_dims(a.atttypmod) AS coord_dimension,
  postgis_typmod_srid(a.atttypmod) AS srid,
  postgis_typmod_type(a.atttypmod) AS type
FROM
  pg_class c,
  pg_attribute a,
  pg_type t,
  pg_namespace n
WHERE
  t.typname = 'geography'::name
  AND a.attisdropped = false
  AND a.atttypid = t.oid
  AND a.attrelid = c.oid
  AND c.relnamespace = n.oid
  AND (c.relkind = ANY(ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"]))
  AND NOT pg_is_other_temp_schema(c.relnamespace)
  AND has_table_privilege(c.oid, 'SELECT'::text);

CREATE OR REPLACE VIEW public.geometry_columns AS
SELECT
  current_database()::character varying(256) AS f_table_catalog,
  n.nspname AS f_table_schema,
  c.relname AS f_table_name,
  a.attname AS f_geometry_column,
  COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension,
  COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid,
  replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type
FROM
  pg_class c
  JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped
  JOIN pg_namespace n ON c.relnamespace = n.oid
  JOIN pg_type t ON a.atttypid = t.oid
  LEFT JOIN (
    SELECT
      s.connamespace,
      s.conrelid,
      s.conkey,
      replace(split_part(s.consrc, ''''::text, 2), ')'::text, ''::text) AS type
    FROM (
      SELECT
        pg_constraint.connamespace,
        pg_constraint.conrelid,
        pg_constraint.conkey,
        pg_get_constraintdef(pg_constraint.oid) AS consrc
      FROM pg_constraint
    ) s
    WHERE s.consrc ~~* '%geometrytype(% = %'::text
  ) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY(st.conkey))
  LEFT JOIN (
    SELECT
      s.connamespace,
      s.conrelid,
      s.conkey,
      replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text)::integer AS ndims
    FROM (
      SELECT
        pg_constraint.connamespace,
        pg_constraint.conrelid,
        pg_constraint.conkey,
        pg_get_constraintdef(pg_constraint.oid) AS consrc
      FROM pg_constraint
    ) s
    WHERE s.consrc ~~* '%ndims(% = %'::text
  ) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY(sn.conkey))
  LEFT JOIN (
    SELECT
      s.connamespace,
      s.conrelid,
      s.conkey,
      replace(replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text), '('::text, ''::text)::integer AS srid
    FROM (
      SELECT
        pg_constraint.connamespace,
        pg_constraint.conrelid,
        pg_constraint.conkey,
        pg_get_constraintdef(pg_constraint.oid) AS consrc
      FROM pg_constraint
    ) s
    WHERE s.consrc ~~* '%srid(% = %'::text
  ) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY(sr.conkey))
WHERE
  (c.relkind = ANY(ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"]))
  AND NOT c.relname = 'raster_columns'::name
  AND t.typname = 'geometry'::name
  AND NOT pg_is_other_temp_schema(c.relnamespace)
  AND has_table_privilege(c.oid, 'SELECT'::text);

-- Create spatial_ref_sys table (PostGIS)
CREATE TABLE public.spatial_ref_sys (
  srid INTEGER NOT NULL,
  auth_name CHARACTER VARYING(256) NULL,
  auth_srid INTEGER NULL,
  srtext CHARACTER VARYING(2048) NULL,
  proj4text CHARACTER VARYING(2048) NULL,
  CONSTRAINT spatial_ref_sys_pkey PRIMARY KEY (srid),
  CONSTRAINT spatial_ref_sys_srid_check CHECK ((srid > 0) AND (srid <= 998999))
);

-- ===========================================
-- SAMPLE DATA INSERTS
-- ===========================================

-- Insert Cities (6 cities in Egypt)
INSERT INTO public.cities (id, name, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'القاهرة', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'الإسكندرية', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'الجيزة', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'المنوفية', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'الشرقية', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'أسيوط', true, NOW(), NOW());

-- Insert Districts for Cairo
INSERT INTO public.districts (id, city_id, name, is_active, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'المعادي', true, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'مدينة نصر', true, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'الزمالك', true, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'سموحة', true, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'سيدي جابر', true, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'الدقي', true, NOW(), NOW());

-- Insert Stores (3 stores in different cities)
INSERT INTO public.stores (id, name, slug, description, email, phone, address, city_id, location_lat, location_lng, delivery_range, delivery_fee, min_order_amount, theme_color, is_active, is_featured, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'متجر القاهرة المركزي', 'cairo-central-store', 'أكبر متجر في القاهرة للمنتجات الطازجة', 'info@cairo-store.com', '01012345678', 'شارع التحرير، وسط البلد، القاهرة', '550e8400-e29b-41d4-a716-446655440001', 30.0444, 31.2357, 15, 10, 50, '#3B82F6', true, true, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440002', 'متجر الإسكندرية الساحلي', 'alexandria-coastal', 'متجر طازج على ساحل الإسكندرية', 'info@alexandria-store.com', '01012345679', 'شارع الكورنيش، سيدي جابر، الإسكندرية', '550e8400-e29b-41d4-a716-446655440002', 31.2001, 29.9187, 12, 15, 75, '#10B981', true, false, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440003', 'متجر الجيزة الحديث', 'giza-modern', 'متجر حديث في قلب الجيزة', 'info@giza-store.com', '01012345680', 'شارع الجامعة، الدقي، الجيزة', '550e8400-e29b-41d4-a716-446655440003', 30.0131, 31.2089, 10, 12, 60, '#F59E0B', true, true, NOW(), NOW());

-- Insert Categories (7 categories)
INSERT INTO public.categories (id, store_id, name, slug, description, icon, sort_order, is_active, is_featured, created_at, updated_at) VALUES
-- Store 1 Categories
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'خضروات طازجة', 'fresh-vegetables', 'خضروات عضوية طازجة من المزرعة', '🥬', 1, true, true, NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'فواكه موسمية', 'seasonal-fruits', 'فواكه موسمية حلوة', '🍎', 2, true, true, NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'لحوم طازجة', 'fresh-meat', 'لحوم طازجة عالية الجودة', '🥩', 3, true, false, NOW(), NOW()),
-- Store 2 Categories
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 'أسماك طازجة', 'fresh-fish', 'أسماك طازجة من البحر المتوسط', '🐟', 1, true, true, NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'مخبوزات', 'bakery', 'مخبوزات طازجة يومياً', '🥖', 2, true, false, NOW(), NOW()),
-- Store 3 Categories
('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440003', 'ألبان وأجبان', 'dairy', 'منتجات ألبان طازجة', '🧀', 1, true, true, NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', 'مشروبات طبيعية', 'natural-drinks', 'عصائر طبيعية طازجة', '🥤', 2, true, false, NOW(), NOW());

-- Insert Products (9 products across different stores)
INSERT INTO public.products (id, store_id, category_id, name, slug, description, price, unit, image_url, is_active, created_at, updated_at) VALUES
-- Store 1 Products
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'طماطم طازجة', 'fresh-tomatoes', 'طماطم طازجة من المزرعة', 15.00, 'كيلو', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', true, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'خيار عضوي', 'organic-cucumber', 'خيار عضوي طازج', 8.50, 'كيلو', 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', true, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 'تفاح أحمر', 'red-apples', 'تفاح أحمر حلو', 25.00, 'كيلو', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', true, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 'لحم بقري طازج', 'fresh-beef', 'لحم بقري طازج عالي الجودة', 120.00, 'كيلو', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', true, NOW(), NOW()),
-- Store 2 Products
('990e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440004', 'سمك بلطي طازج', 'fresh-tilapia', 'سمك بلطي طازج من النيل', 45.00, 'كيلو', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', true, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440005', 'خبز بلدي طازج', 'fresh-bread', 'خبز بلدي طازج من الفرن', 2.50, 'قطعة', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', true, NOW(), NOW()),
-- Store 3 Products
('990e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440006', 'جبنة رومي', 'romi-cheese', 'جبنة رومي طازجة', 35.00, 'كيلو', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', true, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440007', 'عصير برتقال طازج', 'fresh-orange-juice', 'عصير برتقال طازج طبيعي', 15.00, 'لتر', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', true, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440006', 'زبدة طازجة', 'fresh-butter', 'زبدة طازجة من الحليب الكامل', 25.00, 'كيلو', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', true, NOW(), NOW());

-- Insert Product Images
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', 'طماطم طازجة', 1, true, NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', 'خيار عضوي', 1, true, NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', 'تفاح أحمر', 1, true, NOW()),
('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', 'لحم بقري طازج', 1, true, NOW()),
('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', 'سمك بلطي طازج', 1, true, NOW()),
('aa0e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 'خبز بلدي طازج', 1, true, NOW()),
('aa0e8400-e29b-41d4-a716-446655440007', '990e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', 'جبنة رومي', 1, true, NOW()),
('aa0e8400-e29b-41d4-a716-446655440008', '990e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', 'عصير برتقال طازج', 1, true, NOW()),
('aa0e8400-e29b-41d4-a716-446655440009', '990e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'زبدة طازجة', 1, true, NOW());

-- Insert Promo Codes
INSERT INTO public.promo_codes (id, store_id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, used_count, is_active, start_date, end_date, created_at, updated_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'WELCOME2024', 'خصم ترحيبي للعملاء الجدد', 'percentage', 15.00, 100.00, 50.00, 100, 0, true, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', NOW(), NOW()),
('bb0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'FRESH10', 'خصم على المنتجات الطازجة', 'fixed', 10.00, 50.00, NULL, 50, 0, true, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', NOW(), NOW()),
('bb0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'DAIRY20', 'خصم 20% على منتجات الألبان', 'percentage', 20.00, 75.00, 30.00, 25, 0, true, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', NOW(), NOW());

-- Insert Banners
INSERT INTO public.banners (id, store_id, title, subtitle, description, background_color, text_color, button_text, button_link, button_color, position, sort_order, is_active, start_date, end_date, created_at, updated_at, offer_text, badge_text) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'خصم 25% على الخضروات', 'عرض محدود', 'احصل على خصم 25% على جميع الخضروات الطازجة', '#10B981', '#FFFFFF', 'تسوق الآن', '/products?category=fresh-vegetables', '#FFFFFF', 'hero', 1, true, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', NOW(), NOW(), 'خصم 25%', 'عرض محدود'),
('cc0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'الأسماك الطازجة', 'من البحر مباشرة', 'أسماك طازجة من البحر المتوسط', '#3B82F6', '#FFFFFF', 'اكتشف المنتجات', '/products?category=fresh-fish', '#FFFFFF', 'hero', 1, true, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', NOW(), NOW(), 'من البحر مباشرة', 'طازج');

-- Insert Admin User
INSERT INTO public.admin_users (id, username, password_hash, full_name, role, email, created_at) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير النظام', 'admin', 'admin@example.com', NOW());