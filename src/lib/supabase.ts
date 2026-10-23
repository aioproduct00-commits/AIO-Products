import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AdminCredentials,
  Category,
  Customer,
  NewsletterSubscriber,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  Review,
  SiteSettings,
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
} from './seedData';

// Local storage keys for caching and fallback store
const STORAGE_KEYS = {
  PRODUCTS: 'aio_products_v2',
  CATEGORIES: 'aio_categories_v2',
  ORDERS: 'aio_orders_v2',
  CUSTOMERS: 'aio_customers_v2',
  REVIEWS: 'aio_reviews_v2',
  NEWSLETTER: 'aio_newsletter_v2',
  SETTINGS: 'aio_site_settings_v2',
  ADMIN_CREDS: 'aio_admin_credentials_v2',
  CURRENT_CUSTOMER: 'aio_current_customer_v2',
  SUPABASE_URL: 'aio_supabase_url',
  SUPABASE_KEY: 'aio_supabase_key',
};

// Check for Supabase credentials from env or localStorage
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) : null) || '';
  const storedKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) : null) || '';

  const url = envUrl || storedUrl;
  const anonKey = envKey || storedKey;

  return { url, anonKey };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || !url.startsWith('https://')) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);

    supabaseInstance = null; // reset client to re-initialize
  }
}

export function isSupabaseConnected(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('https://'));
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  const targetUrl = (url || getSupabaseCredentials().url).trim();
  const targetKey = (anonKey || getSupabaseCredentials().anonKey).trim();

  if (!targetUrl || !targetKey || !targetUrl.startsWith('https://')) {
    return {
      success: false,
      message: 'Please provide a valid Supabase project URL (https://...) and Anon public API key.',
    };
  }

  try {
    const testClient = createClient(targetUrl, targetKey);
    const { data, error } = await testClient.from('products').select('id').limit(1);

    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: `Connected to Supabase, but the "products" table was not found. Please run the SQL schema script in your Supabase SQL Editor.`,
        };
      }
      return {
        success: false,
        message: `Supabase returned error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `Successfully connected to your Supabase project! Live database is ready.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err?.message || 'Network error'}`,
    };
  }
}

// -------------------------------------------------------------
// LOCAL STORAGE FALLBACK STORE INITIALIZERS
// -------------------------------------------------------------
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// Initialize seed data if empty, and ensure newly added initial products exist
export function initLocalStore(): void {
  if (typeof window === 'undefined') return;
  const currentProducts = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  if (!currentProducts || currentProducts.length === 0) {
    setLocalItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  } else {
    let updated = false;
    for (const initP of INITIAL_PRODUCTS) {
      if (!currentProducts.some(p => p.id === initP.id || p.name === initP.name)) {
        currentProducts.unshift(initP);
        updated = true;
      }
    }
    if (updated) {
      setLocalItem(STORAGE_KEYS.PRODUCTS, currentProducts);
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    setLocalItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setLocalItem(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  }
}

// Reset data to defaults
export function resetLocalStoreToDefaults(): void {
  setLocalItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  setLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  setLocalItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  setLocalItem(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  setLocalItem(STORAGE_KEYS.ORDERS, []);
  setLocalItem(STORAGE_KEYS.CUSTOMERS, []);
}

// -------------------------------------------------------------
// DATA REPOSITORY OPERATIONS
// -------------------------------------------------------------

// --- PRODUCTS ---
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
      if (error) {
        console.warn('Supabase products fetch failed, using local store:', error.message);
      }
    } catch (e) {
      console.warn('Supabase query error:', e);
    }
  }

  // Fallback to local storage
  initLocalStore();
  return getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export async function upsertProduct(product: Partial<Product> & { name: string; price: number }): Promise<Product> {
  const supabase = getSupabaseClient();
  const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const now = new Date().toISOString();

  const newProduct: Product = {
    id: product.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'prod-' + Date.now()),
    name: product.name,
    slug,
    description: product.description || '',
    price: Number(product.price),
    compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
    image_url: product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category_id: product.category_id || '',
    stock_quantity: Number(product.stock_quantity ?? 10),
    is_active: product.is_active ?? true,
    is_featured: product.is_featured ?? false,
    created_at: product.created_at || now,
    updated_at: now,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert(newProduct)
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch (e) {
      console.warn('Supabase product upsert error, falling back to local store:', e);
    }
  }

  // Local storage fallback
  const list = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const index = list.findIndex(p => p.id === newProduct.id);
  if (index >= 0) {
    list[index] = newProduct;
  } else {
    list.unshift(newProduct);
  }
  setLocalItem(STORAGE_KEYS.PRODUCTS, list);
  return newProduct;
}

export async function deleteProductById(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase product delete error:', e);
    }
  }

  const list = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const filtered = list.filter(p => p.id !== id);
  setLocalItem(STORAGE_KEYS.PRODUCTS, filtered);
  return true;
}

// --- CATEGORIES ---
export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase categories error:', e);
    }
  }

  initLocalStore();
  return getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export async function upsertCategory(category: Partial<Category> & { name: string }): Promise<Category> {
  const supabase = getSupabaseClient();
  const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newCat: Category = {
    id: category.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cat-' + Date.now()),
    name: category.name,
    slug,
    description: category.description || '',
    image_url: category.image_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    is_active: category.is_active ?? true,
    created_at: category.created_at || new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').upsert(newCat).select().single();
      if (!error && data) return data as Category;
    } catch (e) {
      console.warn('Supabase category upsert error:', e);
    }
  }

  const list = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const index = list.findIndex(c => c.id === newCat.id);
  if (index >= 0) {
    list[index] = newCat;
  } else {
    list.push(newCat);
  }
  setLocalItem(STORAGE_KEYS.CATEGORIES, list);
  return newCat;
}

export async function deleteCategoryById(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase category delete error:', e);
    }
  }

  const list = getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  setLocalItem(STORAGE_KEYS.CATEGORIES, list.filter(c => c.id !== id));
  return true;
}

// --- ORDERS & CUSTOMERS ---
export async function getOrders(): Promise<Order[]> {
  const localOrders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const remoteOrders = data.map((o: any) => ({
          ...o,
          items: o.order_items || o.items || [],
        })) as Order[];

        // Merge remote orders with local orders deduplicated by id & order_number
        const map = new Map<string, Order>();
        remoteOrders.forEach(o => map.set(o.id || o.order_number, o));
        localOrders.forEach(o => {
          const key = o.id || o.order_number;
          if (!map.has(key)) {
            map.set(key, o);
          }
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        setLocalItem(STORAGE_KEYS.ORDERS, merged);
        return merged;
      }
    } catch (e) {
      console.warn('Supabase orders fetch error:', e);
    }
  }

  return localOrders;
}

export async function createOrder(
  customerData: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postal_code?: string;
  },
  items: OrderItem[],
  totalAmount: number,
  notes?: string,
  paymentMethod: 'Cash on Delivery' | 'Online Payment' = 'Cash on Delivery'
): Promise<Order> {
  const supabase = getSupabaseClient();
  const orderNumber = 'AIO-PK-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();
  const orderId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'ord-' + Date.now();
  const customerId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cust-' + Date.now();

  let finalOrderId = orderId;

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_id: customerId,
    customer_name: customerData.name,
    customer_phone: customerData.phone,
    customer_email: customerData.email,
    total_amount: totalAmount,
    payment_method: paymentMethod,
    payment_status: 'Pending',
    order_status: 'Pending',
    shipping_address: customerData,
    notes: notes || '',
    items: items.map(item => ({
      ...item,
      order_id: orderId,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'item-' + Math.random().toString(36).substring(2, 9),
    })),
    created_at: now,
    updated_at: now,
  };

  if (supabase) {
    try {
      // 1. Upsert customer
      const { data: customerRecord } = await supabase
        .from('customers')
        .insert({
          id: customerId,
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email || null,
          address: customerData.address,
          city: customerData.city,
          province: customerData.province,
          postal_code: customerData.postal_code || null,
        })
        .select()
        .single();

      // 2. Insert order
      const { data: orderRecord, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          order_number: orderNumber,
          customer_id: customerRecord?.id || customerId,
          customer_name: customerData.name,
          customer_phone: customerData.phone,
          customer_email: customerData.email || null,
          customer_city: customerData.city,
          customer_address: customerData.address,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          payment_status: 'Pending',
          order_status: 'Pending',
          shipping_address: customerData,
          notes: notes || null,
        })
        .select()
        .single();

      if (orderRecord?.id) {
        finalOrderId = orderRecord.id;
      }

      // 3. Insert order items
      if (!orderError && orderRecord && newOrder.items) {
        await supabase.from('order_items').insert(
          newOrder.items.map(item => ({
            order_id: orderRecord.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          }))
        );
      }
    } catch (e) {
      console.warn('Supabase order creation error, saving locally:', e);
    }
  }

  const finalOrder: Order = { ...newOrder, id: finalOrderId };

  // Guaranteed save to local storage so the placed order is immediately and permanently visible in admin portal
  const orders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const existingIdx = orders.findIndex(o => o.id === finalOrder.id || o.order_number === finalOrder.order_number);
  if (existingIdx >= 0) {
    orders[existingIdx] = finalOrder;
  } else {
    orders.unshift(finalOrder);
  }
  setLocalItem(STORAGE_KEYS.ORDERS, orders);

  // Save customer
  const customers = getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  const existingCustIndex = customers.findIndex(c => c.phone === customerData.phone);
  if (existingCustIndex >= 0) {
    customers[existingCustIndex] = { ...customerData, id: customers[existingCustIndex].id, created_at: customers[existingCustIndex].created_at };
  } else {
    customers.unshift({
      id: customerId,
      ...customerData,
      created_at: now,
    });
  }
  setLocalItem(STORAGE_KEYS.CUSTOMERS, customers);

  // Deduct local stock for products
  const products = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  items.forEach(item => {
    const p = products.find(prod => prod.id === item.product_id);
    if (p) {
      p.stock_quantity = Math.max(0, p.stock_quantity - item.quantity);
    }
  });
  setLocalItem(STORAGE_KEYS.PRODUCTS, products);

  return finalOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status, updated_at: now })
        .eq('id', orderId);

      if (!error) return true;
    } catch (e) {
      console.warn('Supabase order status update error:', e);
    }
  }

  const orders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.order_status = status;
    order.updated_at = now;
    setLocalItem(STORAGE_KEYS.ORDERS, orders);
    return true;
  }
  return false;
}

export async function deleteOrderById(orderId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // First delete associated order items
      await supabase.from('order_items').delete().eq('order_id', orderId);
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase order delete error:', e);
    }
  }

  const orders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  const filtered = orders.filter(o => o.id !== orderId);
  setLocalItem(STORAGE_KEYS.ORDERS, filtered);
  return true;
}

// --- REVIEWS ---
export async function getReviews(approvedOnly = true): Promise<Review[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (approvedOnly) {
        query = query.eq('is_approved', true);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as Review[];
      }
    } catch (e) {
      console.warn('Supabase reviews error:', e);
    }
  }

  initLocalStore();
  const list = getLocalItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  return approvedOnly ? list.filter(r => r.is_approved) : list;
}

export async function submitReview(review: {
  product_id: string;
  product_name?: string;
  customer_name: string;
  rating: number;
  review_text: string;
}): Promise<Review> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();
  const newReview: Review = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'rev-' + Date.now(),
    product_id: review.product_id,
    product_name: review.product_name || 'AIO Product',
    customer_name: review.customer_name,
    rating: review.rating,
    review_text: review.review_text,
    is_approved: false, // requires admin approval
    created_at: now,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('reviews').insert(newReview).select().single();
      if (!error && data) return data as Review;
    } catch (e) {
      console.warn('Supabase review insert error:', e);
    }
  }

  const reviews = getLocalItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  reviews.unshift(newReview);
  setLocalItem(STORAGE_KEYS.REVIEWS, reviews);
  return newReview;
}

export async function setReviewApproval(reviewId: string, isApproved: boolean): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: isApproved })
        .eq('id', reviewId);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase review approval error:', e);
    }
  }

  const reviews = getLocalItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const r = reviews.find(rev => rev.id === reviewId);
  if (r) {
    r.is_approved = isApproved;
    setLocalItem(STORAGE_KEYS.REVIEWS, reviews);
    return true;
  }
  return false;
}

export async function deleteReviewById(reviewId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase review delete error:', e);
    }
  }

  const reviews = getLocalItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  setLocalItem(STORAGE_KEYS.REVIEWS, reviews.filter(r => r.id !== reviewId));
  return true;
}

// --- NEWSLETTER ---
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: cleanEmail,
        created_at: now,
      });

      if (!error) {
        return { success: true, message: 'Thank you for subscribing! Use code WELCOME10 for 10% off your first order.' };
      }
      if (error.code === '23505') {
        return { success: true, message: 'You are already subscribed to our newsletter! Thank you for being with us.' };
      }
    } catch (e) {
      console.warn('Supabase newsletter subscribe error:', e);
    }
  }

  // Local storage
  const subs = getLocalItem<NewsletterSubscriber[]>(STORAGE_KEYS.NEWSLETTER, []);
  if (!subs.some(s => s.email === cleanEmail)) {
    subs.push({
      id: 'sub-' + Date.now(),
      email: cleanEmail,
      created_at: now,
    });
    setLocalItem(STORAGE_KEYS.NEWSLETTER, subs);
  }
  return { success: true, message: 'Thank you for subscribing! Use code WELCOME10 for 10% off your first order.' };
}

// --- CUSTOMERS ---
export async function getCustomers(): Promise<Customer[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Customer[];
      }
    } catch (e) {
      console.warn('Supabase customers error:', e);
    }
  }

  return getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, [
    {
      id: 'cust-seed-1',
      name: 'Hamza Tariq',
      email: 'hamza.tariq@gmail.com',
      phone: '03001234567',
      address: 'House 42, Block B, Model Town',
      city: 'Lahore',
      province: 'Punjab',
      postal_code: '54700',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      auth_provider: 'google',
      status: 'active',
      notes: 'VIP customer. Registered via Gmail account.',
      created_at: '2026-09-18T10:00:00Z',
    },
    {
      id: 'cust-seed-2',
      name: 'Ayesha Khan',
      email: 'ayesha.khan@gmail.com',
      phone: '03219876543',
      address: 'Flat 4B, Ocean View Towers, Clifton Block 4',
      city: 'Karachi',
      province: 'Sindh',
      postal_code: '75600',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      auth_provider: 'google',
      status: 'active',
      notes: 'Frequent buyer. Registered via Gmail.',
      created_at: '2026-09-22T14:00:00Z',
    },
    {
      id: 'cust-seed-3',
      name: 'Usman Ali',
      email: 'usman.ali@gmail.com',
      phone: '03335558899',
      address: 'House 15, Street 9, F-7/2',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      postal_code: '44000',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      auth_provider: 'google',
      status: 'active',
      notes: 'Verified COD buyer from Islamabad.',
      created_at: '2026-09-25T09:00:00Z',
    },
  ]);
}

export async function upsertCustomer(customer: Partial<Customer> & { name: string }): Promise<Customer> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();
  const custId = customer.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cust-' + Date.now());

  const newCust: Customer = {
    id: custId,
    name: customer.name,
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
    city: customer.city || 'Lahore',
    province: customer.province || 'Punjab',
    postal_code: customer.postal_code || '',
    avatar_url: customer.avatar_url || '',
    auth_provider: customer.auth_provider || 'google',
    status: customer.status || 'active',
    notes: customer.notes || '',
    created_at: customer.created_at || now,
    updated_at: now,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('customers').upsert(newCust).select().single();
      if (!error && data) return data as Customer;
    } catch (e) {
      console.warn('Supabase customer upsert error, falling back to local store:', e);
    }
  }

  const customers = getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  const idx = customers.findIndex(c => c.id === custId || (customer.email && c.email?.toLowerCase() === customer.email.toLowerCase()));
  if (idx >= 0) {
    customers[idx] = { ...customers[idx], ...newCust };
  } else {
    customers.unshift(newCust);
  }
  setLocalItem(STORAGE_KEYS.CUSTOMERS, customers);
  return newCust;
}

export async function deleteCustomerById(customerId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', customerId);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase customer delete error:', e);
    }
  }

  const customers = getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  setLocalItem(STORAGE_KEYS.CUSTOMERS, customers.filter(c => c.id !== customerId));
  return true;
}

// --- GOOGLE / GMAIL CUSTOMER AUTH ---
export async function loginOrRegisterCustomerWithGoogle(googleProfile: {
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
}): Promise<Customer> {
  const customers = await getCustomers();
  const existing = customers.find(c => c.email?.toLowerCase() === googleProfile.email.toLowerCase());

  if (existing) {
    const updated = await upsertCustomer({
      ...existing,
      avatar_url: googleProfile.avatar_url || existing.avatar_url,
      auth_provider: 'google',
    });
    saveCurrentCustomer(updated);
    return updated;
  }

  const avatar = googleProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(googleProfile.name)}&background=ff6b00&color=fff`;

  const newCust = await upsertCustomer({
    name: googleProfile.name,
    email: googleProfile.email,
    phone: googleProfile.phone || '',
    avatar_url: avatar,
    auth_provider: 'google',
    status: 'active',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    notes: 'Signed up with Gmail account.',
  });

  saveCurrentCustomer(newCust);
  return newCust;
}

export function getCurrentCustomer(): Customer | null {
  return getLocalItem<Customer | null>(STORAGE_KEYS.CURRENT_CUSTOMER, null);
}

export function saveCurrentCustomer(customer: Customer | null): void {
  if (customer) {
    setLocalItem(STORAGE_KEYS.CURRENT_CUSTOMER, customer);
  } else {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CUSTOMER);
    }
  }
}

// --- ADMIN CREDENTIALS & SECURITY ---
export function getAdminCredentials(): AdminCredentials {
  const stored = getLocalItem<AdminCredentials | null>(STORAGE_KEYS.ADMIN_CREDS, null);
  return stored || {
    email: 'admin@aioproduct.pk',
    password: 'aioadmin123',
    updated_at: new Date().toISOString(),
  };
}

export function saveAdminCredentials(creds: AdminCredentials): void {
  setLocalItem(STORAGE_KEYS.ADMIN_CREDS, {
    ...creds,
    updated_at: new Date().toISOString(),
  });
}

// --- SITE SETTINGS (CMS) ---
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'main_config')
        .single();

      if (!error && data && data.value) {
        return { ...DEFAULT_SITE_SETTINGS, ...data.value };
      }
    } catch (e) {
      console.warn('Supabase site settings error:', e);
    }
  }

  initLocalStore();
  const stored = getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  return { ...DEFAULT_SITE_SETTINGS, ...stored };
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const { error } = await supabase.from('site_settings').upsert({
        key: 'main_config',
        value: settings,
        updated_at: now,
      });

      if (!error) {
        setLocalItem(STORAGE_KEYS.SETTINGS, settings);
        return true;
      }
    } catch (e) {
      console.warn('Supabase site settings save error:', e);
    }
  }

  setLocalItem(STORAGE_KEYS.SETTINGS, settings);
  return true;
}

// --- SUPABASE STORAGE (PRODUCT IMAGES & BANNERS) ---
export const STORAGE_BUCKET_NAME = 'aio-media';

/**
 * Uploads an image file or base64 data string to Supabase Storage bucket 'aio-media'.
 * Returns the public CDN URL of the uploaded image if successful.
 * If Supabase is not connected or bucket is not accessible, falls back gracefully.
 */
export async function uploadImageToSupabaseStorage(
  fileOrBase64: File | string,
  folder: 'products' | 'banners' | 'categories' = 'products'
): Promise<{ url: string; success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (typeof fileOrBase64 === 'string') {
      return { url: fileOrBase64, success: true };
    }
    return { url: '', success: false, error: 'Supabase client not connected.' };
  }

  try {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);

    let blob: Blob;
    let contentType = 'image/jpeg';
    let fileExt = 'jpg';

    if (typeof fileOrBase64 === 'string') {
      if (fileOrBase64.startsWith('data:')) {
        const matches = fileOrBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return { url: fileOrBase64, success: true };
        }
        contentType = matches[1];
        if (contentType.includes('png')) fileExt = 'png';
        else if (contentType.includes('webp')) fileExt = 'webp';

        const byteCharacters = atob(matches[2]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: contentType });
      } else {
        // Already a remote URL (Unsplash, imgpile, etc.)
        return { url: fileOrBase64, success: true };
      }
    } else {
      blob = fileOrBase64;
      contentType = fileOrBase64.type || 'image/jpeg';
      if (contentType.includes('png')) fileExt = 'png';
      else if (contentType.includes('webp')) fileExt = 'webp';
    }

    const filePath = `${folder}/${timestamp}-${randomStr}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(filePath, blob, {
        contentType,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return {
        url: typeof fileOrBase64 === 'string' ? fileOrBase64 : '',
        success: false,
        error: error.message,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(data.path);

    if (publicUrlData?.publicUrl) {
      return { url: publicUrlData.publicUrl, success: true };
    }

    return {
      url: typeof fileOrBase64 === 'string' ? fileOrBase64 : '',
      success: true,
    };
  } catch (err: any) {
    console.warn('Storage upload error:', err);
    return {
      url: typeof fileOrBase64 === 'string' ? fileOrBase64 : '',
      success: false,
      error: err?.message || 'Storage upload failed',
    };
  }
}
