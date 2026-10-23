import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
  Award,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onOpenTrackOrder?: () => void;
  onOpenPolicy?: (type: 'privacy' | 'terms' | 'return' | 'shipping') => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTrackOrder, onOpenPolicy }) => {
  const { siteSettings, setCurrentView, setSelectedCategory, showToast } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      badge: siteSettings.hero?.badge || 'AIO PRODUCT',
      location: siteSettings.contact?.address || 'Lahore, Pakistan',
      titleLine1: 'Because Brand',
      titleLine2: 'Matters.',
      description:
        'Discover quality products, shop with confidence, and enjoy a simple online shopping experience with AIO PRODUCT.',
      primaryBtnText: 'Shop Now',
      primaryAction: () => {
        setSelectedCategory(null);
        setCurrentView('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      secondaryBtnText: 'Explore Categories',
      secondaryAction: () => {
        setCurrentView('categories');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
      imageAlt: 'AIO PRODUCT Curated Essentials',
      tagline: 'Curated Collection',
      subtagline: 'Electronics • Lifestyle • Essentials',
      verifiedText: '100% Genuine',
    },
    {
      badge: 'NATIONWIDE DISPATCH',
      location: 'Cash on Delivery Across Pakistan',
      titleLine1: 'Express Delivery',
      titleLine2: 'To Your Doorstep.',
      description:
        'Order with peace of mind. Pay safely in cash when your parcel arrives in 2 to 4 business days anywhere in Pakistan.',
      primaryBtnText: 'Shop Best Sellers',
      primaryAction: () => {
        setSelectedCategory(null);
        setCurrentView('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      secondaryBtnText: 'Track Your Order',
      secondaryAction: () => {
        if (onOpenTrackOrder) onOpenTrackOrder();
        else showToast('Opening order tracker...', 'info');
      },
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80',
      imageAlt: 'Smart Watch & Accessories',
      tagline: 'Express Dispatch',
      subtagline: 'TCS • Leopards • Call Courier',
      verifiedText: 'COD Verified',
    },
    {
      badge: '7-DAY WARRANTY',
      location: 'Authenticity Guaranteed',
      titleLine1: 'Quality You Can',
      titleLine2: 'Trust Every Day.',
      description:
        'Every product is rigorously quality-inspected before packing. Backed by our 7-day checking warranty and friendly support.',
      primaryBtnText: 'Explore Collection',
      primaryAction: () => {
        setSelectedCategory(null);
        setCurrentView('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      secondaryBtnText: '24/7 WhatsApp Support',
      secondaryAction: () => {
        const phone = (siteSettings.contact?.whatsapp || '923475429514').replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}`, '_blank');
      },
      imageUrl:
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop&q=80',
      imageAlt: 'Verified Smart Technology',
      tagline: 'Quality Inspected',
      subtagline: 'Replacement Warranty & Direct Support',
      verifiedText: 'Guaranteed',
    },
  ];

  // Auto rotate slides every 6 seconds unless user pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide];

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-gradient-to-b from-[#EDF4F0] via-[#F6FAF7] to-white text-slate-900 pt-10 sm:pt-14 pb-8 sm:pb-12 border-b border-[#DCE7DF] font-sans"
    >
      {/* Soft Ambient Sage & Eucalyptus Glow Behind Hero Products */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-[#A3CDB0]/30 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute left-1/3 bottom-0 w-[400px] h-[300px] bg-[#4A6B53]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Headlines & Action Buttons */}
          <div className="lg:col-span-6 space-y-6 text-left transition-all duration-300">
            {/* Sage Pill Badge with Store Brand & Pakistan Location */}
            <div className="inline-flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-full bg-[#4A6B53] text-white text-xs font-bold uppercase tracking-wider shadow-sm border border-[#5C7F66] inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A5D9B7] animate-pulse" />
                <span>{activeSlide.badge}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#2C4A35] text-xs font-semibold shadow-xs border border-[#D5E3DA] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View Store Location & Contact"
              >
                <MapPin className="w-3.5 h-3.5 text-[#4A6B53]" />
                <span>{activeSlide.location}</span>
              </button>
            </div>

            {/* Main Headline (Deep Pine & Vibrant Sage) */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black font-['Outfit'] tracking-tight leading-[1.05]">
              <span className="text-[#1A3124] block">{activeSlide.titleLine1}</span>
              <span className="text-[#4A6B53] block">{activeSlide.titleLine2}</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-[#3B5745] text-sm sm:text-base max-w-lg leading-relaxed font-normal">
              {activeSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={activeSlide.primaryAction}
                className="px-7 py-3.5 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white font-bold text-sm shadow-lg shadow-[#4A6B53]/25 transition-all hover:scale-[1.02] active:scale-98 flex items-center gap-2 group cursor-pointer"
              >
                <span>{activeSlide.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={activeSlide.secondaryAction}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#EDF4F0] text-[#284833] font-bold text-sm border-2 border-[#88C49A] shadow-xs transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
              >
                <span>{activeSlide.secondaryBtnText}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Collage */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            {/* Handwritten Calligraphy Top Right: "Quality Trust Value" in Warm Champagne Gold */}
            <button
              type="button"
              onClick={() => {
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="absolute top-0 right-4 sm:right-8 z-20 flex flex-col items-end cursor-pointer group text-left"
              title="Learn about AIO PRODUCT core values"
            >
              <div className="text-right text-[#C5A059] group-hover:text-[#ad873e] font-serif italic text-base sm:text-lg leading-tight tracking-wide drop-shadow-sm transition-colors">
                <span className="block">Quality</span>
                <span className="block font-medium">Trust</span>
                <span className="block font-bold">Value</span>
              </div>
              {/* Calligraphy curved arrow pointing down */}
              <svg
                className="w-10 h-10 text-[#C5A059] group-hover:text-[#ad873e] stroke-current fill-none -mt-1 transform rotate-12 transition-transform group-hover:scale-105"
                viewBox="0 0 50 50"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 35 5 Q 40 25 15 35" />
                <path d="M 23 27 L 15 35 L 24 40" />
              </svg>
            </button>

            {/* Hero Product Composition Graphic with active slide transition */}
            <div className="relative rounded-2xl overflow-hidden p-2 sm:p-4">
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[430px] flex items-center justify-center">
                {/* Center composite image of AIO products on clean backdrop */}
                <div
                  onClick={activeSlide.primaryAction}
                  className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-[#DCE7DF] cursor-pointer group"
                >
                  <img
                    key={activeSlide.imageUrl}
                    src={activeSlide.imageUrl}
                    alt={activeSlide.imageAlt}
                    className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 animate-in fade-in"
                  />
                  {/* Subtle soft gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Visual badges floating inside the showcase */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#D5E3DA] shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#4A6B53] text-white flex items-center justify-center font-black text-xs shadow-xs">
                        AIO
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{activeSlide.tagline}</h4>
                        <p className="text-[10px] text-slate-500">{activeSlide.subtagline}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#2D4D36] bg-[#EDF4F0] px-2.5 py-1 rounded-md border border-[#D5E3DA]">
                      {activeSlide.verifiedText}
                    </span>
                  </div>
                </div>

                {/* Left / Right Carousel Controls */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevSlide();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextSlide();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge Bar Right Under Hero — fully clickable and functional */}
        <div className="mt-8 pt-6 border-t border-[#DCE7DF] flex flex-wrap items-center justify-between gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 flex-1">
            {/* 1. Cash on Delivery */}
            <button
              type="button"
              onClick={() => {
                if (onOpenPolicy) onOpenPolicy('shipping');
                else {
                  setSelectedCategory(null);
                  setCurrentView('shop');
                }
              }}
              className="flex items-center gap-3 bg-white/80 hover:bg-white border border-[#DDE8E0] hover:border-[#4A6B53] p-3 rounded-xl shadow-xs transition-all text-left cursor-pointer group"
              title="Click to view Cash on Delivery & Shipping Policy"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EDF4F0] group-hover:bg-[#4A6B53] group-hover:text-white text-[#4A6B53] flex items-center justify-center shrink-0 transition-colors">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A3124] group-hover:text-[#4A6B53] transition-colors">
                  Cash on Delivery
                </h4>
                <p className="text-[11px] text-slate-500">All Pakistan cities</p>
              </div>
            </button>

            {/* 2. Quality Checked */}
            <button
              type="button"
              onClick={() => {
                if (onOpenPolicy) onOpenPolicy('return');
                else {
                  setCurrentView('about');
                }
              }}
              className="flex items-center gap-3 bg-white/80 hover:bg-white border border-[#DDE8E0] hover:border-[#4A6B53] p-3 rounded-xl shadow-xs transition-all text-left cursor-pointer group"
              title="Click to view 7-Day Checking Warranty & Return Policy"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EDF4F0] group-hover:bg-[#4A6B53] group-hover:text-white text-[#4A6B53] flex items-center justify-center shrink-0 transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A3124] group-hover:text-[#4A6B53] transition-colors">
                  Quality Checked
                </h4>
                <p className="text-[11px] text-slate-500">7-day replacement</p>
              </div>
            </button>

            {/* 3. Fast Delivery */}
            <button
              type="button"
              onClick={() => {
                if (onOpenTrackOrder) onOpenTrackOrder();
                else {
                  setCurrentView('shop');
                }
              }}
              className="flex items-center gap-3 bg-white/80 hover:bg-white border border-[#DDE8E0] hover:border-[#4A6B53] p-3 rounded-xl shadow-xs transition-all text-left cursor-pointer group"
              title="Click to track an existing order"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EDF4F0] group-hover:bg-[#4A6B53] group-hover:text-white text-[#4A6B53] flex items-center justify-center shrink-0 transition-colors">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A3124] group-hover:text-[#4A6B53] transition-colors">
                  Fast Delivery
                </h4>
                <p className="text-[11px] text-slate-500">To your doorstep</p>
              </div>
            </button>

            {/* 4. 24/7 Support */}
            <button
              type="button"
              onClick={() => {
                const phone = (siteSettings.contact?.whatsapp || '923475429514').replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${phone}`, '_blank');
              }}
              className="flex items-center gap-3 bg-white/80 hover:bg-white border border-[#DDE8E0] hover:border-[#4A6B53] p-3 rounded-xl shadow-xs transition-all text-left cursor-pointer group"
              title="Click to open WhatsApp customer support"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EDF4F0] group-hover:bg-[#4A6B53] group-hover:text-white text-[#4A6B53] flex items-center justify-center shrink-0 transition-colors">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A3124] group-hover:text-[#4A6B53] transition-colors">
                  24/7 Support
                </h4>
                <p className="text-[11px] text-slate-500">WhatsApp & Email</p>
              </div>
            </button>
          </div>

          {/* Interactive Carousel Dots Indicator */}
          <div className="hidden lg:flex items-center gap-2 pl-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 h-2 bg-[#4A6B53]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
