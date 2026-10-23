import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, RefreshCw, X, Zap, CloudUpload } from 'lucide-react';
import { readFileAsOptimizedDataURL, resolveImageUrl, FALLBACK_PRODUCT_IMAGE } from '../lib/utils';
import { uploadImageToSupabaseStorage, isSupabaseConnected } from '../lib/supabase';

interface ImagePickerInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  presets?: Array<{ label: string; url: string }>;
  showPresets?: boolean;
  className?: string;
  compact?: boolean;
  placeholder?: string;
}

export const ImagePickerInput: React.FC<ImagePickerInputProps> = ({
  value,
  onChange,
  label = 'Product Image',
  presets,
  showPresets = true,
  className = '',
  compact = false,
  placeholder = 'Paste direct image link...',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [linkInput, setLinkInput] = useState(value && !value.startsWith('data:') ? value : '');

  const isDataUrl = value && value.startsWith('data:');
  const isSupabaseHosted = value && (value.includes('.supabase.co/storage') || value.includes('/aio-media/'));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file format: JPEG, JPG, PNG, WEBP
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a valid JPEG, JPG, or PNG image.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setUploadStatus('Optimizing image...');
    try {
      const optimizedDataUrl = await readFileAsOptimizedDataURL(file, 1200, 0.85);

      // Attempt Supabase Storage upload if connected
      if (isSupabaseConnected()) {
        setUploadStatus('Uploading to Supabase Storage...');
        const res = await uploadImageToSupabaseStorage(optimizedDataUrl, 'products');
        if (res.success && res.url && !res.url.startsWith('data:')) {
          onChange(res.url);
          setUploadStatus('Saved to Supabase Storage (CDN)');
        } else {
          // Fallback to optimized data url
          onChange(optimizedDataUrl);
          setUploadStatus('Saved locally');
        }
      } else {
        onChange(optimizedDataUrl);
        setUploadStatus('Saved to local storage');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to read image from device.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadStatus(''), 3000);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLinkApply = (url: string) => {
    const resolved = resolveImageUrl(url);
    setLinkInput(resolved);
    if (resolved.trim()) {
      onChange(resolved.trim());
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    onChange('');
    setLinkInput('');
    setErrorMessage('');
  };

  return (
    <div className={`space-y-2.5 text-left ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            JPEG, JPG, PNG from device or web link
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        {/* Top: Thumbnail Preview & Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative group w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {value ? (
              <img
                src={resolveImageUrl(value)}
                alt="Product preview"
                className="w-full h-full object-contain"
                onError={e => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = FALLBACK_PRODUCT_IMAGE;
                }}
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-300" />
            )}
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-0 bg-slate-950/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Mode Switch Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Device (JPEG/PNG)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('link')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'link'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Web Link</span>
              </button>
            </div>

            <div className="mt-1.5 text-[11px] text-slate-500 truncate">
              {uploadStatus ? (
                <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-600" /> {uploadStatus}
                </span>
              ) : isSupabaseHosted ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <CloudUpload className="w-3.5 h-3.5 text-emerald-600" /> Supabase Storage CDN Hosted
                </span>
              ) : isDataUrl ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <Check className="w-3 h-3 text-emerald-600" /> Device image attached (JPEG/PNG)
                </span>
              ) : value?.includes('imgpile.com') || value?.includes('JMYwJYO') ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> imgpile active live image
                </span>
              ) : value ? (
                <span className="font-mono text-[10px] truncate block max-w-xs">{value}</span>
              ) : (
                <span>No image chosen yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Upload Mode */}
        {activeTab === 'upload' && (
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg,image/webp"
              className="hidden"
            />
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 rounded-xl text-xs font-bold text-amber-900 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Processing device photo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Choose JPEG / JPG / PNG Image from Device</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Works directly on mobile & desktop. Photos are automatically optimized.
            </p>
          </div>
        )}

        {/* Link Mode */}
        {activeTab === 'link' && (
          <div className="flex gap-2 items-center">
            <input
              type="url"
              value={linkInput}
              onChange={e => {
                const raw = e.target.value;
                setLinkInput(raw);
                const resolved = resolveImageUrl(raw);
                onChange(resolved);
              }}
              placeholder="Paste image URL (https://... or https://imgpile.com/...)"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:border-amber-500"
            />
            {linkInput !== value && (
              <button
                type="button"
                onClick={() => handleLinkApply(linkInput)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Apply
              </button>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Optional Presets */}
        {showPresets && presets && presets.length > 0 && !compact && (
          <div className="pt-2 border-t border-slate-200/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Or Choose from Presets:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleLinkApply(preset.url);
                    setActiveTab('link');
                  }}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    value === preset.url
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-4 h-4 rounded-sm object-cover"
                  />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
