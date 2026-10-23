import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Edit3,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactView: React.FC = () => {
  const { siteSettings, showToast, goBack, isAdminLoggedIn, openLiveEdit } = useStore();
  const contact = siteSettings.contact || {
    phone: '+92 347 5429514',
    whatsapp: '+92 347 5429514',
    email: 'info@aioproduct.pk',
    address: 'Lahore, Pakistan',
    hours: 'Monday – Saturday: 9:00 AM – 9:00 PM PKT',
  };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const whatsappClean = (contact.whatsapp || '923475429514').replace(/[^0-9]/g, '');

  const handleSendViaWhatsApp = () => {
    if (!message.trim() && !name.trim()) {
      window.open(`https://wa.me/${whatsappClean}`, '_blank');
      return;
    }
    const text = `*New Customer Inquiry from AIO PRODUCT Website*\n*Name:* ${name || 'Customer'}\n*Phone:* ${phone || 'N/A'}\n*Subject:* ${subject || 'General Inquiry'}\n*Message:* ${message || 'Hello, I have an inquiry.'}`;
    window.open(`https://wa.me/${whatsappClean}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = 'AIO-INQ-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedTicket);
    setIsSent(true);
    showToast(`Inquiry #${generatedTicket} logged! We will reach out shortly.`, 'success');
  };

  return (
    <div className="bg-slate-50 py-8 sm:py-16 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#4A6B53] text-xs font-bold shadow-xs transition-all hover:-translate-x-0.5 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#4A6B53]" />
            <span>Back to Home</span>
          </button>

          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={() => openLiveEdit('contact')}
              className="px-3.5 py-1.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Contact Info</span>
            </button>
          )}
        </div>

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block mb-2">
            Pakistan Customer Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-['Outfit'] tracking-tight">
            We&apos;re Here to Help
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Have questions about an item, delivery status, or cash on delivery? Connect with our dedicated team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Priority Card */}
            <div className="p-6 rounded-3xl bg-[#132218] text-white border border-[#2F533A] shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A6B53]/30 text-[#88C49A] text-xs font-bold uppercase border border-[#4A6B53]/40">
                  <span>Fastest Response</span>
                </div>
                <h3 className="text-xl font-bold font-['Outfit']">WhatsApp Instant Support</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Chat directly with an AIO product advisor for rapid order confirmations, parcel queries, or warranty support.
                </p>
                <a
                  href={`https://wa.me/${whatsappClean}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp ({contact.whatsapp})</span>
                </a>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0 border border-[#D3E5D7]">
                  <Phone className="w-5 h-5 text-[#4A6B53]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Phone Call Support</h4>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm font-bold text-slate-800 hover:text-[#4A6B53] block mt-0.5"
                  >
                    {contact.phone}
                  </a>
                  <span className="text-[11px] text-slate-400">{contact.hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Email Support</h4>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm font-bold text-slate-800 hover:text-[#4A6B53] block mt-0.5"
                  >
                    {contact.email}
                  </a>
                  <span className="text-[11px] text-slate-400">Response within 24 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">
                    Pakistan Fulfillment Center
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{contact.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
              <h3 className="text-xl font-extrabold text-slate-950 font-['Outfit'] mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in the details below and our customer representative will get in touch with you shortly.
              </p>

              {isSent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Message Received!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Your inquiry reference is <strong className="font-mono text-slate-900">{ticketId}</strong>. We will contact you on your provided phone number or email.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleSendViaWhatsApp}
                      className="px-5 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Forward to WhatsApp ({contact.whatsapp})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setName('');
                        setPhone('');
                        setSubject('');
                        setMessage('');
                        setIsSent(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Mehmood"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject / Inquiry Reason *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Order Delivery Status, Bulk Order, Product Inquiry"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we assist you today?"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendViaWhatsApp}
                      className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#EDF4F0] text-[#243F2E] font-bold text-xs border border-[#88C49A] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#4A6B53]" />
                      <span>Send via WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
