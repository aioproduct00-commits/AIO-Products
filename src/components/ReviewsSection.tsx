import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../lib/utils';

export const ReviewsSection: React.FC = () => {
  const { reviews, products, writeReview } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [city, setCity] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter only approved reviews for public display
  const approvedReviews = reviews.filter(r => r.is_approved);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) return;

    setIsSubmitting(true);
    const prod = products.find(p => p.id === selectedProductId);

    await writeReview({
      product_id: selectedProductId || (products[0]?.id ?? 'general'),
      product_name: prod ? prod.name : 'AIO Product Experience',
      customer_name: city.trim() ? `${customerName.trim()} (${city.trim()})` : customerName.trim(),
      rating,
      review_text: reviewText.trim(),
    });

    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setModalOpen(false);
      setCustomerName('');
      setCity('');
      setReviewText('');
      setRating(5);
    }, 2500);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
              Customer Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit'] tracking-tight">
              What Pakistani Shoppers Say
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900">4.9 out of 5</span>
              <span className="text-xs text-slate-500">• Verified Customer Reviews</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all self-start md:self-auto cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        {approvedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approvedReviews.map(r => (
              <div
                key={r.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating ? 'fill-current text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                    “{r.review_text}”
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{r.customer_name}</h4>
                    <span className="text-[10px] text-slate-400 block">{formatDate(r.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
            <p className="text-slate-600 text-sm">No approved reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Review Submitted!</h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">
                  Thank you for helping other Pakistani shoppers. Your review will be published upon quick admin review.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-extrabold text-slate-950 font-['Outfit']">
                    Share Your Experience
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your honest feedback helps maintain the AIO standard.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product Purchased
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={e => setSelectedProductId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">General AIO PRODUCT Experience</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Asad Ali"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lahore / Karachi"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'fill-current text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-2">
                        {rating} out of 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details about product quality, packing, delivery speed, etc."
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight">
                    * Note: Because Brand Matters, all reviews undergo moderation to eliminate bot spam before appearing on the site.
                  </p>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
