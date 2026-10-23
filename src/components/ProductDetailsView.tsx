import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Star,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  Zap,
  Edit3,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { calcDiscountPercent, calcSavingsPKR, formatPKR, formatDate, resolveImageUrl, FALLBACK_PRODUCT_IMAGE } from '../lib/utils';
import { ProductCard } from './ProductCard';

export const ProductDetailsView: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setCurrentView,
    addToCart,
    products,
    categories,
    reviews,
    writeReview,
    showToast,
    shareProduct,
    goBack,
    isAdminLoggedIn,
    openFrontPageProductEdit,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'shipping'>('desc');

  // Review modal inside product page
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-600">Product not found.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === selectedProduct.category_id);
  const discountPercent = calcDiscountPercent(selectedProduct.price, selectedProduct.compare_at_price);
  const savings = calcSavingsPKR(selectedProduct.price, selectedProduct.compare_at_price);
  const isOutOfStock = selectedProduct.stock_quantity <= 0;

  // Product specific reviews
  const productReviews = reviews.filter(
    r => r.product_id === selectedProduct.id && r.is_approved
  );

  // Related products
  const relatedProducts = products
    .filter(
      p =>
        p.id !== selectedProduct.id &&
        (p.category_id === selectedProduct.category_id || p.is_featured) &&
        p.is_active
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    setIsSubmittingReview(true);
    await writeReview({
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      customer_name: reviewName.trim(),
      rating: reviewRating,
      review_text: reviewText.trim(),
    });

    setIsSubmittingReview(false);
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
  };

  const handleShare = () => {
    shareProduct(selectedProduct);
  };

  return (
    <div className="bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#4A6B53] bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-all hover:-translate-x-0.5 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-[#4A6B53]" />
            <span>Back to previous page</span>
          </button>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => openFrontPageProductEdit(selectedProduct)}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#4A6B53] hover:bg-[#3D5B45] px-3.5 py-1.5 rounded-lg border border-[#5C7F66] shadow-sm transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Product</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 bg-white px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 sm:p-10 lg:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Product Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={resolveImageUrl(selectedProduct.image_url)}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain object-center p-2"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = FALLBACK_PRODUCT_IMAGE;
                  }}
                />

                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-[#4A6B53] text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider border border-white/10">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category & Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">
                    {category?.name || 'AIO Collection'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-slate-500">
                    SKU: {selectedProduct.slug.slice(0, 10).toUpperCase()}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 font-['Outfit'] tracking-tight leading-tight">
                  {selectedProduct.name}
                </h1>

                {/* Rating summary */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-900">4.9 / 5</span>
                  <span className="text-xs text-slate-400">
                    ({productReviews.length} customer reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-6 p-4 rounded-2xl bg-[#F4F7F4] border border-[#D5E4D8] flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#2D4D36] font-['Outfit']">
                    {formatPKR(selectedProduct.price)}
                  </span>
                  {selectedProduct.compare_at_price && selectedProduct.compare_at_price > selectedProduct.price && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        {formatPKR(selectedProduct.compare_at_price)}
                      </span>
                      <span className="text-xs font-bold text-[#204529] bg-[#E1EDE4] px-2 py-0.5 rounded-md border border-[#C5DDCB]">
                        Save {formatPKR(savings)}
                      </span>
                    </>
                  )}
                </div>

                {/* Short Description */}
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Stock Status */}
                <div className="mt-6 flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOutOfStock
                        ? 'bg-rose-500'
                        : selectedProduct.stock_quantity < 5
                        ? 'bg-amber-500'
                        : 'bg-[#4A6B53]'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {isOutOfStock
                      ? 'Out of Stock'
                      : `In Stock — ${selectedProduct.stock_quantity} units available for dispatch`}
                  </span>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(selectedProduct.stock_quantity, quantity + 1))
                        }
                        disabled={quantity >= selectedProduct.stock_quantity || isOutOfStock}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                        isOutOfStock
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : justAdded
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                          : 'bg-[#4A6B53] hover:bg-[#3D5B45] text-white shadow-[#4A6B53]/25 active:scale-98'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : isOutOfStock ? (
                        <span>Currently Unavailable</span>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>Add to Cart • {formatPKR(selectedProduct.price * quantity)}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Instant Buy Now Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isOutOfStock) return;
                      addToCart(selectedProduct, quantity);
                      setCurrentView('checkout');
                    }}
                    disabled={isOutOfStock}
                    className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm bg-[#192C20] hover:bg-[#253D2E] text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-[#88C49A]" />
                    <span>Buy Now — Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-left">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#4A6B53] shrink-0" />
                  <span className="text-[11px] font-medium text-slate-700">Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-700">7-Day Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-700">100% Genuine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tabs (Description, Reviews, Shipping Info) */}
          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="flex gap-4 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3 text-sm font-bold transition-colors ${
                  activeTab === 'desc'
                    ? 'border-b-2 border-[#4A6B53] text-[#2F533A]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Product Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-sm font-bold transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#4A6B53] text-[#2F533A]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Customer Reviews ({productReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 text-sm font-bold transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-b-2 border-[#4A6B53] text-[#2F533A]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pakistan Delivery & COD
              </button>
            </div>

            {/* Tab 1: Description */}
            {activeTab === 'desc' && (
              <div className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                <p>{selectedProduct.description}</p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Why buy from AIO PRODUCT?
                  </h4>
                  <p className="text-xs text-slate-600">
                    Because Brand Matters — we don&apos;t just sell products; we curate items that solve everyday needs. Every order is inspected before dispatch from our warehouse in Pakistan.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {productReviews.length > 0 ? (
                  <div className="space-y-4">
                    {productReviews.map(r => (
                      <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < r.rating ? 'fill-current text-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400">{formatDate(r.created_at)}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 italic mb-2">
                          &quot;{r.review_text}&quot;
                        </p>
                        <span className="text-xs font-bold text-slate-900">{r.customer_name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No approved reviews for this product yet. Be the first to review it below!
                  </p>
                )}

                {/* Submit review for this product */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">
                    Add a Review for {selectedProduct.name}
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bilal Ahmed (Islamabad)"
                        value={reviewName}
                        onChange={e => setReviewName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                      <div className="flex gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setReviewRating(s)}
                            className="p-1 focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= reviewRating ? 'fill-current text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Review</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="How did this product perform?"
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-4 py-2 bg-slate-950 text-white rounded-lg text-xs font-bold"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit for Approval'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 3: Shipping */}
            {activeTab === 'shipping' && (
              <div className="text-slate-600 text-xs sm:text-sm space-y-3">
                <p>
                  <strong>Cash on Delivery:</strong> Available across all major cities and rural areas of Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and Quetta.
                </p>
                <p>
                  <strong>Delivery Timeline:</strong> Major cities: 2 to 3 business days. Other regions: 3 to 5 business days via trusted logistics partners (TCS, Leopards, Trax).
                </p>
                <p>
                  <strong>Inspection Guarantee:</strong> All orders come with a 7-day checking warranty. If there is any defect, our WhatsApp support will assist you immediately with a quick replacement.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-2xl font-extrabold text-slate-950 font-['Outfit'] mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
