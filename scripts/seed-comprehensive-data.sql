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
