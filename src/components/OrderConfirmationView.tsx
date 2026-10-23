import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  ArrowRight,
  Printer,
  Copy,
  Calendar,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR, formatDate, buildWhatsAppOrderUrl, STORE_WHATSAPP_NUMBER } from '../lib/utils';

export const OrderConfirmationView: React.FC = () => {
  const { lastCreatedOrder, setCurrentView, showToast, siteSettings } = useStore();

  if (!lastCreatedOrder) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-slate-900">No recent order found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-6 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const order = lastCreatedOrder;
  const merchantWhatsAppUrl = buildWhatsAppOrderUrl(order);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    showToast('Order number copied to clipboard!', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 py-12 sm:py-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10 text-center">
          {/* Animated checkmark icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Order Received
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit'] mt-1">
            Thank You, {order.shipping_address?.name || 'Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Your order has been recorded in our system. Our team is preparing your package for express dispatch across Pakistan.
          </p>

          {/* Order Number Banner */}
          <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Your Unique Tracking Number
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">
                {order.order_number}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyOrderNumber}
                className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-slate-800 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-slate-800 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="mt-8 text-left border-t border-slate-100 pt-8 space-y-6">
            {/* Delivery Timeline Notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Truck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Estimated Delivery: 2 to 4 Days</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Shipped to {order.shipping_address?.city}, {order.shipping_address?.province} via premier courier. The delivery rider will call on <strong>{order.shipping_address?.phone}</strong> prior to arrival.
                </p>
              </div>
            </div>

            {/* Items Summary */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Items In This Order
              </h3>
              <div className="divide-y divide-slate-100 border-y border-slate-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {item.quantity}x
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{item.product_name}</h4>
                        <span className="text-[11px] text-slate-400">{formatPKR(item.price)} each</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">{formatPKR(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Payment */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Payment Method</span>
                <span className="font-bold text-slate-900">{order.payment_method}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Status</span>
                <span className="font-bold text-amber-600">Pending (Pay upon Delivery)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Address</span>
                <span className="font-medium text-slate-900 text-right max-w-xs">
                  {order.shipping_address?.address}, {order.shipping_address?.city}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-extrabold text-slate-950">
                <span>Total Due on Delivery (PKR)</span>
                <span className="text-amber-600 font-black text-lg">
                  {formatPKR(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={merchantWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Details to Store ({STORE_WHATSAPP_NUMBER})</span>
            </a>

            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
