import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSettings } from '../lib/SettingsContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CheckCircle2, FileText, Loader2 } from 'lucide-react';

export function Quote() {
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get('service') || '';
  const { services, settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceRequired: preSelectedService,
    projectDescription: '',
    preferredDate: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({ ...prev, serviceRequired: preSelectedService }));
    }
  }, [preSelectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        type: 'quote',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        serviceRequired: formData.serviceRequired || 'General Finishes',
        preferredDate: formData.preferredDate || '',
        projectDescription: formData.projectDescription,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Could not submit quote right now. Please message us on WhatsApp or call our phone line directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const activeServices = services.filter(s => s.isActive !== false);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-24">
      <section className="bg-royal-950 py-20 text-white text-center">
        <span className="inline-block py-1 px-4 rounded-full bg-burgundy-700/80 text-xs font-bold uppercase tracking-wider mb-4">
          Free Estimate
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Request a Quote</h1>
        <p className="text-base sm:text-lg text-royal-200 max-w-xl mx-auto px-4">
          Provide us with details about your space, and we'll prepare a transparent, competitive estimate.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {submitted ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Quote Request Received!</h2>
              <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-gray-900">{formData.name || 'valued customer'}</span>. We have received your project details and our decorating team will contact you at <span className="font-semibold text-burgundy-700">{formData.phone}</span> with your customized estimate.
              </p>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', email: '', serviceRequired: '', projectDescription: '', preferredDate: '' });
                }}
                className="bg-burgundy-700 text-white px-8 py-3 rounded-full font-bold hover:bg-burgundy-800 transition-colors text-xs"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="p-8 md:p-10">
              <div className="flex items-center mb-8 border-b border-gray-100 pb-6">
                <div className="w-12 h-12 bg-burgundy-50 rounded-full flex items-center justify-center text-burgundy-700 mr-4 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
                  <p className="text-gray-500 text-xs">Fill out the form below to help us tailor your estimate.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Full Name *</label>
                    <input required type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm bg-gray-50/50" placeholder="e.g. Chief Adebayo" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Phone Number *</label>
                    <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm bg-gray-50/50" placeholder="+234 803 000 0000" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Email Address (Optional)</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm bg-gray-50/50" placeholder="client@example.com" />
                </div>
                
                <div>
                  <label htmlFor="serviceRequired" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Primary Service Required *</label>
                  <select required id="serviceRequired" name="serviceRequired" value={formData.serviceRequired} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm bg-gray-50/50">
                    <option value="" disabled>Select a service</option>
                    {activeServices.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Complete Interior & Exterior Finishing">Complete Interior & Exterior Finishing</option>
                    <option value="Multiple Services">Multiple Services</option>
                    <option value="Not Sure Yet / Need Consultation">Not Sure Yet / Need Consultation</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferredDate" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">When do you plan to start? (Optional)</label>
                  <input type="date" id="preferredDate" name="preferredDate" value={formData.preferredDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm bg-gray-50/50" />
                </div>

                <div>
                  <label htmlFor="projectDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Project Description *</label>
                  <p className="text-xs text-gray-500 mb-2">Please describe the property type (e.g. 5-bedroom duplex, bungalow, commercial showroom), location, and any specific preferences.</p>
                  <textarea required id="projectDescription" name="projectDescription" value={formData.projectDescription} onChange={handleChange} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm resize-none bg-gray-50/50" placeholder="E.g., We have a newly roofed 4-bedroom duplex in Lekki requiring interior wall screeding, POP ceiling finishing, and exterior satin painting..."></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={isSubmitting} 
                    type="submit" 
                    className="w-full bg-burgundy-700 text-white font-bold text-sm py-4 rounded-xl hover:bg-burgundy-800 disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? 'Sending Request...' : 'Submit Request for Quote'}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    Your information is protected. We will respond promptly with a personalized assessment.
                  </p>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
