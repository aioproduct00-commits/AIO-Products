import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    shippingFee,
    cartTotal,
    siteSettings,
    setCurrentView,
  } = useStore();

  if (!isCartOpen) return null;

  const freeThreshold = siteSettings.storePolicy?.freeShippingThreshold || 2500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeThreshold - cartSubtotal);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4A6B53]" />
              <h2 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
                Your Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator (Sage Green) */}
          <div className="px-6 py-3.5 bg-[#EBF3ED] border-b border-[#D3E5D7]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-[#2F533A] flex items-center gap-1.5 font-bold">
                <Truck className="w-3.5 h-3.5 text-[#4A6B53]" />
                {remainingForFreeShipping > 0
                  ? `Add ${formatPKR(remainingForFreeShipping)} more for FREE Delivery`
                  : '🎉 Congratulations! You have unlocked FREE Express Delivery!'}
              </span>
              <span className="text-[#2F533A] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#D3E5D7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4A6B53] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Explore our curated quality products and find something you’ll love.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-white border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-slate-900 block mt-0.5">
                        {formatPKR(item.product.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded-l-md"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded-r-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-slate-950">
                        {formatPKR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-white space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPKR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping (Pakistan Courier)</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">FREE</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-950">
                  <span>Estimated Total</span>
                  <span className="text-[#2F533A] font-black">{formatPKR(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-sm shadow-lg shadow-[#4A6B53]/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Cash on Delivery Available Across Pakistan</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
