import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';

export function Footer() {
  const { settings } = useSettings();
  
  const companyName = settings?.companyName || 'ASANTEX DECOR';
  const companyDesc = settings?.companyDescription || 'ASANTEX DECOR specializes in professional interior and exterior wall finishing, decoration, painting, and modern architectural finishing services.';
  
  const address = settings?.address || '123 Decor Avenue, Victoria Island, Lagos, Nigeria';
  const phone = settings?.phone || '+2348000000000';
  const email = settings?.email || 'info@asantexdecor.com';
  const whatsapp = settings?.whatsapp || '2348000000000';
  
  const waMessage = encodeURIComponent(`Hello ${companyName}, I would like to make an enquiry about your decoration services.`);

  return (
    <footer className="bg-royal-950 text-royal-50 pt-16 pb-8 border-t border-royal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col inline-block">
              <span className="font-display font-bold text-2xl tracking-wide text-white uppercase">
                {companyName}
              </span>
            </Link>
            <p className="text-sm text-royal-200 leading-relaxed mt-4">
              {companyDesc}
            </p>
            <div className="flex space-x-4 pt-2">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-royal-300 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-royal-300 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Projects', 'Contact Us'].map((link) => (
                <li key={link}>
                  <Link to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '')}`} className="text-sm text-royal-200 hover:text-white hover:underline transition-all">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {['Wall Screeding', 'POP Designs', 'Wallpaper', 'Graphitex Design', 'Painting'].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-sm text-royal-200 hover:text-white hover:underline transition-all">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-4">Contact Information</h4>
            <ul className="space-y-4">
              <li className="flex items-start text-sm text-royal-200">
                <MapPin className="w-5 h-5 mr-3 text-burgundy-400 shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center text-sm text-royal-200">
                <Phone className="w-5 h-5 mr-3 text-burgundy-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white">{phone}</a>
              </li>
              <li className="flex items-center text-sm text-royal-200">
                <Mail className="w-5 h-5 mr-3 text-burgundy-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
              </li>
            </ul>
            
            <a 
              href={`https://wa.me/${whatsapp}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md mt-6 text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
        
        <div className="border-t border-royal-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-royal-400">
          <p>Copyright &copy; {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="/admin" className="hover:text-white">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
