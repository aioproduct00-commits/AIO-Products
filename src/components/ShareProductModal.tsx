import React, { useState } from 'react';
import { X, Check, Copy, Share2, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { formatPKR, resolveImageUrl, FALLBACK_PRODUCT_IMAGE } from '../lib/utils';
import { useStore } from '../context/StoreContext';

interface ShareProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ShareProductModal: React.FC<ShareProductModalProps> = ({ product, onClose }) => {
  const { showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?product=${product.id}`
      : `https://aioproduct.pk/?product=${product.id}`;

  const shareText = `Check out "${product.name}" on AIO PRODUCT (Price: ${formatPKR(product.price)} with Cash on Delivery across Pakistan!): ${productUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productUrl);
    }
    setCopied(true);
    showToast('Product link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on AIO PRODUCT:`,
          url: productUrl,
        });
        showToast('Shared successfully!', 'success');
        onClose();
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on AIO PRODUCT:`)}&url=${encodeURIComponent(productUrl)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-950 font-['Outfit']">
                Share Product
              </h3>
              <p className="text-[11px] text-slate-500">Share with friends, family, or social media</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snippet */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img
              src={resolveImageUrl(product.image_url)}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={e => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = FALLBACK_PRODUCT_IMAGE;
              }}
            />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
              {product.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-black text-amber-700">
                {formatPKR(product.price)}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                Cash on Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] transition-all cursor-pointer group"
          >
            <svg
              className="w-6 h-6 fill-current text-[#25D366] group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.044-1.015-.069-.242-.072-.557-.177-.962-.352-1.708-.737-2.822-2.457-2.907-2.571-.085-.113-.693-.923-.693-1.761s.438-1.25.594-1.421c.156-.171.341-.214.455-.214.114 0 .228.001.328.006.106.006.249-.04.389.297.144.352.493 1.203.536 1.29.043.086.071.187.014.3-.057.114-.085.185-.171.285-.085.1-.179.224-.256.3-.086.086-.176.179-.076.35.1.171.444.733.953 1.186.657.585 1.21.766 1.382.852.171.086.271.071.371-.043.1-.114.428-.499.542-.67.114-.172.229-.143.386-.086.157.057 1.001.472 1.172.557.171.086.286.129.328.2.043.072.043.414-.101.819z" />
            </svg>
            <span className="text-xs font-bold text-slate-800 mt-1.5">WhatsApp</span>
          </a>

          {/* Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] transition-all cursor-pointer group"
          >
            <svg
              className="w-6 h-6 fill-current text-[#1877F2] group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M9.945 22v-8.834H7V9.485h2.945V6.702c0-2.909 1.777-4.493 4.37-4.493 1.243 0 2.544.222 2.544.222v2.796h-1.433c-1.442 0-1.892.894-1.892 1.813v2.445h3.153l-.504 3.681h-2.649V22h-3.589z" />
            </svg>
            <span className="text-xs font-bold text-slate-800 mt-1.5">Facebook</span>
          </a>

          {/* Twitter / X */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 transition-all cursor-pointer group"
          >
            <svg
              className="w-5 h-5 fill-current text-slate-900 group-hover:scale-110 transition-transform my-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-xs font-bold text-slate-800 mt-1.5">Twitter / X</span>
          </a>
        </div>

        {/* Copy Link Row */}
        <div className="mt-4 space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider text-left">
            Or Copy Direct Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={productUrl}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50 text-slate-800 select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 hover:bg-slate-800 text-white active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-left pt-0.5">
            Anyone clicking this link will open this exact product directly with Cash on Delivery.
          </p>
        </div>

        {/* Device Share Button (if supported) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Share2 className="w-4 h-4 text-amber-500" />
              <span>More Apps (Instagram, SMS, Bluetooth, etc.)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
