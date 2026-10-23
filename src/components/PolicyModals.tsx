import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, FileText, MessageCircle, Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'return' | 'shipping' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  const { siteSettings } = useStore();

  if (!type) return null;

  const contactPhone = siteSettings.contact?.phone || '+92 347 5429514';
  const contactWhatsApp = siteSettings.contact?.whatsapp || '+92 347 5429514';
  const contactEmail = siteSettings.contact?.email || 'info@aioproduct.pk';
  const contactAddress = siteSettings.contact?.address || 'Lahore, Pakistan';
  const waClean = contactWhatsApp.replace(/[^0-9]/g, '');

  const content = {
    return: {
      title: 'Return, Replacement & Warranty Policy',
      icon: <RotateCcw className="w-6 h-6 text-emerald-500" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            At <strong>AIO PRODUCT</strong>, because brand matters, our utmost priority is your satisfaction and peace of mind when shopping online in Pakistan.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">7-Day Checking Warranty</h4>
          <p>
            All products purchased from AIO PRODUCT are covered by an initial 7-day checking warranty starting from the day your package is delivered by the courier.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">Eligibility for Replacement</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Item is damaged, broken, or inoperative upon receipt.</li>
            <li>Incorrect item was dispatched.</li>
            <li>Item must be returned with original product packaging and accessories intact.</li>
          </ul>
          <h4 className="font-bold text-slate-900 text-sm">How to Initiate a Claim</h4>
          <p>
            Simply reach out to our official WhatsApp support at{' '}
            <a
              href={`https://wa.me/${waClean}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#4A6B53] font-bold hover:underline inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{contactWhatsApp}</span>
            </a>{' '}
            with your Order Number and a short video highlighting the issue. Our support team will arrange a hassle-free replacement.
          </p>
        </div>
      ),
    },
    shipping: {
      title: 'Nationwide Pakistan Shipping Policy',
      icon: <Truck className="w-6 h-6 text-amber-500" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            We deliver safely to all cities, towns, and postal areas across Pakistan via licensed express logistics partners (TCS, Leopards, Trax, Call Courier).
          </p>
          <h4 className="font-bold text-slate-900 text-sm">Delivery Timelines</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Karachi, Lahore, Islamabad, Rawalpindi:</strong> 2 to 3 business days.</li>
            <li><strong>Faisalabad, Multan, Peshawar, Sialkot, Gujranwala:</strong> 3 to 4 business days.</li>
            <li><strong>Remote Regions, Balochistan, AJK, Gilgit:</strong> 4 to 6 business days.</li>
          </ul>
          <h4 className="font-bold text-slate-900 text-sm">Shipping Charges</h4>
          <p>
            Standard shipping is <strong>₨ 250</strong> per order. Orders with a cart value exceeding <strong>₨ 2,500</strong> automatically qualify for <strong>FREE EXPRESS SHIPPING</strong>.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD) Instructions</h4>
          <p>
            Please keep the exact cash amount ready upon delivery rider arrival. You will receive an SMS from the courier company with tracking updates on dispatch day.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            AIO PRODUCT takes your privacy seriously. This policy explains what information we collect when you browse and purchase from our store.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">Information We Collect</h4>
          <p>
            We collect your full name, shipping delivery address, mobile telephone number, and email address solely for courier delivery and customer order verification.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">Security & Sharing</h4>
          <p>
            We never sell, rent, or trade your personal information with any third-party marketing companies. Your contact details are only shared with our logistics partners to fulfill delivery.
          </p>
          <p className="text-xs text-slate-500">
            For questions regarding privacy, email us at{' '}
            <a href={`mailto:${contactEmail}`} className="text-[#4A6B53] font-bold hover:underline">
              {contactEmail}
            </a>.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms & Conditions',
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to AIO PRODUCT. By placing an order on our website, you agree to the following terms and guidelines.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">Order Verification</h4>
          <p>
            AIO PRODUCT reserves the right to call or WhatsApp confirm cash-on-delivery orders before dispatching high-value items. Orders that cannot be verified may be placed on hold.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">Pricing and Currency</h4>
          <p>
            All prices are shown in Pakistani Rupees (PKR ₨) and include applicable product costs. What you see is what you pay at delivery.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">Operating Jurisdiction</h4>
          <p>
            Orders and deliveries are fulfilled within the Islamic Republic of Pakistan from {contactAddress}.
          </p>
        </div>
      ),
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            {content.icon}
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-950 font-['Outfit']">
              {content.title}
            </h3>
            <span className="text-[11px] text-[#4A6B53] font-bold uppercase tracking-wider">
              AIO PRODUCT Pakistan
            </span>
          </div>
        </div>

        <div className="overflow-y-auto py-6 pr-1">{content.body}</div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <a
            href={`https://wa.me/${waClean}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#4A6B53] hover:underline flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
