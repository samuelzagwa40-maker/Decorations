import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { ImageUploadField } from '../../components/ImageUploadField';
import { Save, Check, Building2, Eye, Award, Target, Compass, HeartHandshake } from 'lucide-react';
import { WebsiteSettings } from '../../types';

export function AdminAbout() {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState<WebsiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: keyof WebsiteSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save company profile', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">About Us & Company Profile</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your company profile, history, mission, vision, values, and founder information.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Saved & Live!
            </span>
          )}
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            Preview About Page
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 disabled:bg-burgundy-400 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Company Profile */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Building2 className="w-5 h-5 text-burgundy-700" />
            <h2 className="text-lg font-bold text-gray-900">Company Overview & Bio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g. ASANTEX DECOR"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Short Footer Bio
              </label>
              <input
                type="text"
                value={formData.footerBio || ''}
                onChange={(e) => handleChange('footerBio', e.target.value)}
                placeholder="One-sentence summary displayed in the footer..."
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Full Company Description / Profile
            </label>
            <textarea
              rows={4}
              value={formData.companyDescription || ''}
              onChange={(e) => handleChange('companyDescription', e.target.value)}
              placeholder="Detailed description of ASANTEX DECOR..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Company History & Origin Story
            </label>
            <textarea
              rows={3}
              value={formData.history || ''}
              onChange={(e) => handleChange('history', e.target.value)}
              placeholder="How the company started and its journey..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>
        </div>

        {/* Mission, Vision & Values */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Target className="w-5 h-5 text-burgundy-700" />
            <h2 className="text-lg font-bold text-gray-900">Mission, Vision & Core Values</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={formData.mission || ''}
                onChange={(e) => handleChange('mission', e.target.value)}
                placeholder="Our mission is to..."
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Vision Statement
              </label>
              <textarea
                rows={3}
                value={formData.vision || ''}
                onChange={(e) => handleChange('vision', e.target.value)}
                placeholder="To be recognized as..."
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Core Values (Comma-separated or bullet points)
              </label>
              <textarea
                rows={3}
                value={formData.values || ''}
                onChange={(e) => handleChange('values', e.target.value)}
                placeholder="Commitment to Quality, Attention to Detail, Integrity, Punctuality..."
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>
          </div>
        </div>

        {/* Founder & Leadership Information */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Award className="w-5 h-5 text-burgundy-700" />
            <h2 className="text-lg font-bold text-gray-900">Founder / Executive Leadership Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Founder / Managing Director Name
                </label>
                <input
                  type="text"
                  value={formData.founderName || ''}
                  onChange={(e) => handleChange('founderName', e.target.value)}
                  placeholder="e.g. Samuel Zagwa"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Founder's Message / Statement
                </label>
                <textarea
                  rows={5}
                  value={formData.founderMessage || ''}
                  onChange={(e) => handleChange('founderMessage', e.target.value)}
                  placeholder="A personal welcome or guarantee of quality from the founder..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>
            </div>

            <div>
              <ImageUploadField
                label="Founder Photo"
                value={formData.founderPhoto || ''}
                onChange={(url) => handleChange('founderPhoto', url)}
                helperText="Upload a professional portrait photo directly from your device."
                categoryHint="Team"
                aspectRatio="square"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
