import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { 
  FileImage, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Sparkles, 
  Loader2, 
  ExternalLink,
  Video,
  Play,
  Film,
  Link as LinkIcon,
  X,
  Layers
} from 'lucide-react';
import { 
  compressImageFile, 
  saveMediaItem, 
  uploadVideoFile, 
  parseVideoUrl 
} from '../../lib/cmsData';
import { VideoPlayerModal } from '../../components/VideoPlayerModal';
import { MediaItem } from '../../types';

export function AdminMedia() {
  const { mediaItems, deleteMedia } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [uploadCategory, setUploadCategory] = useState('Gallery');
  
  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // Preview Modals
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string; category?: string } | null>(null);

  // Video Link Embed Modal
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [embedVideoUrl, setEmbedVideoUrl] = useState('');
  const [embedVideoName, setEmbedVideoName] = useState('');
  const [embedVideoCategory, setEmbedVideoCategory] = useState('Gallery');
  const [embedSaving, setEmbedSaving] = useState(false);

  const categories = ['All', 'Homepage', 'Services', 'Gallery', 'Team', 'Parents Association', 'General'];

  const filteredMedia = mediaItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isVideo = item.type === 'video' || (item.url && (item.url.includes('.mp4') || item.url.includes('.webm') || item.url.includes('youtube') || item.url.includes('vimeo')));
    const matchesType = mediaTypeFilter === 'all' 
      ? true 
      : mediaTypeFilter === 'video' 
      ? isVideo 
      : !isVideo;

    return matchesCat && matchesSearch && matchesType;
  });

  const handleUploadImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress('Compressing & Uploading Photos...');
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { dataUrl, sizeKB } = await compressImageFile(file, 1200, 0.75);
        await saveMediaItem(file.name, dataUrl, uploadCategory, sizeKB, 'image');
      }
    } catch (err: any) {
      console.error('Failed to upload media files', err);
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = '';
    }
  };

  const handleUploadVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress('Processing video & generating thumbnail...');
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadVideoFile(file, uploadCategory, (pct) => {
          setUploadProgress(`Uploading ${file.name} (${pct}%)...`);
        });
      }
    } catch (err: any) {
      console.error('Failed to upload video file', err);
      alert(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = '';
    }
  };

  const handleUniversalDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('video/')) {
          setUploadProgress(`Processing video ${file.name}...`);
          await uploadVideoFile(file, uploadCategory);
        } else {
          setUploadProgress(`Compressing photo ${file.name}...`);
          const { dataUrl, sizeKB } = await compressImageFile(file, 1200, 0.75);
          await saveMediaItem(file.name, dataUrl, uploadCategory, sizeKB, 'image');
        }
      }
    } catch (err: any) {
      console.error('Failed to upload media files', err);
      alert('Upload error: ' + (err.message || 'Failed to upload file'));
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = '';
    }
  };

  const handleSaveEmbedVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = embedVideoUrl.trim();
    if (!url) return;

    setEmbedSaving(true);
    try {
      const { thumbnailUrl, type } = parseVideoUrl(url);
      const name = embedVideoName.trim() || `Online Video (${type.toUpperCase()})`;

      await saveMediaItem(
        name,
        url,
        embedVideoCategory,
        0,
        'video',
        thumbnailUrl,
        0,
        type
      );

      setIsEmbedModalOpen(false);
      setEmbedVideoUrl('');
      setEmbedVideoName('');
    } catch (err: any) {
      alert('Failed to attach video: ' + (err.message || 'Error'));
    } finally {
      setEmbedSaving(false);
    }
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${name}" from the media library?`)) {
      try {
        await deleteMedia(id);
      } catch (err) {
        console.error('Failed to delete media', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-gray-900">Media Library (Photos & Videos)</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-burgundy-50 text-burgundy-800 border border-burgundy-200">
              {mediaItems.length} Assets
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Store, view, and organize architectural photos and project walkthrough videos in one centralized cloud library.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-burgundy-500"
          >
            <option value="Gallery">Category: Gallery</option>
            <option value="Homepage">Category: Homepage</option>
            <option value="Services">Category: Services</option>
            <option value="Team">Category: Team</option>
            <option value="General">Category: General</option>
          </select>

          {/* Upload Video Button */}
          <label className={`px-4 py-2 bg-royal-900 hover:bg-royal-950 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Video className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>Upload Video</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleUploadVideoFile}
              className="hidden"
            />
          </label>

          {/* Embed Video Link Button */}
          <button
            onClick={() => setIsEmbedModalOpen(true)}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Paste YouTube, Vimeo or MP4 link"
          >
            <LinkIcon className="w-3.5 h-3.5 text-royal-700" />
            <span>Embed Video Link</span>
          </button>

          {/* Upload Photos Button */}
          <label className={`px-4 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>Upload Photos</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleUploadImageFiles}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Uploading Status Banner */}
      {uploading && (
        <div className="p-4 rounded-xl bg-burgundy-50 border border-burgundy-200 text-burgundy-900 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <Loader2 className="w-5 h-5 animate-spin text-burgundy-700 shrink-0" />
          <span>{uploadProgress || 'Processing upload, please wait...'}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Media Type Filter Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setMediaTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mediaTypeFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setMediaTypeFilter('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                mediaTypeFilter === 'image' ? 'bg-white text-burgundy-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => setMediaTypeFilter('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                mediaTypeFilter === 'video' ? 'bg-white text-royal-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-burgundy-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search media name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
          />
        </div>
      </div>

      {/* Drag & Drop Quick Dropzone (Images + Videos) */}
      <label className="border-2 border-dashed border-gray-300 hover:border-burgundy-600 rounded-2xl p-6 bg-gray-50/50 hover:bg-burgundy-50/20 cursor-pointer transition-all flex flex-col items-center justify-center text-center group">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-6 h-6 text-gray-400 group-hover:text-burgundy-600 transition-colors" />
          <Video className="w-6 h-6 text-gray-400 group-hover:text-royal-600 transition-colors" />
        </div>
        <p className="text-xs font-bold text-gray-800">
          Click or Drag & Drop Photos or Videos here to upload
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Supports JPG, PNG, WEBP images and MP4, WebM, MOV videos
        </p>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg,video/mp4,video/webm,video/ogg,video/quicktime"
          onChange={handleUniversalDrop}
          className="hidden"
        />
      </label>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400 space-y-3">
          <div className="flex justify-center gap-2 text-gray-300">
            <FileImage className="w-10 h-10" />
            <Video className="w-10 h-10" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No media items found</p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Upload a photo or video to populate your media library and reuse across projects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => {
            const isCopied = copiedUrl === item.url;
            const isVideo = item.type === 'video' || (item.url && (item.url.includes('.mp4') || item.url.includes('.webm') || item.url.includes('youtube') || item.url.includes('vimeo')));
            const displayThumb = item.thumbnailUrl || item.url;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isVideo) {
                    setPlayingVideo({ url: item.url, title: item.name, category: item.category });
                  } else {
                    setPreviewImage(item.url);
                  }
                }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
              >
                <div className="relative aspect-square bg-black overflow-hidden">
                  {isVideo ? (
                    item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-royal-950 flex items-center justify-center">
                        <Video className="w-10 h-10 text-white/30" />
                      </div>
                    )
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/75 backdrop-blur-xs text-white">
                      {item.category || 'General'}
                    </span>
                    {isVideo && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-burgundy-600 text-white flex items-center gap-1 shadow-xs">
                        <Film className="w-2.5 h-2.5" />
                        VIDEO
                      </span>
                    )}
                  </div>

                  {/* Play Overlay for Videos */}
                  {isVideo && (
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 flex items-center justify-center transition-colors">
                      <div className="w-10 h-10 rounded-full bg-burgundy-700 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  {/* Duration badge if video */}
                  {isVideo && item.duration ? (
                    <div className="absolute bottom-2 right-2">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-black/80 text-white">
                        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <p className="text-xs font-bold text-gray-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {item.sizeKB ? `${item.sizeKB > 1024 ? `${(item.sizeKB / 1024).toFixed(1)} MB` : `${item.sizeKB} KB`}` : (isVideo ? 'Stream Reel' : 'Optimized')}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => handleCopyUrl(item.url, e)}
                      className="text-[11px] font-semibold text-royal-600 hover:text-royal-800 flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : (isVideo ? 'Copy Video URL' : 'Copy URL')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, item.name, e)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Image Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black">
            <img src={previewImage} alt="Enlarged" className="w-full h-full object-contain max-h-[85vh]" />
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <VideoPlayerModal
          isOpen={true}
          onClose={() => setPlayingVideo(null)}
          videoUrl={playingVideo.url}
          title={playingVideo.title}
          category={playingVideo.category}
        />
      )}

      {/* Embed Video Link Modal */}
      {isEmbedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-burgundy-700" />
                  <span>Embed Online Video</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Attach YouTube, Vimeo, Cloudinary, or direct MP4 stream links.
                </p>
              </div>
              <button
                onClick={() => setIsEmbedModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmbedVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Video URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={embedVideoUrl}
                  onChange={(e) => setEmbedVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Supports YouTube standard & Shorts links, Vimeo, and direct .mp4 streaming files.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Video Title / Description
                </label>
                <input
                  type="text"
                  value={embedVideoName}
                  onChange={(e) => setEmbedVideoName(e.target.value)}
                  placeholder="e.g. Master Bedroom Ceiling POP Timelapse"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={embedVideoCategory}
                  onChange={(e) => setEmbedVideoCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500 bg-white"
                >
                  <option value="Gallery">Gallery</option>
                  <option value="Homepage">Homepage</option>
                  <option value="Services">Services</option>
                  <option value="Team">Team</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEmbedModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={embedSaving}
                  className="px-5 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {embedSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Attach Video</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
