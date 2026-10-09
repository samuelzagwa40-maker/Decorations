import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { ImageUploadField } from '../../components/ImageUploadField';
import { VideoUploadField } from '../../components/VideoUploadField';
import { 
  Save, 
  Eye, 
  Check, 
  Sparkles, 
  LayoutList, 
  Sliders, 
  BarChart3, 
  ShieldCheck, 
  Megaphone,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { WebsiteSettings } from '../../types';

export function AdminHomepage() {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState<WebsiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'stats' | 'cta'>('hero');

  // Sync with context if updated externally
  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: keyof WebsiteSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectionToggle = (sectionKey: keyof NonNullable<WebsiteSettings['sectionsConfig']>) => {
    setFormData(prev => ({
      ...prev,
      sectionsConfig: {
        ...(prev.sectionsConfig || {
          hero: true,
          announcements: true,
          services: true,
          whyChooseUs: true,
          stats: true,
          projects: true,
          parentsAssociation: true,
          team: true,
          testimonials: true,
          cta: true
        }),
        [sectionKey]: !(prev.sectionsConfig as any)?.[sectionKey]
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save homepage settings', err);
      alert('Failed to save changes. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header & Save Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Homepage Manager</h1>
          <p className="text-xs text-gray-500 mt-1">
            Customize hero banners, headlines, section visibility, and buttons on the front page.
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
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 disabled:bg-burgundy-400 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing Changes...' : 'Save & Publish Live'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-2xl px-6">
        <button
          onClick={() => setActiveTab('hero')}
          className={`py-4 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'hero'
              ? 'border-burgundy-700 text-burgundy-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Hero Banner Section
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`py-4 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'sections'
              ? 'border-burgundy-700 text-burgundy-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          Homepage Sections & Ordering
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-4 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'stats'
              ? 'border-burgundy-700 text-burgundy-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Statistics / Counters
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`py-4 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'cta'
              ? 'border-burgundy-700 text-burgundy-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Call To Action (CTA) Banner
        </button>
      </div>

      {/* TAB 1: HERO SECTION */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-b-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-8 -mt-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Hero & Main Banner Content</h2>
            <p className="text-xs text-gray-500 mt-1">
              The first impression visitors see when landing on Asantex.com.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Hero Tagline / Subtitle Badge
                </label>
                <input
                  type="text"
                  value={formData.heroSubtitle || ''}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  placeholder="e.g. PREMIUM INTERIOR & EXTERIOR FINISHING"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Main Headline / Title
                </label>
                <textarea
                  rows={3}
                  value={formData.heroHeading || ''}
                  onChange={(e) => handleChange('heroHeading', e.target.value)}
                  placeholder="e.g. Transforming Spaces. Creating Beautiful Finishes."
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Tip: End phrases with a period to generate distinctive typographic color accents.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Hero Description / Introduction Paragraph
                </label>
                <textarea
                  rows={4}
                  value={formData.heroDescription || ''}
                  onChange={(e) => handleChange('heroDescription', e.target.value)}
                  placeholder="Provide an engaging summary of your services..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroButtonText || ''}
                    onChange={(e) => handleChange('heroButtonText', e.target.value)}
                    placeholder="e.g. Get a Quote"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.heroButtonUrl || ''}
                    onChange={(e) => handleChange('heroButtonUrl', e.target.value)}
                    placeholder="e.g. /quote"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroButton2Text || ''}
                    onChange={(e) => handleChange('heroButton2Text', e.target.value)}
                    placeholder="e.g. View Our Services"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.heroButton2Url || ''}
                    onChange={(e) => handleChange('heroButton2Url', e.target.value)}
                    placeholder="e.g. /services"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>
              </div>
            </div>

            {/* Hero Image Management */}
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-sm">Hero Background Image</h3>
                <p className="text-xs text-gray-500">
                  Upload or replace the hero background photo. It automatically displays on the homepage.
                </p>

                <ImageUploadField
                  label="Hero Background Photo"
                  value={formData.heroImageUrl || ''}
                  onChange={(url) => handleChange('heroImageUrl', url)}
                  helperText="Recommended: 1920x1080 or high-res landscape decor image."
                  categoryHint="Homepage"
                  aspectRatio="video"
                />
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm">Hero Showcase Video (Optional)</h3>
                <p className="text-xs text-gray-500">
                  Upload an MP4 project reel or link a YouTube / Vimeo showcase. Adds an interactive &quot;Watch Video&quot; button in the hero banner.
                </p>

                <VideoUploadField
                  label="Showcase Video / Walkthrough"
                  value={formData.heroVideoUrl || ''}
                  onChange={(url) => handleChange('heroVideoUrl', url)}
                  helperText="Upload an MP4 clip or paste a YouTube / Vimeo video URL."
                  categoryHint="Homepage"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECTIONS CONFIG */}
      {activeTab === 'sections' && (
        <div className="bg-white rounded-b-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 -mt-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Homepage Sections Control</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enable or disable specific sections on the public homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'hero', name: 'Hero Banner Section', desc: 'Main headline, hero background image, call to action' },
              { id: 'announcements', name: 'Notice Board / Announcements', desc: 'Promotions, urgent news, and notifications banner' },
              { id: 'services', name: 'Our Premium Services', desc: 'Grid preview of wall screeding, POP, wallpaper, painting' },
              { id: 'whyChooseUs', name: 'Why Choose Us / Values', desc: 'Quality workmanship, attention to detail, reliability' },
              { id: 'stats', name: 'Statistics & Achievements Counters', desc: 'Projects completed, client satisfaction rate, years in business' },
              { id: 'projects', name: 'Selected Projects Mini-Gallery', desc: 'Featured visual portfolio showcase' },
              { id: 'parentsAssociation', name: 'Parents’ Association Section', desc: 'Community involvement, chairman message & executive members' },
              { id: 'team', name: 'Leadership & Team Members', desc: 'Profiles of master finishers and project managers' },
              { id: 'testimonials', name: 'Client Testimonials & Reviews', desc: 'Real customer feedback and 5-star ratings' },
              { id: 'cta', name: 'Ready to Perfect Your Space CTA', desc: 'Full-width bottom conversion banner' },
            ].map((sec) => {
              const isEnabled = (formData.sectionsConfig as any)?.[sec.id] !== false;
              return (
                <div
                  key={sec.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isEnabled ? 'bg-white border-gray-300 shadow-xs' : 'bg-gray-50/60 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-bold text-gray-900">{sec.name}</h4>
                    <p className="text-xs text-gray-500 leading-tight">{sec.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSectionToggle(sec.id as any)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? 'bg-burgundy-700' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STATISTICS / COUNTERS */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-b-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 -mt-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Statistics & Counters</h2>
            <p className="text-xs text-gray-500 mt-1">
              Update the credibility metrics shown on the homepage and about page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Projects Completed
              </label>
              <input
                type="text"
                value={formData.statProjects || ''}
                onChange={(e) => handleChange('statProjects', e.target.value)}
                placeholder="e.g. 350+"
                className="w-full px-4 py-2 text-base font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500 bg-white"
              />
              <span className="text-[11px] text-gray-500">Number of finished projects</span>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Satisfied Clients
              </label>
              <input
                type="text"
                value={formData.statClients || ''}
                onChange={(e) => handleChange('statClients', e.target.value)}
                placeholder="e.g. 280+"
                className="w-full px-4 py-2 text-base font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500 bg-white"
              />
              <span className="text-[11px] text-gray-500">Corporate & residential clients</span>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Years of Experience
              </label>
              <input
                type="text"
                value={formData.statExperience || ''}
                onChange={(e) => handleChange('statExperience', e.target.value)}
                placeholder="e.g. 10+"
                className="w-full px-4 py-2 text-base font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500 bg-white"
              />
              <span className="text-[11px] text-gray-500">Industry craftsmanship tenure</span>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Client Satisfaction
              </label>
              <input
                type="text"
                value={formData.statSatisfaction || ''}
                onChange={(e) => handleChange('statSatisfaction', e.target.value)}
                placeholder="e.g. 100%"
                className="w-full px-4 py-2 text-base font-bold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-burgundy-500 bg-white"
              />
              <span className="text-[11px] text-gray-500">Rating & positive feedback</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CTA BANNER */}
      {activeTab === 'cta' && (
        <div className="bg-white rounded-b-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 -mt-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Bottom Call To Action (CTA) Banner</h2>
            <p className="text-xs text-gray-500 mt-1">
              The high-converting invitation banner at the bottom of the homepage.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                CTA Heading
              </label>
              <input
                type="text"
                value={formData.ctaHeading || ''}
                onChange={(e) => handleChange('ctaHeading', e.target.value)}
                placeholder="e.g. Ready to Perfect Your Space?"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                CTA Description Text
              </label>
              <textarea
                rows={3}
                value={formData.ctaDescription || ''}
                onChange={(e) => handleChange('ctaDescription', e.target.value)}
                placeholder="e.g. Contact us today for a consultation or request a quote to get started on transforming your property..."
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaButtonText || ''}
                  onChange={(e) => handleChange('ctaButtonText', e.target.value)}
                  placeholder="e.g. Request a Quote"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Button URL / Path
                </label>
                <input
                  type="text"
                  value={formData.ctaButtonUrl || ''}
                  onChange={(e) => handleChange('ctaButtonUrl', e.target.value)}
                  placeholder="e.g. /quote"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
