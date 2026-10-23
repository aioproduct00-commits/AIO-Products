import { Category, Order, Product, Review, SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'AIO PRODUCT.',
  tagline: 'Because Brand Matters.',
  announcementBar: {
    enabled: true,
    text: 'Nationwide Delivery Across Pakistan',
    supportPhone: '+92 347 5429514',
    whatsappNumber: '+92 347 5429514',
  },
  navigation: [
    { id: '1', label: 'Home', view: 'home', isVisible: true },
    { id: '2', label: 'Shop', view: 'shop', isVisible: true },
    { id: '3', label: 'Categories', view: 'categories', isVisible: true },
    { id: '4', label: 'About', view: 'about', isVisible: true },
    { id: '5', label: 'Contact', view: 'contact', isVisible: true },
  ],
  hero: {
    badge: 'AIO PRODUCT',
    headline: 'Because Brand Matters.',
    supportingText:
      'Discover quality products, shop with confidence, and enjoy a simple online shopping experience with AIO PRODUCT.',
    primaryButtonText: 'Shop Now',
    primaryButtonLink: 'shop',
    secondaryButtonText: 'Explore Categories',
    secondaryButtonLink: 'categories',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
  },
  whyChooseUs: {
    heading: 'Why Choose AIO PRODUCT',
    subheading: 'Built on trust, speed, and uncompromised standard for shoppers across Pakistan.',
    items: [
      {
        id: '1',
        title: 'Cash on Delivery',
        description: 'All Pakistan cities',
        iconName: 'Truck',
      },
      {
        id: '2',
        title: 'Quality Checked',
        description: '7-day replacement',
        iconName: 'ShieldCheck',
      },
      {
        id: '3',
        title: 'Fast Delivery',
        description: 'To your doorstep',
        iconName: 'Award',
      },
      {
        id: '4',
        title: '24/7 Support',
        description: 'WhatsApp & Email',
        iconName: 'Headphones',
      },
    ],
  },
  specialOffer: {
    enabled: true,
    badge: 'Special Offer',
    heading: 'UP TO 50% OFF',
    description: 'On selected products, Limited time only!',
    discountText: 'UP TO 50% OFF',
    buttonText: 'Shop Now',
    buttonLink: 'shop',
    imageUrl:
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80',
    endsAt: '2026-10-31',
  },
  about: {
    heading: 'Because Brand Matters.',
    tagline: 'Because Brand Matters.',
    description:
      'AIO PRODUCT is a modern online shopping brand focused on bringing useful, quality, and carefully selected products to customers in Pakistan. We aim to provide a simple, trustworthy, convenient, and enjoyable shopping experience.',
    storyParagraph1:
      'We aim to provide a simple, trustworthy, convenient, and enjoyable online shopping experience. In an online market filled with unreliable replicas and broken promises, AIO PRODUCT stands for authenticity.',
    storyParagraph2:
      'Because Brand Matters — every product, order, and customer experience should reflect quality and trust.',
    values: [
      { title: 'Quality Products', desc: 'Carefully selected essentials.' },
      { title: 'Trusted Shopping', desc: 'Secure cash on delivery.' },
      { title: 'Convenience For You', desc: 'Fast, reliable dispatch.' },
      { title: 'Customer Satisfaction', desc: 'Dedicated friendly assistance.' },
    ],
  },
  contact: {
    phone: '+92 347 5429514',
    whatsapp: '+92 347 5429514',
    email: 'info@aioproduct.pk',
    address: 'Lahore, Pakistan',
    hours: 'Monday – Saturday: 9:00 AM – 9:00 PM PKT',
  },
  social: {
    facebook: 'https://facebook.com/aioproduct.pk',
    instagram: 'https://instagram.com/aioproduct.pk',
    whatsapp: 'https://wa.me/923475429514',
    tiktok: 'https://tiktok.com/@aioproduct.pk',
    youtube: 'https://youtube.com/@aioproduct',
  },
  footer: {
    description:
      'AIO PRODUCT is Pakistan’s trusted online shopping destination for premium selected lifestyle and daily essentials. Because Brand Matters.',
    copyrightText: '© 2025 AIO PRODUCT. All rights reserved.',
  },
  storePolicy: {
    freeShippingThreshold: 2500,
    standardShippingFee: 250,
  },
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Style for every you',
    image_url:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest tech & gadgets',
    image_url:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
  {
    id: 'cat-home',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Comfort for your home',
    image_url:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    description: 'Look good, feel great',
    image_url:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Small things, big style',
    image_url:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
  {
    id: 'cat-sports',
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Stay active, stay healthy',
    image_url:
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    is_active: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-islamic-calligraphy-1',
    name: 'Ma Sha Allah Tabarak Allah – Premium Islamic Calligraphy Wall Art',
    slug: 'ma-sha-allah-tabarak-allah-premium-islamic-calligraphy-wall-art',
    description:
      'Bring elegance, faith, and blessings into your space with this beautiful Islamic calligraphy wall art featuring “Ma Sha Allah Tabarak Allah.” The elegant Arabic calligraphy and floral detailing create a timeless premium look, making it perfect for living rooms, bedrooms, offices, prayer spaces, and Islamic home décor.\n\n• Premium Islamic wall décor\n• Elegant Arabic calligraphy\n• Beautiful floral detailing\n• Suitable for home, office, and prayer spaces\n• Meaningful gift for family and loved ones\n• Premium traditional aesthetic',
    price: 3499,
    compare_at_price: 4999,
    image_url: 'https://cdn.imgpile.com/f/JMYwJYO_xl.webp',
    category_id: 'cat-home',
    stock_quantity: 35,
    is_active: true,
    is_featured: true,
  },
  {
    id: 'prod-1',
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description: 'High quality sound • Long battery life with active noise isolation and ergonomic fit.',
    price: 7499,
    compare_at_price: 9999,
    image_url:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-electronics',
    stock_quantity: 24,
    is_active: true,
    is_featured: true,
  },
  {
    id: 'prod-2',
    name: 'Smart Watch Series 8',
    slug: 'smart-watch-series-8',
    description: 'Health tracking • Touch display with heart rate monitoring, fitness sensors, and HD screen.',
    price: 14999,
    compare_at_price: 16999,
    image_url:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-electronics',
    stock_quantity: 18,
    is_active: true,
    is_featured: true,
  },
  {
    id: 'prod-3',
    name: 'Sports Running Shoes',
    slug: 'sports-running-shoes',
    description: 'Lightweight • Comfortable high-rebound cushioning athletic sneakers for all day wear.',
    price: 3999,
    compare_at_price: 4999,
    image_url:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-sports',
    stock_quantity: 15,
    is_active: true,
    is_featured: true,
  },
  {
    id: 'prod-4',
    name: 'Laptop Backpack',
    slug: 'laptop-backpack',
    description: 'Waterproof • Spacious compartments with cushioned laptop sleeve and anti-theft zipper.',
    price: 4999,
    compare_at_price: 5899,
    image_url:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-accessories',
    stock_quantity: 30,
    is_active: true,
    is_featured: true,
  },
  {
    id: 'prod-5',
    name: 'Urban Casual Hoodie',
    slug: 'urban-casual-hoodie',
    description: 'Premium heavyweight cotton fleece, relaxed unisex modern streetwear fit.',
    price: 3499,
    compare_at_price: 4500,
    image_url:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-fashion',
    stock_quantity: 20,
    is_active: true,
    is_featured: false,
  },
  {
    id: 'prod-6',
    name: 'Organic Facial Skincare Serum Set',
    slug: 'organic-skincare-serum-set',
    description: 'Gentle hydrating vitamin C and hyaluronic moisture glow drops for radiant skin.',
    price: 2850,
    compare_at_price: 3800,
    image_url:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    category_id: 'cat-beauty',
    stock_quantity: 12,
    is_active: true,
    is_featured: false,
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    product_name: 'Wireless Earbuds Pro',
    customer_name: 'Ahmed Raza',
    rating: 5,
    review_text: 'Amazing quality and very fast delivery. Highly recommended!',
    is_approved: true,
    created_at: '2025-04-12T10:30:00Z',
  },
  {
    id: 'rev-2',
    product_id: 'prod-2',
    product_name: 'Smart Watch Series 8',
    customer_name: 'Ayesha Khan',
    rating: 5,
    review_text: 'Original products and great customer service. Will shop again!',
    is_approved: true,
    created_at: '2025-04-08T14:15:00Z',
  },
  {
    id: 'rev-3',
    product_id: 'prod-4',
    product_name: 'Laptop Backpack',
    customer_name: 'Usman Ali',
    rating: 5,
    review_text: 'Best online shopping experience in Pakistan. Keep it up!',
    is_approved: true,
    created_at: '2025-04-02T09:00:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-seed-1',
    order_number: 'AIO-PK-849201',
    customer_id: 'cust-1',
    customer_name: 'Muhammad Usman',
    customer_phone: '03001234567',
    customer_email: 'usman.pk@gmail.com',
    total_amount: 3499,
    payment_method: 'Cash on Delivery',
    payment_status: 'Pending',
    order_status: 'Confirmed',
    shipping_address: {
      name: 'Muhammad Usman',
      phone: '03001234567',
      email: 'usman.pk@gmail.com',
      address: 'House #42, Block 6, Gulshan-e-Iqbal',
      city: 'Karachi',
      province: 'Sindh',
      postal_code: '75300',
    },
    items: [
      {
        id: 'item-1',
        order_id: 'ord-seed-1',
        product_id: 'prod-1',
        product_name: 'Premium Wireless Headphones',
        quantity: 1,
        price: 3499,
        subtotal: 3499,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ord-seed-2',
    order_number: 'AIO-PK-639148',
    customer_id: 'cust-2',
    customer_name: 'Fatima Zahra',
    customer_phone: '03219876543',
    customer_email: 'fatima.zahra@gmail.com',
    total_amount: 4999,
    payment_method: 'Cash on Delivery',
    payment_status: 'Pending',
    order_status: 'Processing',
    shipping_address: {
      name: 'Fatima Zahra',
      phone: '03219876543',
      email: 'fatima.zahra@gmail.com',
      address: 'Plot 15-B, Sector F-7/2',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      postal_code: '44000',
    },
    items: [
      {
        id: 'item-2',
        order_id: 'ord-seed-2',
        product_id: 'prod-2',
        product_name: 'Smart Watch Series 8',
        quantity: 1,
        price: 4999,
        subtotal: 4999,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];
