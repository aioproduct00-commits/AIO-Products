import React from 'react';
import { ArrowRight, Sparkles, Layers, ArrowLeft, Plus, Edit3 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CategoriesView: React.FC = () => {
  const { categories, products, setSelectedCategory, setCurrentView, goBack, isAdminLoggedIn, openLiveEdit } = useStore();

  const activeCategories = categories.filter(c => c.is_active);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 py-8 sm:py-12 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#4A6B53] text-xs font-bold shadow-xs transition-all hover:-translate-x-0.5 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#4A6B53]" />
            <span>Back to Home</span>
          </button>

          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={() => openLiveEdit('category')}
              className="px-3.5 py-1.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Category</span>
            </button>
          )}
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3ED] text-[#2F533A] text-xs font-bold uppercase tracking-wider mb-3 border border-[#D3E5D7]">
            <Layers className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Product Collections</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit'] tracking-tight">
            Browse All Categories
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Carefully selected product categories designed for reliability, comfort, and everyday convenience in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeCategories.map(cat => {
            const catProducts = products.filter(
              p => p.category_id === cat.id && p.is_active
            );
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-[#A9C4B0] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Admin Edit Button */}
                {isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLiveEdit('category', cat);
                    }}
                    className="absolute top-4 right-4 z-20 px-3 py-1 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#759980] transition-all cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}

                <div className="h-64 sm:h-72 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs font-bold text-[#88C49A] uppercase tracking-wider block mb-1">
                      {catProducts.length} {catProducts.length === 1 ? 'Product' : 'Products'}
                    </span>
                    <h3 className="text-2xl font-black font-['Outfit']">{cat.name}</h3>
                  </div>
                </div>

                <div className="p-6 flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm line-clamp-2">
                    {cat.description || 'Explore high quality selections in this category.'}
                  </p>
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#4A6B53] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
