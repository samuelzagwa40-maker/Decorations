import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettings } from '../lib/SettingsContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  const companyName = settings?.companyName || 'ASANTEX DECOR';

  // Helper to highlight parts of the name
  const nameParts = companyName.split(' ');
  const firstPart = nameParts[0] || 'ASANTEX';
  const restParts = nameParts.slice(1).join(' ') || 'DECOR';

  const initials = companyName
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('') || 'AD';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top Organization Name & Branding Tier */}
      <div className="bg-white border-b border-gray-100/80 py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          
          {/* Prominent, Enlarged Organization Name at the Top */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={companyName} 
                className="h-12 sm:h-14 md:h-16 w-auto object-contain rounded-xl shadow-xs"
              />
            ) : (
              <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-royal-950 text-amber-300 font-display font-black text-xl sm:text-2xl md:text-3xl flex items-center justify-center shadow-md ring-2 ring-burgundy-100 group-hover:scale-105 transition-transform shrink-0">
                {initials}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-burgundy-950 uppercase leading-none group-hover:text-burgundy-800 transition-colors">
                {firstPart} {restParts && <span className="text-royal-900">{restParts}</span>}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-gray-500 uppercase mt-1">
                {settings?.heroSubtitle || 'PREMIUM INTERIOR & EXTERIOR FINISHING • WALL SCREEDING • POP DESIGNS'}
              </span>
            </div>
          </Link>

          {/* Quick Contact & Consultation CTAs (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-burgundy-50 text-burgundy-700 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Direct Line</div>
                <a 
                  href={`tel:${(settings?.phone || '+234 803 000 0000').replace(/\s/g, '')}`} 
                  className="font-bold text-gray-900 hover:text-burgundy-700 transition-colors"
                >
                  {settings?.phone || '+234 803 000 0000'}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-royal-50 text-royal-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</div>
                <span className="font-bold text-gray-900">
                  {settings?.address ? settings.address.split(',').slice(-2).join(',').trim() : 'Victoria Island, Lagos'}
                </span>
              </div>
            </div>

            <Link
              to="/quote"
              className="bg-burgundy-700 hover:bg-burgundy-800 text-white px-5 py-2.5 rounded-full font-bold text-xs tracking-wide uppercase transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Action Controls */}
          <div className="flex md:hidden items-center justify-between pt-1 border-t border-gray-100">
            <span className="text-[11px] font-bold text-burgundy-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Architectural Finishers</span>
            </span>
            <div className="flex items-center gap-2">
              <Link
                to="/quote"
                className="bg-burgundy-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs"
              >
                Quote
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-lg text-gray-700 hover:text-burgundy-700 hover:bg-gray-100"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar Tier */}
      <div className="bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex justify-between h-13 items-center">
            
            {/* Nav Links */}
            <div className="flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                    location.pathname === link.path 
                      ? "bg-burgundy-50 text-burgundy-800 font-bold" 
                      : "text-gray-700 hover:text-burgundy-700 hover:bg-gray-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Admin & Quote Action */}
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/login"
                className="text-xs font-semibold text-gray-500 hover:text-burgundy-700 transition-colors flex items-center gap-1.5"
                title="Staff & Management CMS"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span>Admin Portal</span>
              </Link>

              <Link
                to="/quote"
                className="lg:hidden bg-burgundy-700 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-burgundy-800 transition-colors shadow-xs"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 pt-3 pb-5 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-base font-medium transition-colors",
                  location.pathname === link.path 
                    ? "bg-burgundy-50 text-burgundy-800 font-bold" 
                    : "text-gray-700 hover:text-burgundy-600 hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-100 space-y-2.5">
              <div className="text-xs text-gray-500 space-y-1 pb-1">
                <div className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-burgundy-700" />
                  <span>{settings?.phone || '+234 803 000 0000'}</span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-royal-700" />
                  <span>{settings?.address || 'Victoria Island, Lagos, Nigeria'}</span>
                </div>
              </div>

              <Link
                to="/quote"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-xl text-sm font-bold text-center shadow-md"
              >
                Request a Free Quote
              </Link>

              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-center rounded-lg text-xs font-semibold text-gray-500 hover:text-burgundy-700 hover:bg-gray-50"
              >
                Admin Staff Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

