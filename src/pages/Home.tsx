import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Shield, 
  ThumbsUp, 
  Users2, 
  Phone, 
  MessageCircle, 
  Sparkles,
  Calendar,
  Award,
  Clock,
  Check,
  Play,
  Video
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';
import { VideoPlayerModal } from '../components/VideoPlayerModal';

export function Home() {
  const { 
    settings, 
    services, 
    projects, 
    testimonials, 
    announcements, 
    parentsAssociation, 
    sectionsConfig 
  } = useSettings();

  const heroHeading = settings?.heroHeading || "Transforming Spaces. Creating Beautiful Finishes.";
  const heroDescription = settings?.heroDescription || "We are Asantex Decor, delivering premium wall screeding, painting, wallpaper installation, and specialized interior and exterior finishes for residential and commercial properties.";
  const heroImageUrl = settings?.heroImageUrl || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000";
  const heroPrimaryText = settings?.heroButtonText || "Get a Quote";
  const heroPrimaryUrl = settings?.heroButtonUrl || "/quote";
  const heroSecondaryText = settings?.heroSecondaryText || "View Our Services";
  const heroSecondaryUrl = settings?.heroSecondaryUrl || "/services";

  const activeServices = services.filter(s => s.isActive !== false);
  const featuredServices = activeServices.slice(0, 3);
  
  const activeProjects = projects.filter(p => p.isActive !== false);
  const featuredProjects = activeProjects.filter(p => p.featured).slice(0, 4);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : activeProjects.slice(0, 4);

  const activeTestimonials = testimonials.filter(t => t.isActive !== false);
  const activeAnnouncements = announcements.filter(a => a.isActive);

  const cleanWa = (settings.whatsapp || '2348000000000').replace(/[^0-9]/g, '');
  const [videoModal, setVideoModal] = useState<{ url: string; title: string; category?: string } | null>(null);

  return (
    <div className="w-full">
      {/* Top Announcement Banner */}
      {sectionsConfig?.announcements !== false && activeAnnouncements.length > 0 && (
        <div className="bg-gradient-to-r from-burgundy-900 via-royal-950 to-burgundy-900 text-white text-xs py-2.5 px-4 shadow-sm relative z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="px-2 py-0.5 rounded-full bg-burgundy-600 text-[10px] font-bold uppercase tracking-wider shrink-0">
                {activeAnnouncements[0].badge || 'Notice'}
              </span>
              <span className="font-semibold text-burgundy-100 truncate">
                {activeAnnouncements[0].title}:
              </span>
              <span className="text-gray-300 truncate">
                {activeAnnouncements[0].content}
              </span>
            </div>
            {activeAnnouncements[0].link && (
              <Link 
                to={activeAnnouncements[0].link} 
                className="shrink-0 font-bold underline hover:text-burgundy-200 flex items-center gap-1 text-[11px]"
              >
                Learn More <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImageUrl} 
            alt="Modern living room with beautiful finishes" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-royal-950/65 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-royal-950/90 via-royal-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy-800/90 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold tracking-widest uppercase mb-3 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ARCHITECTURAL FINISHING SPECIALISTS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-amber-300 tracking-tight uppercase drop-shadow-md">
                {settings?.companyName || 'ASANTEX DECOR'}
              </h2>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-6 text-white">
              {heroHeading}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 max-w-lg leading-relaxed">
              {heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to={heroPrimaryUrl} 
                className="bg-burgundy-700 hover:bg-burgundy-800 text-white px-8 py-4 rounded-full text-center font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                {heroPrimaryText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to={heroSecondaryUrl} 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full text-center font-medium transition-all flex items-center justify-center"
              >
                {heroSecondaryText}
              </Link>
              {settings?.heroVideoUrl && (
                <button 
                  type="button"
                  onClick={() => setVideoModal({ 
                    url: settings.heroVideoUrl!, 
                    title: "Asantex Decor - Company Showcase & Walkthrough", 
                    category: "Showcase Reel" 
                  })}
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/30 px-6 py-4 rounded-full text-center font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105"
                >
                  <Play className="w-4 h-4 text-amber-300 fill-current" />
                  <span>Watch Video</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Statistics Bar */}
      {sectionsConfig?.stats !== false && (
        <section className="bg-royal-900 text-white py-8 border-y border-royal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-3">
                <p className="text-3xl sm:text-4xl font-display font-bold text-burgundy-300">
                  {settings?.statProjects || '350+'}
                </p>
                <p className="text-xs sm:text-sm text-royal-200 mt-1 uppercase tracking-wider font-medium">
                  Completed Projects
                </p>
              </div>
              <div className="p-3">
                <p className="text-3xl sm:text-4xl font-display font-bold text-burgundy-300">
                  {settings?.statClients || '280+'}
                </p>
                <p className="text-xs sm:text-sm text-royal-200 mt-1 uppercase tracking-wider font-medium">
                  Satisfied Clients
                </p>
              </div>
              <div className="p-3">
                <p className="text-3xl sm:text-4xl font-display font-bold text-burgundy-300">
                  {settings?.statExperience || '10+'}
                </p>
                <p className="text-xs sm:text-sm text-royal-200 mt-1 uppercase tracking-wider font-medium">
                  Years Experience
                </p>
              </div>
              <div className="p-3">
                <p className="text-3xl sm:text-4xl font-display font-bold text-burgundy-300">
                  {settings?.statSatisfaction || '100%'}
                </p>
                <p className="text-xs sm:text-sm text-royal-200 mt-1 uppercase tracking-wider font-medium">
                  Satisfaction Guarantee
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Services Section */}
      {sectionsConfig?.services !== false && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Our Craftsmanship</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-1 mb-4">
                Our Premium Finishing Services
              </h2>
              <div className="w-20 h-1 bg-burgundy-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-base sm:text-lg">
                We provide high-quality finishing solutions for homes, offices, commercial buildings, and luxury apartments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => {
                const IconComp = (Icons as any)[service.icon] || Icons.Sparkles;
                
                return (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-56 overflow-hidden relative">
                        <img 
                          src={service.imageUrl} 
                          alt={service.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl shadow-xs text-burgundy-700">
                          <IconComp className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-3">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="px-8 pb-8 pt-0">
                      <Link to="/services" className="inline-flex items-center font-bold text-sm text-burgundy-700 hover:text-burgundy-800 transition-colors">
                        Explore service details <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/services" className="inline-flex items-center font-bold text-royal-700 hover:text-royal-800 transition-colors">
                View all {activeServices.length} decoration services <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Why Choose Us</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-1 mb-4">
                  Excellence in Every Stroke & Edge
                </h2>
                <div className="w-20 h-1 bg-burgundy-600 mb-8"></div>
                <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
                  We are a premium Nigerian interior and exterior decoration company dedicated to excellence. Our commitment to high-grade materials, meticulous edge finishing, and client satisfaction sets us apart.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Shield, title: 'Quality Workmanship', desc: 'We never compromise on materials or screeding thickness.' },
                    { icon: Star, title: 'Attention to Detail', desc: 'Flawless finishes with straight and precise angles.' },
                    { icon: ThumbsUp, title: 'Reliable Delivery', desc: 'Transparent pricing, timely milestones, and site cleanliness.' },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-royal-50 flex items-center justify-center text-royal-600">
                          <feature.icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-bold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mt-0.5">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800" 
                  alt="Professional painter working" 
                  className="rounded-2xl shadow-2xl z-10 relative object-cover aspect-4/3"
                />
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 border border-gray-100 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="bg-burgundy-600 text-white p-3 rounded-full">
                      <Star className="w-7 h-7 fill-current" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-gray-900">{settings?.statSatisfaction || '100%'}</p>
                      <p className="text-xs font-medium text-gray-500">Client Satisfaction</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Projects Gallery */}
      {sectionsConfig?.gallery !== false && (
        <section className="py-24 bg-royal-950 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-burgundy-400 uppercase tracking-wider">Portfolio</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold mt-1 mb-4">Selected Projects</h2>
                <div className="w-20 h-1 bg-burgundy-500 mb-6"></div>
                <p className="text-royal-200 text-base sm:text-lg">
                  Explore a selection of our finest finishing projects across residential and commercial spaces.
                </p>
              </div>
              <Link to="/projects" className="hidden md:inline-flex items-center font-bold text-burgundy-400 hover:text-burgundy-300 transition-colors">
                View full gallery <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayProjects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative h-80 rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (project.videoUrl) {
                      setVideoModal({
                        url: project.videoUrl,
                        title: project.title,
                        category: project.category
                      });
                    }
                  }}
                >
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-950/90 via-royal-950/30 to-transparent"></div>
                  
                  {project.videoUrl && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-burgundy-600/90 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <Play className="w-3 h-3 fill-current" />
                      <span>Video</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="text-xs font-semibold tracking-wider text-burgundy-400 uppercase mb-2 block">{project.category}</span>
                    <h3 className="text-lg font-display font-semibold text-white line-clamp-1">{project.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link to="/projects" className="inline-flex items-center font-bold text-burgundy-400 hover:text-burgundy-300 transition-colors">
                View full gallery <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Parents' Association Homepage Spotlight */}
      {sectionsConfig?.parentsAssociation !== false && parentsAssociation?.isPublished && (
        <section className="py-20 bg-burgundy-50/50 border-y border-burgundy-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-burgundy-200/70 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-100 text-burgundy-800 text-xs font-bold uppercase tracking-wider">
                  <Users2 className="w-3.5 h-3.5" />
                  Community & Stakeholders
                </div>
                <h2 className="text-3xl font-display font-bold text-gray-900">
                  {parentsAssociation.title || 'Parents’ Association Forum'}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {parentsAssociation.description || 'Connecting stakeholders, patrons, and the community to uphold safety, excellence, and collaborative initiatives.'}
                </p>
                {parentsAssociation.meetingsInfo && (
                  <div className="flex items-center gap-2 text-xs text-burgundy-900 font-medium bg-burgundy-50 p-3 rounded-xl border border-burgundy-100">
                    <Calendar className="w-4 h-4 text-burgundy-700 shrink-0" />
                    <span>{parentsAssociation.meetingsInfo}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/parents-association"
                  className="px-6 py-3.5 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Visit Parents’ Hub
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`https://wa.me/${cleanWa}?text=${encodeURIComponent('Hello Parents’ Association, I would like to make an enquiry.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {sectionsConfig?.testimonials !== false && activeTestimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Client Reviews</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-1 mb-4">
                What Our Clients Say
              </h2>
              <div className="w-20 h-1 bg-burgundy-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-base">
                Discover why homeowners, architects, and building contractors trust ASANTEX DECOR.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeTestimonials.slice(0, 3).map((item, idx) => (
                <div 
                  key={item.id}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm italic leading-relaxed">
                      "{item.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300 shrink-0">
                      <img src={item.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'} alt={item.clientName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{item.clientName}</h4>
                      <p className="text-xs text-gray-500">{item.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {sectionsConfig?.cta !== false && (
        <section className="py-24 bg-burgundy-700 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
              {settings?.ctaHeading || "Ready to Perfect Your Space?"}
            </h2>
            <p className="text-base sm:text-lg text-burgundy-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              {settings?.ctaDescription || "Contact us today for a consultation or request a quote to get started on transforming your property with our premium finishing services."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to={settings?.ctaButtonUrl || "/quote"} 
                className="bg-white text-burgundy-800 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {settings?.ctaButtonText || "Request a Quote"}
              </Link>
              <Link 
                to="/contact" 
                className="bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Direct Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hello ${settings?.companyName || 'ASANTEX DECOR'}, I would like to consult on a decorative project.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
        title="Chat with Asantex Decor on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold">
          Chat with Us
        </span>
      </a>
      {/* Video Player Modal */}
      {videoModal && (
        <VideoPlayerModal
          isOpen={true}
          onClose={() => setVideoModal(null)}
          videoUrl={videoModal.url}
          title={videoModal.title}
          category={videoModal.category}
        />
      )}
    </div>
  );
}
