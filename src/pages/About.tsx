import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Gem, Users, CheckCircle2, Award, Phone, Mail, Sparkles } from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';

export function About() {
  const { settings, team } = useSettings();

  const companyDesc = settings?.companyDescription || "ASANTEX DECOR is a premium Nigerian interior and exterior decoration and finishing company. We specialize in transforming spaces through professional wall finishing, decoration, painting, and modern architectural finishing services.";
  const mission = settings?.aboutMission || "To provide exceptional finishing solutions that elevate the aesthetic and structural value of properties, utilizing innovative techniques, premium materials, and professional craftsmanship.";
  const vision = settings?.aboutVision || "To be the most trusted and sought-after interior and exterior finishing company in Nigeria, recognized for our commitment to quality, creativity, and flawless execution.";
  const valuesText = settings?.aboutValues || "Commitment to Quality, Professionalism, Integrity, and 100% Customer Satisfaction in every project.";

  const activeTeam = team.filter(m => m.isActive !== false);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-royal-950 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Background" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-burgundy-700/80 text-xs font-bold uppercase tracking-wider mb-4">
            Our Story & Values
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">About ASANTEX DECOR</h1>
          <p className="text-xl text-royal-200 max-w-2xl mx-auto">
            Discover the passion, precision, and craftsmanship behind every project we deliver.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Company Profile</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-1 mb-4">Who We Are</h2>
              <div className="w-16 h-1 bg-burgundy-600 mb-6"></div>
              <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed whitespace-pre-line">
                {companyDesc}
              </p>
              {settings?.companyHistory && (
                <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-burgundy-700" />
                    Our Journey & Standards
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {settings.companyHistory}
                  </p>
                </div>
              )}
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600" 
                alt="Worker screeding wall" 
                className="rounded-2xl shadow-md h-64 object-cover w-full" 
              />
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600" 
                alt="Beautiful POP design" 
                className="rounded-2xl shadow-md h-64 object-cover w-full mt-8" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder / Leadership Profile if configured */}
      {settings?.founderName && (
        <section className="py-20 bg-royal-950 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-royal-900/60 rounded-3xl p-8 sm:p-12 border border-royal-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-4 border-burgundy-700 shadow-xl mb-4 bg-royal-800">
                  <img
                    src={settings.founderPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'}
                    alt={settings.founderName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold font-display text-white">{settings.founderName}</h3>
                <p className="text-xs text-burgundy-300 font-semibold">{settings.founderTitle || 'Founder & Principal Decorator'}</p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <span className="text-xs font-bold text-burgundy-400 uppercase tracking-wider">
                  Founder's Message
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  "Excellence is not an accident; it is the deliberate result of skilled hands and unwavering standards."
                </h2>
                <div className="w-16 h-1 bg-burgundy-500 rounded-full"></div>
                <p className="text-royal-200 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {settings.founderBio || 'With over a decade of hands-on expertise in architectural finishing across residential villas, commercial high-rises, and luxury estates, our mission has always remained simple: to turn raw walls into works of enduring beauty.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 bg-royal-50 rounded-xl flex items-center justify-center text-royal-600 mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {mission}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 bg-burgundy-50 rounded-xl flex items-center justify-center text-burgundy-600 mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Our Standards</span>
            <h2 className="text-3xl font-display font-bold text-gray-900 mt-1 mb-4">Our Core Values</h2>
            <div className="w-16 h-1 bg-burgundy-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">{valuesText}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Gem, title: 'Commitment to Quality', desc: 'We select the best materials and employ expert artisans to ensure longevity and beauty.' },
              { icon: Users, title: 'Customer Satisfaction', desc: 'Your vision is our priority. We communicate transparently and deliver beyond expectations.' },
              { icon: CheckCircle2, title: 'Professionalism', desc: 'From punctuality to worksite cleanliness, our team maintains the highest professional standards.' }
            ].map((value, i) => (
              <div key={i} className="text-center p-8 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-burgundy-600 mb-6 border border-gray-200 shadow-xs">
                  <value.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {activeTeam.length > 0 && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Meet the Artisans</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 mt-1 mb-4">
                Our Leadership & Team
              </h2>
              <div className="w-16 h-1 bg-burgundy-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-sm">
                Skilled specialists dedicated to bringing architectural perfection to your walls.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activeTeam.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={member.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
                        alt={member.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-base text-gray-900">{member.name}</h4>
                      <p className="text-xs font-semibold text-burgundy-700 mt-0.5">{member.role}</p>
                      {member.bio && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{member.bio}</p>
                      )}
                    </div>
                  </div>

                  {(member.phone || member.email) && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
                      {member.phone && <div>Tel: {member.phone}</div>}
                      {member.email && <div>Email: {member.email}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
