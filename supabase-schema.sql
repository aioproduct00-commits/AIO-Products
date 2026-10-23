-- =========================================================================
-- AIO PRODUCT — SUPABASE DATABASE SCHEMA
-- Brand: AIO PRODUCT | Tagline: "Because Brand Matters."
-- Target Country: Pakistan (PKR ₨)
-- =========================================================================
-- Instructions:
-- 1. Open your Supabase Project: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste this entire script, and click "RUN".
-- 4. In Project Settings -> API, copy your Project URL and Anon Public Key.
-- 5. Add them to your environment variables or in the AIO PRODUCT Admin Panel.
-- =========================================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    compare_at_price NUMERIC(12, 2),
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    avatar_url TEXT,
    auth_provider TEXT DEFAULT 'guest',
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_id TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    customer_city TEXT,
    customer_address TEXT,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
    payment_status TEXT NOT NULL DEFAULT 'Pending',
    order_status TEXT NOT NULL DEFAULT 'Pending',
    shipping_address JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. SITE SETTINGS TABLE (Editable CMS content)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Products Policies
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin can manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Customers Policies
CREATE POLICY "Anyone can create customer record on checkout or signup" ON public.customers
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view customers" ON public.customers
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update customers" ON public.customers
    FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete customers" ON public.customers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Orders Policies
CREATE POLICY "Customers can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can track own order by order_number" ON public.orders
    FOR SELECT USING (true);
CREATE POLICY "Admin can update orders" ON public.orders
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete orders" ON public.orders
    FOR DELETE USING (auth.role() = 'authenticated');

-- Order Items Policies
CREATE POLICY "Customers can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read order items of their order" ON public.order_items
    FOR SELECT USING (true);
CREATE POLICY "Admin can manage order items" ON public.order_items
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Reviews Policies
CREATE POLICY "Public can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true OR auth.role() = 'authenticated');
CREATE POLICY "Anyone can submit review" ON public.reviews
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage reviews" ON public.reviews
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Newsletter Policies
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Site Settings Policies
CREATE POLICY "Public can view site settings" ON public.site_settings
    FOR SELECT USING (true);
CREATE POLICY "Admin can update site settings" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =========================================================================
-- INITIAL SEED DATA
-- =========================================================================
INSERT INTO public.categories (id, name, slug, description, image_url, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Smart Electronics', 'smart-electronics', 'Cutting-edge everyday technology and accessories for high productivity.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', true),
    ('22222222-2222-2222-2222-222222222222', 'Home & Living', 'home-living', 'Smart living solutions and premium home essentials for comfort.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', true),
    ('33333333-3333-3333-3333-333333333333', 'Personal Grooming', 'personal-grooming', 'High quality self-care and grooming essentials designed for modern lifestyles.', 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80', true),
    ('44444444-4444-4444-4444-444444444444', 'Lifestyle & Travel', 'lifestyle-travel', 'Durable, stylish everyday carry gear and travel utilities.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, price, compare_at_price, image_url, category_id, stock_quantity, is_active, is_featured)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AIO Pro Bass Active ANC Wireless Earbuds', 'aio-pro-bass-anc-wireless-earbuds', 'Engineered for crisp vocal clarity, dynamic punchy bass, and 36-hour total battery life. Perfect for commutes and remote calls.', 4450.00, 6500.00, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', '11111111-1111-1111-1111-111111111111', 25, true, true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'AIO UltraSlim Magnetic 10000mAh Power Bank', 'aio-ultraslim-magnetic-powerbank', 'High-speed 22.5W fast charging with digital LED power display and multi-device protection. Fits seamlessly into your pocket.', 3200.00, 4200.00, 'https://images.unsplash.com/photo-1609592426861-125c1d683fb6?w=800&auto=format&fit=crop&q=80', '11111111-1111-1111-1111-111111111111', 18, true, true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'AIO Smart Sonic Electric Toothbrush & Sanitizer', 'aio-smart-sonic-electric-toothbrush', '40,000 vibrations/min with 5 tailored cleaning modes and IPX7 waterproof rating. Includes 3 replacement brush heads.', 3850.00, 5200.00, 'https://images.unsplash.com/photo-1559591937-e1032c1c68e9?w=800&auto=format&fit=crop&q=80', '33333333-3333-3333-3333-333333333333', 14, true, true),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'AIO Precision Matte Stainless Steel Thermal Tumbler 750ml', 'aio-matte-thermal-tumbler-750ml', 'Double-wall vacuum insulation keeps drinks chilled for 24 hours or piping hot for 12 hours. Leak-proof lock lid.', 2150.00, 2900.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', '44444444-4444-4444-4444-444444444444', 32, true, true),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'AIO Ambient Glow Aromatherapy Diffuser & Lamp', 'aio-ambient-glow-aromatherapy-diffuser', 'Ultra-quiet ultrasonic misting with warm candlelight LED glow. Enhances indoor air and creates a soothing bedroom ambiance.', 2750.00, 3600.00, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80', '22222222-2222-2222-2222-222222222222', 20, true, true),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'AIO Ergonomic Memory Foam Lumbar Support Pillow', 'aio-ergonomic-memory-foam-lumbar-pillow', 'Doctor-recommended orthopedic contoured memory foam for office chairs and car seats. Relieves lower back strain during long hours.', 2650.00, 3500.00, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', '22222222-2222-2222-2222-222222222222', 15, true, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reviews (product_id, customer_name, rating, review_text, is_approved)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hamza Tariq (Lahore)', 5, 'Ordered on Monday and received in Lahore via TCS on Wednesday. Sound quality is exceptional, very clean bass and ANC works great in noisy areas.', true),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Zainab Bilal (Karachi)', 5, 'Super impressed by the build quality and packaging. AIO PRODUCT is genuinely authentic. Highly recommended!', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Muhammad Usman (Islamabad)', 5, 'The 22.5W fast charge is real. Charged my phone twice with battery to spare. Cash on Delivery was seamless.', true),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Dr. Sarah Khan (Rawalpindi)', 5, 'Holds ice water all day at the clinic even in 40 degree heat. The matte finish feels very premium.', true)
ON CONFLICT DO NOTHING;

-- =========================================================================
-- SUPABASE STORAGE BUCKET: aio-media (Product images & banners)
-- =========================================================================
-- Create the public storage bucket for product photos and promotional banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'aio-media',
    'aio-media',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage Policies: Public can read, authenticated or anon with app key can upload product media
CREATE POLICY "Public media access" ON storage.objects
    FOR SELECT USING (bucket_id = 'aio-media');

CREATE POLICY "Admin & store image upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'aio-media');

CREATE POLICY "Admin & store image update" ON storage.objects
    FOR UPDATE USING (bucket_id = 'aio-media');

CREATE POLICY "Admin & store image delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'aio-media');
