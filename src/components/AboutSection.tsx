import React from 'react';
import { ShieldCheck, CheckCircle2, Truck, Award, Edit3 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutSection: React.FC = () => {
  const { siteSettings, isAdminLoggedIn, openLiveEdit, setCurrentView, setSelectedCategory } = useStore();
  const about = siteSettings.about || {
    heading: 'Because Brand Matters.',
    tagline: 'Because Brand Matters.',
    description:
      'AIO PRODUCT is a modern online shopping brand focused on bringing useful, quality, and carefully selected products to customers in Pakistan.',
    storyParagraph1:
      'We aim to provide a simple, trustworthy, convenient, and enjoyable online shopping experience. In an online market filled with unreliable replicas and broken promises, AIO PRODUCT stands for authenticity.',
    storyParagraph2:
      'Because Brand Matters — every product, order, and customer experience should reflect quality and trust.',
    values: [
      { title: 'Quality Products', desc: 'Carefully selected essentials.' },
      { title: 'Trusted Shopping', desc: 'Secure cash on delivery.' },
      { title: 'Convenience For You', desc: 'Fast, reliable dispatch.' },
      { title: 'Customer Satisfaction', desc: 'Dedicated friendly assistance.' },
    ],
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Side */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="AIO PRODUCT Pakistan"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4A6B53] text-white flex items-center justify-center font-black">
                    AIO
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">AIO PRODUCT.</h4>
                    <p className="text-xs text-[#4A6B53] font-semibold">Because Brand Matters.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 rounded-full bg-[#EBF3ED] text-[#2F533A] border border-[#D3E5D7] text-xs font-bold uppercase tracking-wider">
                ABOUT AIO PRODUCT
              </span>

              {isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={() => openLiveEdit('about')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit About Us</span>
                </button>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-['Outfit'] tracking-tight">
              {about.heading || 'Because Brand Matters.'}
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{about.description}</p>
              <p>{about.storyParagraph1}</p>
              {about.storyParagraph2 && <p>{about.storyParagraph2}</p>}
            </div>

            {/* Core Pillars */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {about.values?.map((v, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#f8f9fa] border border-slate-200/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{v.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Navigation */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Shop Our Collection
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-white hover:bg-[#F2F7F4] text-[#243D2C] border border-[#88C49A] font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Contact Customer Care
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
