import React, { useState } from 'react';
import { 
  Video, 
  Upload, 
  Link as LinkIcon, 
  Trash2, 
  Play, 
  ExternalLink, 
  Loader2, 
  Check, 
  Sparkles,
  Film
} from 'lucide-react';
import { uploadVideoFile, parseVideoUrl, generateVideoThumbnail, saveMediaItem } from '../lib/cmsData';
import { VideoPlayerModal } from './VideoPlayerModal';
import { useSettings } from '../lib/SettingsContext';

interface VideoUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  categoryHint?: string;
}

export function VideoUploadField({
  label,
  value,
  onChange,
  helperText,
  categoryHint = 'Gallery'
}: VideoUploadFieldProps) {
  const { mediaItems } = useSettings();
  const [activeTab, setActiveTab] = useState<'upload' | 'link' | 'library'>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [linkInput, setLinkInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter video items from media library
  const libraryVideos = mediaItems.filter(m => m.type === 'video');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);
    setErrorMessage(null);

    try {
      const item = await uploadVideoFile(file, categoryHint, (progress) => {
        setUploadProgress(progress);
      });
      onChange(item.url);
    } catch (err: any) {
      console.error('Video upload failed:', err);
      setErrorMessage(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      e.target.value = '';
    }
  };

  const handleApplyLink = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const url = linkInput.trim();
    if (!url) return;

    setErrorMessage(null);
    setUploading(true);

    try {
      const { embedUrl, thumbnailUrl, type } = parseVideoUrl(url);
      
      // Also save to Media Library so it's reusable
      await saveMediaItem(
        `Linked Video (${type.toUpperCase()})`,
        url,
        categoryHint,
        0,
        'video',
        thumbnailUrl,
        0,
        type
      );

      onChange(url);
      setLinkInput('');
    } catch (err: any) {
      setErrorMessage('Could not save video link: ' + (err.message || 'Error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSelectFromLibrary = (videoUrl: string) => {
    onChange(videoUrl);
    setErrorMessage(null);
  };

  const handleRemove = () => {
    if (window.confirm('Remove this video?')) {
      onChange('');
    }
  };

  const { thumbnailUrl } = parseVideoUrl(value);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <Video className="w-4 h-4 text-burgundy-700" />
          <span>{label}</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Video</span>
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {/* Error display */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* If a video is already assigned, show preview */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-black aspect-video max-h-56 group shadow-sm flex items-center justify-center">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt="Video preview" 
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-royal-950 to-burgundy-950 flex items-center justify-center">
              <Video className="w-12 h-12 text-white/30" />
            </div>
          )}

          {/* Overlay controls */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="w-12 h-12 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title="Play Video"
            >
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </button>
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/80 text-white backdrop-blur-xs truncate max-w-[240px]">
              {value}
            </span>
          </div>
        </div>
      ) : (
        /* Tabs for Uploading or Linking video */
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
          <div className="flex border-b border-gray-100 bg-gray-50/70 p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'upload' ? 'bg-white text-burgundy-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Video File</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'link' ? 'bg-white text-burgundy-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Paste Video URL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'library' ? 'bg-white text-burgundy-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Media Library ({libraryVideos.length})</span>
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'upload' && (
              <label className="border-2 border-dashed border-gray-300 hover:border-burgundy-600 rounded-xl p-6 bg-gray-50/50 hover:bg-burgundy-50/20 cursor-pointer transition-all flex flex-col items-center justify-center text-center">
                {uploading ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-burgundy-700 animate-spin" />
                    <p className="text-xs font-bold text-gray-700">
                      Processing & Uploading Video... {uploadProgress ? `${uploadProgress}%` : ''}
                    </p>
                    <p className="text-[11px] text-gray-400">Generating video thumbnail and registering stream</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-burgundy-700 mb-2" />
                    <p className="text-xs font-bold text-gray-800">Click to choose a video file</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">MP4, WebM, MOV, QuickTime</p>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </>
                )}
              </label>
            )}

            {activeTab === 'link' && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Paste any YouTube video/shorts, Vimeo, Cloudinary, or direct MP4 stream link:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyLink();
                        }
                      }}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyLink()}
                      disabled={uploading || !linkInput.trim()}
                      className="px-4 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Attach</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div>
                {libraryVideos.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-xs">
                    No videos found in your media library yet. Upload a video file or paste a link above.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {libraryVideos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleSelectFromLibrary(video.url)}
                        className="group relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-black cursor-pointer hover:border-burgundy-600 transition-all shadow-2xs"
                      >
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} alt={video.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-royal-950">
                            <Video className="w-6 h-6 text-white/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition-colors">
                          <Play className="w-5 h-5 text-white fill-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute bottom-1 left-1 right-1">
                          <p className="text-[10px] font-medium text-white truncate drop-shadow-xs">
                            {video.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video player modal */}
      <VideoPlayerModal
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
        videoUrl={value}
        title={label}
        category={categoryHint}
      />
    </div>
  );
}
