import React from 'react';
import {
  Award,
  ShieldCheck,
  Truck,
  Clock,
  Headphones,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhyChooseUs: React.FC = () => {
  const { siteSettings } = useStore();
  const config = siteSettings.whyChooseUs || {
    heading: 'Why Choose AIO PRODUCT',
    subheading: 'Built on trust, speed, and uncompromised standard for shoppers across Pakistan.',
    items: [],
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-6 h-6 text-amber-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-indigo-500" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-purple-500" />;
      default:
        return <HeartHandshake className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-2">
            The AIO Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit'] tracking-tight">
            {config.heading}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {config.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {config.items?.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-start text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-4">
                {getIcon(item.iconName)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
