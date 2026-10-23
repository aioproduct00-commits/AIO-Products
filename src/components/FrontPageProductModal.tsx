import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Trash2, Check, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { calcCompareAtFromDiscount, calcDiscountPercent, formatPKR } from '../lib/utils';
import { ImagePickerInput } from './ImagePickerInput';

const POPULAR_PRODUCT_IMAGES = [
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

export const FrontPageProductModal: React.FC = () => {
  const {
    frontPageEditProduct,
    setFrontPageEditProduct,
    isFrontPageProductModalOpen,
    setIsFrontPageProductModalOpen,
    saveProduct,
    deleteProduct,
    categories,
    showToast,
  } = useStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [categoryId, setCategoryId] = useState<string>('');
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (frontPageEditProduct) {
      setConfirmDelete(false);
      setName(frontPageEditProduct.name || '');
      setDescription(frontPageEditProduct.description || '');
      setImageUrl(frontPageEditProduct.image_url || POPULAR_PRODUCT_IMAGES[0].url);
      setPrice(frontPageEditProduct.price || 0);
      setCompareAtPrice(frontPageEditProduct.compare_at_price);
      setCategoryId(frontPageEditProduct.category_id || categories[0]?.id || 'cat-electronics');
      setIsFeatured(frontPageEditProduct.is_featured ?? true);
      setStockQuantity(frontPageEditProduct.stock_quantity ?? 20);

      // Compute initial discount percent
      if (frontPageEditProduct.compare_at_price && frontPageEditProduct.compare_at_price > frontPageEditProduct.price) {
        setDiscountPercent(calcDiscountPercent(frontPageEditProduct.price, frontPageEditProduct.compare_at_price));
      } else {
        setDiscountPercent(0);
      }
    }
  }, [frontPageEditProduct, categories]);

  if (!isFrontPageProductModalOpen || !frontPageEditProduct) return null;

  const isEditingExisting = Boolean(frontPageEditProduct.id);

  // When user updates discount percent, calculate compare_at_price
  const handleDiscountChange = (newDiscount: number) => {
    const clamped = Math.max(0, Math.min(95, newDiscount));
    setDiscountPercent(clamped);
    if (clamped > 0 && price > 0) {
      const calculatedCompare = calcCompareAtFromDiscount(price, clamped);
      setCompareAtPrice(calculatedCompare);
    } else {
      setCompareAtPrice(undefined);
    }
  };

  // When user updates price, update compare_at_price if discount is active
  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
    if (discountPercent > 0 && newPrice > 0) {
      setCompareAtPrice(calcCompareAtFromDiscount(newPrice, discountPercent));
    }
  };

  // When user updates compare_at_price directly, recalculate discount percent
  const handleCompareAtPriceChange = (newCompareAt: number | undefined) => {
    setCompareAtPrice(newCompareAt);
    if (newCompareAt && newCompareAt > price) {
      setDiscountPercent(calcDiscountPercent(price, newCompareAt));
    } else {
      setDiscountPercent(0);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (!price || price <= 0) {
      showToast('Please enter a valid price in PKR', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedProduct: Partial<Product> & { name: string; price: number } = {
        ...frontPageEditProduct,
        id: frontPageEditProduct.id || undefined,
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl.trim() || POPULAR_PRODUCT_IMAGES[0].url,
        price: Number(price),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : undefined,
        category_id: categoryId || categories[0]?.id || 'cat-electronics',
        stock_quantity: Number(stockQuantity),
        is_active: true,
        is_featured: isFeatured,
      };

      await saveProduct(updatedProduct);
      showToast(
        isEditingExisting
          ? `Product "${name}" updated on front page!`
          : `New product "${name}" added to front page!`,
        'success'
      );
      setIsFrontPageProductModalOpen(false);
      setFrontPageEditProduct(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to save product. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!frontPageEditProduct.id) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(frontPageEditProduct.id);
      showToast(`Product "${name}" deleted successfully.`, 'info');
      setIsFrontPageProductModalOpen(false);
      setFrontPageEditProduct(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedSavings = compareAtPrice && compareAtPrice > price ? compareAtPrice - price : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900 font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2A4734] flex items-center justify-between bg-[#182C1F] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#26422F] border border-[#3E634A] flex items-center justify-center text-[#88C49A] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-['Outfit']">
                  {isEditingExisting ? 'Edit Product' : 'Add New Product'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#88C49A]/20 text-[#88C49A] border border-[#88C49A]/30">
                  Live Editor
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Update Name, Description, Image, Price & Discount for instant live display
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsFrontPageProductModalOpen(false);
              setFrontPageEditProduct(null);
            }}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
          {/* Top Row: Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Wireless Earbuds Pro Max"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 text-sm font-semibold outline-hidden transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#ff6b00] text-sm font-semibold outline-hidden bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Key product highlights, specifications, and warranty details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 text-xs sm:text-sm font-normal outline-hidden transition-all"
            />
          </div>

          {/* Image Section (Upload JPEG/JPG/PNG from Device or Link) */}
          <ImagePickerInput
            value={imageUrl}
            onChange={setImageUrl}
            label="Product Image (Device JPEG/JPG/PNG or Link)"
            presets={POPULAR_PRODUCT_IMAGES}
          />

          {/* Pricing & Discount Grid (Price, Discount %, Compare At Price) */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Pricing & Discount (PKR)
              </span>
              {discountPercent > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ff6b00] text-white shadow-xs">
                  {discountPercent}% DISCOUNT APPLIED
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selling Price (PKR ₨) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₨</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price || ''}
                    onChange={e => handlePriceChange(Number(e.target.value))}
                    placeholder="3999"
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 focus:border-[#ff6b00] text-sm font-black bg-white"
                  />
                </div>
              </div>

              {/* Discount % Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="95"
                    value={discountPercent || ''}
                    onChange={e => handleDiscountChange(Number(e.target.value))}
                    placeholder="25"
                    className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-300 focus:border-[#ff6b00] text-sm font-black bg-white"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              {/* Compare At Price (Original / Cross-out Price) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Original Price (PKR ₨)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₨</span>
                  <input
                    type="number"
                    min="0"
                    value={compareAtPrice || ''}
                    onChange={e => handleCompareAtPriceChange(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="4999"
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 focus:border-[#ff6b00] text-sm font-black bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Quick Discount Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Discount:</span>
              {[0, 10, 15, 20, 25, 30, 50].map(disc => (
                <button
                  key={disc}
                  type="button"
                  onClick={() => handleDiscountChange(disc)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                    discountPercent === disc
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {disc === 0 ? 'No Discount' : `${disc}% OFF`}
                </button>
              ))}
            </div>

            {/* Savings preview */}
            {calculatedSavings > 0 && (
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                <span>Customer saves: <strong>{formatPKR(calculatedSavings)}</strong></span>
                <span>Badge will show: <strong>-{discountPercent}%</strong></span>
              </div>
            )}
          </div>

          {/* Front Page Visibility & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {/* Front Page Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded text-[#ff6b00] focus:ring-[#ff6b00] border-slate-300 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Show on Front Page (Featured)
                </span>
                <span className="text-[11px] text-slate-500">
                  Displays in homepage "Featured Products" section
                </span>
              </div>
            </label>

            {/* Stock Quantity */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <label className="text-xs font-bold text-slate-700">Stock Units:</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={e => setStockQuantity(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-center"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {isEditingExisting ? (
              confirmDelete ? (
                <div className="flex items-center gap-1.5 p-1 bg-rose-50 border border-rose-200 rounded-xl animate-in fade-in">
                  <span className="text-xs font-bold text-rose-700 px-1.5">Delete "{name}"?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-black text-xs shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Deleting...' : 'Confirm'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    disabled={isSubmitting}
                    className="px-2 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsFrontPageProductModalOpen(false);
                  setFrontPageEditProduct(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#ff6b00] hover:bg-[#ff7b1a] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : isEditingExisting ? 'Save Front Page Product' : 'Add to Front Page'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
