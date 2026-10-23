import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { formatPKR } from '../lib/utils';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedSort,
    setSelectedSort,
    inStockOnly,
    setInStockOnly,
    maxPriceFilter,
    setMaxPriceFilter,
    goBack,
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Maximum price in current catalog
  const highestPrice = Math.max(10000, ...products.map(p => p.price || 0));

  // Filter products
  const filteredProducts = products.filter(p => {
    if (!p.is_active) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category
    if (selectedCategory && p.category_id !== selectedCategory) {
      return false;
    }

    // Stock
    if (inStockOnly && p.stock_quantity <= 0) {
      return false;
    }

    // Price
    if (p.price > maxPriceFilter) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'price-asc') return a.price - b.price;
    if (selectedSort === 'price-desc') return b.price - a.price;
    if (selectedSort === 'newest') {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    }
    // 'featured'
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setInStockOnly(false);
    setMaxPriceFilter(highestPrice);
    setSelectedSort('featured');
  };

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="bg-slate-50 py-8 sm:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#4A6B53] text-xs font-bold shadow-xs mb-3 transition-all hover:-translate-x-0.5 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#4A6B53]" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block mb-1">
            AIO PRODUCT Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit'] tracking-tight">
            {activeCategoryObj ? activeCategoryObj.name : 'All Products'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Showing {sortedProducts.length} of {products.filter(p => p.is_active).length} items
            available for nationwide Pakistan delivery.
          </p>
        </div>

        {/* Top Filter Bar (Search, Sort, Mobile Filter Toggle) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Sort By:</span>
              <select
                value={selectedSort}
                onChange={e => setSelectedSort(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-500" />
                  <span>Filter Products</span>
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === null
                        ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-500'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[11px] text-slate-400">
                      {products.filter(p => p.is_active).length}
                    </span>
                  </button>
                  {categories
                    .filter(c => c.is_active)
                    .map(cat => {
                      const count = products.filter(
                        p => p.category_id === cat.id && p.is_active
                      ).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                            selectedCategory === cat.id
                              ? 'bg-[#EBF3ED] text-[#2F533A] font-bold border-l-4 border-[#4A6B53]'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="line-clamp-1">{cat.name}</span>
                          <span className="text-[11px] text-slate-400">{count}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-[#3B5D45]">
                    {formatPKR(maxPriceFilter)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={highestPrice || 10000}
                  step={200}
                  value={maxPriceFilter}
                  onChange={e => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#4A6B53] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₨ 1,000</span>
                  <span>{formatPKR(highestPrice)}</span>
                </div>
              </div>

              {/* Stock Filter */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    In Stock Only
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No products match your criteria</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try adjusting your filters, clearing the search keyword, or selecting a different category.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold shadow-xs hover:bg-slate-800"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/60 backdrop-blur-xs">
          <div className="w-4/5 max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Categories
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                    selectedCategory === null ? 'bg-amber-100 text-amber-900' : 'text-slate-600'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.id);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                      selectedCategory === c.id ? 'bg-amber-100 text-amber-900' : 'text-slate-600'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Max Price</span>
                <span className="text-amber-600">{formatPKR(maxPriceFilter)}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={highestPrice || 10000}
                step={200}
                value={maxPriceFilter}
                onChange={e => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* In stock */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-xs font-semibold text-slate-700">In Stock Only</span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
        </div>
      )}
    </div>
  );
};
