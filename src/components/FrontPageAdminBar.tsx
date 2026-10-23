import React from 'react';
import { Sparkles, Plus, Settings, Eye, CheckCircle2, Layers, Megaphone, PhoneCall, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FrontPageAdminBar: React.FC = () => {
  const {
    isAdminLoggedIn,
    isFrontPageEditMode,
    setIsFrontPageEditMode,
    setCurrentView,
    openFrontPageProductEdit,
    openLiveEdit,
    products,
  } = useStore();

  if (!isAdminLoggedIn) return null;

  const featuredCount = products.filter(p => p.is_active && p.is_featured).length;

  return (
    <div className="bg-[#243F2E] text-white border-b border-[#3B6149] sticky top-0 z-50 px-3 sm:px-6 py-2 shadow-md backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Indicator & Title */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#A5D9B7] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-[#A5D9B7] font-['Outfit'] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Live Site Editor</span>
          </span>
          <span className="hidden sm:inline-block text-white/40 text-xs">•</span>
          <span className="text-[11px] text-white/85 hidden md:inline-block">
            Every item is clickable & editable live on the website
          </span>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add product button */}
          <button
            type="button"
            onClick={() => openFrontPageProductEdit()}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F2F7F4] text-[#243F2E] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#243F2E]" />
            <span>+ Add Product</span>
          </button>

          {/* Add Category */}
          <button
            type="button"
            onClick={() => openLiveEdit('category')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            title="Create a new category"
          >
            <Layers className="w-3 h-3 text-[#A5D9B7]" />
            <span className="hidden sm:inline">+ Category</span>
          </button>

          {/* Edit Hero */}
          <button
            type="button"
            onClick={() => openLiveEdit('hero')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            title="Edit Hero Headline, Badge & Image"
          >
            <Sparkles className="w-3 h-3 text-[#A5D9B7]" />
            <span className="hidden lg:inline">Hero</span>
          </button>

          {/* Edit Contact */}
          <button
            type="button"
            onClick={() => openLiveEdit('contact')}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            title="Edit WhatsApp, Phone & Store Details"
          >
            <PhoneCall className="w-3 h-3 text-[#A5D9B7]" />
            <span className="hidden lg:inline">Contact</span>
          </button>

          {/* Full Admin Dashboard */}
          <button
            type="button"
            onClick={() => setCurrentView('admin')}
            className="px-3 py-1.5 rounded-lg bg-[#182C1F] hover:bg-[#122218] text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-[#A5D9B7]" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
