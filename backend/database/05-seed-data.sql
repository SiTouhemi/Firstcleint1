-- Insert sample cities
INSERT INTO cities (name) VALUES 
('الرياض'),
('جدة'),
('الدمام'),
('مكة المكرمة'),
('المدينة المنورة'),
('الطائف'),
('تبوك'),
('بريدة'),
('خميس مشيط'),
('حائل');

-- Insert sample districts for Riyadh
INSERT INTO districts (city_id, name) 
SELECT id, district_name FROM cities, 
(VALUES 
  ('العليا'),
  ('الملز'),
  ('النخيل'),
  ('الروضة'),
  ('السليمانية'),
  ('المروج'),
  ('الياسمين'),
  ('النرجس'),
  ('الورود'),
  ('الربيع')
) AS districts(district_name)
WHERE cities.name = 'الرياض';

-- Insert sample store
INSERT INTO stores (name, email, phone, address, location_lat, location_lng, delivery_range) VALUES
('متجر الرياض الرئيسي', 'info@riyadhstore.com', '+966501234567', 'الرياض، حي العليا، شارع الملك فهد', 24.7136, 46.6753, 15);

-- Get the store ID for further inserts
DO $$
DECLARE
    store_uuid UUID;
BEGIN
    SELECT id INTO store_uuid FROM stores WHERE name = 'متجر الرياض الرئيسي';
    
    -- Insert sample categories
    INSERT INTO categories (store_id, name, description, icon, sort_order) VALUES
    (store_uuid, 'إلكترونيات', 'أجهزة إلكترونية ومعدات تقنية', '📱', 1),
    (store_uuid, 'ملابس', 'ملابس رجالية ونسائية وأطفال', '👕', 2),
    (store_uuid, 'منزل ومطبخ', 'أدوات منزلية ومطبخية', '🏠', 3),
    (store_uuid, 'رياضة', 'معدات رياضية وملابس رياضية', '⚽', 4),
    (store_uuid, 'جمال وعناية', 'منتجات التجميل والعناية الشخصية', '💄', 5),
    (store_uuid, 'كتب', 'كتب ومجلات ومواد تعليمية', '📚', 6);

    -- Insert subcategories
    INSERT INTO categories (store_id, name, parent_id, sort_order) VALUES
    (store_uuid, 'هواتف ذكية', (SELECT id FROM categories WHERE name = 'إلكترونيات' AND store_id = store_uuid), 1),
    (store_uuid, 'حاسوب محمول', (SELECT id FROM categories WHERE name = 'إلكترونيات' AND store_id = store_uuid), 2),
    (store_uuid, 'ملابس رجالية', (SELECT id FROM categories WHERE name = 'ملابس' AND store_id = store_uuid), 1),
    (store_uuid, 'ملابس نسائية', (SELECT id FROM categories WHERE name = 'ملابس' AND store_id = store_uuid), 2);

    -- Insert sample products
    INSERT INTO products (store_id, category_id, subcategory_id, name, description, price, unit, image_url, stock_quantity) VALUES
    (store_uuid, 
     (SELECT id FROM categories WHERE name = 'إلكترونيات' AND store_id = store_uuid),
     (SELECT id FROM categories WHERE name = 'هواتف ذكية' AND store_id = store_uuid),
     'iPhone 15 Pro', 'أحدث هاتف من آبل بمواصفات متقدمة', 4999.00, 'قطعة', '/placeholder.svg?height=300&width=300', 50),
    
    (store_uuid,
     (SELECT id FROM categories WHERE name = 'ملابس' AND store_id = store_uuid),
     (SELECT id FROM categories WHERE name = 'ملابس رجالية' AND store_id = store_uuid),
     'قميص قطني كلاسيكي', 'قميص قطني عالي الجودة للرجال', 149.00, 'قطعة', '/placeholder.svg?height=300&width=300', 100),
    
    (store_uuid,
     (SELECT id FROM categories WHERE name = 'منزل ومطبخ' AND store_id = store_uuid),
     NULL,
     'طقم أواني طبخ', 'طقم أواني طبخ من الستانلس ستيل', 299.00, 'طقم', '/placeholder.svg?height=300&width=300', 25);

    -- Insert sample banners
    INSERT INTO banners (store_id, title, subtitle, description, background_color, button_text, button_link, sort_order) VALUES
    (store_uuid, 'عروض خاصة', 'خصم يصل إلى 50%', 'اكتشف أفضل العروض على منتجاتنا المميزة', 'bg-gradient-to-r from-blue-600 to-blue-800', 'تسوق الآن', '#', 1),
    (store_uuid, 'منتجات جديدة', 'وصل حديثاً', 'تصفح أحدث المنتجات في متجرنا', 'bg-gradient-to-r from-green-600 to-green-800', 'اكتشف المزيد', '#', 2);

    -- Insert sample promo code
    INSERT INTO promo_codes (store_id, code, description, discount_type, discount_value, min_order_amount, valid_from, valid_until) VALUES
    (store_uuid, 'SAVE20', 'خصم 20% على جميع المنتجات', 'percentage', 20.00, 100.00, NOW(), NOW() + INTERVAL '30 days');

    -- Insert sample admin user (password: admin123)
    INSERT INTO admin_users (username, email, password_hash) VALUES
    ('admin', 'admin@store.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO');
END $$;
