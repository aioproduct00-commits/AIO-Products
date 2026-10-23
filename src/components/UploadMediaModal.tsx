import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  File,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { uploadMediaFileToStorage, detectMediaCategory, formatBytes, isSupabaseConnected } from '../lib/supabase';
import { MediaFileType } from '../types';

const CATEGORIES = [
  'Product Catalogs',
  'Promotional Banners',
  'Brand Assets',
  'User Manuals & Policy',
  'Videos & Demos',
  'Audio Guides',
  'General Media',
];

export const UploadMediaModal: React.FC = () => {
  const { isUploadMediaModalOpen, setIsUploadMediaModalOpen, saveMedia, showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'device' | 'url'>('device');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [directUrl, setDirectUrl] = useState<string>('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [detectedType, setDetectedType] = useState<MediaFileType>('document');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [fileName, setFileName] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isUploadMediaModalOpen) return null;

  const resetForm = () => {
    setSelectedFile(null);
    setFilePreviewUrl('');
    setDirectUrl('');
    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setDetectedType('document');
    setFileSizeStr('');
    setFileName('');
    setErrorMessage('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetForm();
    setIsUploadMediaModalOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);
    setFileSizeStr(formatBytes(file.size));

    const type = detectMediaCategory(file.name, file.type);
    setDetectedType(type);

    // Auto-generate title from filename if title is empty
    if (!title) {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .trim();
      setTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }

    // Auto-suggest category based on type
    if (type === 'image') setCategory('Promotional Banners');
    else if (type === 'video') setCategory('Videos & Demos');
    else if (type === 'audio') setCategory('Audio Guides');
    else if (type === 'archive') setCategory('Brand Assets');
    else setCategory('Product Catalogs');

    // Create thumbnail preview if image or video
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl('');
    }
    setErrorMessage('');
  };

  const handleDirectUrlChange = (url: string) => {
    setDirectUrl(url);
    if (url.trim()) {
      const urlParts = url.split('/');
      const guessedName = urlParts[urlParts.length - 1].split('?')[0] || 'media_asset';
      setFileName(guessedName);
      const type = detectMediaCategory(guessedName);
      setDetectedType(type);

      if (!title) {
        const cleanTitle = guessedName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
        if (cleanTitle) {
          setTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a title for the media file.');
      return;
    }

    if (activeTab === 'device' && !selectedFile) {
      setErrorMessage('Please select a file to upload from your device.');
      return;
    }

    if (activeTab === 'url' && !directUrl.trim()) {
      setErrorMessage('Please enter a valid media file web link / URL.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setUploadProgress(20);

    try {
      let finalFileUrl = directUrl.trim();
      let finalSize = fileSizeStr || 'Web Link';
      let finalName = fileName || 'media_file';
      let finalType = detectedType;

      if (activeTab === 'device' && selectedFile) {
        setUploadProgress(45);
        const res = await uploadMediaFileToStorage(selectedFile, 'media');
        setUploadProgress(80);
        finalFileUrl = res.url;
        finalSize = res.fileSize;
        finalName = res.fileName;
        finalType = res.fileType;
      }

      await saveMedia({
        title: title.trim(),
        description: description.trim(),
        file_url: finalFileUrl,
        file_name: finalName,
        file_type: finalType,
        file_size: finalSize,
        category,
        is_public: true,
      });

      setUploadProgress(100);
      showToast(`"${title.trim()}" added to Media Library!`, 'success');
      handleClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to upload media. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getTypeIcon = (type: MediaFileType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-amber-500" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-rose-500" />;
      case 'document':
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-[#1B3224] text-white px-6 py-5 flex items-center justify-between border-b border-[#2D4837]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#88C49A]">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-['Outfit']">
                Add Media File
              </h3>
              <p className="text-xs text-white/70">
                Upload catalogs, videos, audios, PDFs, or banners accessible to all visitors.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tabs: Device Upload vs Web URL */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('device')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'device'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload From Device</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Direct Web URL / Link</span>
            </button>
          </div>

          {/* TAB 1: File Input */}
          {activeTab === 'device' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#4A6B53] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-[#F2F7F4] group"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 mx-auto flex items-center justify-center text-slate-500 group-hover:text-[#4A6B53] mb-3 transition-colors">
                    <CloudUpload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop any file
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports PDFs, Catalogs, Images (JPG, PNG, WEBP), Videos (MP4), Audios (MP3), ZIPs
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">PDF / Doc</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Image</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700">Video</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">Audio</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700">ZIP</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#F2F7F4] border border-[#D5E3DA] flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {filePreviewUrl ? (
                      <img
                        src={filePreviewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {getTypeIcon(detectedType)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{fileName}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-[#4A6B53]">{fileSizeStr}</span>
                        <span>•</span>
                        <span className="capitalize uppercase text-[10px] font-bold text-slate-600">
                          {detectedType}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreviewUrl('');
                      setFileName('');
                      setFileSizeStr('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Direct Web URL */}
          {activeTab === 'url' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Direct File URL / Web Link
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://example.com/assets/catalog.pdf or image link..."
                  value={directUrl}
                  onChange={e => handleDirectUrlChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter any direct download link, hosted PDF document, YouTube demo link, or media CDN link.
              </p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              File Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Official Product Catalog 2026, Earbuds Feature Video..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
              required
            />
          </div>

          {/* Category & File Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Media Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4A6B53] bg-white cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detected File Format
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800">
                {getTypeIcon(detectedType)}
                <span className="capitalize">{detectedType} Asset</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Brief Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Explain what this file contains for visitors and customers..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B53]"
            />
          </div>

          {/* Error display */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload progress indicator */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#4A6B53]">
                <span>Uploading to Media Library...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#4A6B53] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Upload & Publish to Library</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
