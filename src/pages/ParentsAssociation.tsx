import React from 'react';
import { useSettings } from '../lib/SettingsContext';
import { motion } from 'motion/react';
import { Users2, Calendar, Phone, Mail, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ParentsAssociation() {
  const { parentsAssociation, settings } = useSettings();

  if (!parentsAssociation.isPublished) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-gray-50">
        <Users2 className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold font-display text-gray-800">Parents’ Association Notice</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-md">
          The Parents’ Association hub is currently being updated by the administrator. Please check back shortly.
        </p>
        <Link to="/" className="mt-6 px-6 py-2.5 bg-burgundy-700 text-white text-xs font-bold rounded-full">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const cleanWa = (settings.whatsapp || '2348000000000').replace(/[^0-9]/g, '');

  return (
    <div className="w-full bg-white">
      {/* Hero Banner */}
      <section className="relative py-24 bg-royal-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=2000"
            alt="Parents Association"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-burgundy-700/90 text-xs font-bold uppercase tracking-wider mb-4">
            Official Community Hub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {parentsAssociation.title || 'Parents’ Association'}
          </h1>
          <p className="text-lg text-royal-200 max-w-3xl mx-auto leading-relaxed">
            {parentsAssociation.description || 'Fostering collaboration, excellence, and dedicated stakeholder engagement for sustainable community growth and high standards.'}
          </p>
        </div>
      </section>

      {/* Chairman Welcome Address */}
      {parentsAssociation.chairmanName && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-4 border-burgundy-100 shadow-md mb-4 bg-gray-100">
                  <img
                    src={parentsAssociation.chairmanPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'}
                    alt={parentsAssociation.chairmanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{parentsAssociation.chairmanName}</h3>
                <p className="text-xs text-burgundy-700 font-semibold">{parentsAssociation.chairmanTitle || 'Chairman, Parents’ Association'}</p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <span className="text-xs font-bold text-burgundy-800 uppercase tracking-wider">
                  Address from the Leadership
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
                  Welcome to our Community & Stakeholders Forum
                </h2>
                <div className="w-16 h-1 bg-burgundy-600 rounded-full"></div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {parentsAssociation.chairmanMessage || 'We are delighted to welcome all parents, patrons, and stakeholders to our community forum. Together with ASANTEX DECOR, we are dedicated to maintaining quality standards, safe environments, and exemplary finishes.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Meetings Schedule Banner */}
      {parentsAssociation.meetingsInfo && (
        <section className="py-12 bg-burgundy-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-burgundy-800 rounded-2xl shrink-0">
                <Calendar className="w-8 h-8 text-burgundy-200" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Meeting & Assemblies Schedule</h3>
                <p className="text-xs text-burgundy-200 mt-0.5">{parentsAssociation.meetingsInfo}</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('Hello Parents’ Association, I would like to inquire about the next meeting.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-burgundy-950 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              RSVP via WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* Executive Committee Members */}
      {parentsAssociation.executives && parentsAssociation.executives.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Leadership</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-1 mb-3">
                Executive Committee
              </h2>
              <div className="w-16 h-1 bg-burgundy-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">
                Dedicated representatives serving the interests of members and guiding continuous improvements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {parentsAssociation.executives.map((exec) => (
                <div
                  key={exec.id}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all group"
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-burgundy-200 bg-gray-200 shrink-0">
                    <img
                      src={exec.photoUrl || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400'}
                      alt={exec.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="font-bold text-base text-gray-900">{exec.name}</h4>
                  <p className="text-xs text-burgundy-700 font-semibold mb-3">{exec.position}</p>

                  {(exec.phone || exec.email) && (
                    <div className="text-[11px] text-gray-500 space-y-1 w-full border-t border-gray-200 pt-3 mt-auto">
                      {exec.phone && (
                        <div className="flex items-center justify-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <a href={`tel:${exec.phone}`} className="hover:text-burgundy-700">{exec.phone}</a>
                        </div>
                      )}
                      {exec.email && (
                        <div className="flex items-center justify-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <a href={`mailto:${exec.email}`} className="hover:text-burgundy-700 truncate">{exec.email}</a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events & Photo Gallery */}
      {parentsAssociation.eventPhotos && parentsAssociation.eventPhotos.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Photo Album</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 mt-1 mb-3">
                Events & Activities
              </h2>
              <div className="w-16 h-1 bg-burgundy-600 mx-auto mb-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {parentsAssociation.eventPhotos.map((photo, idx) => (
                <div key={idx} className="relative aspect-4/3 rounded-2xl overflow-hidden border border-gray-200 group">
                  <img
                    src={photo}
                    alt={`Event Photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
