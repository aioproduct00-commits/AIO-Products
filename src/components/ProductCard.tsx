import React, { useState } from 'react';
import { ShoppingBag, Eye, Check, Star, Edit3, Share2 } from 'lucide-react';
import { Product } from '../types';
import { calcDiscountPercent, formatPKR, resolveImageUrl, FALLBACK_PRODUCT_IMAGE } from '../lib/utils';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  badgeType?: string; // Optional custom badge like 'New' or '-25%'
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, badgeType }) => {
  const { addToCart, viewProductDetails, isAdminLoggedIn, openFrontPageProductEdit, shareProduct } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = calcDiscountPercent(product.price, product.compare_at_price);
  const isOutOfStock = product.stock_quantity <= 0;

  // Review counts based on product for realistic look matching image
  const reviewCountMap: Record<string, number> = {
    'prod-1': 124,
    'prod-2': 99,
    'prod-3': 76,
    'prod-4': 63,
  };
  const count = reviewCountMap[product.id] || 48;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  // Determine badge:
  // If product is prod-2 ("Smart Watch Series 8"), show "New" green badge; else show "-25%" etc.
  let badgeLabel = '';
  let isGreenBadge = false;

  if (product.id === 'prod-2' || product.slug.includes('smart-watch')) {
    badgeLabel = 'New';
    isGreenBadge = true;
  } else if (discountPercent > 0) {
    badgeLabel = `-${discountPercent}%`;
  } else if (product.compare_at_price && product.compare_at_price > product.price) {
    badgeLabel = '-20%';
  }

  return (
    <div
      onClick={() => viewProductDetails(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full bg-[#f8f9fa] overflow-hidden flex items-center justify-center p-4">
        {/* Top Left Badge (Sage Green) */}
        {badgeLabel && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-black tracking-wide uppercase ${
                isGreenBadge
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#4A6B53] text-white'
              }`}
            >
              {badgeLabel}
            </span>
          </div>
        )}

        {/* Share Product Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            shareProduct(product);
          }}
          className={`absolute ${isAdminLoggedIn ? 'top-3 right-16' : 'top-3 right-3'} z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#4A6B53] flex items-center justify-center shadow-md border border-slate-200/80 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs`}
          title="Share this Product"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Admin Front Page Edit Button */}
        {isAdminLoggedIn && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFrontPageProductEdit(product);
            }}
            className="absolute top-3 right-3 z-20 px-2 py-1 rounded-lg bg-[#5C7F66] hover:bg-[#4B6E55] text-white text-[11px] font-black flex items-center gap-1 shadow-md border border-[#759980] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Edit on Front Page"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        )}

        <img
          src={resolveImageUrl(product.image_url)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = FALLBACK_PRODUCT_IMAGE;
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white text-left">
        <div>
          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#4A6B53] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Feature summary line */}
          <p className="mt-1 text-xs text-slate-500 line-clamp-1 leading-relaxed">
            {product.description.split('.')[0] || 'High quality guaranteed.'}
          </p>

          {/* Star rating + review count: ★★★★★ (124) */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">({count})</span>
          </div>

          {/* Price & Stock Indicator Row */}
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-[#3B5D45]">
                {formatPKR(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPKR(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* In Stock Dot */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4A6B53]" />
              <span className="text-xs font-semibold text-[#3D6B49]">In Stock</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Add to Cart (Sage Green) & View Details (Deep Forest Pine) */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#4A6B53] hover:bg-[#3D5B45] text-white active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : isOutOfStock ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              viewProductDetails(product);
            }}
            className="py-2.5 px-2 rounded-xl bg-[#192C20] hover:bg-[#253D2E] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
