import React, { useState } from 'react';
import { ArrowRight, Star, CheckCircle2, Edit3, Plus, X, MessageSquareQuote } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../lib/utils';

export const AboutAndReviewsSection: React.FC = () => {
  const { setCurrentView, siteSettings, reviews, isAdminLoggedIn, openLiveEdit, writeReview, showToast } = useStore();

  const [isCustomerReviewOpen, setIsCustomerReviewOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerRating, setCustomerRating] = useState(5);
  const [customerText, setCustomerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const about = siteSettings.about || {
    heading: 'Because Brand Matters.',
    tagline: 'Because Brand Matters.',
    description:
      'AIO PRODUCT is a modern online shopping brand focused on bringing useful, quality, and carefully selected products to customers in Pakistan. We aim to provide a simple, trustworthy, convenient, and enjoyable shopping experience.',
  };

  const defaultReviews = [
    {
      id: 'rev-seed-1',
      customer_name: 'Ahmed Raza',
      rating: 5,
      created_at: '2025-04-12T10:00:00Z',
      review_text: 'Amazing quality and very fast delivery. Highly recommended!',
    },
    {
      id: 'rev-seed-2',
      customer_name: 'Ayesha Khan',
      rating: 5,
      created_at: '2025-04-08T10:00:00Z',
      review_text: 'Original products and great customer service. Will shop again!',
    },
    {
      id: 'rev-seed-3',
      customer_name: 'Usman Ali',
      rating: 5,
      created_at: '2025-04-02T10:00:00Z',
      review_text: 'Best online shopping experience in Pakistan. Keep it up!',
    },
  ];

  const displayReviews = reviews && reviews.length > 0 ? reviews.slice(0, 3) : defaultReviews;

  const handleCustomerReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerText.trim()) {
      showToast('Please enter your name and review message.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await writeReview({
        product_id: 'general-store',
        product_name: 'AIO PRODUCT Store Experience',
        customer_name: customerName.trim(),
        rating: customerRating,
        review_text: customerText.trim(),
      });
      setCustomerName('');
      setCustomerText('');
      setCustomerRating(5);
      setIsCustomerReviewOpen(false);
      showToast('Thank you! Your review has been submitted.', 'success');
    } catch {
      showToast('Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-white font-sans border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: ABOUT AIO PRODUCT */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 items-start relative">
            {/* Storefront Image */}
            <div
              onClick={() => {
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full md:w-5/12 aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full rounded-2xl overflow-hidden bg-slate-900 relative shadow-md shrink-0 cursor-pointer group"
              title="Click to view About AIO PRODUCT"
            >
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="AIO PRODUCT Storefront"
                className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                <span className="text-base font-black font-['Outfit'] uppercase tracking-tight">
                  AIO PRODUCT.
                </span>
                <span className="text-[10px] text-[#88C49A] font-semibold">
                  Because Brand Matters.
                </span>
              </div>
            </div>

            {/* Content & 4 Value Badges */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block">
                  ABOUT AIO PRODUCT
                </span>

                {isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={() => openLiveEdit('about')}
                    className="px-2.5 py-1 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit About</span>
                  </button>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
                {about.heading || 'Because Brand Matters.'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {about.description}
              </p>

              {/* 4 Pillars in 2x2 grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Quality Products</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Trusted Shopping</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Convenience For You</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Customer Satisfaction</span>
                </div>
              </div>

              {/* Learn More Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: CUSTOMER REVIEWS */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block mb-1">
                  CUSTOMER REVIEWS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
                  What Our Customers Say
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomerReviewOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#2C4E36] text-[11px] font-bold flex items-center gap-1 border border-emerald-200 shadow-2xs transition-all cursor-pointer"
                  title="Write your own review"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5 text-[#4A6B53]" />
                  <span>+ Write Review</span>
                </button>

                {isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={() => openLiveEdit('review')}
                    className="px-2.5 py-1 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Admin Review</span>
                  </button>
                )}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-3 pt-1">
              {displayReviews.map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#f8f9fa] border border-slate-100 flex items-start gap-3 hover:bg-white hover:border-[#A9C4B0] hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#EBF3ED] text-[#2F533A] font-black text-sm flex items-center justify-center shrink-0 border border-[#D3E5D7]">
                    {rev.customer_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{rev.customer_name}</h4>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {rev.created_at ? formatDate(rev.created_at) : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      &quot;{rev.review_text}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Write Review Modal */}
      {isCustomerReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsCustomerReviewOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A6B53]">
                Your Feedback Matters
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit'] mt-0.5">
                Write a Review
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Share your experience shopping with AIO PRODUCT Pakistan.
              </p>
            </div>

            <form onSubmit={handleCustomerReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Star Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCustomerRating(star)}
                      className="p-1 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= customerRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">
                    {customerRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Review
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell others about product quality, packaging, delivery speed, or customer support..."
                  value={customerText}
                  onChange={e => setCustomerText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomerReviewOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
