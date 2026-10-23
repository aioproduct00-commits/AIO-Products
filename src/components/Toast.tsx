import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white/95 text-slate-800 shadow-emerald-500/10',
    error: 'border-rose-200 bg-white/95 text-slate-800 shadow-rose-500/10',
    info: 'border-amber-200 bg-white/95 text-slate-800 shadow-amber-500/10',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="text-sm font-medium leading-relaxed">{toast.message}</div>
      </div>
    </div>
  );
};
