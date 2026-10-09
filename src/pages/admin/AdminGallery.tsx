import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { Project } from '../../types';
import { ImageUploadField } from '../../components/ImageUploadField';
import { VideoUploadField } from '../../components/VideoUploadField';
import { VideoPlayerModal } from '../../components/VideoPlayerModal';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Eye, 
  Check, 
  X, 
  Upload, 
  Filter, 
  Search,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Video,
  Play
} from 'lucide-react';
import { compressImageFile, saveMediaItem } from '../../lib/cmsData';

export function AdminGallery() {
  const { projects, saveProject, deleteProject } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [batchUploading, setBatchUploading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string; category?: string } | null>(null);

  const categories = [
    'All',
    'Wall Screeding',
    'POP Designs',
    'Wallpaper',
    'Painting',
    'Exterior Finishing',
    'Interior Decoration'
  ];

  const filteredProjects = projects.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingProject({
      id: `temp-${Date.now()}`,
      title: '',
      category: 'Wall Screeding',
      imageUrl: '',
      videoUrl: '',
      description: 'High precision decorative finish executed with premium materials.',
      featured: true,
      isActive: true,
      order: projects.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.imageUrl) {
      alert('Please provide a title and select/upload an image.');
      return;
    }

    setSaving(true);
    try {
      await saveProject(editingProject);
      setIsModalOpen(false);
      setEditingProject(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to save gallery photo', err);
      alert('Error saving project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete "${title}" from the gallery?`)) {
      try {
        await deleteProject(id);
      } catch (err) {
        console.error('Failed to delete project', err);
      }
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    await saveProject({
      ...project,
      featured: !project.featured
    });
  };

  // Batch multi-photo upload from device
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setBatchUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { dataUrl, sizeKB } = await compressImageFile(file, 1200, 0.75);
        await saveMediaItem(file.name, dataUrl, 'Gallery', sizeKB);
        await saveProject({
          id: `temp-${Date.now()}-${i}`,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          category: selectedCategory === 'All' ? 'Wall Screeding' : selectedCategory,
          imageUrl: dataUrl,
          featured: true,
          isActive: true,
          order: projects.length + i + 1
        });
      }
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err: any) {
      console.error('Batch upload error:', err);
      alert('Failed to upload some images: ' + err.message);
    } finally {
      setBatchUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Gallery & Projects Manager</h1>
          <p className="text-xs text-gray-500 mt-1">
            Upload photos of completed works, choose homepage highlights, and categorize for clients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {successToast && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Gallery Updated!
            </span>
          )}

          <label className={`px-4 py-2 bg-royal-900 hover:bg-royal-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer ${batchUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload className="w-4 h-4" />
            {batchUploading ? 'Compressing & Uploading...' : 'Upload Multiple Photos'}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleBatchUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Single Photo
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-burgundy-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search project titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-bold text-gray-800">No project photos found</h3>
          <p className="text-xs text-gray-400 mt-1">Upload a photo or select another category filter above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/75 backdrop-blur-xs text-white">
                    {project.category}
                  </span>
                  {project.videoUrl && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-burgundy-600 text-white flex items-center gap-1 shadow-xs">
                      <Video className="w-2.5 h-2.5" />
                      VIDEO
                    </span>
                  )}
                </div>

                {project.videoUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewVideo({ url: project.videoUrl!, title: project.title, category: project.category });
                    }}
                    className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/80 hover:bg-burgundy-700 text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer backdrop-blur-xs"
                    title="Preview Video Walkthrough"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch Video</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleFeatured(project)}
                  className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all ${
                    project.featured ? 'bg-amber-400 text-black' : 'bg-black/60 text-white/70 hover:text-white'
                  }`}
                  title={project.featured ? 'Featured on Homepage (Click to unfeature)' : 'Click to feature on Homepage'}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{project.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{project.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    project.isActive !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {project.isActive !== false ? 'Active' : 'Hidden'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(project)}
                      className="p-1.5 text-gray-600 hover:text-burgundy-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id, project.title)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-base">
                {editingProject.id && !editingProject.id.startsWith('temp-') ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Photo Title / Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Modern Living Room POP Ceiling Finish"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  value={editingProject.category || 'Wall Screeding'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500 bg-white"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <ImageUploadField
                  label="Project Photo *"
                  value={editingProject.imageUrl || ''}
                  onChange={(url) => setEditingProject({ ...editingProject, imageUrl: url })}
                  helperText="Upload directly from phone/computer or pick from media library."
                  categoryHint="Gallery"
                  aspectRatio="video"
                />
              </div>

              <div>
                <VideoUploadField
                  label="Project Video Walkthrough (Optional)"
                  value={editingProject.videoUrl || ''}
                  onChange={(url) => setEditingProject({ ...editingProject, videoUrl: url })}
                  helperText="Attach a walkthrough video, screeding timelapse, or YouTube/Vimeo project link."
                  categoryHint="Gallery"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Project Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="e.g. Executed in Lekki with high grade screeding and washable satin finish..."
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Feature on Homepage</p>
                    <p className="text-[11px] text-amber-700">Display this image on the front page portfolio grid</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingProject.featured ?? false}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-5 h-5 text-burgundy-700 rounded-md focus:ring-burgundy-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Publish to Public Website</p>
                    <p className="text-[11px] text-gray-500">Visible to all visitors in the projects gallery</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingProject.isActive !== false}
                    onChange={(e) => setEditingProject({ ...editingProject, isActive: e.target.checked })}
                    className="w-5 h-5 text-burgundy-700 rounded-md focus:ring-burgundy-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Video Player Lightbox */}
      {previewVideo && (
        <VideoPlayerModal
          isOpen={true}
          onClose={() => setPreviewVideo(null)}
          videoUrl={previewVideo.url}
          title={previewVideo.title}
          category={previewVideo.category}
        />
      )}
    </div>
  );
}
