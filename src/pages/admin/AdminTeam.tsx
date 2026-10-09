import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { TeamMember } from '../../types';
import { DEFAULT_TEAM } from '../../lib/cmsData';
import { ImageUploadField } from '../../components/ImageUploadField';
import { Plus, Edit3, Trash2, Check, X, Users, Eye, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

export function AdminTeam() {
  const { team, saveTeamMember, deleteTeamMember } = useSettings();
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleResetFourMembers = async () => {
    if (window.confirm('Reset team to the 4 standard professional members (Samuel Zagwa, Emmanuel Adebayo, Grace Okafor, David Osei)?')) {
      for (const m of DEFAULT_TEAM) {
        await saveTeamMember(m);
      }
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember({
      id: `temp-${Date.now()}`,
      name: '',
      role: '',
      bio: '',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      phone: '',
      email: '',
      linkedin: '',
      order: team.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name) return;

    setSaving(true);
    try {
      await saveTeamMember(editingMember);
      setIsModalOpen(false);
      setEditingMember(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to save team member', err);
      alert('Error saving team member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from team?`)) {
      try {
        await deleteTeamMember(id);
      } catch (err) {
        console.error('Failed to delete team member', err);
      }
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= team.length) return;

    const current = team[index];
    const target = team[targetIndex];

    await saveTeamMember({ ...current, order: target.order || targetIndex + 1 });
    await saveTeamMember({ ...target, order: current.order || index + 1 });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Team & Leadership Manager</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage profiles of your craftsmen, managers, and consultants shown on the About and Home pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successToast && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Team Updated!
            </span>
          )}
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            Preview Team
          </a>
          <button
            onClick={handleResetFourMembers}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to 4 Standard Members"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 4 Members</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <div
            key={member.id}
            className={`bg-white rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
              member.isActive !== false ? 'border-gray-200 shadow-xs' : 'border-gray-200 bg-gray-50/70 opacity-60'
            }`}
          >
            <div>
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={member.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1 bg-black/50 backdrop-blur-xs rounded-lg p-1">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveOrder(index, 'up')}
                    className="p-1 text-white hover:text-amber-400 disabled:opacity-20"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === team.length - 1}
                    onClick={() => handleMoveOrder(index, 'down')}
                    className="p-1 text-white hover:text-amber-400 disabled:opacity-20"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-gray-900">{member.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {member.isActive !== false ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-burgundy-700 bg-burgundy-50 px-2 py-0.5 rounded-md inline-block">
                  Profession: {member.role}
                </div>
                <p className="text-xs text-gray-500 line-clamp-3">{member.bio}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(member)}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id, member.name)}
                className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Member Modal */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-base">
                {editingMember.id && !editingMember.id.startsWith('temp-') ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="e.g. Samuel Zagwa"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Profession / Role / Designation *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="e.g. Founder & Lead Finisher, Operations & Site Supervisor..."
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'Founder & Lead Finisher',
                    'Operations & Site Supervisor',
                    'Client Relations & Color Consultant',
                    'Senior Finisher & Quality Estimator'
                  ].map((prof) => (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, role: prof })}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        editingMember.role === prof
                          ? 'bg-burgundy-100 text-burgundy-900 border-burgundy-300 font-bold'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {prof}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Portrait Photo"
                  value={editingMember.imageUrl || ''}
                  onChange={(url) => setEditingMember({ ...editingMember, imageUrl: url })}
                  categoryHint="Team"
                  aspectRatio="avatar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Biography / Expertise Summary
                </label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="Summary of craftsmanship experience..."
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="+234..."
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    placeholder="name@..."
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 mt-2">
                <span className="text-xs font-bold text-gray-800">Publish to Website</span>
                <input
                  type="checkbox"
                  checked={editingMember.isActive !== false}
                  onChange={(e) => setEditingMember({ ...editingMember, isActive: e.target.checked })}
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
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
