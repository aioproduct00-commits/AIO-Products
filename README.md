# AIO PRODUCT — “Because Brand Matters.”

A modern, responsive e-commerce web platform engineered for customers across Pakistan.

---

## 🇵🇰 Brand Overview

* **Brand Name:** AIO PRODUCT
* **Tagline:** “Because Brand Matters.”
* **Brand Description:** AIO PRODUCT is a modern online shopping brand focused on bringing useful, quality, and carefully selected products to customers in Pakistan. We aim to provide a simple, trustworthy, convenient, and enjoyable online shopping experience. Because Brand Matters — every product, order, and customer experience should reflect quality and trust.
* **Store Currency:** Pakistani Rupee (**PKR ₨**)
* **Payment Support:** Nationwide Cash on Delivery (COD) & prepared Online Gateway structure

---

## 🚀 Key Features

1. **Modern Responsive Storefront:**
   - Announcement Top Bar with direct WhatsApp & phone support links
   - Hero Section with high-impact visuals, value propositions, and editable CTAs
   - Dynamic Categories section with category image banners and product counters
   - Dynamic Featured Products section with tabs (Featured, Best Deals, All Items)
   - "Why Choose AIO PRODUCT" 5-pillar trust showcase (Quality, Trust, Speed, Ease, Support)
   - Editable Special Offers promotional banner
   - Brand Story section explaining the "Because Brand Matters" philosophy
   - Customer Reviews section with approved testimonials and a submission modal
   - Newsletter subscription form with instant 10% voucher reward (`WELCOME10`)
   - Complete Footer with Pakistan courier policy modals (Warranty, Shipping, Privacy, Terms)

2. **Complete Shopping Experience:**
   - Real-time live product search with preview dropdown
   - Category filtering, price slider in PKR, stock filtering, and multi-mode sorting
   - Comprehensive Product Details page with image zoom, stock warnings, quantity selector, specs, tabbed customer reviews, and related products
   - Slide-over Cart Drawer with free delivery progress bar (Free shipping over ₨ 2,500)
   - Pakistan-tailored Checkout form:
     - Full Name
     - Pakistani Mobile validation (`03XX-XXXXXXX`)
     - Complete Address
     - Quick selector for major Pakistani cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, etc.)
     - Province selector
     - Cash on Delivery (COD) nationwide
   - Instant order creation generating unique tracking IDs (`AIO-PK-XXXXXX`)
   - Order Confirmation View with delivery timeline and pre-filled WhatsApp customer support button
   - Live Order Tracking modal by Order Number or Phone Number

3. **Secure Admin Dashboard:**
   - Protected by admin authentication (Demo credentials: `admin@aioproduct.pk` / `aioadmin123`)
   - **Overview:** Total Revenue (PKR), Pending Orders, Active Products, Pending Reviews
   - **Products CRUD:** Add, edit, delete products, change prices in PKR, adjust inventory stock, set images, toggle Active or Featured
   - **Categories CRUD:** Add, edit, delete categories, upload images, update slugs
   - **Orders Management:** Real-time order monitoring, update statuses (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), view customer delivery notes
   - **Reviews Moderation:** Approve, reject, or delete visitor reviews
   - **Customer Directory:** View customer records and order histories
   - **Website Content & CMS:** Live-edit Logo/brand name, tagline, announcement bar, hero headlines, buttons, promo banners, why choose us pillars, about text, Pakistan contact info, and footer copy
   - **Supabase Configuration:** Test connection, save credentials, copy database schema, reset demo data

---

## 🗄️ Supabase Backend Connection

The website connects to **Supabase** via `@supabase/supabase-js` using standard environment variables:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-api-key"
```

### Setup Steps:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase-schema.sql` (located in the repository root) and click **Run**.
   - This creates tables: `products`, `categories`, `customers`, `orders`, `order_items`, `reviews`, `newsletter_subscribers`, and `site_settings`.
   - It also enables Row Level Security (RLS) policies and seeds initial categories and products.
4. Copy your **Project URL** and **Anon Public Key** from **Project Settings → API**.
5. Add them to your environment variables or paste them directly in the **Admin Dashboard → Supabase Config** tab!
6. *Dual-Mode Fallback:* If Supabase credentials are not provided or during offline testing, the app automatically runs seamlessly using a resilient local storage store pre-seeded with Pakistani e-commerce products and settings.
