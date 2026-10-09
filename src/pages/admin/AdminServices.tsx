import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { Service } from '../../types';
import { ImageUploadField } from '../../components/ImageUploadField';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Eye,
  CheckCircle2
} from 'lucide-react';

export function AdminServices() {
  const { services, saveService, deleteService } = useSettings();
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleOpenAdd = () => {
    setEditingService({
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      features: ['Professional Finishing', 'Premium Materials', 'Skilled Artisans'],
      icon: 'Brush',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
      buttonText: 'Get a Quote',
      buttonUrl: '/quote',
      isActive: true,
      order: services.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    setSaving(true);
    try {
      await saveService(editingService);
      setIsModalOpen(false);
      setEditingService(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to save service', err);
      alert('Error saving service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteService(id);
      } catch (err) {
        console.error('Error deleting service', err);
        alert('Could not delete service.');
      }
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim() || !editingService) return;
    setEditingService({
      ...editingService,
      features: [...(editingService.features || []), featureInput.trim()]
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      features: (editingService.features || []).filter((_, i) => i !== index)
    });
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const current = services[index];
    const target = services[targetIndex];

    await saveService({ ...current, order: target.order || targetIndex + 1 });
    await saveService({ ...target, order: current.order || index + 1 });
  };

  const availableIcons = ['Brush', 'Trowel', 'Image', 'Box', 'Layers', 'PaintRoller', 'Sparkles', 'Shield', 'Hammer'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Services Manager</h1>
          <p className="text-xs text-gray-500 mt-1">
            Add, update, or remove decorative services. Changes sync directly to the Homepage and Services page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successToast && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Service Saved!
            </span>
          )}
          <a
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            View Public Services
          </a>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Service
          </button>
        </div>
      </div>

      {/* Services List Table / Cards */}
      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`bg-white p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
              service.isActive !== false ? 'border-gray-200 shadow-xs' : 'border-gray-200 bg-gray-50/70 opacity-60'
            }`}
          >
            <div className="flex items-start sm:items-center gap-4">
              {/* Order Controls */}
              <div className="flex flex-col gap-1 items-center shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveOrder(index, 'up')}
                  className="p-1 rounded text-gray-400 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                <button
                  type="button"
                  disabled={index === services.length - 1}
                  onClick={() => handleMoveOrder(index, 'down')}
                  className="p-1 rounded text-gray-400 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Service Thumbnail */}
              <div className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={service.imageUrl || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Service Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">{service.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    service.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {service.isActive !== false ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 max-w-xl">
                  {service.description}
                </p>
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
              <button
                onClick={() => handleOpenEdit(service)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id, service.title)}
                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-base">
                {editingService.id && !editingService.id.startsWith('temp-') ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Wall Screeding & Skimming"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Service Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Comprehensive description of the service and quality deliverables..."
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              {/* Service Photo with Easy Uploader */}
              <div>
                <ImageUploadField
                  label="Service Featured Photo"
                  value={editingService.imageUrl || ''}
                  onChange={(url) => setEditingService({ ...editingService, imageUrl: url })}
                  helperText="Upload a photo from your phone or computer, or pick from the media library."
                  categoryHint="Services"
                  aspectRatio="video"
                />
              </div>

              {/* Features / Bullet Points */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Service Features / Bullet Points
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                    placeholder="e.g. 5-Year Durability Guarantee"
                    className="flex-1 px-4 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Add Bullet
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingService.features || []).map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-800 text-xs rounded-lg"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Switch */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-xs font-bold text-gray-800">Publish Service</p>
                  <p className="text-[11px] text-gray-500">Make visible to public visitors on the website</p>
                </div>
                <input
                  type="checkbox"
                  checked={editingService.isActive !== false}
                  onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                  className="w-5 h-5 text-burgundy-700 rounded-md focus:ring-burgundy-500 cursor-pointer"
                />
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
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
