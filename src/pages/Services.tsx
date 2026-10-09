import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';

export function Services() {
  const { services, settings } = useSettings();
  const activeServices = services.filter(s => s.isActive !== false);

  const cleanWa = (settings.whatsapp || '2348000000000').replace(/[^0-9]/g, '');

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
            Master Craftsmanship
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Our Services</h1>
          <p className="text-xl text-royal-200 max-w-2xl mx-auto">
            Comprehensive interior and exterior finishing solutions for residential, corporate, and commercial properties.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service, index) => {
              const IconComp = (Icons as any)[service.icon] || Icons.Sparkles;

              return (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
                >
                  <div className="h-64 overflow-hidden relative shrink-0">
                    <img 
                      src={service.imageUrl} 
                      alt={service.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl shadow-xs text-royal-700">
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6 flex-grow text-sm leading-relaxed">{service.description}</p>
                    
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mb-8 border-t border-gray-100 pt-4">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-xs sm:text-sm text-gray-600">
                            <Icons.Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto space-y-2">
                      <Link 
                        to={`/quote?service=${encodeURIComponent(service.title)}`}
                        className="block w-full py-3 px-4 bg-burgundy-700 hover:bg-burgundy-800 text-white text-center rounded-xl text-xs font-bold transition-colors shadow-xs"
                      >
                        Request Quote for this Service
                      </Link>
                      <a
                        href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hello ASANTEX DECOR, I would like to inquire about your ${service.title} service.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 px-4 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-center rounded-xl text-xs font-bold transition-colors"
                      >
                        Inquire on WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Workflow</span>
            <h2 className="text-3xl font-display font-bold text-gray-900 mt-1 mb-4">How We Work</h2>
            <div className="w-16 h-1 bg-burgundy-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Consultation', desc: 'We discuss your vision, evaluate your space, and understand your exact finishing requirements.' },
              { num: '02', title: 'Quotation', desc: 'You receive a transparent, itemized quotation with timeline projections and material specs.' },
              { num: '03', title: 'Execution', desc: 'Our certified decorators screed, paint, or install with rigorous attention to straight edge precision.' },
              { num: '04', title: 'Handover', desc: 'Final joint inspection, thorough cleanup, and delivery of your transformed architectural space.' }
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                {i !== 3 && <div className="hidden md:block absolute top-12 left-1/2 w-full h-[2px] bg-gray-100 -z-10"></div>}
                <div className="w-24 h-24 mx-auto bg-white border-4 border-royal-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-3xl font-display font-bold text-burgundy-700">{step.num}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
