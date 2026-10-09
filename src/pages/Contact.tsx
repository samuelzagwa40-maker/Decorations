import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useSettings } from '../lib/SettingsContext';

export function Contact() {
  const { settings, services } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceRequired: '',
    preferredDate: '',
    projectDescription: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const address = settings?.address || 'Victoria Island, Lagos, Nigeria';
  const phone = settings?.phone || '+234 803 000 0000';
  const email = settings?.email || 'info@asantexdecor.com';
  const workingHours = settings?.openingHours || 'Mon - Sat: 8:00 AM - 6:00 PM';
  const cleanWa = (settings.whatsapp || '2348000000000').replace(/[^0-9]/g, '');
  const mapsUrl = settings?.mapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126844.06232549221!2d3.35518485!3d6.5372166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1699999999999!5m2!1sen!2sng";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        type: 'contact',
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        serviceRequired: '',
        preferredDate: '',
        projectDescription: ''
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-royal-950 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Background" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-burgundy-700/80 text-xs font-bold uppercase tracking-wider mb-4">
            Direct Communication
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-royal-200 max-w-2xl mx-auto">
            Get in touch with our team today. We are ready to discuss your finishing project.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Contact Info */}
            <div>
              <div className="mb-12">
                <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Reach Out</span>
                <h2 className="text-3xl font-display font-bold text-gray-900 mt-1 mb-4">Get In Touch</h2>
                <div className="w-16 h-1 bg-burgundy-600 mb-6"></div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Our master decorators are ready to provide expert guidance and site evaluation for your property.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-burgundy-50 text-burgundy-700 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-bold text-gray-900">Office / Workshop</h4>
                    <p className="text-gray-600 text-sm mt-0.5 whitespace-pre-wrap">{address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-burgundy-50 text-burgundy-700 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-bold text-gray-900">Telephone Line</h4>
                    <p className="text-gray-600 text-sm mt-0.5">
                      <a href={`tel:${phone}`} className="hover:text-burgundy-700">{phone}</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-burgundy-50 text-burgundy-700 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-bold text-gray-900">Official Email</h4>
                    <p className="text-gray-600 text-sm mt-0.5">
                      <a href={`mailto:${email}`} className="hover:text-burgundy-700">{email}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-burgundy-50 text-burgundy-700 rounded-full flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-bold text-gray-900">Working Hours</h4>
                    <p className="text-gray-600 text-sm mt-0.5">{workingHours}</p>
                  </div>
                </div>

                {/* WhatsApp Action */}
                <div className="pt-4">
                  <a
                    href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('Hello ASANTEX DECOR, I would like to consult on my upcoming building decoration.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat Directly on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Send an Enquiry</h3>
                
                {submitted ? (
                  <div className="bg-green-50 text-green-800 p-8 rounded-xl text-center border border-green-200">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                    <p className="text-sm text-green-700">
                      Thank you for reaching out to ASANTEX DECOR. Our team has received your details and will get in touch shortly.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-6 px-6 py-2.5 bg-green-700 text-white text-xs font-bold rounded-lg hover:bg-green-800 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Full Name *</label>
                        <input required type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm" placeholder="e.g. Chief Adebayo" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Phone Number *</label>
                        <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm" placeholder="+234 803 000 0000" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm" placeholder="client@example.com" />
                      </div>
                      <div>
                        <label htmlFor="serviceRequired" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Service Required</label>
                        <select id="serviceRequired" name="serviceRequired" value={formData.serviceRequired} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm bg-white">
                          <option value="">Select a service</option>
                          {services.filter(s => s.isActive !== false).map(s => (
                            <option key={s.id} value={s.title}>{s.title}</option>
                          ))}
                          <option value="Full Building Screeding & Painting">Full Building Screeding & Painting</option>
                          <option value="General Consultation">General Consultation</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="preferredDate" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Preferred Inspection Date</label>
                      <input type="date" id="preferredDate" name="preferredDate" value={formData.preferredDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm" />
                    </div>

                    <div>
                      <label htmlFor="projectDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Project Description *</label>
                      <textarea required id="projectDescription" name="projectDescription" value={formData.projectDescription} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 outline-none text-sm resize-none" placeholder="Describe the size of the building, current state of walls, location in Nigeria, and preferred finish..."></textarea>
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full bg-burgundy-700 text-white font-bold py-4 rounded-xl hover:bg-burgundy-800 disabled:opacity-50 transition-colors shadow-md text-sm">
                      {isSubmitting ? 'Submitting Enquiry...' : 'Submit Project Enquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Location */}
      <section className="h-[400px] w-full bg-gray-200 relative">
        <iframe 
          src={mapsUrl} 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="ASANTEX DECOR Location"
          className="absolute inset-0 grayscale contrast-125 opacity-85"
        ></iframe>
      </section>
    </div>
  );
}
