import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, MessageCircle, ArrowRight, Play, Film } from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';
import { Link } from 'react-router-dom';
import { VideoPlayerModal } from '../components/VideoPlayerModal';

const CATEGORIES = [
  'All', 
  'Videos & Reels',
  'Wall Screeding', 
  'POP Designs', 
  'Wallpaper', 
  'Painting', 
  'Exterior Finishing', 
  'Interior Decoration'
];

export function Gallery() {
  const { projects, settings } = useSettings();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string; category?: string } | null>(null);

  const activeProjects = projects.filter(p => p.isActive !== false);

  const filteredProjects = activeFilter === 'All' 
    ? activeProjects 
    : activeFilter === 'Videos & Reels'
    ? activeProjects.filter(p => Boolean(p.videoUrl))
    : activeProjects.filter(p => 
        p.category.toLowerCase().includes(activeFilter.toLowerCase()) || 
        activeFilter.toLowerCase().includes(p.category.toLowerCase())
      );

  const cleanWa = (settings.whatsapp || '2348000000000').replace(/[^0-9]/g, '');

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-royal-950 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Background" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-burgundy-700/80 text-xs font-bold uppercase tracking-wider mb-4">
            Master Gallery
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Projects & Gallery</h1>
          <p className="text-xl text-royal-200 max-w-2xl mx-auto">
            Browse through our portfolio of beautifully completed decoration and architectural finishing projects.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === category
                    ? 'bg-burgundy-700 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all border border-gray-200/80 bg-white"
                  onClick={() => setSelectedImage(project.imageUrl)}
                >
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-royal-950/0 group-hover:bg-royal-950/60 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
                  </div>

                  {/* Video Walkthrough Badge / Play Button */}
                  {project.videoUrl && (
                    <div className="absolute top-3 right-3 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo({
                            url: project.videoUrl!,
                            title: project.title,
                            category: project.category
                          });
                        }}
                        className="px-3 py-1 rounded-full bg-burgundy-600 hover:bg-burgundy-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer"
                        title="Play Project Video Walkthrough"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Video</span>
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-royal-950/95 via-royal-950/60 to-transparent">
                    <span className="text-[11px] font-bold tracking-wider text-burgundy-300 uppercase mb-1 block">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-display font-semibold text-white line-clamp-1">{project.title}</h3>
                    {project.description && (
                      <p className="text-xs text-gray-300 line-clamp-2 mt-1">{project.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 p-8 max-w-lg mx-auto">
              <h4 className="text-lg font-bold text-gray-800">No projects in this category yet</h4>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Our team uploads newly completed jobs regularly. Inquire directly for photos of our latest work.
              </p>
              <a
                href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hello ASANTEX DECOR, do you have sample photos for ${activeFilter}?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Ask for Samples on WhatsApp
              </a>
            </div>
          )}

          {/* Bottom Banner */}
          <div className="mt-20 bg-royal-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-royal-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold">Have a Project in Mind?</h3>
              <p className="text-sm text-royal-300 mt-1 max-w-xl">
                Let us bring the same standard of perfection and luxury finish to your residential or commercial property.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/quote"
                className="px-6 py-3.5 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                Request Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-7 h-7" />
            </button>
            <div className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
              <img 
                src={selectedImage} 
                alt="Enlarged project view" 
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          category={selectedVideo.category}
        />
      )}
    </div>
  );
}
