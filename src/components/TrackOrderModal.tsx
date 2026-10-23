import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, AlertCircle, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR, formatDate } from '../lib/utils';
import { Order, OrderStatus } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) return;

    const found = orders.find(
      o =>
        o.order_number.toUpperCase() === clean ||
        o.customer_phone?.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    return steps.indexOf(status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-950 font-['Outfit']">
            Track Your Order
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Enter your AIO order number (e.g. <code>AIO-PK-XXXXXX</code>) or mobile number used during checkout.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="AIO-PK-123456 or 03001234567"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm uppercase font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
          >
            Track
          </button>
        </form>

        {hasSearched && (
          <div>
            {searchedOrder ? (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Order Number
                    </span>
                    <h4 className="text-sm font-black text-slate-900 font-mono">
                      {searchedOrder.order_number}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      searchedOrder.order_status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : searchedOrder.order_status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {searchedOrder.order_status}
                  </span>
                </div>

                {/* Progress bar steps */}
                {searchedOrder.order_status !== 'Cancelled' ? (
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {steps.map((st, idx) => {
                        const currentIdx = getStepIndex(searchedOrder.order_status);
                        const isDone = idx <= currentIdx;
                        return (
                          <div key={st} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                                isDone
                                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                                  : 'bg-slate-200 text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <span className="text-[9px] font-semibold text-slate-600 line-clamp-1">
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    This order has been cancelled. Please contact WhatsApp support if you have questions.
                  </div>
                )}

                {/* Details summary */}
                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200 text-slate-600">
                  <div className="flex justify-between">
                    <span>Recipient:</span>
                    <span className="font-semibold text-slate-900">
                      {searchedOrder.shipping_address?.name} ({searchedOrder.shipping_address?.city})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount (COD):</span>
                    <span className="font-black text-slate-900">
                      {formatPKR(searchedOrder.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Placed On:</span>
                    <span>{formatDate(searchedOrder.created_at)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Order Not Found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  We could not find an order matching &quot;{query}&quot;. Please verify the order number on your confirmation screen or courier SMS.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
