import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Save,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Layers,
  Megaphone,
  Percent,
  PhoneCall,
  Info,
  Star,
  Award,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category, SiteSettings } from '../types';
import { ImagePickerInput } from './ImagePickerInput';

export const LiveSiteEditorModal: React.FC = () => {
  const {
    liveEditType,
    liveEditData,
    closeLiveEdit,
    siteSettings,
    updateSiteContent,
    categories,
    saveCategory,
    deleteCategory,
    writeReview,
    showToast,
  } = useStore();

  const [isSaving, setIsSaving] = useState(false);

  // Form states based on active liveEditType
  // 1. Hero
  const [heroBadge, setHeroBadge] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSupportingText, setHeroSupportingText] = useState('');
  const [heroPrimaryBtn, setHeroPrimaryBtn] = useState('');
  const [heroSecondaryBtn, setHeroSecondaryBtn] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  // 2. Announcement
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementPhone, setAnnouncementPhone] = useState('');
  const [announcementWhatsapp, setAnnouncementWhatsapp] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  // 3. Category
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const [categoryIsActive, setCategoryIsActive] = useState(true);

  // 4. Special Offer
  const [offerBadge, setOfferBadge] = useState('');
  const [offerHeading, setOfferHeading] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerImageUrl, setOfferImageUrl] = useState('');
  const [offerButtonText, setOfferButtonText] = useState('');

  // 5. About
  const [aboutHeading, setAboutHeading] = useState('');
  const [aboutTagline, setAboutTagline] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [aboutStory1, setAboutStory1] = useState('');
  const [aboutStory2, setAboutStory2] = useState('');

  // 6. Contact
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactHours, setContactHours] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialTiktok, setSocialTiktok] = useState('');

  // 7. Why Choose
  const [whyHeading, setWhyHeading] = useState('');
  const [whySubheading, setWhySubheading] = useState('');

  // 8. Review
  const [revCustomerName, setRevCustomerName] = useState('');
  const [revProductName, setRevProductName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revText, setRevText] = useState('');

  // Populate form when opened
  useEffect(() => {
    if (!liveEditType) return;

    if (liveEditType === 'hero') {
      const hero = siteSettings.hero || {
        badge: 'AIO PRODUCT',
        headline: 'Because Brand Matters.',
        supportingText: 'Discover quality products, shop with confidence, and enjoy a simple online shopping experience with AIO PRODUCT.',
        primaryButtonText: 'Shop Now',
        secondaryButtonText: 'Explore Categories',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
      };
      setHeroBadge(hero.badge || 'AIO PRODUCT');
      setHeroHeadline(hero.headline || 'Because Brand Matters.');
      setHeroSupportingText(hero.supportingText || '');
      setHeroPrimaryBtn(hero.primaryButtonText || 'Shop Now');
      setHeroSecondaryBtn(hero.secondaryButtonText || 'Explore Categories');
      setHeroImageUrl(hero.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80');
    } else if (liveEditType === 'announcement') {
      const ann = siteSettings.announcementBar || {
        enabled: true,
        text: 'Nationwide Delivery Across Pakistan',
        supportPhone: '+92 347 5429514',
        whatsappNumber: '+92 347 5429514',
      };
      setAnnouncementText(ann.text || 'Nationwide Delivery Across Pakistan');
      setAnnouncementPhone(ann.supportPhone || '+92 347 5429514');
      setAnnouncementWhatsapp(ann.whatsappNumber || '+92 347 5429514');
      setAnnouncementEnabled(ann.enabled ?? true);
    } else if (liveEditType === 'category') {
      const cat = liveEditData as Category | undefined;
      if (cat) {
        setCategoryName(cat.name || '');
        setCategorySlug(cat.slug || '');
        setCategoryDescription(cat.description || '');
        setCategoryImageUrl(cat.image_url || '');
        setCategoryIsActive(cat.is_active ?? true);
      } else {
        // New category
        setCategoryName('');
        setCategorySlug('');
        setCategoryDescription('');
        setCategoryImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80');
        setCategoryIsActive(true);
      }
    } else if (liveEditType === 'special_offer') {
      const offer = siteSettings.specialOffer || {
        badge: 'Special Offer',
        heading: 'UP TO 50% OFF',
        description: 'On selected products, Limited time only!',
        buttonText: 'Shop Now',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
      };
      setOfferBadge(offer.badge || 'Special Offer');
      setOfferHeading(offer.heading || 'UP TO 50% OFF');
      setOfferDescription(offer.description || 'On selected products, Limited time only!');
      setOfferButtonText(offer.buttonText || 'Shop Now');
      setOfferImageUrl(offer.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
    } else if (liveEditType === 'about') {
      const ab = siteSettings.about || {
        heading: 'Because Brand Matters.',
        tagline: 'Because Brand Matters.',
        description: 'AIO PRODUCT is a modern online shopping brand focused on bringing useful, quality, and carefully selected products to customers in Pakistan.',
        storyParagraph1: 'We aim to provide a simple, trustworthy, convenient, and enjoyable online shopping experience.',
        storyParagraph2: 'Because Brand Matters — every product, order, and customer experience should reflect quality and trust.',
      };
      setAboutHeading(ab.heading || 'Because Brand Matters.');
      setAboutTagline(ab.tagline || 'Because Brand Matters.');
      setAboutDescription(ab.description || '');
      setAboutStory1(ab.storyParagraph1 || '');
      setAboutStory2(ab.storyParagraph2 || '');
    } else if (liveEditType === 'contact') {
      const ct = siteSettings.contact || {
        phone: '+92 347 5429514',
        whatsapp: '+92 347 5429514',
        email: 'info@aioproduct.pk',
        address: 'Lahore, Pakistan',
        hours: 'Monday – Saturday: 9:00 AM – 9:00 PM PKT',
      };
      const sc = siteSettings.social || {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        tiktok: 'https://tiktok.com',
      };
      setContactPhone(ct.phone || '+92 347 5429514');
      setContactWhatsapp(ct.whatsapp || '+92 347 5429514');
      setContactEmail(ct.email || 'info@aioproduct.pk');
      setContactAddress(ct.address || 'Lahore, Pakistan');
      setContactHours(ct.hours || 'Monday – Saturday: 9:00 AM – 9:00 PM PKT');
      setSocialFacebook(sc.facebook || '');
      setSocialInstagram(sc.instagram || '');
      setSocialTiktok(sc.tiktok || '');
    } else if (liveEditType === 'why_choose') {
      const wc = siteSettings.whyChooseUs || {
        heading: 'Why Choose AIO PRODUCT',
        subheading: 'Built on trust, speed, and uncompromised standard for shoppers across Pakistan.',
        items: [],
      };
      setWhyHeading(wc.heading || 'Why Choose AIO PRODUCT');
      setWhySubheading(wc.subheading || '');
    } else if (liveEditType === 'review') {
      setRevCustomerName('');
      setRevProductName('Featured AIO Collection');
      setRevRating(5);
      setRevText('');
    }
  }, [liveEditType, liveEditData, siteSettings]);

  if (!liveEditType) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (liveEditType === 'hero') {
        const updated: SiteSettings = {
          ...siteSettings,
          hero: {
            ...siteSettings.hero,
            badge: heroBadge.trim(),
            headline: heroHeadline.trim(),
            supportingText: heroSupportingText.trim(),
            primaryButtonText: heroPrimaryBtn.trim(),
            secondaryButtonText: heroSecondaryBtn.trim(),
            imageUrl: heroImageUrl.trim(),
          },
        };
        await updateSiteContent(updated);
        showToast('Hero section updated successfully!', 'success');
      } else if (liveEditType === 'announcement') {
        const updated: SiteSettings = {
          ...siteSettings,
          announcementBar: {
            ...siteSettings.announcementBar,
            enabled: announcementEnabled,
            text: announcementText.trim(),
            supportPhone: announcementPhone.trim(),
            whatsappNumber: announcementWhatsapp.trim(),
          },
        };
        await updateSiteContent(updated);
        showToast('Top Announcement Bar updated!', 'success');
      } else if (liveEditType === 'category') {
        const existingCat = liveEditData as Category | undefined;
        const generatedSlug = (categorySlug || categoryName)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        await saveCategory({
          id: existingCat?.id,
          name: categoryName.trim(),
          slug: generatedSlug || 'category',
          description: categoryDescription.trim(),
          image_url: categoryImageUrl.trim(),
          is_active: categoryIsActive,
        });
        showToast(existingCat ? 'Category updated!' : 'New category created!', 'success');
      } else if (liveEditType === 'special_offer') {
        const updated: SiteSettings = {
          ...siteSettings,
          specialOffer: {
            ...siteSettings.specialOffer,
            badge: offerBadge.trim(),
            heading: offerHeading.trim(),
            description: offerDescription.trim(),
            buttonText: offerButtonText.trim(),
            imageUrl: offerImageUrl.trim(),
          },
        };
        await updateSiteContent(updated);
        showToast('Special offer section updated!', 'success');
      } else if (liveEditType === 'about') {
        const updated: SiteSettings = {
          ...siteSettings,
          about: {
            ...siteSettings.about,
            heading: aboutHeading.trim(),
            tagline: aboutTagline.trim(),
            description: aboutDescription.trim(),
            storyParagraph1: aboutStory1.trim(),
            storyParagraph2: aboutStory2.trim(),
          },
        };
        await updateSiteContent(updated);
        showToast('About Us content updated!', 'success');
      } else if (liveEditType === 'contact') {
        const updated: SiteSettings = {
          ...siteSettings,
          contact: {
            ...siteSettings.contact,
            phone: contactPhone.trim(),
            whatsapp: contactWhatsapp.trim(),
            email: contactEmail.trim(),
            address: contactAddress.trim(),
            hours: contactHours.trim(),
          },
          social: {
            ...siteSettings.social,
            facebook: socialFacebook.trim(),
            instagram: socialInstagram.trim(),
            tiktok: socialTiktok.trim(),
          },
        };
        await updateSiteContent(updated);
        showToast('Contact & store information updated!', 'success');
      } else if (liveEditType === 'why_choose') {
        const updated: SiteSettings = {
          ...siteSettings,
          whyChooseUs: {
            ...siteSettings.whyChooseUs,
            heading: whyHeading.trim(),
            subheading: whySubheading.trim(),
          },
        };
        await updateSiteContent(updated);
        showToast('Why Choose Us updated!', 'success');
      } else if (liveEditType === 'review') {
        await writeReview({
          product_id: 'prod-featured',
          product_name: revProductName.trim() || 'AIO Product',
          customer_name: revCustomerName.trim() || 'Verified Customer',
          rating: revRating,
          review_text: revText.trim(),
        });
        showToast('Customer review added successfully!', 'success');
      }

      closeLiveEdit();
    } catch (err) {
      console.error('Error saving item:', err);
      showToast('Failed to save changes. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getTitle = () => {
    switch (liveEditType) {
      case 'hero':
        return 'Edit Hero Section & Headlines';
      case 'announcement':
        return 'Edit Announcement Bar & Contact Details';
      case 'category':
        return (liveEditData as Category)?.id ? 'Edit Category' : 'Add New Category';
      case 'special_offer':
        return 'Edit Special Offer Banner & Deal';
      case 'about':
        return 'Edit About Us Story & Branding';
      case 'contact':
        return 'Edit Contact & Store Details';
      case 'why_choose':
        return 'Edit Why Choose Us Section';
      case 'review':
        return 'Add Customer Review';
      default:
        return 'Edit Site Item';
    }
  };

  const getIcon = () => {
    switch (liveEditType) {
      case 'hero':
        return <Sparkles className="w-5 h-5 text-[#88C49A]" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-[#88C49A]" />;
      case 'category':
        return <Layers className="w-5 h-5 text-[#88C49A]" />;
      case 'special_offer':
        return <Percent className="w-5 h-5 text-[#88C49A]" />;
      case 'about':
        return <Info className="w-5 h-5 text-[#88C49A]" />;
      case 'contact':
        return <PhoneCall className="w-5 h-5 text-[#88C49A]" />;
      case 'why_choose':
        return <Award className="w-5 h-5 text-[#88C49A]" />;
      case 'review':
        return <Star className="w-5 h-5 text-[#88C49A]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#88C49A]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header in Sage Green */}
        <div className="px-6 py-4 bg-[#182C1F] text-white flex items-center justify-between border-b border-[#2A4734]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#26422F] border border-[#3E634A] flex items-center justify-center shadow-xs">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-['Outfit']">{getTitle()}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#88C49A]/20 text-[#88C49A] border border-[#88C49A]/30">
                  Live Editor
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Changes apply immediately across the entire website.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLiveEdit}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* HERO SECTION FORM */}
          {liveEditType === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sage Pill Badge Text
                </label>
                <input
                  type="text"
                  required
                  value={heroBadge}
                  onChange={e => setHeroBadge(e.target.value)}
                  placeholder="AIO PRODUCT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  required
                  value={heroHeadline}
                  onChange={e => setHeroHeadline(e.target.value)}
                  placeholder="Because Brand Matters."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Example: <em>Because Brand Matters.</em> (renders in crisp white and luminous sage)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supporting Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={heroSupportingText}
                  onChange={e => setHeroSupportingText(e.target.value)}
                  placeholder="Discover quality products, shop with confidence..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    required
                    value={heroPrimaryBtn}
                    onChange={e => setHeroPrimaryBtn(e.target.value)}
                    placeholder="Shop Now"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    required
                    value={heroSecondaryBtn}
                    onChange={e => setHeroSecondaryBtn(e.target.value)}
                    placeholder="Explore Categories"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              <ImagePickerInput
                label="Hero Showcase Composite Photo"
                value={heroImageUrl}
                onChange={setHeroImageUrl}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          )}

          {/* ANNOUNCEMENT BAR FORM */}
          {liveEditType === 'announcement' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Announcement Notice Text
                </label>
                <input
                  type="text"
                  required
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  placeholder="Nationwide Delivery Across Pakistan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={announcementPhone}
                    onChange={e => setAnnouncementPhone(e.target.value)}
                    placeholder="03475429514"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={announcementWhatsapp}
                    onChange={e => setAnnouncementWhatsapp(e.target.value)}
                    placeholder="03475429514"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ann-enabled"
                  checked={announcementEnabled}
                  onChange={e => setAnnouncementEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4A6B53] focus:ring-[#4A6B53]"
                />
                <label htmlFor="ann-enabled" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Show Top Announcement Bar on Storefront
                </label>
              </div>
            </div>
          )}

          {/* CATEGORY FORM */}
          {liveEditType === 'category' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={e => {
                      setCategoryName(e.target.value);
                      if (!categorySlug || !(liveEditData as Category)?.id) {
                        setCategorySlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '')
                        );
                      }
                    }}
                    placeholder="e.g. Smart Electronics"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={categorySlug}
                    onChange={e => setCategorySlug(e.target.value)}
                    placeholder="e.g. smart-electronics"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={categoryDescription}
                  onChange={e => setCategoryDescription(e.target.value)}
                  placeholder="e.g. Earbuds, smartwatches & tech gadgets"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <ImagePickerInput
                label="Category Photo"
                value={categoryImageUrl}
                onChange={setCategoryImageUrl}
                placeholder="https://images.unsplash.com/..."
              />

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={categoryIsActive}
                    onChange={e => setCategoryIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A6B53] focus:ring-[#4A6B53]"
                  />
                  <span>Active & Visible in Categories Grid</span>
                </label>

                {(liveEditData as Category)?.id && (
                  <button
                    type="button"
                    onClick={async () => {
                      const cat = liveEditData as Category;
                      if (window.confirm(`Delete category "${cat.name}"?`)) {
                        await deleteCategory(cat.id);
                        showToast('Category deleted', 'info');
                        closeLiveEdit();
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Category</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SPECIAL OFFER FORM */}
          {liveEditType === 'special_offer' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    required
                    value={offerBadge}
                    onChange={e => setOfferBadge(e.target.value)}
                    placeholder="Special Offer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Offer Heading (e.g. UP TO 50% OFF)
                  </label>
                  <input
                    type="text"
                    required
                    value={offerHeading}
                    onChange={e => setOfferHeading(e.target.value)}
                    placeholder="UP TO 50% OFF"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Offer Subtitle / Description
                </label>
                <input
                  type="text"
                  required
                  value={offerDescription}
                  onChange={e => setOfferDescription(e.target.value)}
                  placeholder="On selected products, Limited time only!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  required
                  value={offerButtonText}
                  onChange={e => setOfferButtonText(e.target.value)}
                  placeholder="Shop Now"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <ImagePickerInput
                label="Offer Product Image"
                value={offerImageUrl}
                onChange={setOfferImageUrl}
                placeholder="https://images.unsplash.com/photo-1546868871-7041f2a55e12..."
              />
            </div>
          )}

          {/* ABOUT US FORM */}
          {liveEditType === 'about' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Headline
                </label>
                <input
                  type="text"
                  required
                  value={aboutHeading}
                  onChange={e => setAboutHeading(e.target.value)}
                  placeholder="Because Brand Matters."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  required
                  value={aboutTagline}
                  onChange={e => setAboutTagline(e.target.value)}
                  placeholder="Because Brand Matters."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Main Summary Paragraph
                </label>
                <textarea
                  rows={3}
                  required
                  value={aboutDescription}
                  onChange={e => setAboutDescription(e.target.value)}
                  placeholder="AIO PRODUCT is a modern online shopping brand focused on bringing useful, quality products..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Story Paragraph 1
                </label>
                <textarea
                  rows={2}
                  value={aboutStory1}
                  onChange={e => setAboutStory1(e.target.value)}
                  placeholder="We aim to provide a simple, trustworthy, convenient..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Story Paragraph 2
                </label>
                <textarea
                  rows={2}
                  value={aboutStory2}
                  onChange={e => setAboutStory2(e.target.value)}
                  placeholder="Because Brand Matters — every product, order, and customer experience..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>
            </div>
          )}

          {/* CONTACT & STORE DETAILS FORM */}
          {liveEditType === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Phone (Call Support)
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="+92 347 5429514"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store WhatsApp (Orders & Chat)
                  </label>
                  <input
                    type="text"
                    required
                    value={contactWhatsapp}
                    onChange={e => setContactWhatsapp(e.target.value)}
                    placeholder="03475429514"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="info@aioproduct.pk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    required
                    value={contactAddress}
                    onChange={e => setContactAddress(e.target.value)}
                    placeholder="Lahore, Pakistan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Operating / Support Hours
                </label>
                <input
                  type="text"
                  required
                  value={contactHours}
                  onChange={e => setContactHours(e.target.value)}
                  placeholder="Monday – Saturday: 9:00 AM – 9:00 PM PKT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Social Media Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="url"
                    value={socialFacebook}
                    onChange={e => setSocialFacebook(e.target.value)}
                    placeholder="Facebook URL"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-[#4A6B53]"
                  />
                  <input
                    type="url"
                    value={socialInstagram}
                    onChange={e => setSocialInstagram(e.target.value)}
                    placeholder="Instagram URL"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-[#4A6B53]"
                  />
                  <input
                    type="url"
                    value={socialTiktok}
                    onChange={e => setSocialTiktok(e.target.value)}
                    placeholder="TikTok URL"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-[#4A6B53]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WHY CHOOSE US FORM */}
          {liveEditType === 'why_choose' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  required
                  value={whyHeading}
                  onChange={e => setWhyHeading(e.target.value)}
                  placeholder="Why Choose AIO PRODUCT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Subheading
                </label>
                <textarea
                  rows={2}
                  required
                  value={whySubheading}
                  onChange={e => setWhySubheading(e.target.value)}
                  placeholder="Built on trust, speed, and uncompromised standard for shoppers across Pakistan."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>
            </div>
          )}

          {/* REVIEW FORM */}
          {liveEditType === 'review' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={revCustomerName}
                    onChange={e => setRevCustomerName(e.target.value)}
                    placeholder="e.g. Zaid Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Reference / Tag
                  </label>
                  <input
                    type="text"
                    value={revProductName}
                    onChange={e => setRevProductName(e.target.value)}
                    placeholder="e.g. Smart Watch Series 8"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rating Stars
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRevRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= revRating ? 'fill-current text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700">{revRating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Review Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={revText}
                  onChange={e => setRevText(e.target.value)}
                  placeholder="Write the customer testimonial here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeLiveEdit}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
