import React from 'react';
import { X, ExternalLink, Play, Film } from 'lucide-react';
import { parseVideoUrl } from '../lib/cmsData';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  category?: string;
}

export function VideoPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  title = 'Project Video Walkthrough',
  category
}: VideoPlayerModalProps) {
  if (!isOpen || !videoUrl) return null;

  const { embedUrl, type } = parseVideoUrl(videoUrl);
  const isEmbed = type === 'youtube' || type === 'vimeo';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-royal-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-xl bg-burgundy-600/80 flex items-center justify-center text-white shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-sm text-white truncate">{title}</h3>
              {category && (
                <span className="text-[11px] font-semibold text-royal-300 uppercase tracking-wider">
                  {category}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEmbed && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Open Video in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {isEmbed ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain max-h-[75vh]"
            >
              Your browser does not support HTML5 video playback.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
