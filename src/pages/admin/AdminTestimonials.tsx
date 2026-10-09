import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { Testimonial } from '../../types';
import { ImageUploadField } from '../../components/ImageUploadField';
import { Plus, Edit3, Trash2, Check, X, Star, MessageSquareQuote, Eye } from 'lucide-react';

export function AdminTestimonials() {
  const { testimonials, saveTestimonial, deleteTestimonial } = useSettings();
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleOpenAdd = () => {
    setEditingTestimonial({
      id: `temp-${Date.now()}`,
      clientName: '',
      location: '',
      content: '',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      isActive: true,
      order: testimonials.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingTestimonial({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.clientName || !editingTestimonial.content) return;

    setSaving(true);
    try {
      await saveTestimonial(editingTestimonial);
      setIsModalOpen(false);
      setEditingTestimonial(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to save testimonial', err);
      alert('Error saving testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete review from ${name}?`)) {
      try {
        await deleteTestimonial(id);
      } catch (err) {
        console.error('Failed to delete testimonial', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Client Reviews & Testimonials</h1>
          <p className="text-xs text-gray-500 mt-1">
            Display authentic reviews and 5-star ratings from satisfied homeowners and commercial clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successToast && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Review Saved!
            </span>
          )}
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Review
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-all ${
              item.isActive !== false ? 'border-gray-200 shadow-xs' : 'border-gray-200 bg-gray-50/70 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.isActive !== false ? 'Live' : 'Hidden'}
                </span>
              </div>

              <p className="text-xs text-gray-700 italic leading-relaxed">
                "{item.content}"
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                  <img src={item.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'} alt={item.clientName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900">{item.clientName}</h4>
                  <p className="text-[10px] text-gray-500">{item.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-gray-600 hover:text-burgundy-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.clientName)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-base">
                {editingTestimonial.id && !editingTestimonial.id.startsWith('temp-') ? 'Edit Review' : 'Add New Review'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.clientName || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                    placeholder="e.g. Chief Babatunde"
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location / Project</label>
                  <input
                    type="text"
                    value={editingTestimonial.location || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Star Rating (1-5)</label>
                <select
                  value={editingTestimonial.rating || 5}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500 bg-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Review Content *</label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.content || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  placeholder="What the client said about ASANTEX DECOR's workmanship..."
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Client Photo / Avatar"
                  value={editingTestimonial.avatarUrl || ''}
                  onChange={(url) => setEditingTestimonial({ ...editingTestimonial, avatarUrl: url })}
                  categoryHint="General"
                  aspectRatio="avatar"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-bold text-gray-800">Publish Review on Website</span>
                <input
                  type="checkbox"
                  checked={editingTestimonial.isActive !== false}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, isActive: e.target.checked })}
                  className="w-5 h-5 text-burgundy-700 rounded-md focus:ring-burgundy-500 cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
