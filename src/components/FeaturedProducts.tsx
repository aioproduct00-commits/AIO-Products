import React from 'react';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const FeaturedProducts: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory, isAdminLoggedIn, openFrontPageProductEdit } = useStore();

  const activeProducts = products.filter(p => p.is_active);

  // Take all featured products if any, otherwise fallback to first 4 active
  const featured = activeProducts.filter(p => p.is_featured);
  const displayProducts = featured.length > 0 ? featured : activeProducts.slice(0, 4);

  const handleViewAll = () => {
    setSelectedCategory(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-[#F4F8F5] text-slate-900 border-b border-[#DDE7E1] font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#4A6B53] text-white text-[11px] font-black uppercase tracking-wider border border-[#5C7F66]">
                TRENDING NOW
              </span>
              {isAdminLoggedIn && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4A6B53]/15 text-[#2B4B34] border border-[#4A6B53]/30 text-[10px] font-extrabold uppercase tracking-wide">
                  <Sparkles className="w-3 h-3 text-[#4A6B53]" />
                  <span>Front Page Editing Active</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#172E20] font-['Outfit'] tracking-tight">
              Featured Products
            </h2>
            {isAdminLoggedIn && (
              <p className="text-xs text-slate-600 pt-0.5">
                Click <span className="text-[#4A6B53] font-bold">Edit</span> on any card to update Name, Description, Image, Price & Discount, or add new items below.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => openFrontPageProductEdit()}
                className="px-3.5 py-2 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Front Page Product</span>
              </button>
            )}

            <button
              onClick={handleViewAll}
              className="text-xs font-bold text-[#2D4B36] hover:text-[#172E20] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* Admin Add Card Shortcut */}
          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={() => openFrontPageProductEdit()}
              className="group min-h-[340px] flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#88C49A] hover:border-[#4A6B53] bg-white/60 hover:bg-white transition-all text-center cursor-pointer shadow-xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#4A6B53] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-[#172E20] text-base font-['Outfit']">
                Add Front Page Product
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                Add a new product row with Name, Description, Image, Price & Discount
              </p>
              <span className="mt-4 px-3 py-1 rounded-lg bg-[#EDF4F0] text-[#2D4B36] text-xs font-bold border border-[#D5E3DA]">
                + Add Row Now
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
