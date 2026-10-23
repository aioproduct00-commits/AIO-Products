import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Truck,
  Shield,
  CreditCard,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Heart,
  FolderOpen,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../lib/utils';

interface NavbarProps {
  onOpenTrackOrder: () => void;
  onOpenAdminModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrackOrder }) => {
  const {
    siteSettings,
    cartItemCount,
    setIsCartOpen,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    products,
    categories,
    viewProductDetails,
    setSelectedCategory,
    currentCustomer,
    setIsCustomerAuthModalOpen,
    goBack,
    canGoBack,
    selectedProduct,
    showToast,
    openLoveSorryModal,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Suggestions for live search preview
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (viewName: string) => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    if (viewName === 'shop') {
      setSelectedCategory(null);
    }
    setCurrentView(viewName as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelect = (product: any) => {
    setSearchQuery('');
    viewProductDetails(product);
  };

  return (
    <header className="sticky top-0 z-40 w-full font-sans">
      {/* Top Announcement Bar (Rich Sage Green background with clean white icons and text) */}
      <div className="bg-[#2D4837] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-[#3C6149]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: 3 Value Props */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar font-medium">
            <div className="flex items-center gap-1.5 whitespace-nowrap text-white/90 hover:text-white transition-colors">
              <Truck className="w-3.5 h-3.5 text-[#A5D9B7]" />
              <span>Nationwide Delivery Across Pakistan</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 whitespace-nowrap text-white/90 hover:text-white transition-colors">
              <CreditCard className="w-3.5 h-3.5 text-[#A5D9B7]" />
              <span>Cash on Delivery Available</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap text-white/90 hover:text-white transition-colors">
              <RotateCcw className="w-3.5 h-3.5 text-[#A5D9B7]" />
              <span>7-Day Easy Return</span>
            </div>
          </div>

          {/* Right: Track Order + Admin Portal + Currency selector */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenTrackOrder}
              className="flex items-center gap-1.5 text-white/90 hover:text-white font-medium text-[11px] sm:text-xs transition-colors cursor-pointer group"
              title="Track Your Order"
            >
              <Truck className="w-3.5 h-3.5 text-[#A5D9B7] group-hover:scale-110 transition-transform" />
              <span>Track Order</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('media')}
              className="flex items-center gap-1.5 text-white/90 hover:text-white font-medium text-[11px] sm:text-xs transition-colors cursor-pointer group"
              title="Media Library & Catalogs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#A5D9B7] group-hover:scale-110 transition-transform" />
              <span>Media Library</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1.5 text-white/90 hover:text-white font-medium text-[11px] sm:text-xs transition-colors cursor-pointer group"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-[#A5D9B7] group-hover:scale-110 transition-transform" />
              <span>Admin</span>
            </button>

            {/* Special "I Love You" & Sorry button */}
            <button
              type="button"
              onClick={openLoveSorryModal}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 hover:bg-rose-500/50 text-white font-bold text-[11px] sm:text-xs transition-all border border-rose-300/40 cursor-pointer shadow-xs active:scale-95 group"
              title="Click for Special Message ❤️"
            >
              <Heart className="w-3 h-3 fill-rose-300 text-rose-300 group-hover:scale-125 transition-transform" />
              <span>I Love You ❤️</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Store currency is set to Pakistani Rupee (PKR ₨) for Cash on Delivery nationwide.', 'info')}
              className="hidden sm:flex items-center gap-1 text-white/90 hover:text-white font-semibold text-[11px] shrink-0 cursor-pointer transition-colors"
              title="All prices in Pakistani Rupees (PKR)"
            >
              <span className="text-sm">🇵🇰</span>
              <span>PKR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header (Crisp Luminous White background with soft sage accents) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#E0EAE3] px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-[#2D4837] hover:text-[#4A6B53] hover:bg-[#F2F7F4]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & In-Site Back Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {canGoBack && (
              <button
                type="button"
                onClick={goBack}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F2F7F4] hover:bg-[#4A6B53] hover:text-white active:scale-95 text-[#2D4837] text-xs font-bold flex items-center gap-1.5 transition-all border border-[#D5E3DA] cursor-pointer shadow-xs group"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('home')}
              className="text-left group focus:outline-none"
            >
              <div className="flex items-baseline">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1B3224] font-['Outfit'] uppercase">
                  AIO PRODUCT
                </span>
                <span className="text-2xl font-black text-[#4A6B53]">.</span>
              </div>
              <p className="text-[11px] font-bold text-[#4A6B53] tracking-tight">
                Because Brand Matters.
              </p>
            </button>
          </div>

          {/* Center Navigation Links (Deep Sage text, active sage underline) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors py-1 relative ${
                currentView === 'home'
                  ? 'text-[#1B3224] font-bold'
                  : 'text-slate-600 hover:text-[#4A6B53]'
              }`}
            >
              <span>Home</span>
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A6B53] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('shop')}
              className={`transition-colors py-1 relative ${
                currentView === 'shop'
                  ? 'text-[#1B3224] font-bold'
                  : 'text-slate-600 hover:text-[#4A6B53]'
              }`}
            >
              <span>Shop</span>
              {currentView === 'shop' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A6B53] rounded-full" />
              )}
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`flex items-center gap-1 transition-colors py-1 ${
                  currentView === 'categories'
                    ? 'text-[#1B3224] font-bold'
                    : 'text-slate-600 hover:text-[#4A6B53]'
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    categoriesDropdownOpen ? 'rotate-180 text-[#4A6B53]' : 'text-slate-400'
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-[#D5E3DA] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    Select Collection
                  </div>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleCategorySelect(c.id)}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:text-[#1B3224] hover:bg-[#F2F7F4] flex items-center justify-between transition-colors"
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-slate-400">→</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => handleNavClick('categories')}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#4A6B53] hover:bg-[#F2F7F4]"
                    >
                      View All Categories
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('media')}
              className={`transition-colors py-1 relative flex items-center gap-1.5 ${
                currentView === 'media'
                  ? 'text-[#1B3224] font-bold'
                  : 'text-slate-600 hover:text-[#4A6B53]'
              }`}
            >
              <span>Media Library</span>
              {currentView === 'media' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A6B53] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors py-1 relative ${
                currentView === 'about'
                  ? 'text-[#1B3224] font-bold'
                  : 'text-slate-600 hover:text-[#4A6B53]'
              }`}
            >
              <span>About</span>
              {currentView === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A6B53] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors py-1 relative ${
                currentView === 'contact'
                  ? 'text-[#1B3224] font-bold'
                  : 'text-slate-600 hover:text-[#4A6B53]'
              }`}
            >
              <span>Contact</span>
              {currentView === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A6B53] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Actions: Pill Search Input + User Icon + Cart Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Pill Input */}
            <div className="relative hidden sm:block">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleNavClick('shop');
                    }
                  }}
                  className="w-48 md:w-56 lg:w-64 pl-4 pr-9 py-2 rounded-full bg-[#F5F8F6] border border-[#D5E3DA] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#4A6B53] focus:ring-1 focus:ring-[#4A6B53] transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleNavClick('shop')}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-[#4A6B53] transition-colors cursor-pointer"
                  title="Search products"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Live search dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#D5E3DA] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {searchResults.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleProductSelect(p)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#F2F7F4] transition-colors text-left"
                        >
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{p.name}</h5>
                            <span className="text-[11px] font-bold text-[#4A6B53]">
                              {formatPKR(p.price)}
                            </span>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => handleNavClick('shop')}
                        className="w-full py-2 bg-[#F5F8F6] text-center text-xs font-bold text-[#4A6B53] hover:bg-[#EDF3EF]"
                      >
                        See all results in Shop
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No products found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => handleNavClick('shop')}
              className="sm:hidden p-2 text-[#2D4837] hover:text-[#4A6B53]"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Special "I Love You" & Sorry Button */}
            <button
              type="button"
              onClick={openLoveSorryModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 group"
              title="Click me for a special message ❤️"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 group-hover:scale-125 transition-transform" />
              <span className="hidden sm:inline">I Love You ❤️</span>
            </button>

            {/* User Account / Gmail Login Icon */}
            <button
              onClick={() => setIsCustomerAuthModalOpen(true)}
              className="p-1 sm:p-1.5 text-[#2D4837] hover:text-[#4A6B53] transition-colors relative flex items-center gap-1.5"
              title={currentCustomer ? `Signed in as ${currentCustomer.name}` : "Sign In with Gmail / Account"}
            >
              {currentCustomer ? (
                <div className="relative">
                  <img
                    src={
                      currentCustomer.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentCustomer.name)}&background=4A6B53&color=fff`
                    }
                    alt={currentCustomer.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#4A6B53]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full" />
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {/* Cart Icon with Sage Green Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#2D4837] hover:text-[#4A6B53] transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#4A6B53] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-sm bg-[#132218] h-full shadow-2xl flex flex-col justify-between p-6 border-r border-white/10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <span className="text-xl font-black tracking-tight text-white font-['Outfit'] uppercase">
                    AIO PRODUCT
                  </span>
                  <span className="text-xl font-black text-[#88C49A]">.</span>
                  <p className="text-[10px] font-semibold text-[#88C49A] uppercase">
                    Because Brand Matters.
                  </p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="py-6 space-y-2">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                    currentView === 'home'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('shop')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                    currentView === 'shop'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => handleNavClick('categories')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                    currentView === 'categories'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Categories
                </button>
                <button
                  onClick={() => handleNavClick('media')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 ${
                    currentView === 'media'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <FolderOpen className="w-4 h-4 text-[#88C49A]" />
                  <span>Media Library</span>
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                    currentView === 'about'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                    currentView === 'contact'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Contact
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoveSorryModal();
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                    <span>I Love You ❤️ (Sorry)</span>
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Admin Dashboard
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackOrder();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#88C49A]" />
                <span>Track Your Order</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                Pakistan Cash on Delivery Nationwide
              </p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Non-Home In-Site Back & Breadcrumb Bar */}
      {currentView !== 'home' && (
        <div className="bg-[#111F15] border-b border-white/10 py-2 px-4 sm:px-6 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-2 font-bold text-slate-200 hover:text-[#88C49A] transition-colors group cursor-pointer"
            >
              <span className="w-6 h-6 rounded-lg bg-white/10 group-hover:bg-[#4A6B53] group-hover:text-white text-slate-200 flex items-center justify-center transition-colors shadow-xs">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </span>
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-[#88C49A] font-bold uppercase tracking-wider">
                {currentView === 'product-details'
                  ? (selectedProduct?.name?.slice(0, 28) + '...')
                  : currentView}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
