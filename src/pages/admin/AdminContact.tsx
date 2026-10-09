import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { WebsiteSettings } from '../../types';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Save, 
  Check, 
  ExternalLink,
  Globe
} from 'lucide-react';

export function AdminContact() {
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

    // Clean up WhatsApp number (strip plus, spaces, dashes)
    let cleanWa = (formData.whatsapp || '').replace(/[^0-9]/g, '');
    const dataToSave = {
      ...formData,
      whatsapp: cleanWa
    };

    try {
      await updateSettings(dataToSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save contact settings', err);
      alert('Error updating contact information.');
    } finally {
      setSaving(false);
    }
  };

  const cleanWaNumber = (formData.whatsapp || '').replace(/[^0-9]/g, '');
  const waTestUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent('Hello ASANTEX DECOR, testing WhatsApp integration.')}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Contact & WhatsApp Setup</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure phone lines, official WhatsApp chat number, physical location, and social profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-green-600" />
              Settings Updated!
            </span>
          )}
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            View Contact Page
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 disabled:bg-burgundy-400 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All Contacts'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* WhatsApp Real-Time Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Direct WhatsApp Integration</h2>
                <p className="text-xs text-gray-500">Every WhatsApp button on your website links to this number.</p>
              </div>
            </div>
            {cleanWaNumber && (
              <a
                href={waTestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-bold hover:bg-green-100 transition-colors"
              >
                Test WhatsApp Button
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="space-y-3 max-w-xl">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              WhatsApp Number (with International Country Code) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="e.g. 2348030000000 (No plus sign or spaces)"
                className="w-full px-4 py-2.5 text-base font-mono border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="p-3.5 rounded-xl bg-green-50/50 border border-green-200/70 text-xs text-green-800 space-y-1">
              <p className="font-semibold">Format Guide:</p>
              <p>For Nigeria: enter <code className="bg-green-100 px-1 py-0.5 rounded font-mono">234</code> followed by the 10 digits (e.g. 2348031234567). Omit any leading 0.</p>
              <p>Live wa.me link generated: <span className="font-mono text-green-900 font-bold underline">https://wa.me/{cleanWaNumber || '2348030000000'}</span></p>
            </div>
          </div>
        </div>

        {/* Primary Contact Channels */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Phone className="w-5 h-5 text-burgundy-700" />
            <h2 className="text-lg font-bold text-gray-900">Phone, Email & Physical Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Official Telephone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +234 803 000 0000"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. info@asantexdecor.com"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Physical Office / Workshop Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. Victoria Island, Lagos, Nigeria"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Working / Operating Hours
              </label>
              <input
                type="text"
                value={formData.openingHours || ''}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder="e.g. Monday - Saturday: 8:00 AM - 6:00 PM"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Globe className="w-5 h-5 text-burgundy-700" />
            <h2 className="text-lg font-bold text-gray-900">Social Media Handles & Links</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Facebook Page Link
              </label>
              <input
                type="url"
                value={formData.facebookUrl || ''}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/asantexdecor"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Instagram Profile Link
              </label>
              <input
                type="url"
                value={formData.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/asantexdecor"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                TikTok Handle / URL
              </label>
              <input
                type="url"
                value={formData.tiktokUrl || ''}
                onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                placeholder="https://tiktok.com/@asantexdecor"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/company/asantexdecor"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>
          </div>
        </div>

        {/* Google Maps Location */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <MapPin className="w-5 h-5 text-burgundy-700" />
            <h2 className="text-lg font-bold text-gray-900">Google Maps Embed</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Google Maps Embed URL / Link
            </label>
            <input
              type="text"
              value={formData.mapsEmbedUrl || ''}
              onChange={(e) => handleChange('mapsEmbedUrl', e.target.value)}
              placeholder="e.g. https://www.google.com/maps/embed?pb=..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Paste the embed src link from Google Maps (Share → Embed a map → copy HTML).
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
