import React, { useState, useMemo } from 'react';
import {
  Download,
  Upload,
  Search,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  Eye,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  X,
  Play,
  Share2,
  FileDown,
  Layers,
  Sparkles,
  ShieldCheck,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MediaItem, MediaFileType } from '../types';
import { formatDate } from '../lib/utils';

export const MediaLibraryView: React.FC = () => {
  const {
    mediaItems,
    openUploadMediaModal,
    downloadMediaFile,
    deleteMedia,
    isAdminLoggedIn,
    showToast,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | MediaFileType>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Compute available categories from actual media items
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    mediaItems.forEach(m => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [mediaItems]);

  // Filtered media items
  const filteredItems = useMemo(() => {
    return mediaItems.filter(item => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        selectedTypeFilter === 'all' || item.file_type === selectedTypeFilter;

      const matchesCategory =
        selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [mediaItems, searchQuery, selectedTypeFilter, selectedCategoryFilter]);

  const totalDownloads = useMemo(() => {
    return mediaItems.reduce((acc, curr) => acc + (curr.download_count || 0), 0);
  }, [mediaItems]);

  const handleCopyLink = (item: MediaItem) => {
    try {
      navigator.clipboard.writeText(item.file_url);
      setCopiedId(item.id);
      showToast(`Copied download link for "${item.title}"`, 'success');
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      showToast('Link copied to clipboard', 'info');
    }
  };

  const handleDelete = (item: MediaItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}" from the Media Library?`)) {
      deleteMedia(item.id);
    }
  };

  const getTypeBadge = (type: MediaFileType) => {
    switch (type) {
      case 'image':
        return {
          icon: <ImageIcon className="w-3.5 h-3.5" />,
          label: 'Image',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'video':
        return {
          icon: <Video className="w-3.5 h-3.5" />,
          label: 'Video',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'audio':
        return {
          icon: <Music className="w-3.5 h-3.5" />,
          label: 'Audio',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'archive':
        return {
          icon: <Archive className="w-3.5 h-3.5" />,
          label: 'Archive',
          color: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'document':
      default:
        return {
          icon: <FileText className="w-3.5 h-3.5" />,
          label: 'Document',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] font-sans pb-16">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-b from-[#132218] via-[#1B3224] to-[#254230] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#355841]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#88C49A] text-xs font-bold uppercase tracking-wider border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#A5D9B7]" />
              <span>Public Brand & Product Assets</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight">
              AIO PRODUCT Media Library
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Access and download official product catalogs, high-resolution photography, unboxing videos, brand logos, user manuals, and warranty documentation.
            </p>
          </div>

          {/* Action & Stats Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openUploadMediaModal}
              className="px-6 py-3 rounded-xl bg-[#88C49A] hover:bg-[#72b085] text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-[#88C49A]/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
            >
              <Upload className="w-4 h-4 text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
              <span>+ Add / Upload Media</span>
            </button>

            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-medium">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/60 block">Files</span>
                <span className="font-bold text-white text-sm">{mediaItems.length}</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-[10px] uppercase font-bold text-white/60 block">Downloads</span>
                <span className="font-bold text-[#A5D9B7] text-sm">{totalDownloads}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Controls & Search Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-[#E0EAE3] space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80 md:w-96">
              <input
                type="text"
                placeholder="Search media by title, filename, or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F5F8F6] border border-[#D5E3DA] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#4A6B53] focus:ring-1 focus:ring-[#4A6B53] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Upload Button visible directly on toolbar for instant access */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={openUploadMediaModal}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedTypeFilter === 'all'
                  ? 'bg-[#1B3224] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Assets ({mediaItems.length})
            </button>
            <button
              onClick={() => setSelectedTypeFilter('document')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                selectedTypeFilter === 'document'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDFs & Catalogs</span>
            </button>
            <button
              onClick={() => setSelectedTypeFilter('image')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                selectedTypeFilter === 'image'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Images & Banners</span>
            </button>
            <button
              onClick={() => setSelectedTypeFilter('video')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                selectedTypeFilter === 'video'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos & Demos</span>
            </button>
            <button
              onClick={() => setSelectedTypeFilter('audio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                selectedTypeFilter === 'audio'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio & Songs</span>
            </button>
            <button
              onClick={() => setSelectedTypeFilter('archive')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                selectedTypeFilter === 'archive'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>ZIP Archives</span>
            </button>
          </div>
        </div>

        {/* 3. Media Items Grid */}
        <div className="mt-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredItems.map(item => {
                const badge = getTypeBadge(item.file_type);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E0EAE3] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    {/* Media Thumbnail / Preview Area */}
                    <div
                      onClick={() => setPreviewItem(item)}
                      className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center cursor-pointer"
                      title="Click to preview / listen"
                    >
                      {item.file_type === 'image' ? (
                        <img
                          src={item.file_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : item.file_type === 'video' ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                          <video
                            src={item.file_url}
                            className="w-full h-full object-cover opacity-80"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                            <div className="w-11 h-11 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 ml-0.5 fill-slate-950" />
                            </div>
                          </div>
                        </div>
                      ) : item.file_type === 'audio' ? (
                        <div className="w-full h-full bg-gradient-to-tr from-amber-950 via-amber-900 to-amber-700 flex flex-col items-center justify-center text-white p-4 group/audio">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-inner group-hover/audio:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-white text-white" />
                          </div>
                          <span className="text-[11px] font-mono tracking-widest text-amber-200 uppercase font-bold">
                            Listen & Play
                          </span>
                        </div>
                      ) : item.file_type === 'archive' ? (
                        <div className="w-full h-full bg-gradient-to-tr from-rose-950 to-rose-800 flex flex-col items-center justify-center text-white p-4">
                          <Archive className="w-10 h-10 mb-2 opacity-90" />
                          <span className="text-[11px] font-mono tracking-widest text-rose-200">
                            ZIP ARCHIVE
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center text-white p-4">
                          <FileText className="w-10 h-10 mb-2 text-blue-300" />
                          <span className="text-[11px] font-mono tracking-widest text-blue-200">
                            PDF DOCUMENT
                          </span>
                        </div>
                      )}

                      {/* Top Type Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-sm border backdrop-blur-md bg-white/90 text-slate-900 border-white/50">
                        {badge.icon}
                        <span className="uppercase">{badge.label}</span>
                      </div>

                      {/* File size badge */}
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                        {item.file_size || 'File'}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4A6B53]">
                            {item.category || 'Media Asset'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#4A6B53] transition-colors" title={item.title}>
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* 1-Click Download Button */}
                        <button
                          type="button"
                          onClick={() => downloadMediaFile(item)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 group/btn"
                          title={`Download ${item.file_name}`}
                        >
                          <Download className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          <span>Download</span>
                        </button>

                        {/* Preview Lightbox / Player button */}
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Preview Media"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Copy Link button */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Copy Shareable Link"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete button (Admin Only) */}
                        {isAdminLoggedIn && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-xl border border-rose-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">No media assets found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search query or upload a new file to the Media Library.
                </p>
              </div>
              <button
                type="button"
                onClick={openUploadMediaModal}
                className="px-6 py-2.5 rounded-xl bg-[#4A6B53] text-white text-xs font-bold shadow-md hover:bg-[#395642] transition-colors"
              >
                + Upload Media File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Interactive Media Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="min-w-0 pr-4">
                <h3 className="text-sm sm:text-base font-bold truncate">{previewItem.title}</h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {previewItem.file_name} • {previewItem.file_size}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content Body */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40 min-h-[300px]">
              {previewItem.file_type === 'image' ? (
                <img
                  src={previewItem.file_url}
                  alt={previewItem.title}
                  className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-2xl"
                />
              ) : previewItem.file_type === 'video' ? (
                <video
                  src={previewItem.file_url}
                  controls
                  autoPlay
                  className="max-h-[60vh] w-full rounded-xl object-contain"
                />
              ) : previewItem.file_type === 'audio' ? (
                <div className="p-8 text-center space-y-4 max-w-md w-full">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                    <Music className="w-10 h-10 animate-pulse" />
                  </div>
                  <h4 className="text-white font-bold text-sm">{previewItem.title}</h4>
                  <audio src={previewItem.file_url} controls className="w-full" autoPlay />
                </div>
              ) : previewItem.file_type === 'document' ? (
                <div className="p-8 text-center space-y-4 max-w-md w-full bg-slate-800/80 rounded-2xl border border-slate-700">
                  <div className="w-20 h-20 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h4 className="text-white font-bold text-base">{previewItem.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {previewItem.description || 'Official AIO PRODUCT PDF document ready to view or download.'}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <a
                      href={previewItem.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in Browser</span>
                    </a>
                    <button
                      onClick={() => downloadMediaFile(previewItem)}
                      className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-4 max-w-md w-full bg-slate-800/80 rounded-2xl border border-slate-700">
                  <Archive className="w-16 h-16 text-rose-400 mx-auto" />
                  <h4 className="text-white font-bold text-base">{previewItem.title}</h4>
                  <p className="text-xs text-slate-300">
                    Compressed Archive ({previewItem.file_size})
                  </p>
                  <button
                    onClick={() => downloadMediaFile(previewItem)}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Archive</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer Toolbar */}
            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-white text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Downloads: <strong className="text-white">{previewItem.download_count || 0}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(previewItem)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadMediaFile(previewItem)}
                  className="px-5 py-1.5 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
