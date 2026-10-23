import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { createOrder } from '../lib/supabase';
import {
  formatPKR,
  PAKISTAN_MAJOR_CITIES,
  PAKISTAN_PROVINCES,
  validatePakistanPhone,
  buildWhatsAppOrderUrl,
  STORE_WHATSAPP_NUMBER,
} from '../lib/utils';
import { PaymentMethod } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    cartTotal,
    clearCart,
    setCurrentView,
    setLastCreatedOrder,
    addPlacedOrder,
    refreshAllData,
    currentCustomer,
    setIsCustomerAuthModalOpen,
    goBack,
    showToast,
  } = useStore();

  // Form State
  const [name, setName] = useState(currentCustomer?.name || '');
  const [phone, setPhone] = useState(currentCustomer?.phone || '');
  const [email, setEmail] = useState(currentCustomer?.email || '');
  const [address, setAddress] = useState(currentCustomer?.address || '');
  const [city, setCity] = useState(currentCustomer?.city || 'Lahore');
  const [customCity, setCustomCity] = useState('');
  const [province, setProvince] = useState(currentCustomer?.province || 'Punjab');
  const [postalCode, setPostalCode] = useState(currentCustomer?.postal_code || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');

  // Sync if customer signs in while on checkout page
  React.useEffect(() => {
    if (currentCustomer) {
      if (currentCustomer.name) setName(currentCustomer.name);
      if (currentCustomer.phone) setPhone(currentCustomer.phone);
      if (currentCustomer.email) setEmail(currentCustomer.email);
      if (currentCustomer.address) setAddress(currentCustomer.address);
      if (currentCustomer.city) setCity(currentCustomer.city);
      if (currentCustomer.province) setProvince(currentCustomer.province);
      if (currentCustomer.postal_code) setPostalCode(currentCustomer.postal_code);
    }
  }, [currentCustomer]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-xs"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = 'Please enter your full name.';

    const phoneValidation = validatePakistanPhone(phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error || 'Invalid Pakistani phone number';
    }

    if (!address.trim()) errors.address = 'Please provide complete delivery street address.';

    const finalCity = city === 'Other City' ? customCity.trim() : city;
    if (!finalCity) errors.city = 'Please specify your city.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
        image_url: item.product.image_url,
      }));

      const customerPayload = {
        name: name.trim(),
        phone: phoneValidation.normalized,
        email: email.trim() || undefined,
        address: address.trim(),
        city: finalCity,
        province,
        postal_code: postalCode.trim() || undefined,
      };

      const placedOrder = await createOrder(
        customerPayload,
        orderItems,
        cartTotal,
        notes.trim() || undefined,
        paymentMethod
      );

      // Clear cart
      clearCart();
      // Add immediately to store state
      addPlacedOrder(placedOrder);
      // Set confirmed order
      setLastCreatedOrder(placedOrder);
      // Refresh background data
      await refreshAllData();

      // Send order details to merchant WhatsApp 03475429514
      const whatsappUrl = buildWhatsAppOrderUrl(placedOrder);
      try {
        window.open(whatsappUrl, '_blank');
      } catch (e) {
        console.warn('Could not auto-open WhatsApp tab:', e);
      }
      showToast(`Order confirmed! Details forwarded to WhatsApp ${STORE_WHATSAPP_NUMBER}`, 'success');

      // Redirect to confirmation view
      setCurrentView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Order creation error:', err);
      setFormErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 py-10 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#4A6B53] bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs mb-3 transition-all hover:-translate-x-0.5 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-[#4A6B53]" />
            <span>Back to Store / Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-['Outfit']">
            Checkout & Nationwide Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fast, secure ordering with Cash on Delivery across Pakistan.
          </p>
        </div>

        {formErrors.submit && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formErrors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Customer Information & Shipping Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Details */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                      Customer Information
                    </h3>
                  </div>

                  {!currentCustomer && (
                    <button
                      type="button"
                      onClick={() => setIsCustomerAuthModalOpen(true)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Sign in with Gmail</span>
                      <span>→</span>
                    </button>
                  )}
                </div>

                {currentCustomer ? (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                        G
                      </span>
                      <span>
                        Signed in as <strong>{currentCustomer.name}</strong> ({currentCustomer.email})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCustomerAuthModalOpen(true)}
                      className="text-blue-700 font-bold underline hover:text-blue-900 cursor-pointer"
                    >
                      Profile
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-between">
                    <span>Quick checkout with Cash on Delivery or sign in with your Gmail account.</span>
                    <button
                      type="button"
                      onClick={() => setIsCustomerAuthModalOpen(true)}
                      className="text-[#4A6B53] font-bold hover:underline cursor-pointer whitespace-nowrap ml-2"
                    >
                      Gmail Login
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Farooq"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] ${
                        formErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile Number (For Courier SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300-1234567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] ${
                        formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.phone ? (
                      <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Format: 03XX-XXXXXXX (TCS/Leopard delivery rider will call here)
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (Optional for Order Receipt)
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              {/* Step 2: Delivery Address in Pakistan */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Delivery Address
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Complete Street Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Apartment #, Street, Block, Phase, Landmark"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53] ${
                      formErrors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                    >
                      {PAKISTAN_MAJOR_CITIES.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {city === 'Other City' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Specify City Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter City"
                        value={customCity}
                        onChange={e => setCustomCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Province *
                    </label>
                    <select
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                    >
                      {PAKISTAN_PROVINCES.map(p => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 54000"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Order Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please call before arriving or leave with security gate"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              {/* Step 3: Payment Method Selection */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Payment Method
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery (Standard) */}
                  <label
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-[#4A6B53] bg-[#EBF3ED]/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="mt-1 text-[#4A6B53] focus:ring-[#4A6B53]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span>Cash on Delivery (COD)</span>
                        </span>
                        <span className="text-[10px] font-bold text-[#2F533A] bg-[#EBF3ED] border border-[#D3E5D7] px-2 py-0.5 rounded-full uppercase">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Pay with cash to the courier rider upon parcel delivery at your doorstep. No prepayment required.
                      </p>
                    </div>
                  </label>

                  {/* Online Payment (Structure ready) */}
                  <label
                    onClick={() => setPaymentMethod('Online Payment')}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Online Payment'
                        ? 'border-[#4A6B53] bg-[#EBF3ED]/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Online Payment'}
                      onChange={() => setPaymentMethod('Online Payment')}
                      className="mt-1 text-[#4A6B53] focus:ring-[#4A6B53]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span>Online Payment (Debit/Credit Card, EasyPaisa, JazzCash)</span>
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Gateway In Setup
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        (Online gateway merchant configuration is prepared. Please select Cash on Delivery for immediate same-day order processing.)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 font-['Outfit']">
                  Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {formatPKR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing calculations */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatPKR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-slate-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold uppercase">FREE</span>
                      ) : (
                        formatPKR(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-950">
                    <span>Total Amount (PKR)</span>
                    <span className="text-[#2F533A] font-black text-xl">
                      {formatPKR(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-extrabold text-sm shadow-xl shadow-[#4A6B53]/25 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>
                    {isSubmitting ? 'Placing Your Order...' : `Place Order • ${formatPKR(cartTotal)}`}
                  </span>
                </button>

                {/* Guarantees */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>AIO PRODUCT Assurance</span>
                  </div>
                  <p>
                    Pay only when you receive your package. Includes 7-day hassle-free checking warranty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
