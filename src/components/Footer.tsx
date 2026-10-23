import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Banknote,
  Edit3,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenPolicy: (type: 'privacy' | 'terms' | 'return' | 'shipping') => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy, onOpenTrackOrder }) => {
  const { siteSettings, setCurrentView, setSelectedCategory, isAdminLoggedIn, openLiveEdit } = useStore();

  const handleNav = (view: string) => {
    if (view === 'shop') {
      setSelectedCategory(null);
    }
    setCurrentView(view as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1B2F22] text-[#A6C4B0] pt-14 pb-8 border-t border-[#2D4A36] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Column 1: Brand & Socials */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <div className="flex items-baseline">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit'] uppercase">
                  AIO PRODUCT
                </span>
                <span className="text-2xl font-black text-[#88C49A]">.</span>
              </div>
              <p className="text-xs font-semibold tracking-tight text-[#88C49A] mt-0.5">
                Because Brand Matters.
              </p>
            </div>

            {/* Social Icons matching the row in screenshot */}
            <div className="pt-2 flex items-center gap-3">
              {/* Facebook */}
              <a
                href={siteSettings.social?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#4A6B53] hover:text-white text-white/90 flex items-center justify-center transition-all text-xs font-bold border border-white/10"
                title="Facebook"
              >
                f
              </a>
              {/* Instagram */}
              <a
                href={siteSettings.social?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#4A6B53] hover:text-white text-white/90 flex items-center justify-center transition-all text-xs font-bold border border-white/10"
                title="Instagram"
              >
                ig
              </a>
              {/* TikTok */}
              <a
                href={siteSettings.social?.tiktok || 'https://tiktok.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#4A6B53] hover:text-white text-white/90 flex items-center justify-center transition-all text-xs font-bold border border-white/10"
                title="TikTok"
              >
                tt
              </a>
              {/* YouTube */}
              <a
                href={siteSettings.social?.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#4A6B53] hover:text-white text-white/90 flex items-center justify-center transition-all text-xs font-bold border border-white/10"
                title="YouTube"
              >
                yt
              </a>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${(siteSettings.contact?.whatsapp || '923475429514').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#4A6B53] hover:text-white text-white/90 flex items-center justify-center transition-all text-xs font-bold border border-white/10"
                title="WhatsApp"
              >
                wa
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('categories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-white transition-colors cursor-pointer text-[#88C49A] font-semibold flex items-center gap-1"
                >
                  <span>Track Your Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-white transition-colors cursor-pointer text-slate-300"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Policies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('return')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shipping Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Us</h4>
              {isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={() => openLiveEdit('contact')}
                  className="px-2 py-0.5 rounded-md bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#88C49A] shrink-0" />
                <a href={`tel:${siteSettings.contact?.phone || '+923475429514'}`} className="hover:text-white">
                  {siteSettings.contact?.phone || '+92 347 5429514'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#88C49A] shrink-0" />
                <a href={`mailto:${siteSettings.contact?.email || 'info@aioproduct.pk'}`} className="hover:text-white">
                  {siteSettings.contact?.email || 'info@aioproduct.pk'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#88C49A] shrink-0" />
                <span>{siteSettings.contact?.address || 'Lahore, Pakistan'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Copyright + Admin Access + Payment Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <p>© 2025 AIO PRODUCT. All rights reserved.</p>
            <span>•</span>
            <button
              onClick={() => handleNav('admin')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
            >
              Admin Access
            </button>
          </div>

          {/* Payment Badges (VISA, Mastercard, Cash on Delivery) */}
          <div className="flex items-center gap-3">
            {/* VISA */}
            <span className="font-extrabold italic text-sm text-[#1434cb] bg-white px-2 py-0.5 rounded shadow-2xs">
              VISA
            </span>

            {/* Mastercard circles */}
            <div className="flex items-center bg-white px-2 py-1 rounded shadow-2xs">
              <span className="w-3 h-3 rounded-full bg-[#eb001b] -mr-1.5" />
              <span className="w-3 h-3 rounded-full bg-[#f79e1b] opacity-90" />
            </div>

            {/* Cash on Delivery */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-slate-200 text-[11px] font-semibold">
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
