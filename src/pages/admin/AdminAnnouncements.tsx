import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { Announcement } from '../../types';
import { Plus, Edit3, Trash2, Check, X, BellRing } from 'lucide-react';

export function AdminAnnouncements() {
  const { announcements, saveAnnouncement, deleteAnnouncement } = useSettings();
  const [editingItem, setEditingItem] = useState<Partial<Announcement> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem({
      id: `temp-${Date.now()}`,
      title: '',
      content: '',
      badge: 'Notice',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      link: '/quote',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title) return;

    setSaving(true);
    try {
      await saveAnnouncement(editingItem);
      setIsModalOpen(false);
      setEditingItem(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to save announcement', err);
      alert('Error saving announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete announcement "${title}"?`)) {
      try {
        await deleteAnnouncement(id);
      } catch (err) {
        console.error('Failed to delete announcement', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Announcements & Notice Board</h1>
          <p className="text-xs text-gray-500 mt-1">
            Post special offers, holiday work schedules, and announcements banner on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successToast && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Announcement Saved!
            </span>
          )}
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Announcement
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className={`bg-white p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              item.isActive ? 'border-gray-200 shadow-xs' : 'border-gray-200 bg-gray-50/70 opacity-60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-burgundy-100 text-burgundy-800">
                  {item.badge || 'Notice'}
                </span>
                <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                <span className="text-[10px] text-gray-400">• {item.date}</span>
              </div>
              <p className="text-xs text-gray-600 max-w-2xl">{item.content}</p>
              {item.link && (
                <p className="text-[10px] text-royal-600 font-medium">Link: {item.link}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEdit(item)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm">Add / Edit Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={editingItem.badge || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  placeholder="e.g. Special Offer, Notice, Promo"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. 15% Off Full-Building Screeding"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Content / Message</label>
                <textarea
                  rows={3}
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Announcement message details..."
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link (Optional)</label>
                <input
                  type="text"
                  value={editingItem.link || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                  placeholder="e.g. /quote"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-bold text-gray-800">Publish Announcement</span>
                <input
                  type="checkbox"
                  checked={editingItem.isActive}
                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                  className="w-5 h-5 text-burgundy-700 rounded-md focus:ring-burgundy-500 cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-burgundy-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
