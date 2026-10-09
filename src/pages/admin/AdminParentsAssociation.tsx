import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { ParentsAssociation, ExecutiveMember } from '../../types';
import { ImageUploadField } from '../../components/ImageUploadField';
import { 
  Users2, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Eye, 
  Calendar, 
  Phone, 
  Mail, 
  ImageIcon,
  X
} from 'lucide-react';

export function AdminParentsAssociation() {
  const { parentsAssociation, updateParentsAssociation } = useSettings();
  const [formData, setFormData] = useState<ParentsAssociation>(parentsAssociation);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Executive member modal
  const [editingExec, setEditingExec] = useState<ExecutiveMember | null>(null);
  const [isExecModalOpen, setIsExecModalOpen] = useState(false);

  React.useEffect(() => {
    setFormData(parentsAssociation);
  }, [parentsAssociation]);

  const handleChange = (field: keyof ParentsAssociation, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateParentsAssociation(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Parents Association data', err);
      alert('Error saving Parents Association details.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAddExec = () => {
    setEditingExec({
      id: `exec-${Date.now()}`,
      name: '',
      position: '',
      photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
      phone: '',
      email: ''
    });
    setIsExecModalOpen(true);
  };

  const handleOpenEditExec = (exec: ExecutiveMember) => {
    setEditingExec({ ...exec });
    setIsExecModalOpen(true);
  };

  const handleSaveExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExec || !editingExec.name) return;

    const currentList = formData.executives || [];
    const exists = currentList.some(e => e.id === editingExec.id);

    let updatedList;
    if (exists) {
      updatedList = currentList.map(e => e.id === editingExec.id ? editingExec : e);
    } else {
      updatedList = [...currentList, editingExec];
    }

    setFormData(prev => ({
      ...prev,
      executives: updatedList
    }));

    setIsExecModalOpen(false);
    setEditingExec(null);
  };

  const handleDeleteExec = (id: string) => {
    setFormData(prev => ({
      ...prev,
      executives: (prev.executives || []).filter(e => e.id !== id)
    }));
  };

  const handleAddEventPhoto = (url: string) => {
    if (!url) return;
    setFormData(prev => ({
      ...prev,
      eventPhotos: [...(prev.eventPhotos || []), url]
    }));
  };

  const handleRemoveEventPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      eventPhotos: (prev.eventPhotos || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="w-6 h-6 text-burgundy-700" />
            <h1 className="text-2xl font-display font-bold text-gray-900">Parents’ Association CMS</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage executive committee members, meeting notices, chairman message, and event photos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Published Live!
            </span>
          )}
          <a
            href="/parents-association"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            Preview Page
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 disabled:bg-burgundy-400 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Visibility & General Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-burgundy-50/60 border border-burgundy-200">
          <div>
            <h3 className="text-sm font-bold text-burgundy-950">Publish Parents’ Association</h3>
            <p className="text-xs text-burgundy-700">
              When enabled, this section appears on the homepage and provides a dedicated page at <code className="bg-burgundy-100 px-1 py-0.5 rounded">/parents-association</code>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleChange('isPublished', !formData.isPublished)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              formData.isPublished ? 'bg-burgundy-700' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.isPublished ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Section / Page Title *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Parents’ Association Community Hub"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Meetings & Stakeholders Schedule
            </label>
            <input
              type="text"
              value={formData.meetingsInfo || ''}
              onChange={(e) => handleChange('meetingsInfo', e.target.value)}
              placeholder="e.g. Stakeholders Meeting holds every 2nd Saturday of the quarter..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Section Description
          </label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Introduction explaining the purpose and initiatives of the Parents’ Association..."
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
          />
        </div>
      </div>

      {/* Chairman / Leadership Statement */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Chairman / President Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Chairman Name *
              </label>
              <input
                type="text"
                value={formData.chairmanName || ''}
                onChange={(e) => handleChange('chairmanName', e.target.value)}
                placeholder="e.g. Dr. Kenneth O. Agwu"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Chairman Title / Designation
              </label>
              <input
                type="text"
                value={formData.chairmanTitle || ''}
                onChange={(e) => handleChange('chairmanTitle', e.target.value)}
                placeholder="e.g. Chairman, Parents’ Association"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Chairman Welcome Message
              </label>
              <textarea
                rows={4}
                value={formData.chairmanMessage || ''}
                onChange={(e) => handleChange('chairmanMessage', e.target.value)}
                placeholder="A welcoming address to parents, members, and patrons..."
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>
          </div>

          <div>
            <ImageUploadField
              label="Chairman Photo"
              value={formData.chairmanPhoto || ''}
              onChange={(url) => handleChange('chairmanPhoto', url)}
              helperText="Upload official portrait of the Chairman."
              categoryHint="Parents Association"
              aspectRatio="square"
            />
          </div>
        </div>
      </div>

      {/* Executive Committee Members */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Executive Committee Members</h2>
            <p className="text-xs text-gray-500 mt-0.5">Officers and executives representing the association.</p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddExec}
            className="px-4 py-2 bg-royal-900 hover:bg-royal-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Executive Member
          </button>
        </div>

        {(!formData.executives || formData.executives.length === 0) ? (
          <p className="text-xs text-gray-400 py-6 text-center">No executive members added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {formData.executives.map((exec) => (
              <div
                key={exec.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-200 shrink-0">
                    <img src={exec.photoUrl || ''} alt={exec.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{exec.name}</h4>
                    <p className="text-xs text-burgundy-700 font-medium">{exec.position}</p>
                  </div>
                </div>

                {(exec.phone || exec.email) && (
                  <div className="text-[11px] text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2">
                    {exec.phone && <div>Tel: {exec.phone}</div>}
                    {exec.email && <div>Email: {exec.email}</div>}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditExec(exec)}
                    className="p-1 text-gray-600 hover:text-burgundy-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExec(exec.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Photos */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Events & Activities Photos</h2>
          <p className="text-xs text-gray-500 mt-0.5">Showcase past events, ceremonies, and meetings.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(formData.eventPhotos || []).map((photoUrl, idx) => (
            <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={photoUrl} alt={`Event ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveEventPhoto(idx)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div>
          <ImageUploadField
            label="Upload Another Event Photo"
            value=""
            onChange={handleAddEventPhoto}
            helperText="Select photo from phone or computer to append to event gallery."
            categoryHint="Parents Association"
            aspectRatio="video"
          />
        </div>
      </div>

      {/* Exec Member Modal */}
      {isExecModalOpen && editingExec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm">Add / Edit Executive Member</h3>
              <button onClick={() => setIsExecModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExec} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingExec.name}
                  onChange={(e) => setEditingExec({ ...editingExec, name: e.target.value })}
                  placeholder="e.g. Barrister Ngozi Peters"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Position / Office *</label>
                <input
                  type="text"
                  required
                  value={editingExec.position}
                  onChange={(e) => setEditingExec({ ...editingExec, position: e.target.value })}
                  placeholder="e.g. Vice Chairman / Secretary"
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Member Portrait Photo"
                  value={editingExec.photoUrl || ''}
                  onChange={(url) => setEditingExec({ ...editingExec, photoUrl: url })}
                  categoryHint="Parents Association"
                  aspectRatio="avatar"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingExec.phone || ''}
                    onChange={(e) => setEditingExec({ ...editingExec, phone: e.target.value })}
                    placeholder="+234..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={editingExec.email || ''}
                    onChange={(e) => setEditingExec({ ...editingExec, email: e.target.value })}
                    placeholder="email@..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExecModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-burgundy-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
