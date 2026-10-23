export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in PKR
  compare_at_price?: number; // in PKR
  image_url: string;
  category_id: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  avatar_url?: string;
  auth_provider?: 'google' | 'email' | 'guest';
  status?: 'active' | 'suspended';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
  updated_at?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type PaymentMethod = 'Cash on Delivery' | 'Online Payment';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  total_amount: number; // in PKR
  subtotal_amount?: number;
  shipping_fee?: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  shipping_address: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postal_code?: string;
  };
  notes?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  product_name?: string;
  customer_name: string;
  rating: number; // 1 to 5
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconName: 'ShieldCheck' | 'Truck' | 'Award' | 'Clock' | 'Headphones' | 'HeartHandshake';
}

export interface NavItem {
  id: string;
  label: string;
  view: string;
  isVisible: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    supportPhone: string;
    whatsappNumber: string;
  };
  navigation: NavItem[];
  hero: {
    badge: string;
    headline: string;
    supportingText: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    imageUrl: string;
  };
  whyChooseUs: {
    heading: string;
    subheading: string;
    items: WhyChooseItem[];
  };
  specialOffer: {
    enabled: boolean;
    badge: string;
    heading: string;
    description: string;
    discountText: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
    endsAt: string;
  };
  about: {
    heading: string;
    tagline: string;
    description: string;
    storyParagraph1: string;
    storyParagraph2: string;
    values: { title: string; desc: string }[];
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
  };
  social: {
    facebook: string;
    instagram: string;
    whatsapp: string;
    tiktok: string;
    youtube: string;
  };
  footer: {
    description: string;
    copyrightText: string;
  };
  storePolicy: {
    freeShippingThreshold: number; // PKR
    standardShippingFee: number; // PKR
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
