import React from 'react';
import { ArrowRight, Plus, Edit3 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CategoriesSection: React.FC = () => {
  const { categories, setSelectedCategory, setCurrentView, isAdminLoggedIn, openLiveEdit } = useStore();

  const activeCategories = categories.filter(c => c.is_active);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block mb-1">
              SHOP BY CATEGORY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-['Outfit'] tracking-tight">
              Explore Our Categories
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => openLiveEdit('category')}
                className="px-3 py-1.5 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Category</span>
              </button>
            )}

            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('categories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-slate-800 hover:text-[#4A6B53] flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {activeCategories.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative bg-[#f7f8fa] hover:bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 hover:border-[#A9C4B0] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Admin Edit Button */}
              {isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLiveEdit('category', cat);
                  }}
                  className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-md bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-[10px] font-bold flex items-center gap-1 shadow-md border border-[#759980] transition-all cursor-pointer"
                  title="Edit Category"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}

              {/* Product Category Photo */}
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                />
              </div>

              {/* Title & Subtitle + Circular Action Arrow Button */}
              <div className="flex items-center justify-between gap-1 pt-1 px-1 pb-1">
                <div className="min-w-0 pr-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#4A6B53] transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                    {cat.description || 'Explore products'}
                  </p>
                </div>

                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#182C1F] text-white flex items-center justify-center shrink-0 group-hover:bg-[#4A6B53] transition-colors">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
