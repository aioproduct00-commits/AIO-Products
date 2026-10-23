import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  ShoppingBag,
  Star,
  Users,
  Settings,
  Database,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Save,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCode,
  Copy,
  Key,
  Lock,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Search,
  Sparkles,
  Percent,
  Image as ImageIcon,
  Download,
  Share2,
  Upload,
  ArrowLeft,
} from 'lucide-react';
import { ImagePickerInput } from './ImagePickerInput';
import { useStore } from '../context/StoreContext';
import {
  formatPKR,
  formatDate,
  calcDiscountPercent,
  calcCompareAtFromDiscount,
  PAKISTAN_MAJOR_CITIES,
  PAKISTAN_PROVINCES,
  resolveImageUrl,
} from '../lib/utils';
import {
  Category,
  Customer,
  Order,
  OrderStatus,
  Product,
  Review,
  SiteSettings,
} from '../types';
import {
  getSupabaseCredentials,
  isSupabaseConnected,
  resetLocalStoreToDefaults,
  saveCustomSupabaseCredentials,
  testSupabaseConnection,
} from '../lib/supabase';

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'reviews'
  | 'customers'
  | 'content'
  | 'database'
  | 'password';

const PRESET_IMAGES = [
  { label: 'Islamic Calligraphy Art', url: 'https://cdn.imgpile.com/f/JMYwJYO_xl.webp' },
  { label: 'Wireless Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80' },
  { label: 'Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
  { label: 'Running Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80' },
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sunglasses', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Leather Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80' },
  { label: 'Casual Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80' },
];

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    reviews,
    customers,
    siteSettings,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    updateOrder,
    deleteOrder,
    saveCustomerAdmin,
    deleteCustomerAdmin,
    adminCredentials,
    changeAdminPassword,
    toggleReviewApproval,
    deleteReview,
    updateSiteContent,
    refreshAllData,
    showToast,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    setCurrentView,
    setIsFrontPageEditMode,
    openFrontPageProductEdit,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Login form state (strictly manual input, zero auto-filling)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Clear auto-filled credentials and ensure orders are freshly loaded
  useEffect(() => {
    setLoginEmail('');
    setLoginPassword('');
    refreshAllData();
  }, []);

  // Product modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Product Row Editing & Front Page State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productFilterTab, setProductFilterTab] = useState<'all' | 'featured'>('all');
  const [showAddRowForm, setShowAddRowForm] = useState(false);
  const [rowDrafts, setRowDrafts] = useState<Record<string, {
    name: string;
    description: string;
    image_url: string;
    price: number;
    compare_at_price?: number;
    discountPercent: number;
    is_featured: boolean;
    isModified?: boolean;
    savedJustNow?: boolean;
  }>>({});

  // New product row draft
  const [newRowDraft, setNewRowDraft] = useState({
    name: '',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    price: 3999,
    discountPercent: 20,
    is_featured: true,
    category_id: '',
  });

  // Keep rowDrafts synced with products
  React.useEffect(() => {
    setRowDrafts(prev => {
      const next = { ...prev };
      products.forEach(p => {
        if (!next[p.id] || !next[p.id].isModified) {
          const disc = calcDiscountPercent(p.price, p.compare_at_price);
          next[p.id] = {
            name: p.name,
            description: p.description,
            image_url: p.image_url,
            price: p.price,
            compare_at_price: p.compare_at_price,
            discountPercent: disc,
            is_featured: p.is_featured,
            isModified: false,
          };
        }
      });
      return next;
    });
  }, [products]);

  const handleUpdateRowDraft = (id: string, updates: Partial<{
    name: string;
    description: string;
    image_url: string;
    price: number;
    discountPercent: number;
    is_featured: boolean;
  }>) => {
    setRowDrafts(prev => {
      const current = prev[id] || {
        name: '',
        description: '',
        image_url: '',
        price: 0,
        discountPercent: 0,
        is_featured: false,
      };

      const updated = { ...current, ...updates, isModified: true };

      if ('discountPercent' in updates || 'price' in updates) {
        const p = updated.price;
        const d = updated.discountPercent;
        if (d > 0 && p > 0) {
          updated.compare_at_price = calcCompareAtFromDiscount(p, d);
        } else {
          updated.compare_at_price = undefined;
        }
      }

      return { ...prev, [id]: updated };
    });
  };

  const handleSaveProductRow = async (id: string) => {
    const draft = rowDrafts[id];
    if (!draft) return;
    if (!draft.name.trim()) {
      showToast('Product name cannot be empty', 'error');
      return;
    }
    if (!draft.price || draft.price <= 0) {
      showToast('Price must be greater than 0', 'error');
      return;
    }

    const existing = products.find(p => p.id === id);
    if (!existing) return;

    await saveProduct({
      ...existing,
      name: draft.name.trim(),
      description: draft.description.trim(),
      image_url: draft.image_url.trim(),
      price: Number(draft.price),
      compare_at_price: draft.compare_at_price ? Number(draft.compare_at_price) : undefined,
      is_featured: draft.is_featured,
    });

    setRowDrafts(prev => ({
      ...prev,
      [id]: { ...prev[id], isModified: false, savedJustNow: true },
    }));

    setTimeout(() => {
      setRowDrafts(prev => ({
        ...prev,
        [id]: { ...prev[id], savedJustNow: false },
      }));
    }, 2000);

    showToast(`Row for "${draft.name}" saved!`, 'success');
  };

  // Product Deletion State & Handlers (safe for iframe - avoids window.confirm)
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
    image_url?: string;
    price?: number;
  } | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [inlineDeleteConfirmId, setInlineDeleteConfirmId] = useState<string | null>(null);

  // Quick image URL edit popover for table rows (replaces window.prompt)
  const [imageEditingRowId, setImageEditingRowId] = useState<string | null>(null);
  const [tempRowImageUrl, setTempRowImageUrl] = useState<string>('');

  const handleExecuteDeleteProduct = async (id: string, name: string) => {
    setIsDeletingProduct(true);
    try {
      await deleteProduct(id);
      showToast(`Product "${name}" deleted successfully.`, 'info');
      setProductToDelete(null);
      setInlineDeleteConfirmId(null);
      if (editingProduct?.id === id) {
        setProductModalOpen(false);
        setEditingProduct(null);
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to delete product', 'error');
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleDeleteProductRow = (id: string, name: string) => {
    const existing = products.find(p => p.id === id);
    setProductToDelete({
      id,
      name,
      image_url: existing?.image_url,
      price: existing?.price,
    });
  };

  const handleAddNewProductRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRowDraft.name.trim()) {
      showToast('Please enter product name', 'error');
      return;
    }
    if (!newRowDraft.price || newRowDraft.price <= 0) {
      showToast('Please enter a valid price in PKR', 'error');
      return;
    }

    const compareAt = newRowDraft.discountPercent > 0
      ? calcCompareAtFromDiscount(newRowDraft.price, newRowDraft.discountPercent)
      : undefined;

    await saveProduct({
      name: newRowDraft.name.trim(),
      description: newRowDraft.description.trim() || 'Premium quality verified item.',
      image_url: newRowDraft.image_url.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      price: Number(newRowDraft.price),
      compare_at_price: compareAt,
      is_active: true,
      is_featured: newRowDraft.is_featured,
      category_id: newRowDraft.category_id || categories[0]?.id || 'cat-electronics',
      stock_quantity: 20,
    });

    showToast(`New product row "${newRowDraft.name}" added successfully!`, 'success');
    setNewRowDraft({
      name: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      price: 3999,
      discountPercent: 20,
      is_featured: true,
      category_id: categories[0]?.id || 'cat-electronics',
    });
    setShowAddRowForm(false);
  };

  // Category modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Customer modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Order details modal & inline delete
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderDeleteConfirmId, setOrderDeleteConfirmId] = useState<string | null>(null);

  // Change Password state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Content settings form state (CMS)
  const [cmsSettings, setCmsSettings] = useState<SiteSettings>(siteSettings);

  // Supabase connection settings
  const { url: initialUrl, anonKey: initialKey } = getSupabaseCredentials();
  const [dbUrl, setDbUrl] = useState(initialUrl);
  const [dbKey, setDbKey] = useState(initialKey);
  const [isTestingDb, setIsTestingDb] = useState(false);

  // Keep cmsSettings in sync when siteSettings loads
  React.useEffect(() => {
    setCmsSettings(siteSettings);
  }, [siteSettings]);

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = (adminCredentials?.email || 'admin@aioproduct.pk').trim().toLowerCase();
    const targetPassword = adminCredentials?.password || 'aioadmin123';

    if (loginEmail.trim().toLowerCase() === targetEmail && loginPassword === targetPassword) {
      setIsAdminLoggedIn(true);
      setLoginError('');
      showToast('Admin logged in successfully', 'success');
    } else {
      setLoginError('Invalid credentials. Please enter the correct admin email and password.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('Admin logged out', 'info');
  };

  // --- CHANGE PASSWORD HANDLER ---
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPasswordInput) {
      setPassError('Please enter your current password.');
      return;
    }
    if (newPasswordInput.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    const res = changeAdminPassword(currentPasswordInput, newPasswordInput);
    if (res.success) {
      setPassSuccess(res.message);
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } else {
      setPassError(res.message);
    }
  };

  // --- CUSTOMER CRUD HANDLERS ---
  const handleOpenNewCustomer = () => {
    setEditingCustomer({
      name: '',
      email: '',
      phone: '03',
      address: '',
      city: 'Lahore',
      province: 'Punjab',
      postal_code: '',
      status: 'active',
      notes: '',
      auth_provider: 'google',
    });
    setCustomerModalOpen(true);
  };

  const handleEditCustomer = (cust: Customer) => {
    setEditingCustomer({ ...cust });
    setCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer?.name || !editingCustomer?.phone) {
      showToast('Please enter both customer name and phone number', 'error');
      return;
    }
    await saveCustomerAdmin(editingCustomer as any);
    setCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  // --- PRODUCT CRUD ---
  const handleOpenNewProduct = () => {
    setEditingProduct({
      name: '',
      price: 1000,
      compare_at_price: 1500,
      category_id: categories[0]?.id || '',
      stock_quantity: 20,
      is_active: true,
      is_featured: false,
      description: '',
      image_url:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    });
    setProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      showToast('Please enter name and price', 'error');
      return;
    }
    await saveProduct(editingProduct as any);
    setProductModalOpen(false);
    setEditingProduct(null);
  };

  // --- CATEGORY CRUD ---
  const handleOpenNewCategory = () => {
    setEditingCategory({
      name: '',
      description: '',
      is_active: true,
      image_url:
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    });
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory({ ...cat });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) {
      showToast('Category name is required', 'error');
      return;
    }
    await saveCategory(editingCategory as any);
    setCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // --- CMS CONTENT SAVE ---
  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteContent(cmsSettings);
  };

  // --- SUPABASE CONFIG SAVE ---
  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingDb(true);
    saveCustomSupabaseCredentials(dbUrl, dbKey);

    const testResult = await testSupabaseConnection(dbUrl, dbKey);
    await refreshAllData();
    setIsTestingDb(false);

    if (testResult.success) {
      showToast(testResult.message, 'success');
    } else {
      showToast(testResult.message, 'error');
    }
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset all catalog and orders to default Pakistan demo store data?')) {
      resetLocalStoreToDefaults();
      refreshAllData();
      showToast('Catalog reset to initial data', 'info');
    }
  };

  // --- EXPORT ORDERS TO CSV FOR ACCOUNTING ---
  const handleExportOrdersToCSV = () => {
    if (orders.length === 0) {
      showToast('No orders found to export', 'error');
      return;
    }

    const headers = [
      'Order ID',
      'Order Number',
      'Date & Time',
      'Customer Name',
      'Phone Number',
      'Email',
      'Shipping Address',
      'City',
      'Province',
      'Postal Code',
      'Product Names',
      'Product Categories',
      'Items Purchased',
      'Total Items Count',
      'Subtotal (PKR)',
      'Delivery Fee (PKR)',
      'Total Amount (PKR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
    ];

    const rows = orders.map(o => {
      const itemsDetail = (o.items || [])
        .map(i => `${i.product_name || 'Product'} (Qty: ${i.quantity || 1}, Price: PKR ${i.price || 0})`)
        .join('; ');

      const productNames = (o.items || []).map(i => i.product_name || 'Product').join('; ');
      const productCategories = Array.from(
        new Set(
          (o.items || []).map(i => {
            const prod = products.find(p => p.id === i.product_id || p.name.toLowerCase() === i.product_name?.toLowerCase());
            const cat = categories.find(c => c.id === prod?.category_id);
            return cat?.name || 'General';
          })
        )
      ).join('; ');

      const totalItemsCount = (o.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);

      return [
        o.id,
        o.order_number,
        o.created_at ? new Date(o.created_at).toLocaleString('en-PK') : '',
        o.shipping_address?.name || o.customer_name || '',
        o.shipping_address?.phone || o.customer_phone || '',
        o.customer_email || '',
        (o.shipping_address?.address || '').replace(/[\r\n]+/g, ' '),
        o.shipping_address?.city || '',
        o.shipping_address?.province || '',
        o.shipping_address?.postal_code || '',
        productNames,
        productCategories,
        itemsDetail,
        totalItemsCount,
        o.subtotal_amount || o.total_amount,
        o.shipping_fee || 0,
        o.total_amount,
        o.payment_method || 'Cash on Delivery',
        o.payment_status || 'Pending',
        o.order_status,
      ].map(val => `"${String(val ?? '').replace(/"/g, '""')}"`);
    });

    // Add UTF-8 BOM so Excel opens Urdu/English names properly
    const csvContent = ['\uFEFF' + headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `aio-orders-export-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Successfully exported ${orders.length} orders to CSV for accounting!`, 'success');
  };

  // --- METRICS ---
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.order_status === 'Pending').length;
  const pendingReviews = reviews.filter(r => !r.is_approved).length;
  const lowStockCount = products.filter(p => p.stock_quantity <= 5).length;

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-800">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3 font-black text-xl">
              AIO
            </div>
            <h2 className="text-2xl font-black text-slate-950 font-['Outfit']">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage products, categories, orders & website content.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Security Notice: Autofill prohibited */}
          <div className="mb-4 px-3 py-2 rounded-xl bg-[#EDF4F0] border border-[#D5E3DA] text-[11px] font-bold text-[#243F2E] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4A6B53] shrink-0" />
            <span>Browser credential auto-fill is strictly prohibited for security.</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off" action="javascript:void(0);">
            {/* Decoy hidden inputs to divert browser autofill mechanisms */}
            <input
              type="text"
              name="fake_usernameremembered"
              tabIndex={-1}
              className="hidden pointer-events-none opacity-0 h-0 w-0 absolute -z-50"
              aria-hidden="true"
              autoComplete="off"
            />
            <input
              type="password"
              name="fake_passwordremembered"
              tabIndex={-1}
              className="hidden pointer-events-none opacity-0 h-0 w-0 absolute -z-50"
              aria-hidden="true"
              autoComplete="new-password"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                id="sec_aio_admin_email_field"
                name="sec_aio_admin_email_field"
                required
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                data-bwignore="true"
                placeholder="Enter admin email..."
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] bg-white text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="text-[11px] font-bold text-[#4A6B53] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showLoginPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  id="sec_aio_admin_passcode_field"
                  name="sec_aio_admin_passcode_field"
                  required
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  data-bwignore="true"
                  placeholder="Enter admin password..."
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] bg-white font-mono text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
            AIO
          </div>
          <div>
            <h1 className="text-base font-black font-['Outfit'] leading-none">
              AIO PRODUCT — Admin Dashboard
            </h1>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              {isSupabaseConnected() ? '⚡ Supabase Live Connected' : '💾 Local / Dual-Mode Store'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              const liveUrl = 'https://ais-pre-aszhdxvbhc3gi6eifhlaqi-658556082995.asia-southeast1.run.app';
              navigator.clipboard?.writeText(liveUrl);
              showToast('Public live website link copied! Globally accessible 24/7.', 'success');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Copy free public live link for this store"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Public Link</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="View Customer Placed Orders"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Orders ({orders.length})</span>
            {pendingOrders > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'password'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Change Admin Password"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Change Password</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Return to Customer Storefront"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag, badge: pendingOrders },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star, badge: pendingReviews },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'content', label: 'Website CMS', icon: Settings },
            { id: 'database', label: 'Supabase Config', icon: Database },
            { id: 'password', label: 'Change Password', icon: Key },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Order Revenue
                </span>
                <div className="text-2xl font-black text-slate-950 mt-1 font-['Outfit']">
                  {formatPKR(totalRevenue)}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  {orders.length} total orders recorded
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pending Orders (COD)
                </span>
                <div className="text-2xl font-black text-amber-600 mt-1 font-['Outfit']">
                  {pendingOrders}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Awaiting dispatch confirmation
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Catalog
                </span>
                <div className="text-2xl font-black text-slate-950 mt-1 font-['Outfit']">
                  {products.filter(p => p.is_active).length} / {products.length}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Across {categories.length} categories
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pending Reviews
                </span>
                <div className="text-2xl font-black text-purple-600 mt-1 font-['Outfit']">
                  {pendingReviews}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Requiring administrator approval
                </span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Recent Orders ({orders.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => refreshAllData()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EDF4F0] text-[#243F2E] hover:bg-[#D5E3DA] text-[11px] font-bold transition-all cursor-pointer"
                    title="Refresh placed orders from database"
                  >
                    <RefreshCw className="w-3 h-3 text-[#4A6B53]" />
                    <span>Refresh Orders</span>
                  </button>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#4A6B53] hover:underline cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Total (PKR)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 8).map(o => {
                        const itemsList = o.items || [];
                        const categoriesList = Array.from(
                          new Set(
                            itemsList.map(item => {
                              const prod = products.find(
                                p => p.id === item.product_id || p.name.toLowerCase() === item.product_name?.toLowerCase()
                              );
                              const cat = categories.find(c => c.id === prod?.category_id);
                              return cat?.name || 'General';
                            })
                          )
                        );

                        return (
                          <tr key={o.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-slate-900">{o.order_number}</td>
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{o.shipping_address?.name || o.customer_name}</span>
                              <span className="text-[11px] text-slate-500">{o.shipping_address?.phone || o.customer_phone}</span>
                            </td>
                            {/* Product Name Column */}
                            <td className="p-3 min-w-[160px]">
                              {itemsList.length > 0 ? (
                                <div className="space-y-0.5">
                                  {itemsList.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1 font-semibold text-slate-900">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B53] shrink-0" />
                                      <span className="truncate max-w-[150px]" title={item.product_name}>{item.product_name}</span>
                                      <span className="text-[10px] text-slate-500 font-mono font-bold">({item.quantity}x)</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">Catalog Order</span>
                              )}
                            </td>
                            {/* Category Column */}
                            <td className="p-3 min-w-[100px]">
                              <div className="flex flex-wrap gap-1">
                                {categoriesList.map((cat, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded-md bg-[#EDF4F0] text-[#243F2E] font-bold text-[10px] border border-[#D5E3DA]">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3">{o.shipping_address?.city}</td>
                            <td className="p-3 font-bold text-slate-900">{formatPKR(o.total_amount)}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                {o.order_status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500">{formatDate(o.created_at)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">No orders placed yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT & ROW EDITOR */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                    Product Rows & Front Page Editing
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    Row Editor
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add, edit, and delete product rows with <span className="font-semibold text-slate-700">Name, Description, Image, Price & Discount</span>. Changes can be saved directly on the row or edited live on the front page.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setIsFrontPageEditMode(true);
                    setCurrentView('home');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Switch to storefront with live editing badges"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>✨ Live Front Page Editor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddRowForm(!showAddRowForm)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                    showAddRowForm
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddRowForm ? 'Close Add Row' : '+ Add Product Row'}</span>
                </button>
              </div>
            </div>

            {/* Quick Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              {/* Tab Filters */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setProductFilterTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    productFilterTab === 'all'
                      ? 'bg-white text-slate-950 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Product Rows ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setProductFilterTab('featured')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    productFilterTab === 'featured'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>★ Front Page ({products.filter(p => p.is_featured).length})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={productSearchQuery}
                  onChange={e => setProductSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-amber-500 outline-hidden transition-all"
                />
              </div>
            </div>

            {/* INLINE ADD PRODUCT ROW FORM */}
            {showAddRowForm && (
              <div className="bg-amber-50/80 rounded-2xl border-2 border-amber-300 p-5 shadow-md animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-3 border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      +
                    </span>
                    <h4 className="text-sm font-extrabold text-amber-950 font-['Outfit']">
                      Add New Product Row (Name, Description, Image, Price, Discount)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddRowForm(false)}
                    className="p-1 rounded-lg hover:bg-amber-200 text-amber-900 text-xs font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddNewProductRow} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Product Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newRowDraft.name}
                        onChange={e => setNewRowDraft({ ...newRowDraft, name: e.target.value })}
                        placeholder="e.g. Wireless Noise Cancelling Earbuds"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Price (PKR ₨) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₨</span>
                        <input
                          type="number"
                          min="1"
                          required
                          value={newRowDraft.price || ''}
                          onChange={e =>
                            setNewRowDraft({ ...newRowDraft, price: Number(e.target.value) })
                          }
                          placeholder="4999"
                          className="w-full pl-6 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-amber-500 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Discount % */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Discount (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="95"
                          value={newRowDraft.discountPercent || ''}
                          onChange={e =>
                            setNewRowDraft({
                              ...newRowDraft,
                              discountPercent: Number(e.target.value),
                            })
                          }
                          placeholder="20"
                          className="w-full pl-3 pr-6 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-amber-500 outline-hidden"
                        />
                        <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">%</span>
                      </div>
                      {newRowDraft.discountPercent > 0 && newRowDraft.price > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                          Cross-out Price: {formatPKR(calcCompareAtFromDiscount(newRowDraft.price, newRowDraft.discountPercent) || 0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newRowDraft.description}
                      onChange={e => setNewRowDraft({ ...newRowDraft, description: e.target.value })}
                      placeholder="e.g. Premium HD Audio • 30hr Playtime • Water resistant with fast charging"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:border-amber-500 outline-hidden"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={newRowDraft.category_id || categories[0]?.id || ''}
                      onChange={e => setNewRowDraft({ ...newRowDraft, category_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold focus:border-amber-500"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image Picker: Device (JPEG/PNG) or Web Link */}
                  <ImagePickerInput
                    value={newRowDraft.image_url}
                    onChange={url => setNewRowDraft({ ...newRowDraft, image_url: url })}
                    label="Product Image (Device JPEG/JPG/PNG or Link)"
                    presets={PRESET_IMAGES}
                  />

                  {/* Front Page Toggle & Submit */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-200/80">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRowDraft.is_featured}
                        onChange={e => setNewRowDraft({ ...newRowDraft, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-900">
                        ⭐ Show this row on Front Page (Featured)
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddRowForm(false)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>Add Row to Catalog</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* PRODUCT ROWS TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-black text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3 w-16 text-center">Image</th>
                      <th className="p-3 w-48">Name</th>
                      <th className="p-3 min-w-[220px]">Description</th>
                      <th className="p-3 w-32">Price (PKR)</th>
                      <th className="p-3 w-36">Discount</th>
                      <th className="p-3 w-28 text-center">Front Page</th>
                      <th className="p-3 w-44 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter(p => {
                        if (productFilterTab === 'featured' && !p.is_featured) return false;
                        if (productSearchQuery.trim()) {
                          const q = productSearchQuery.toLowerCase();
                          const matchesName = p.name.toLowerCase().includes(q);
                          const matchesDesc = p.description.toLowerCase().includes(q);
                          return matchesName || matchesDesc;
                        }
                        return true;
                      })
                      .map(p => {
                        const draft = rowDrafts[p.id] || {
                          name: p.name,
                          description: p.description,
                          image_url: p.image_url,
                          price: p.price,
                          compare_at_price: p.compare_at_price,
                          discountPercent: calcDiscountPercent(p.price, p.compare_at_price),
                          is_featured: p.is_featured,
                          isModified: false,
                        };

                        const isModified = Boolean(draft.isModified);
                        const savedJustNow = Boolean(draft.savedJustNow);

                        return (
                          <tr
                            key={p.id}
                            className={`transition-colors ${
                              isModified
                                ? 'bg-amber-50/40 hover:bg-amber-50/70'
                                : 'hover:bg-slate-50/80'
                            }`}
                          >
                            {/* 1. IMAGE COLUMN */}
                            <td className="p-2.5 text-center align-middle">
                              <div className="relative group/img mx-auto w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-1 shadow-inner">
                                <img
                                  src={resolveImageUrl(draft.image_url)}
                                  alt={draft.name}
                                  className="w-full h-full object-contain"
                                  onError={e => {
                                    (e.target as HTMLImageElement).src =
                                      '/products/mashaallah-tabarakallah.webp';
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setImageEditingRowId(imageEditingRowId === p.id ? null : p.id);
                                    setTempRowImageUrl(draft.image_url);
                                  }}
                                  className="absolute inset-0 bg-slate-950/60 text-white opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold cursor-pointer"
                                  title="Change image URL"
                                >
                                  Change
                                </button>
                              </div>
                            </td>

                            {/* 2. NAME COLUMN */}
                            <td className="p-2.5 align-middle">
                              <input
                                type="text"
                                value={draft.name}
                                onChange={e =>
                                  handleUpdateRowDraft(p.id, { name: e.target.value })
                                }
                                placeholder="Product Name"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs font-bold text-slate-900 bg-white"
                              />
                              <span className="text-[10px] text-slate-400 block px-1 mt-0.5 truncate">
                                ID: {p.id}
                              </span>
                            </td>

                            {/* 3. DESCRIPTION COLUMN */}
                            <td className="p-2.5 align-middle">
                              <textarea
                                rows={2}
                                value={draft.description}
                                onChange={e =>
                                  handleUpdateRowDraft(p.id, { description: e.target.value })
                                }
                                placeholder="Product description & bullet points..."
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-slate-700 bg-white resize-y"
                              />
                            </td>

                            {/* 4. PRICE COLUMN */}
                            <td className="p-2.5 align-middle">
                              <div className="relative w-28">
                                <span className="absolute left-2 top-1.5 text-xs font-bold text-slate-400">₨</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={draft.price || ''}
                                  onChange={e =>
                                    handleUpdateRowDraft(p.id, { price: Number(e.target.value) })
                                  }
                                  className="w-full pl-5 pr-2 py-1.5 rounded-lg border border-slate-200 focus:border-amber-500 text-xs font-black text-slate-900 bg-white"
                                />
                              </div>
                            </td>

                            {/* 5. DISCOUNT COLUMN */}
                            <td className="p-2.5 align-middle">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <div className="relative w-16">
                                    <input
                                      type="number"
                                      min="0"
                                      max="95"
                                      value={draft.discountPercent || ''}
                                      onChange={e =>
                                        handleUpdateRowDraft(p.id, {
                                          discountPercent: Number(e.target.value),
                                        })
                                      }
                                      placeholder="0"
                                      className="w-full pl-2 pr-4 py-1.5 rounded-lg border border-slate-200 focus:border-amber-500 text-xs font-bold text-slate-900 bg-white"
                                    />
                                    <span className="absolute right-1.5 top-1.5 text-xs font-bold text-slate-400">%</span>
                                  </div>

                                  {draft.discountPercent > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-[#ff6b00] text-white shrink-0">
                                      -{draft.discountPercent}%
                                    </span>
                                  )}
                                </div>

                                {draft.compare_at_price && draft.compare_at_price > draft.price ? (
                                  <div className="text-[10px] text-slate-400 line-through">
                                    {formatPKR(draft.compare_at_price)}
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-slate-400">No discount</div>
                                )}
                              </div>
                            </td>

                            {/* 6. FRONT PAGE (FEATURED) COLUMN */}
                            <td className="p-2.5 text-center align-middle">
                              <button
                                type="button"
                                onClick={() => {
                                  const toggled = !draft.is_featured;
                                  handleUpdateRowDraft(p.id, { is_featured: toggled });
                                  saveProduct({ ...p, is_featured: toggled });
                                  showToast(
                                    toggled
                                      ? `"${draft.name}" is now featured on Front Page!`
                                      : `"${draft.name}" removed from Front Page.`,
                                    'info'
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                                  draft.is_featured
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                                }`}
                                title="Click to toggle display on Front Page"
                              >
                                {draft.is_featured ? '★ Front Page' : 'Off Front Page'}
                              </button>
                            </td>

                            {/* 7. ACTION COLUMN */}
                            <td className="p-2.5 text-right align-middle">
                              <div className="flex items-center justify-end gap-1.5">
                                {inlineDeleteConfirmId === p.id ? (
                                  <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg animate-in fade-in">
                                    <span className="text-[11px] font-bold text-rose-700 px-1">Delete?</span>
                                    <button
                                      type="button"
                                      disabled={isDeletingProduct}
                                      onClick={() => handleExecuteDeleteProduct(p.id, draft.name)}
                                      className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-black cursor-pointer shadow-xs"
                                    >
                                      {isDeletingProduct ? '...' : 'Confirm'}
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isDeletingProduct}
                                      onClick={() => setInlineDeleteConfirmId(null)}
                                      className="px-1.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-bold cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    {/* Save Row Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleSaveProductRow(p.id)}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                        savedJustNow
                                          ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                                          : isModified
                                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-sm animate-pulse'
                                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                      }`}
                                      title="Save changes to this row"
                                    >
                                      {savedJustNow ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          <span>Saved!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Save className="w-3.5 h-3.5" />
                                          <span>Save</span>
                                        </>
                                      )}
                                    </button>

                                    {/* Full Edit Modal */}
                                    <button
                                      type="button"
                                      onClick={() => handleEditProduct(p)}
                                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                                      title="Full Edit Details"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete Row Button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setProductToDelete({
                                          id: p.id,
                                          name: draft.name,
                                          image_url: draft.image_url,
                                          price: draft.price,
                                        })
                                      }
                                      className="px-2 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
                                      title="Delete Product from Store"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                      <span className="hidden sm:inline">Delete</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Summary & + Add Row button */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>
                    Showing <strong>{products.length}</strong> total products (
                    <strong>{products.filter(p => p.is_featured).length}</strong> featured on front page)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRowForm(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Row</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsFrontPageEditMode(true);
                      setCurrentView('home');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit on Front Page</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                  Categories Management
                </h3>
                <p className="text-xs text-slate-500">
                  Create collections, update banners, and organize catalog structure.
                </p>
              </div>
              <button
                onClick={handleOpenNewCategory}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => {
                const count = products.filter(p => p.category_id === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-36 w-full overflow-hidden bg-slate-100 relative">
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                            cat.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white'
                          }`}
                        >
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                        <span className="text-[11px] text-amber-600 font-semibold block mt-2">
                          {count} Products Linked
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                  Customer Orders ({orders.length})
                </h3>
                <p className="text-xs text-slate-500">
                  View orders, customer addresses, Pakistan courier details, and change status.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => refreshAllData()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#EDF4F0] hover:bg-[#D5E3DA] text-[#243F2E] font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                  title="Reload placed orders from storage and database"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#4A6B53]" />
                  <span>Refresh Orders</span>
                </button>

                {/* Export to CSV for Accounting */}
                <button
                  type="button"
                  onClick={handleExportOrdersToCSV}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
                  title="Download placed orders into CSV spreadsheet for accounting"
                >
                  <Download className="w-4 h-4 text-[#A5D9B7]" />
                  <span>Export to CSV</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">
                    {orders.length}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold">
                      <tr>
                        <th className="p-3.5">Order #</th>
                        <th className="p-3.5">Customer & Phone</th>
                        <th className="p-3.5">Product Name</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Address & City</th>
                        <th className="p-3.5">Items</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5">Payment</th>
                        <th className="p-3.5">Order Status</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-slate-950">
                            {o.order_number}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block">
                              {o.shipping_address?.name || o.customer_name}
                            </span>
                            <span className="text-slate-500">
                              {o.shipping_address?.phone || o.customer_phone}
                            </span>
                          </td>

                          {/* Dedicated Product Name Column */}
                          <td className="p-3.5 min-w-[200px]">
                            <div className="space-y-1">
                              {(o.items || []).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-slate-900">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B53] shrink-0" />
                                  <span className="font-semibold text-slate-900 truncate max-w-[170px]" title={item.product_name}>
                                    {item.product_name}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono font-bold">({item.quantity}x)</span>
                                </div>
                              ))}
                              {(!o.items || o.items.length === 0) && (
                                <span className="text-slate-400 italic text-[11px]">Catalog Order</span>
                              )}
                            </div>
                          </td>

                          {/* Dedicated Category Column */}
                          <td className="p-3.5 min-w-[130px]">
                            <div className="flex flex-wrap gap-1">
                              {Array.from(
                                new Set(
                                  (o.items || []).map(item => {
                                    const prod = products.find(
                                      p => p.id === item.product_id || p.name.toLowerCase() === item.product_name?.toLowerCase()
                                    );
                                    const cat = categories.find(c => c.id === prod?.category_id);
                                    return cat?.name || 'General';
                                  })
                                )
                              ).map((catName, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EBF3ED] text-[#2F533A] font-bold text-[10px] border border-[#D3E5D7]"
                                >
                                  {catName}
                                </span>
                              ))}
                              {(!o.items || o.items.length === 0) && (
                                <span className="text-slate-400 text-[10px]">General</span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5 max-w-xs">
                            <span className="line-clamp-1">
                              {o.shipping_address?.address}, {o.shipping_address?.city}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {o.shipping_address?.province}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold">
                            {o.items?.length || 1} item(s)
                          </td>
                          <td className="p-3.5 font-bold text-slate-950">
                            {formatPKR(o.total_amount)}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold block w-fit">
                              {o.payment_method}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={o.order_status}
                              onChange={e => updateOrder(o.id, e.target.value as OrderStatus)}
                              className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-slate-500">{formatDate(o.created_at)}</td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrderDetails(o)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                                title="View Order Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {orderDeleteConfirmId === o.id ? (
                                <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg animate-in fade-in">
                                  <span className="text-[10px] font-bold text-rose-700 px-1">Delete?</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      deleteOrder(o.id);
                                      setOrderDeleteConfirmId(null);
                                    }}
                                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setOrderDeleteConfirmId(null)}
                                    className="px-1 py-0.5 text-slate-500 hover:text-slate-800 text-[10px] font-bold cursor-pointer"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setOrderDeleteConfirmId(o.id)}
                                  className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No customer orders have been recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS MANAGEMENT */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                Customer Reviews Moderation
              </h3>
              <p className="text-xs text-slate-500">
                Approve, reject, or delete submitted product testimonials.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {reviews.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {reviews.map(r => (
                    <div
                      key={r.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{r.customer_name}</span>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < r.rating ? 'fill-current text-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              r.is_approved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.is_approved ? 'Approved' : 'Pending Approval'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 italic">&quot;{r.review_text}&quot;</p>
                        <span className="text-[10px] text-slate-400">
                          {r.product_name} • {formatDate(r.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {r.is_approved ? (
                          <button
                            onClick={() => toggleReviewApproval(r.id, false)}
                            className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-50"
                          >
                            Unapprove
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleReviewApproval(r.id, true)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this review permanently?')) {
                              deleteReview(r.id);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No reviews submitted yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOMERS MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                  Customer Directory & Accounts ({customers.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Customers registered with Gmail accounts or checkout profiles in Pakistan. All details are fully editable.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenNewCustomer}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Filter by customer name, Gmail, phone or city..."
                  value={customerSearchQuery}
                  onChange={e => setCustomerSearchQuery(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {customerSearchQuery && (
                  <button
                    onClick={() => setCustomerSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="text-xs text-slate-500 whitespace-nowrap px-2">
                Showing{' '}
                <strong>
                  {
                    customers.filter(c => {
                      if (!customerSearchQuery.trim()) return true;
                      const q = customerSearchQuery.toLowerCase();
                      return (
                        c.name.toLowerCase().includes(q) ||
                        (c.email && c.email.toLowerCase().includes(q)) ||
                        c.phone.toLowerCase().includes(q) ||
                        c.city.toLowerCase().includes(q)
                      );
                    }).length
                  }
                </strong>{' '}
                of {customers.length}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {customers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
                      <tr>
                        <th className="p-3.5">Customer & Account</th>
                        <th className="p-3.5">Email / Gmail</th>
                        <th className="p-3.5">Phone Number</th>
                        <th className="p-3.5">City & Address</th>
                        <th className="p-3.5">Orders & Spend</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customers
                        .filter(c => {
                          if (!customerSearchQuery.trim()) return true;
                          const q = customerSearchQuery.toLowerCase();
                          return (
                            c.name.toLowerCase().includes(q) ||
                            (c.email && c.email.toLowerCase().includes(q)) ||
                            c.phone.toLowerCase().includes(q) ||
                            c.city.toLowerCase().includes(q)
                          );
                        })
                        .map(c => {
                          // Find orders linked to this customer
                          const customerOrders = orders.filter(
                            o =>
                              o.customer_id === c.id ||
                              (c.phone && o.customer_phone === c.phone) ||
                              (c.phone && o.shipping_address?.phone === c.phone) ||
                              (c.email && o.customer_email?.toLowerCase() === c.email.toLowerCase())
                          );
                          const totalSpent = customerOrders.reduce((sum, ord) => sum + ord.total_amount, 0);
                          const isGmail =
                            c.auth_provider === 'google' ||
                            (c.email && c.email.toLowerCase().endsWith('@gmail.com'));

                          return (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      c.avatar_url ||
                                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        c.name
                                      )}&background=ff6b00&color=fff`
                                    }
                                    alt={c.name}
                                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                                  />
                                  <div>
                                    <span className="font-bold text-slate-900 block text-sm">
                                      {c.name}
                                    </span>
                                    {isGmail ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                        <span>G</span> Gmail Account
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400">Regular Account</span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                {c.email ? (
                                  <div className="space-y-0.5">
                                    <span className="text-slate-800 font-medium block">{c.email}</span>
                                    <span className="text-[10px] text-slate-400">
                                      Joined {c.created_at ? formatDate(c.created_at) : '—'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">No email</span>
                                )}
                              </td>

                              <td className="p-3.5">
                                <div className="space-y-0.5">
                                  <span className="font-mono font-semibold text-slate-900 block">
                                    {c.phone}
                                  </span>
                                  <span className="text-[10px] text-emerald-600 font-bold">
                                    COD Contact
                                  </span>
                                </div>
                              </td>

                              <td className="p-3.5 max-w-xs">
                                <span className="font-semibold text-slate-900 block">
                                  {c.city}, {c.province}
                                </span>
                                <span className="text-[11px] text-slate-500 line-clamp-1">
                                  {c.address || 'No address added yet'}
                                </span>
                              </td>

                              <td className="p-3.5">
                                <span className="font-bold text-slate-950 block">
                                  {formatPKR(totalSpent)}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {customerOrders.length} order(s) placed
                                </span>
                              </td>

                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    c.status === 'suspended'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {c.status || 'Active'}
                                </span>
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleEditCustomer(c)}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Edit Customer Details"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Are you sure you want to delete customer "${c.name}"?`
                                        )
                                      ) {
                                        deleteCustomerAdmin(c.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Customer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No customer records saved yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: WEBSITE CONTENT & CMS (ALL EDITABLE) */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                  Website Content & CMS Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Every heading, text, button, banner, contact and brand element is editable here.
                </p>
              </div>
              <button
                onClick={handleSaveCMS}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                title="Publish changes to Supabase so all visitors worldwide receive the latest update"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Publish Changes Live</span>
              </button>
            </div>

            <form onSubmit={handleSaveCMS} className="space-y-6">
              {/* Brand & Tagline */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Brand Identity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.brandName}
                      onChange={e =>
                        setCmsSettings({ ...cmsSettings, brandName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.tagline}
                      onChange={e => setCmsSettings({ ...cmsSettings, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Announcement Top Bar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-900">Top Announcement Bar</h4>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={cmsSettings.announcementBar?.enabled}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          announcementBar: {
                            ...cmsSettings.announcementBar,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-amber-500"
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Banner Text
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.announcementBar?.text}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          announcementBar: {
                            ...cmsSettings.announcementBar,
                            text: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Support Phone
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.announcementBar?.supportPhone}
                        onChange={e =>
                          setCmsSettings({
                            ...cmsSettings,
                            announcementBar: {
                              ...cmsSettings.announcementBar,
                              supportPhone: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.announcementBar?.whatsappNumber}
                        onChange={e =>
                          setCmsSettings({
                            ...cmsSettings,
                            announcementBar: {
                              ...cmsSettings.announcementBar,
                              whatsappNumber: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Hero Section Content
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Badge
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.hero?.badge}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          hero: { ...cmsSettings.hero, badge: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.hero?.headline}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          hero: { ...cmsSettings.hero, headline: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Supporting Paragraph
                    </label>
                    <textarea
                      rows={2}
                      value={cmsSettings.hero?.supportingText}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          hero: { ...cmsSettings.hero, supportingText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Primary Button Text
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.hero?.primaryButtonText}
                        onChange={e =>
                          setCmsSettings({
                            ...cmsSettings,
                            hero: { ...cmsSettings.hero, primaryButtonText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Secondary Button Text
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.hero?.secondaryButtonText}
                        onChange={e =>
                          setCmsSettings({
                            ...cmsSettings,
                            hero: { ...cmsSettings.hero, secondaryButtonText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Image URL
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.hero?.imageUrl}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          hero: { ...cmsSettings.hero, imageUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Special Offers Promotional Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-900">Special Offers Promotion Banner</h4>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={cmsSettings.specialOffer?.enabled}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          specialOffer: {
                            ...cmsSettings.specialOffer,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-amber-500"
                    />
                    <span>Active on Homepage</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.specialOffer?.heading}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          specialOffer: { ...cmsSettings.specialOffer, heading: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Discount Badge Text
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.specialOffer?.discountText}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          specialOffer: {
                            ...cmsSettings.specialOffer,
                            discountText: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Offer Description
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.specialOffer?.description}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          specialOffer: {
                            ...cmsSettings.specialOffer,
                            description: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.specialOffer?.imageUrl}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          specialOffer: { ...cmsSettings.specialOffer, imageUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Valid Until Date
                    </label>
                    <input
                      type="date"
                      value={cmsSettings.specialOffer?.endsAt}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          specialOffer: { ...cmsSettings.specialOffer, endsAt: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Store Contact Info (Pakistan)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={cmsSettings.contact?.phone}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          contact: { ...cmsSettings.contact, phone: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Support Number
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.contact?.whatsapp}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          contact: { ...cmsSettings.contact, whatsapp: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={cmsSettings.contact?.email}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          contact: { ...cmsSettings.contact, email: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Warehouse / Office Address
                    </label>
                    <input
                      type="text"
                      value={cmsSettings.contact?.address}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          contact: { ...cmsSettings.contact, address: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Policy Settings */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Shipping Fee Configuration (PKR)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Free Shipping Threshold (₨)
                    </label>
                    <input
                      type="number"
                      value={cmsSettings.storePolicy?.freeShippingThreshold}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          storePolicy: {
                            ...cmsSettings.storePolicy,
                            freeShippingThreshold: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Standard Courier Shipping Fee (₨)
                    </label>
                    <input
                      type="number"
                      value={cmsSettings.storePolicy?.standardShippingFee}
                      onChange={e =>
                        setCmsSettings({
                          ...cmsSettings,
                          storePolicy: {
                            ...cmsSettings.storePolicy,
                            standardShippingFee: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Publish All Website Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 8: SUPABASE CONFIG & BACKEND SETUP */}
        {activeTab === 'database' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                    Supabase Backend Connection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Connect your real Supabase project with PostgreSQL database, Row Level Security (RLS), and auth.
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isSupabaseConnected()
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {isSupabaseConnected() ? 'Connected' : 'Offline / Local Store Fallback'}
                </span>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900">How to Connect Supabase:</h4>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>
                    Create a free project at{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-600 underline"
                    >
                      supabase.com
                    </a>
                  </li>
                  <li>
                    Go to <strong>SQL Editor</strong>, paste and run the complete SQL script from{' '}
                    <code>/supabase-schema.sql</code> (or copy it from the box below).
                  </li>
                  <li>
                    Go to <strong>Project Settings → API</strong> and copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong>.
                  </li>
                  <li>
                    Paste them into the inputs below and click <strong>Save & Test Connection</strong>, or specify them in <code>.env</code> as <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                  </li>
                </ol>
              </div>

              <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    VITE_SUPABASE_URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-project-id.supabase.co"
                    value={dbUrl}
                    onChange={e => setDbUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    VITE_SUPABASE_ANON_KEY
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={dbKey}
                    onChange={e => setDbKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isTestingDb}
                    className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isTestingDb ? 'Testing Connection...' : 'Save & Test Connection'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCatalog}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                  >
                    Reset Demo Catalog
                  </button>
                </div>
              </form>

              {/* View SQL Schema code box */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-amber-500" />
                    <span>Supabase Database Schema & Storage (PostgreSQL with RLS)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">File: /supabase-schema.sql</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] max-h-56 overflow-y-auto leading-relaxed border border-slate-800 space-y-1">
                  <p className="text-emerald-400">✓ Tables: products, categories, orders, order_items, customers, reviews, newsletter_subscribers, site_settings</p>
                  <p className="text-amber-300">✓ Storage Bucket: aio-media (for online product photos and promotional banners)</p>
                  <p className="text-blue-300">✓ Security: Row Level Security (RLS) active on all tables. Customer orders are strictly protected.</p>
                  <p className="text-slate-400">-- Run the complete SQL script in your Supabase project SQL Editor to enable all tables and storage.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: CHANGE ADMIN PASSWORD */}
        {activeTab === 'password' && (
          <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                      <Key className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                      Change Admin Password
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Update security password for the AIO PRODUCT administrative portal.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Admin Account
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {adminCredentials?.email || 'admin@aioproduct.pk'}
                  </span>
                </div>
              </div>

              {passSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Success!</strong>
                    <span>{passSuccess}</span>
                  </div>
                </div>
              )}

              {passError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Error</strong>
                    <span>{passError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4" autoComplete="off">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                      placeholder="Enter current password"
                      value={currentPasswordInput}
                      onChange={e => setCurrentPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Default is <code>aioadmin123</code> unless previously changed.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                      placeholder="Enter new strong password"
                      value={newPasswordInput}
                      onChange={e => setNewPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Must be at least 6 characters long.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    placeholder="Repeat new password"
                    value={confirmPasswordInput}
                    onChange={e => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-[#4A6B53]" />
                    <span>Protected with encrypted session storage</span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Save New Password</span>
                  </button>
                </div>
              </form>

              {/* Security Advisory */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Administrative Security Best Practices</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                  <li>Keep your admin password confidential to protect customer orders and pricing.</li>
                  <li>Your new password takes effect immediately for all subsequent logins.</li>
                  <li>You can reset or change your password anytime directly from this menu.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT ADD/EDIT MODAL */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-950 font-['Outfit'] mb-4">
              {editingProduct.id ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (PKR ₨) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={e => {
                      const newPrice = Number(e.target.value);
                      setEditingProduct({ ...editingProduct, price: newPrice });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="95"
                      placeholder="0"
                      value={calcDiscountPercent(editingProduct.price || 0, editingProduct.compare_at_price) || ''}
                      onChange={e => {
                        const disc = Number(e.target.value);
                        const p = editingProduct.price || 0;
                        if (disc > 0 && p > 0) {
                          setEditingProduct({
                            ...editingProduct,
                            compare_at_price: calcCompareAtFromDiscount(p, disc),
                          });
                        } else {
                          setEditingProduct({
                            ...editingProduct,
                            compare_at_price: undefined,
                          });
                        }
                      }}
                      className="w-full pl-3 pr-6 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Compare at Price (PKR ₨)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.compare_at_price || ''}
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        compare_at_price: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category_id || ''}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, category_id: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock_quantity ?? 10}
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        stock_quantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <ImagePickerInput
                value={editingProduct.image_url || ''}
                onChange={url => setEditingProduct({ ...editingProduct, image_url: url })}
                label="Product Image (Device JPEG/JPG/PNG or Link)"
                presets={PRESET_IMAGES}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active ?? true}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, is_active: e.target.checked })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Active (Visible in Store)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? false}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, is_featured: e.target.checked })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between gap-2 border-t border-slate-100">
                {editingProduct.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      const idToDelete = editingProduct.id!;
                      const nameToDelete = editingProduct.name || 'Product';
                      const imgToDelete = editingProduct.image_url;
                      const priceToDelete = editingProduct.price;
                      setProductModalOpen(false);
                      setProductToDelete({
                        id: idToDelete,
                        name: nameToDelete,
                        image_url: imgToDelete,
                        price: priceToDelete,
                      });
                    }}
                    className="px-3.5 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Delete Product</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY ADD/EDIT MODAL */}
      {categoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-950 font-['Outfit'] mb-4">
              {editingCategory.id ? 'Edit Category' : 'Add Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={e =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editingCategory.image_url || ''}
                  onChange={e =>
                    setEditingCategory({ ...editingCategory, image_url: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={e =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={editingCategory.is_active ?? true}
                  onChange={e =>
                    setEditingCategory({ ...editingCategory, is_active: e.target.checked })
                  }
                  className="rounded text-amber-500"
                />
                <span>Active</span>
              </label>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Order Reference
              </span>
              <h3 className="text-xl font-black text-slate-950 font-mono">
                {selectedOrderDetails.order_number}
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900">Customer & Shipping Information</h4>
                <p>
                  <strong>Name:</strong> {selectedOrderDetails.shipping_address?.name}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedOrderDetails.shipping_address?.phone}
                </p>
                {selectedOrderDetails.shipping_address?.email && (
                  <p>
                    <strong>Email:</strong> {selectedOrderDetails.shipping_address.email}
                  </p>
                )}
                <p>
                  <strong>Address:</strong> {selectedOrderDetails.shipping_address?.address},{' '}
                  {selectedOrderDetails.shipping_address?.city},{' '}
                  {selectedOrderDetails.shipping_address?.province}
                </p>
                {selectedOrderDetails.notes && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded mt-2">
                    <strong>Delivery Notes:</strong> {selectedOrderDetails.notes}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Ordered Items</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl p-2">
                  {selectedOrderDetails.items?.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {item.product_name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.quantity} x {formatPKR(item.price)}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPKR(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-amber-600 font-black text-base">
                  {formatPKR(selectedOrderDetails.total_amount)}
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap justify-between items-center gap-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to permanently delete Order #${selectedOrderDetails.order_number}? This cannot be undone.`)) {
                      deleteOrder(selectedOrderDetails.id);
                      setSelectedOrderDetails(null);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>

                {selectedOrderDetails.shipping_address?.phone && (
                  <a
                    href={`https://wa.me/${(selectedOrderDetails.shipping_address.phone).replace(/[^0-9]/g, '').replace(/^0/, '92')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER ADD/EDIT MODAL */}
      {customerModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCustomerModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-extrabold text-slate-950 font-['Outfit']">
                {editingCustomer.id ? 'Edit Customer Details' : 'Add New Customer'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pakistan customer record, Gmail access status, and address details.
              </p>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Usman Ali"
                  value={editingCustomer.name || ''}
                  onChange={e =>
                    setEditingCustomer({ ...editingCustomer, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email / Gmail Address
                  </label>
                  <input
                    type="email"
                    placeholder="customer@gmail.com"
                    value={editingCustomer.email || ''}
                    onChange={e =>
                      setEditingCustomer({
                        ...editingCustomer,
                        email: e.target.value,
                        auth_provider: e.target.value.toLowerCase().endsWith('@gmail.com')
                          ? 'google'
                          : editingCustomer.auth_provider || 'email',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Gmail enables 1-click Google sign-in.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone (03XX) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={editingCustomer.phone || ''}
                    onChange={e =>
                      setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="House / Apartment #, Street, Block, Area"
                  value={editingCustomer.address || ''}
                  onChange={e =>
                    setEditingCustomer({ ...editingCustomer, address: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <select
                    value={editingCustomer.city || 'Lahore'}
                    onChange={e =>
                      setEditingCustomer({ ...editingCustomer, city: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {PAKISTAN_MAJOR_CITIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Province
                  </label>
                  <select
                    value={editingCustomer.province || 'Punjab'}
                    onChange={e =>
                      setEditingCustomer({ ...editingCustomer, province: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {PAKISTAN_PROVINCES.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 54000"
                    value={editingCustomer.postal_code || ''}
                    onChange={e =>
                      setEditingCustomer({ ...editingCustomer, postal_code: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={editingCustomer.status || 'active'}
                    onChange={e =>
                      setEditingCustomer({
                        ...editingCustomer,
                        status: e.target.value as 'active' | 'suspended',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sign-In Provider
                  </label>
                  <select
                    value={editingCustomer.auth_provider || 'google'}
                    onChange={e =>
                      setEditingCustomer({
                        ...editingCustomer,
                        auth_provider: e.target.value as 'google' | 'email' | 'guest',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="google">Gmail / Google Account</option>
                    <option value="email">Standard Email</option>
                    <option value="guest">Guest Checkout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions, delivery verification status, preferences..."
                  value={editingCustomer.notes || ''}
                  onChange={e =>
                    setEditingCustomer({ ...editingCustomer, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCustomerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SAFE IN-UI DELETE PRODUCT MODAL (Replaces window.confirm) */}
      {/* ======================================================== */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 text-left">
            <button
              onClick={() => {
                if (!isDeletingProduct) setProductToDelete(null);
              }}
              disabled={isDeletingProduct}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-slate-950 font-['Outfit'] mb-1">
              Delete Product?
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to permanently delete this product? It will be removed from your catalog, store, and front page.
            </p>

            {/* Product preview card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5 mb-6">
              {productToDelete.image_url ? (
                <img
                  src={productToDelete.image_url}
                  alt={productToDelete.name}
                  className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900 truncate">
                  {productToDelete.name}
                </div>
                {productToDelete.price !== undefined && (
                  <div className="text-xs font-bold text-amber-600 mt-0.5">
                    PKR {productToDelete.price.toLocaleString()}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                  ID: {productToDelete.id}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={() => handleExecuteDeleteProduct(productToDelete.id, productToDelete.name)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingProduct ? 'Deleting...' : 'Yes, Delete Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* QUICK IMAGE URL EDIT MODAL (Replaces window.prompt)       */}
      {/* ======================================================== */}
      {imageEditingRowId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-left">
            <button
              onClick={() => setImageEditingRowId(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-950 font-['Outfit'] mb-1">
              Update Product Image
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Upload a JPEG, JPG, or PNG image from your device, or enter a web link:
            </p>

            <ImagePickerInput
              value={tempRowImageUrl}
              onChange={setTempRowImageUrl}
              label=""
              presets={PRESET_IMAGES}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setImageEditingRowId(null)}
                className="px-4 py-2 border border-slate-300 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tempRowImageUrl.trim()) {
                    handleUpdateRowDraft(imageEditingRowId, {
                      image_url: tempRowImageUrl.trim(),
                    });
                  }
                  setImageEditingRowId(null);
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Apply Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
