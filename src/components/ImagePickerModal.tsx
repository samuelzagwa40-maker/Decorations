import React, { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  X, 
  Check, 
  Search, 
  Loader2, 
  Copy 
} from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';
import { compressImageFile, saveMediaItem } from '../lib/cmsData';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  currentValue?: string;
  categoryHint?: string;
  title?: string;
}

export function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  currentValue,
  categoryHint = 'General',
  title = 'Select or Upload Image'
}: ImagePickerModalProps) {
  const { mediaItems, addMediaItem } = useSettings();
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Homepage', 'Services', 'Gallery', 'Team', 'General'];

  const filteredMedia = mediaItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setError(null);

    try {
      // 1. Compress image client-side to under 150KB WebP/JPEG
      const { dataUrl, sizeKB } = await compressImageFile(file, 1200, 0.75);

      // 2. Automatically save in Firestore media collection
      await saveMediaItem(file.name, dataUrl, categoryHint, sizeKB);

      // 3. Immediately select and close
      onSelectImage(dataUrl);
      onClose();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCustomUrlSubmit = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!customUrl.trim()) return;
    onSelectImage(customUrl.trim());
    onClose();
  };

  const copyToClipboard = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Upload a photo directly from your device or choose from your media library.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-burgundy-700 text-burgundy-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload New Image
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'library'
                ? 'border-burgundy-700 text-burgundy-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Media Library ({mediaItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'url'
                ? 'border-burgundy-700 text-burgundy-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Enter Image Link
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[360px]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* TAB 1: Upload from Phone / Computer */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <label 
                className={`w-full max-w-md border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  uploading 
                    ? 'border-burgundy-300 bg-burgundy-50/50 pointer-events-none' 
                    : 'border-gray-300 hover:border-burgundy-600 hover:bg-burgundy-50/20'
                }`}
              >
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp,image/jpg" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  disabled={uploading}
                />
                
                <div className="w-16 h-16 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 mb-4 shadow-inner">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <p className="text-base font-semibold text-gray-900 text-center">
                  {uploading ? 'Compressing & Uploading...' : 'Click to Upload from Phone or Computer'}
                </p>
                <p className="text-xs text-gray-500 text-center mt-1.5 max-w-xs">
                  Supports JPG, JPEG, PNG, WEBP. Automatically optimized for fast website loading.
                </p>

                <span className="mt-5 inline-flex items-center px-4 py-2 bg-burgundy-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-burgundy-800 transition-colors">
                  Select Photo
                </span>
              </label>

              {currentValue && (
                <div className="mt-8 pt-6 border-t border-gray-100 w-full max-w-md flex items-center gap-4">
                  <span className="text-xs font-medium text-gray-500">Current active image:</span>
                  <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                    <img src={currentValue} alt="Current" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => copyToClipboard(currentValue, e)}
                    className="ml-auto text-xs text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1 font-medium"
                  >
                    {copiedUrl === currentValue ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUrl === currentValue ? 'Copied' : 'Copy Image URL'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Media Library */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Filter and Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-burgundy-700 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-48">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>
              </div>

              {/* Grid of Images */}
              {filteredMedia.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">No images found in this category.</p>
                  <p className="text-xs text-gray-400 mt-1">Switch to 'Upload' tab to upload a new one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => {
                    const isSelected = currentValue === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectImage(item.url);
                          onClose();
                        }}
                        className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:shadow-md ${
                          isSelected ? 'border-burgundy-700 ring-2 ring-burgundy-700/20' : 'border-gray-200 hover:border-burgundy-400'
                        }`}
                      >
                        <img 
                          src={item.url} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        
                        {/* Overlay with info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-white text-[10px]">
                          <p className="font-semibold truncate">{item.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-gray-300">{item.sizeKB ? `${item.sizeKB} KB` : 'Stock'}</span>
                            <button
                              type="button"
                              onClick={(e) => copyToClipboard(item.url, e)}
                              className="p-1 bg-white/20 hover:bg-white/40 rounded transition-colors"
                              title="Copy URL"
                            >
                              {copiedUrl === item.url ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-burgundy-700 text-white rounded-full p-1 shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Enter URL */}
          {activeTab === 'url' && (
            <div className="max-w-md mx-auto py-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paste External Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomUrlSubmit();
                    }
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Direct links from image CDNs (e.g., Unsplash, Cloudinary).
                </p>
              </div>

              {customUrl && (
                <div className="p-3 border border-gray-200 rounded-xl bg-gray-50 text-center">
                  <p className="text-xs text-gray-500 mb-2">Live Preview:</p>
                  <img 
                    src={customUrl} 
                    alt="Preview" 
                    className="max-h-40 mx-auto rounded-lg object-contain"
                    onError={() => setError('Image URL appears to be broken or inaccessible.')}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => handleCustomUrlSubmit()}
                disabled={!customUrl.trim()}
                className="w-full py-2.5 bg-burgundy-700 text-white text-sm font-semibold rounded-lg hover:bg-burgundy-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                Use this Image
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
