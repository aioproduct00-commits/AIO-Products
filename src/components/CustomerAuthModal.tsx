import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  LogOut,
  Package,
  ShieldCheck,
  ArrowRight,
  Edit2,
  Save,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PAKISTAN_MAJOR_CITIES, PAKISTAN_PROVINCES, formatPKR, formatDate } from '../lib/utils';

export const CustomerAuthModal: React.FC = () => {
  const {
    currentCustomer,
    isCustomerAuthModalOpen,
    setIsCustomerAuthModalOpen,
    loginWithGoogle,
    logoutCustomer,
    saveCustomerProfile,
    orders,
    setCurrentView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'profile'>('signin');
  const [googleName, setGoogleName] = useState('Usman Ali');
  const [googleEmail, setGoogleEmail] = useState('aio.product.00@gmail.com');
  const [googlePhone, setGooglePhone] = useState('03001234567');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile edit fields
  const [editName, setEditName] = useState(currentCustomer?.name || '');
  const [editPhone, setEditPhone] = useState(currentCustomer?.phone || '');
  const [editAddress, setEditAddress] = useState(currentCustomer?.address || '');
  const [editCity, setEditCity] = useState(currentCustomer?.city || 'Lahore');
  const [editProvince, setEditProvince] = useState(currentCustomer?.province || 'Punjab');

  if (!isCustomerAuthModalOpen) return null;

  const handleGoogleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await loginWithGoogle({
      name: googleName.trim() || 'Pakistani Shopper',
      email: googleEmail.trim().toLowerCase(),
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(googleName || 'Shopper')}&background=ff6b00&color=fff`,
      phone: googlePhone.trim() || '03001234567',
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCustomerProfile({
      name: editName,
      phone: editPhone,
      address: editAddress,
      city: editCity,
      province: editProvince,
    });
    setIsEditingProfile(false);
  };

  // Find orders placed by this customer
  const customerOrders = orders.filter(
    o =>
      (currentCustomer?.phone && o.customer_phone === currentCustomer.phone) ||
      (currentCustomer?.email && o.customer_email?.toLowerCase() === currentCustomer.email.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1422] text-white rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsCustomerAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {currentCustomer ? (
          /* LOGGED IN VIEW */
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <img
                src={
                  currentCustomer.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(currentCustomer.name)}&background=ff6b00&color=fff`
                }
                alt={currentCustomer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#ff6b00] shadow-md"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-['Outfit'] truncate">
                    {currentCustomer.name}
                  </h3>
                  {currentCustomer.auth_provider === 'google' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4285F4]/20 text-[#8ab4f8] border border-[#4285F4]/40 flex items-center gap-1">
                      <span className="text-[11px] font-bold">G</span> Gmail Account
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{currentCustomer.email}</p>
                {currentCustomer.phone && (
                  <p className="text-xs text-[#ff6b00] font-semibold">{currentCustomer.phone}</p>
                )}
              </div>
            </div>

            {/* Profile Information or Edit Form */}
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 bg-[#131b2e] p-4 rounded-2xl border border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Edit Details</h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/20 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Mobile (Pakistan 03XX)</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/20 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={e => setEditAddress(e.target.value)}
                    placeholder="House, Street, Area"
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/20 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
                    <select
                      value={editCity}
                      onChange={e => setEditCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/20 text-xs text-white"
                    >
                      {PAKISTAN_MAJOR_CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Province</label>
                    <select
                      value={editProvince}
                      onChange={e => setEditProvince(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0a0f1d] border border-white/20 text-xs text-white"
                    >
                      {PAKISTAN_PROVINCES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#ff6b00] text-white text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-[#131b2e] p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Saved Shipping Details
                  </span>
                  <button
                    onClick={() => {
                      setEditName(currentCustomer.name);
                      setEditPhone(currentCustomer.phone);
                      setEditAddress(currentCustomer.address);
                      setEditCity(currentCustomer.city);
                      setEditProvince(currentCustomer.province);
                      setIsEditingProfile(true);
                    }}
                    className="text-xs font-semibold text-[#ff6b00] hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Address:</strong> {currentCustomer.address || 'No address saved yet'}
                </p>
                <p className="text-xs text-slate-300">
                  <strong>City:</strong> {currentCustomer.city}, {currentCustomer.province}
                </p>
              </div>
            )}

            {/* Orders Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Order History ({customerOrders.length})
              </h4>
              {customerOrders.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {customerOrders.map(o => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-white block">{o.order_number}</span>
                        <span className="text-[10px] text-slate-400">{formatDate(o.created_at)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#ff6b00] block">{formatPKR(o.total_amount)}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300">
                          {o.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 bg-white/5 p-4 rounded-xl text-center">
                  You haven&apos;t placed any orders yet with this Gmail account.
                </p>
              )}
            </div>

            {/* Logout button */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                onClick={() => {
                  setIsCustomerAuthModalOpen(false);
                  setCurrentView('shop');
                }}
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={logoutCustomer}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* SIGN IN / CREATE ACCOUNT VIEW */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6b00]/15 text-[#ff6b00] text-[11px] font-bold uppercase">
                <span>Customer Access</span>
              </div>
              <h3 className="text-2xl font-black font-['Outfit'] text-white">
                Sign In to AIO PRODUCT
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create an account or sign in with your Gmail account to manage orders, addresses, and enjoy faster checkout.
              </p>
            </div>

            {/* PROMINENT GOOGLE / GMAIL 1-CLICK BUTTON */}
            <div className="space-y-3">
              <button
                onClick={() => handleGoogleSignIn()}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                {/* Official Google G SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <span className="flex-1 h-[1px] bg-white/10" />
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Or custom Gmail sign-in</span>
                <span className="flex-1 h-[1px] bg-white/10" />
              </div>

              {/* Form to enter custom Gmail address */}
              <form onSubmit={handleGoogleSignIn} className="space-y-3 bg-[#131b2e] p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={googleName}
                    onChange={e => setGoogleName(e.target.value)}
                    placeholder="e.g. Usman Ali"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0f1d] border border-white/20 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={googleEmail}
                      onChange={e => setGoogleEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0a0f1d] border border-white/20 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Mobile Phone (03XX-XXXXXXX)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={googlePhone}
                      onChange={e => setGooglePhone(e.target.value)}
                      placeholder="03001234567"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0a0f1d] border border-white/20 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#ff6b00] hover:bg-[#ff7b1a] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Sign In with Gmail
                </button>
              </form>
            </div>

            {/* Benefits */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safe & Instant Access</span>
              </div>
              <p>Your details are securely saved for quick nationwide Cash on Delivery orders across Pakistan.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
