import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  deleteCategoryById,
  deleteCustomerById,
  deleteMediaItemById,
  deleteOrderById,
  deleteProductById,
  deleteReviewById,
  getAdminCredentials,
  getCategories,
  getCurrentCustomer,
  getCustomers,
  getMediaItems,
  getOrders,
  getProducts,
  getReviews,
  getSiteSettings,
  incrementMediaDownloadCount,
  isSupabaseConnected,
  loginOrRegisterCustomerWithGoogle,
  saveAdminCredentials,
  saveCurrentCustomer,
  saveSiteSettings,
  setReviewApproval,
  submitReview,
  updateOrderStatus,
  upsertCategory,
  upsertCustomer,
  upsertMediaItem,
  upsertProduct,
} from '../lib/supabase';
import {
  AdminCredentials,
  CartItem,
  Category,
  Customer,
  MediaItem,
  Order,
  OrderStatus,
  Product,
  Review,
  SiteSettings,
} from '../types';
import { DEFAULT_SITE_SETTINGS } from '../lib/seedData';

type ViewType =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-details'
  | 'about'
  | 'contact'
  | 'media'
  | 'checkout'
  | 'order-confirmation'
  | 'track-order'
  | 'admin';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type LiveEditType =
  | 'hero'
  | 'announcement'
  | 'category'
  | 'special_offer'
  | 'about'
  | 'contact'
  | 'why_choose'
  | 'review'
  | null;

interface StoreContextType {
  // Navigation & Views
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  viewProductDetails: (prod: Product) => void;
  goBack: () => void;
  canGoBack: boolean;
  viewHistory: ViewType[];
  
  // Data
  products: Product[];
  categories: Category[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addPlacedOrder: (order: Order) => void;
  reviews: Review[];
  customers: Customer[];
  mediaItems: MediaItem[];
  siteSettings: SiteSettings;
  isLoading: boolean;
  isSupabaseLive: boolean;
  refreshAllData: () => Promise<void>;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  selectedSort: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  setSelectedSort: (sort: 'featured' | 'price-asc' | 'price-desc' | 'newest') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  maxPriceFilter: number;
  setMaxPriceFilter: (val: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
  cartItemCount: number;

  // Checkout & Orders
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;

  // Customer Auth (Gmail / Google)
  currentCustomer: Customer | null;
  isCustomerAuthModalOpen: boolean;
  setIsCustomerAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: (profile?: { name: string; email: string; avatar_url?: string; phone?: string }) => Promise<Customer>;
  logoutCustomer: () => void;
  saveCustomerProfile: (customer: Partial<Customer>) => Promise<Customer>;

  // Admin Auth & Security
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  adminCredentials: AdminCredentials;
  changeAdminPassword: (currentPass: string, newPass: string) => { success: boolean; message: string };

  // Front Page Live Product Editing
  isFrontPageEditMode: boolean;
  setIsFrontPageEditMode: (val: boolean) => void;
  frontPageEditProduct: Product | null;
  setFrontPageEditProduct: (p: Product | null) => void;
  isFrontPageProductModalOpen: boolean;
  setIsFrontPageProductModalOpen: (val: boolean) => void;
  openFrontPageProductEdit: (p?: Product) => void;

  // Live Site Content Editing (Every item editable in admin mode)
  liveEditType: LiveEditType;
  setLiveEditType: (type: LiveEditType) => void;
  liveEditData: any;
  setLiveEditData: (data: any) => void;
  openLiveEdit: (type: LiveEditType, data?: any) => void;
  closeLiveEdit: () => void;

  // Product Sharing
  sharingProduct: Product | null;
  setSharingProduct: (p: Product | null) => void;
  shareProduct: (p: Product) => void;

  // Special Love & Sorry Modal
  isLoveSorryModalOpen: boolean;
  setIsLoveSorryModalOpen: (open: boolean) => void;
  openLoveSorryModal: () => void;

  // Media Library
  saveMedia: (item: Partial<MediaItem> & { title: string; file_url: string }) => Promise<MediaItem>;
  deleteMedia: (id: string) => Promise<boolean>;
  downloadMediaFile: (item: MediaItem) => Promise<void>;
  isUploadMediaModalOpen: boolean;
  setIsUploadMediaModalOpen: (open: boolean) => void;
  openUploadMediaModal: () => void;

  // Toast notifications
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Mutations
  saveProduct: (prod: Partial<Product> & { name: string; price: number }) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  saveCategory: (cat: Partial<Category> & { name: string }) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateOrder: (orderId: string, status: OrderStatus) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  saveCustomerAdmin: (customer: Partial<Customer> & { name: string }) => Promise<Customer>;
  deleteCustomerAdmin: (customerId: string) => Promise<boolean>;
  writeReview: (rev: { product_id: string; product_name?: string; customer_name: string; rating: number; review_text: string }) => Promise<Review>;
  toggleReviewApproval: (reviewId: string, isApproved: boolean) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  updateSiteContent: (settings: SiteSettings) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewState] = useState<ViewType>('home');
  const [viewHistory, setViewHistory] = useState<ViewType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const setCurrentView = (view: ViewType) => {
    if (view === currentView) return;
    setViewHistory(prev => [...prev, currentView]);
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({ view }, '', window.location.href);
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const prevView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setCurrentViewState(prevView || 'home');
    } else {
      setCurrentViewState('home');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = currentView !== 'home' || viewHistory.length > 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        setCurrentViewState(e.state.view);
      } else if (viewHistory.length > 0) {
        const prev = viewHistory[viewHistory.length - 1];
        setViewHistory(h => h.slice(0, -1));
        setCurrentViewState(prev || 'home');
      } else {
        setCurrentViewState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewHistory]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState<boolean>(false);
  const openUploadMediaModal = () => setIsUploadMediaModalOpen(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(100000);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aio_cart_v1');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Customer Auth (Gmail / Google)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    return getCurrentCustomer();
  });
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState<boolean>(false);

  // Admin Credentials & Auth
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    return getAdminCredentials();
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aio_admin_auth') === 'true';
    }
    return false;
  });

  // Front Page Live Product Editing
  const [isFrontPageEditMode, setIsFrontPageEditModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aio_front_page_edit') === 'true';
    }
    return false;
  });
  const [frontPageEditProduct, setFrontPageEditProduct] = useState<Product | null>(null);
  const [isFrontPageProductModalOpen, setIsFrontPageProductModalOpen] = useState<boolean>(false);

  const setIsFrontPageEditMode = (val: boolean) => {
    setIsFrontPageEditModeState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aio_front_page_edit', val ? 'true' : 'false');
    }
  };

  const openFrontPageProductEdit = (p?: Product) => {
    if (p) {
      setFrontPageEditProduct({ ...p });
    } else {
      setFrontPageEditProduct({
        id: '',
        name: '',
        slug: '',
        description: '',
        price: 3999,
        compare_at_price: 4999,
        category_id: categories[0]?.id || 'cat-electronics',
        stock_quantity: 20,
        is_active: true,
        is_featured: true, // Default to true so it immediately shows on front page
        image_url:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      });
    }
    setIsFrontPageProductModalOpen(true);
  };

  // Live Site Content Editing (Every item editable in admin mode)
  const [liveEditType, setLiveEditType] = useState<LiveEditType>(null);
  const [liveEditData, setLiveEditData] = useState<any>(null);

  const openLiveEdit = (type: LiveEditType, data?: any) => {
    setLiveEditType(type);
    setLiveEditData(data || null);
  };

  const closeLiveEdit = () => {
    setLiveEditType(null);
    setLiveEditData(null);
  };

  // Product Sharing
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const shareProduct = (product: Product) => {
    setSharingProduct(product);
  };

  // Love & Sorry Modal
  const [isLoveSorryModalOpen, setIsLoveSorryModalOpen] = useState<boolean>(false);
  const openLoveSorryModal = () => setIsLoveSorryModalOpen(true);

  // Toast
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  // Persist cart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aio_cart_v1', JSON.stringify(cart));
    }
  }, [cart]);

  // Persist admin session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isAdminLoggedIn) localStorage.setItem('aio_admin_auth', 'true');
      else localStorage.removeItem('aio_admin_auth');
    }
  }, [isAdminLoggedIn]);

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      setIsSupabaseLive(isSupabaseConnected());
      const [prods, cats, ords, revs, custs, sets, medias] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
        getReviews(false),
        getCustomers(),
        getSiteSettings(),
        getMediaItems(),
      ]);

      setProducts(prods);

      // Deep link detection: Auto-open product if shared via URL: ?product=... or ?p=...
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const prodParam = urlParams.get('product') || urlParams.get('p');
        if (prodParam) {
          const matched = prods.find(p => p.id === prodParam || p.slug === prodParam);
          if (matched) {
            setSelectedProduct(matched);
            setCurrentView('product-details');
          }
        }
      }

      setCategories(cats);
      setOrders(ords);
      setReviews(revs);
      setCustomers(custs);
      setSiteSettings(sets);
      setMediaItems(medias);
      setAdminCredentials(getAdminCredentials());
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshAllData = async () => {
    await loadData();
  };

  const addPlacedOrder = (order: Order) => {
    setOrders(prev => [order, ...prev.filter(o => o.id !== order.id && o.order_number !== order.order_number)]);
  };

  // Customer Gmail Auth
  const loginWithGoogle = async (profile?: { name: string; email: string; avatar_url?: string; phone?: string }) => {
    const dummyGoogleProfile = profile || {
      name: 'Usman Ali',
      email: 'aio.product.00@gmail.com',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      phone: '03001234567',
    };

    const customer = await loginOrRegisterCustomerWithGoogle(dummyGoogleProfile);
    setCurrentCustomer(customer);
    await refreshAllData();
    showToast(`Welcome back, ${customer.name}! Signed in with Google.`, 'success');
    return customer;
  };

  const logoutCustomer = () => {
    saveCurrentCustomer(null);
    setCurrentCustomer(null);
    showToast('Signed out of customer account.', 'info');
  };

  const saveCustomerProfile = async (updates: Partial<Customer>) => {
    if (!currentCustomer) throw new Error('Not logged in');
    const updated = await upsertCustomer({
      ...currentCustomer,
      ...updates,
      name: updates.name || currentCustomer.name,
    });
    setCurrentCustomer(updated);
    saveCurrentCustomer(updated);
    await refreshAllData();
    showToast('Your profile details have been updated.', 'success');
    return updated;
  };

  // Admin Password Management
  const changeAdminPassword = (currentPass: string, newPass: string): { success: boolean; message: string } => {
    const creds = getAdminCredentials();
    if (creds.password !== currentPass) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    const updated = {
      ...creds,
      password: newPass,
      updated_at: new Date().toISOString(),
    };
    saveAdminCredentials(updated);
    setAdminCredentials(updated);
    showToast('Admin password changed successfully!', 'success');
    return { success: true, message: 'Password updated successfully!' };
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock_quantity <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock_quantity, existing.quantity + quantity);
        showToast(`Updated quantity for "${product.name}" in cart.`, 'success');
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      showToast(`Added "${product.name}" to cart!`, 'success');
      return [...prev, { product, quantity: Math.min(product.stock_quantity, quantity) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock_quantity;
          const capped = Math.min(maxStock, quantity);
          if (quantity > maxStock) {
            showToast(`Only ${maxStock} units available in stock.`, 'info');
          }
          return { ...item, quantity: capped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const viewProductDetails = (prod: Product) => {
    setSelectedProduct(prod);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeThreshold = siteSettings.storePolicy?.freeShippingThreshold ?? 2500;
  const standardFee = siteSettings.storePolicy?.standardShippingFee ?? 250;
  const shippingFee = cartSubtotal >= freeThreshold || cart.length === 0 ? 0 : standardFee;
  const cartTotal = cartSubtotal + shippingFee;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Mutations
  const saveProduct = async (prod: Partial<Product> & { name: string; price: number }) => {
    const saved = await upsertProduct(prod);
    await refreshAllData();
    showToast(`Product "${saved.name}" saved successfully.`, 'success');
    return saved;
  };

  const deleteProduct = async (id: string) => {
    const ok = await deleteProductById(id);
    if (ok) {
      await refreshAllData();
      showToast('Product deleted.', 'info');
    }
    return ok;
  };

  const saveCategory = async (cat: Partial<Category> & { name: string }) => {
    const saved = await upsertCategory(cat);
    await refreshAllData();
    showToast(`Category "${saved.name}" saved.`, 'success');
    return saved;
  };

  const deleteCategory = async (id: string) => {
    const ok = await deleteCategoryById(id);
    if (ok) {
      await refreshAllData();
      showToast('Category deleted.', 'info');
    }
    return ok;
  };

  const updateOrder = async (orderId: string, status: OrderStatus) => {
    const ok = await updateOrderStatus(orderId, status);
    if (ok) {
      await refreshAllData();
      showToast(`Order status updated to ${status}.`, 'success');
    }
    return ok;
  };

  const deleteOrder = async (orderId: string) => {
    const ok = await deleteOrderById(orderId);
    if (ok) {
      await refreshAllData();
      showToast('Order deleted successfully.', 'info');
    }
    return ok;
  };

  const saveCustomerAdmin = async (customer: Partial<Customer> & { name: string }) => {
    const saved = await upsertCustomer(customer);
    await refreshAllData();
    showToast(`Customer "${saved.name}" updated successfully.`, 'success');
    return saved;
  };

  const deleteCustomerAdmin = async (customerId: string) => {
    const ok = await deleteCustomerById(customerId);
    if (ok) {
      await refreshAllData();
      showToast('Customer record removed.', 'info');
    }
    return ok;
  };

  const writeReview = async (rev: {
    product_id: string;
    product_name?: string;
    customer_name: string;
    rating: number;
    review_text: string;
  }) => {
    const res = await submitReview(rev);
    await refreshAllData();
    showToast('Thank you! Your review has been submitted for approval.', 'success');
    return res;
  };

  const toggleReviewApproval = async (reviewId: string, isApproved: boolean) => {
    const ok = await setReviewApproval(reviewId, isApproved);
    if (ok) {
      await refreshAllData();
      showToast(`Review ${isApproved ? 'approved' : 'unapproved'}.`, 'success');
    }
    return ok;
  };

  const deleteReview = async (reviewId: string) => {
    const ok = await deleteReviewById(reviewId);
    if (ok) {
      await refreshAllData();
      showToast('Review removed.', 'info');
    }
    return ok;
  };

  const updateSiteContent = async (settings: SiteSettings) => {
    const ok = await saveSiteSettings(settings);
    if (ok) {
      setSiteSettings(settings);
      showToast('Website content updated successfully!', 'success');
    }
    return ok;
  };

  const saveMedia = async (item: Partial<MediaItem> & { title: string; file_url: string }) => {
    const saved = await upsertMediaItem(item);
    setMediaItems(prev => {
      const idx = prev.findIndex(m => m.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    showToast(`Media "${saved.title}" saved successfully!`, 'success');
    return saved;
  };

  const deleteMedia = async (id: string) => {
    const ok = await deleteMediaItemById(id);
    if (ok) {
      setMediaItems(prev => prev.filter(m => m.id !== id));
      showToast('Media file deleted.', 'info');
    }
    return ok;
  };

  const downloadMediaFile = async (item: MediaItem) => {
    try {
      incrementMediaDownloadCount(item.id);
      setMediaItems(prev =>
        prev.map(m => (m.id === item.id ? { ...m, download_count: (m.download_count || 0) + 1 } : m))
      );

      // Trigger file download
      if (item.file_url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = item.file_url;
        a.download = item.file_name || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(`Downloading ${item.title}...`, 'success');
        return;
      }

      try {
        const res = await fetch(item.file_url, { mode: 'cors' });
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = item.file_name || 'download';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          showToast(`Downloaded ${item.title}`, 'success');
          return;
        }
      } catch {
        // Direct anchor fallback
      }

      const a = document.createElement('a');
      a.href = item.file_url;
      a.download = item.file_name || 'download';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloading ${item.title}...`, 'info');
    } catch {
      showToast('Download initiated', 'info');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        viewProductDetails,
        goBack,
        canGoBack,
        viewHistory,
        products,
        categories,
        orders,
        setOrders,
        addPlacedOrder,
        reviews,
        customers,
        mediaItems,
        siteSettings,
        isLoading,
        isSupabaseLive,
        refreshAllData,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSort,
        setSelectedSort,
        inStockOnly,
        setInStockOnly,
        maxPriceFilter,
        setMaxPriceFilter,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotal,
        shippingFee,
        cartTotal,
        cartItemCount,
        lastCreatedOrder,
        setLastCreatedOrder,
        currentCustomer,
        isCustomerAuthModalOpen,
        setIsCustomerAuthModalOpen,
        loginWithGoogle,
        logoutCustomer,
        saveCustomerProfile,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminCredentials,
        changeAdminPassword,
        isFrontPageEditMode,
        setIsFrontPageEditMode,
        frontPageEditProduct,
        setFrontPageEditProduct,
        isFrontPageProductModalOpen,
        setIsFrontPageProductModalOpen,
        openFrontPageProductEdit,
        liveEditType,
        setLiveEditType,
        liveEditData,
        setLiveEditData,
        openLiveEdit,
        closeLiveEdit,
        sharingProduct,
        setSharingProduct,
        shareProduct,
        isLoveSorryModalOpen,
        setIsLoveSorryModalOpen,
        openLoveSorryModal,
        toast,
        showToast,
        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        updateOrder,
        deleteOrder,
        saveCustomerAdmin,
        deleteCustomerAdmin,
        writeReview,
        toggleReviewApproval,
        deleteReview,
        updateSiteContent,
        saveMedia,
        deleteMedia,
        downloadMediaFile,
        isUploadMediaModalOpen,
        setIsUploadMediaModalOpen,
        openUploadMediaModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

