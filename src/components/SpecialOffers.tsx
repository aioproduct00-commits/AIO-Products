import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SpecialOffers: React.FC = () => {
  const { siteSettings, setCurrentView, setSelectedCategory } = useStore();

  // Live ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 28,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = () => {
    setSelectedCategory(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="py-8 sm:py-12 bg-white text-white font-sans border-b border-[#DDE7E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#294532] via-[#3B5F47] to-[#294532] border border-[#487256] p-6 sm:p-10 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle Ambient Glow */}
          <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#88C49A]/20 blur-3xl pointer-events-none rounded-full" />

          {/* Left Column: Offer Details */}
          <div className="space-y-4 text-left z-10 max-w-sm">
            <span className="inline-block px-3 py-1 rounded-md bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/25">
              Special Offer
            </span>

            <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] tracking-tight text-white leading-tight">
              UP TO 50% OFF
            </h2>

            <p className="text-xs sm:text-sm text-white/85">
              On selected products, Limited time only!
            </p>

            <button
              onClick={handleAction}
              className="mt-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F2F7F4] text-[#243D2C] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#243D2C]" />
            </button>
          </div>

          {/* Center Column: Product Showcase Photo */}
          <div
            onClick={handleAction}
            className="relative z-10 max-w-md w-full flex items-center justify-center cursor-pointer group"
            title="Click to view Special Offer Products"
          >
            <img
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80"
              alt="Special Offer Gear"
              className="w-full h-44 sm:h-52 object-contain filter drop-shadow-2xl group-hover:scale-108 transition-transform duration-500"
            />
          </div>

          {/* Right Column: Countdown Timer */}
          <div className="z-10 text-center lg:text-right space-y-3 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-white/85 block">
              Offer Ends In
            </span>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-lg sm:text-xl font-mono text-white shadow-inner">
                  {pad(timeLeft.days)}
                </div>
                <span className="text-[10px] text-white/70 mt-1 uppercase font-semibold">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-lg sm:text-xl font-mono text-white shadow-inner">
                  {pad(timeLeft.hours)}
                </div>
                <span className="text-[10px] text-white/70 mt-1 uppercase font-semibold">
                  Hours
                </span>
              </div>

              {/* Min */}
              <div className="flex flex-col items-center">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-lg sm:text-xl font-mono text-white shadow-inner">
                  {pad(timeLeft.minutes)}
                </div>
                <span className="text-[10px] text-white/70 mt-1 uppercase font-semibold">
                  Min
                </span>
              </div>

              {/* Sec */}
              <div className="flex flex-col items-center">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center font-black text-lg sm:text-xl font-mono text-[#D7EFE0] shadow-inner">
                  {pad(timeLeft.seconds)}
                </div>
                <span className="text-[10px] text-white/70 mt-1 uppercase font-semibold">
                  Sec
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
