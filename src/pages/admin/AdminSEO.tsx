import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { WebsiteSettings } from '../../types';
import { Search, Save, Check, Globe } from 'lucide-react';

export function AdminSEO() {
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
      console.error('Failed to save SEO', err);
      alert('Error updating SEO settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">SEO & Search Optimization</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure how Asantex Decor appears on Google search results and social media shares.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              SEO Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save SEO'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              SEO Page Title Tag (Max 60 characters)
            </label>
            <input
              type="text"
              value={formData.seoTitle || ''}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
              placeholder="e.g. ASANTEX DECOR | Premium Interior & Exterior Finishing in Nigeria"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              {(formData.seoTitle || '').length} / 60 characters
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Meta Description (Max 160 characters)
            </label>
            <textarea
              rows={3}
              value={formData.seoDescription || ''}
              onChange={(e) => handleChange('seoDescription', e.target.value)}
              placeholder="Summary shown beneath Google search result..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              {(formData.seoDescription || '').length} / 160 characters
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Search Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={formData.seoKeywords || ''}
              onChange={(e) => handleChange('seoKeywords', e.target.value)}
              placeholder="e.g. wall screeding Lagos, POP designs Nigeria, painting contractor..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>
        </div>

        {/* Google Search Snippet Simulation */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            Google Search Preview
          </h3>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1 max-w-xl">
            <div className="text-xs text-gray-600 truncate flex items-center gap-1">
              <span className="text-gray-400 font-mono">https://asantex.com</span>
            </div>
            <div className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
              {formData.seoTitle || 'ASANTEX DECOR | Premium Interior & Exterior Finishing'}
            </div>
            <div className="text-xs text-gray-600 line-clamp-2">
              {formData.seoDescription || 'ASANTEX DECOR specializes in professional interior and exterior wall finishing, decoration, painting, and modern architectural finishing services in Nigeria.'}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
