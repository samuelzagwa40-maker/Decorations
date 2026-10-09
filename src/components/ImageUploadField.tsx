import React, { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ImagePickerModal } from './ImagePickerModal';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  categoryHint?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'avatar' | 'auto';
}

export function ImageUploadField({
  label,
  value,
  onChange,
  helperText,
  categoryHint = 'General',
  aspectRatio = 'video'
}: ImageUploadFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this image?')) {
      onChange('');
    }
  };

  // Determine aspect ratio class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square max-w-[200px]';
      case 'avatar': return 'w-24 h-24 rounded-full';
      case 'banner': return 'aspect-[21/9] max-h-56';
      case 'video': return 'aspect-video max-h-52';
      default: return 'aspect-video max-h-52';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleCopyUrl}
            className="text-xs text-royal-600 hover:text-royal-800 font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600 font-semibold">URL Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image URL</span>
              </>
            )}
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {/* Image Preview Box & Action Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {value ? (
          <div className="relative group w-full sm:w-auto">
            <div className={`overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm ${getAspectClass()}`}>
              <img 
                src={value} 
                alt={label} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Floating quick action */}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg border border-red-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="w-full p-6 border-2 border-dashed border-gray-300 hover:border-burgundy-500 rounded-xl bg-gray-50/50 hover:bg-burgundy-50/20 cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-burgundy-600 group-hover:scale-110 transition-all mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-800 group-hover:text-burgundy-800">
              Click to Upload or Choose Image
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Select directly from phone or computer, or pick from media library
            </p>
          </div>
        )}
      </div>

      {/* Modal for selecting or uploading */}
      <ImagePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectImage={(url) => onChange(url)}
        currentValue={value}
        categoryHint={categoryHint}
        title={`Select Image for ${label}`}
      />
    </div>
  );
}
