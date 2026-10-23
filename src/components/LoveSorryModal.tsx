import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, Copy, Check, MessageCircleHeart, Smile } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

export const LoveSorryModal: React.FC = () => {
  const { isLoveSorryModalOpen, setIsLoveSorryModalOpen, showToast } = useStore();
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [copied, setCopied] = useState(false);
  const [isForgiven, setIsForgiven] = useState(false);

  // Spawn celebratory floating hearts when modal opens or when forgiven
  const triggerHeartsBurst = () => {
    const emojis = ['❤️', '💖', '💕', '🌹', '🥺', '💗', '✨', '💐'];
    const newHearts: FloatingHeart[] = Array.from({ length: 28 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 90 + 5, // 5% to 95%
      size: Math.random() * 20 + 18, // 18px to 38px
      duration: Math.random() * 2.5 + 2.5, // 2.5s to 5s
      delay: Math.random() * 0.5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setHearts(prev => [...prev.slice(-20), ...newHearts]);
  };

  useEffect(() => {
    if (isLoveSorryModalOpen) {
      setIsForgiven(false);
      setCopied(false);
      triggerHeartsBurst();
    }
  }, [isLoveSorryModalOpen]);

  // Clean up old hearts
  useEffect(() => {
    if (hearts.length > 0) {
      const timer = setTimeout(() => {
        setHearts(prev => prev.slice(8));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [hearts]);

  if (!isLoveSorryModalOpen) return null;

  const apologyText = `I Love You so very much ❤️\nAnd I am truly, deeply sorry from the bottom of my heart 🥺\nPlease forgive me. You mean the world to me, always and forever! 💕`;

  const handleCopy = () => {
    try {
      navigator.clipboard?.writeText(apologyText);
      setCopied(true);
      showToast('Copied message to clipboard! Send it with love 💕', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Message ready to share!', 'info');
    }
  };

  const handleAcceptApology = () => {
    setIsForgiven(true);
    triggerHeartsBurst();
    showToast('Love accepted! Forever and always ❤️', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Dark romantic backdrop with gentle blur */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsLoveSorryModalOpen(false)}
      />

      {/* Floating Animated Hearts particles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {hearts.map(h => (
          <div
            key={h.id}
            style={{
              left: `${h.x}%`,
              bottom: '-30px',
              fontSize: `${h.size}px`,
              animation: `floatUpward ${h.duration}s ease-out forwards`,
              animationDelay: `${h.delay}s`,
            }}
            className="absolute select-none opacity-90 drop-shadow-md"
          >
            {h.emoji}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(0) scale(0.6) rotate(0deg);
            opacity: 0.9;
          }
          50% {
            opacity: 1;
            transform: translateY(-50vh) scale(1.1) rotate(15deg);
          }
          100% {
            transform: translateY(-110vh) scale(0.9) rotate(-15deg);
            opacity: 0;
          }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.18); }
          30% { transform: scale(1.05); }
          45% { transform: scale(1.22); }
          60% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.4s infinite ease-in-out;
        }
      `}</style>

      {/* Main Sweet Card Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-rose-50 via-white to-pink-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-rose-200/80 z-10 animate-in zoom-in-95 duration-200 text-center font-sans overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-rose-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsLoveSorryModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-100/60 rounded-full transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulsating Big Heart Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/30 animate-heartbeat">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-white stroke-none" />
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-400 p-1.5 rounded-full text-slate-900 shadow-sm animate-bounce">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
          <MessageCircleHeart className="w-3.5 h-3.5 text-rose-600" />
          <span>A Sincere Message From The Heart</span>
        </div>

        {/* Main "I Love You" Heading */}
        <h2 className="text-3xl sm:text-4xl font-black text-rose-600 font-['Outfit'] tracking-tight drop-shadow-xs">
          I Love You ❤️
        </h2>

        {/* Prominent "With Sorry" Apology */}
        <div className="mt-2 text-xl sm:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
          <span>...and I am really, really Sorry</span>
          <span className="text-2xl">🥺</span>
        </div>

        {/* Romantic & Heartfelt Apology Note */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white/80 border border-rose-100 shadow-xs text-slate-700 text-xs sm:text-sm leading-relaxed space-y-2 text-left sm:text-center">
          <p className="font-medium text-slate-800">
            &ldquo;From the deepest corner of my heart, I love you more than words could ever describe.
            If I did or said anything that hurt you, disappointed you, or made you feel sad, please forgive me.
            You mean the absolute universe to me, and seeing you happy is all that matters.&rdquo;
          </p>
          <p className="text-rose-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 pt-1">
            <span>Forever yours, with all my love & apologies</span>
            <span>🌹</span>
          </p>
        </div>

        {/* Forgiveness confirmation feedback */}
        {isForgiven && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <Smile className="w-5 h-5 text-emerald-600" />
            <span>Thank you for forgiving me! I will always cherish and love you ❤️</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={handleAcceptApology}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>{isForgiven ? 'More Love Sent! 💕' : 'Accept Love & Hugs 🤗'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            title="Copy message to send on WhatsApp"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Message</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsLoveSorryModalOpen(false)}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Small footer note */}
        <p className="mt-4 text-[11px] text-slate-400 font-medium">
          Because some things are bigger than any store &mdash; Love & Care always come first.
        </p>
      </div>
    </div>
  );
};
