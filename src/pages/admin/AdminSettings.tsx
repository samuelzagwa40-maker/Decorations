import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { WebsiteSettings } from '../../types';
import { ImageUploadField } from '../../components/ImageUploadField';
import { Settings, Save, Check, Shield } from 'lucide-react';

export function AdminSettings() {
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
      console.error('Failed to save settings', err);
      alert('Error updating website settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Website Global Settings</h1>
          <p className="text-xs text-gray-500 mt-1">
            General website branding, company logo, favicon, and footer copyright text.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Settings Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Branding & Identity
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Website & Brand Display Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyName || ''}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="e.g. ASANTEX DECOR"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageUploadField
              label="Company Logo"
              value={formData.logoUrl || ''}
              onChange={(url) => handleChange('logoUrl', url)}
              helperText="Upload transparent PNG or SVG logo for header."
              categoryHint="General"
              aspectRatio="square"
            />

            <ImageUploadField
              label="Website Favicon"
              value={formData.faviconUrl || ''}
              onChange={(url) => handleChange('faviconUrl', url)}
              helperText="Small square icon (32x32) shown in browser tab."
              categoryHint="General"
              aspectRatio="avatar"
            />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Footer Details
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={formData.footerCopyright || ''}
              onChange={(e) => handleChange('footerCopyright', e.target.value)}
              placeholder="e.g. ASANTEX DECOR. All Rights Reserved."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Footer Bio / Tagline
            </label>
            <textarea
              rows={3}
              value={formData.footerBio || ''}
              onChange={(e) => handleChange('footerBio', e.target.value)}
              placeholder="Short bio shown under the logo in the website footer..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
