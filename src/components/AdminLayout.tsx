import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useSettings } from '../lib/SettingsContext';
import { 
  LayoutDashboard, 
  Home, 
  Building2, 
  Briefcase, 
  Image as ImageIcon, 
  Users2, 
  Users, 
  MessageSquareQuote, 
  Phone, 
  FileImage, 
  BellRing, 
  Settings, 
  Search, 
  Inbox, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Eye,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export function AdminLayout() {
  const { user, adminRole, logout } = useAuth();
  const { settings, inquiries } = useSettings();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const companyName = settings?.companyName || 'ASANTEX DECOR';
  const orgInitials = companyName
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('') || 'AD';

  const pendingInquiriesCount = inquiries.filter(i => i.status === 'pending' || (i as any).status === 'unread').length;

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Homepage', href: '/admin/homepage', icon: Home },
    { name: 'About & Profile', href: '/admin/about', icon: Building2 },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Parents’ Association', href: '/admin/parents-association', icon: Users2 },
    { name: 'Team Members', href: '/admin/team', icon: Users },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Contact & WhatsApp', href: '/admin/contact', icon: Phone },
    { name: 'Media Library', href: '/admin/media', icon: FileImage },
    { name: 'Announcements', href: '/admin/announcements', icon: BellRing },
    { name: 'Website Settings', href: '/admin/settings', icon: Settings },
    { name: 'SEO Settings', href: '/admin/seo', icon: Search },
    { 
      name: 'Messages / Inquiries', 
      href: '/admin/inquiries', 
      icon: Inbox,
      badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined 
    },
    { name: 'Admin Members', href: '/admin/users', icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-burgundy-700 text-amber-300 flex items-center justify-center font-bold text-sm shadow-xs">
            {orgInitials}
          </div>
          <span className="font-display font-extrabold text-gray-950 text-base sm:text-lg tracking-tight uppercase">
            {companyName}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="p-2 text-burgundy-700 hover:bg-burgundy-50 rounded-lg text-xs font-semibold flex items-center gap-1 border border-burgundy-200"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-royal-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-royal-900 bg-royal-950">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-burgundy-700 flex items-center justify-center font-bold text-amber-300 shadow-md text-base ring-1 ring-white/10">
              {orgInitials}
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg tracking-wide text-white leading-tight uppercase">
                {companyName}
              </h2>
              <p className="text-[10px] text-amber-300/80 uppercase tracking-widest font-semibold">Admin CMS</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-royal-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-royal-800">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-burgundy-700 text-white shadow-md font-semibold' 
                    : 'text-royal-200 hover:bg-royal-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-royal-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-burgundy-600 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom Controls */}
        <div className="p-3 border-t border-royal-900 bg-royal-950/90 space-y-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-royal-900 text-white hover:bg-royal-800 transition-colors border border-royal-800"
          >
            <Eye className="w-4 h-4 text-burgundy-400" />
            Live Preview Website
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-royal-300 hover:text-white hover:bg-royal-900/40 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in New Tab
          </a>

          <div className="pt-2 border-t border-royal-900/80 flex items-center justify-between px-2">
            <div className="truncate max-w-[140px]">
              <p className="text-[11px] font-medium text-white truncate">{user?.displayName || user?.email || 'Admin'}</p>
              <p className="text-[9px] text-royal-300 truncate">{adminRole || 'Administrator'}</p>
              <span className="text-[9px] text-green-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Connected
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-red-300 hover:text-red-100 hover:bg-red-950/50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 w-full overflow-x-hidden min-h-screen flex flex-col">
        {/* Desktop Top Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">CMS Management</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-bold text-gray-800 capitalize">
              {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3.5 py-1.5 bg-burgundy-50 hover:bg-burgundy-100 text-burgundy-800 border border-burgundy-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-4 h-4 text-burgundy-700" />
              Live Preview
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Live Site
            </a>
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1">
          <Outlet />
        </div>
      </main>

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
            <div className="h-14 bg-royal-950 text-white flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                <h3 className="font-bold text-sm">Live Website Preview (Asantex.com)</h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-royal-200 hover:text-white flex items-center gap-1 bg-royal-900 px-3 py-1 rounded-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Fullscreen
                </a>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 rounded-lg text-royal-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full bg-gray-100 relative">
              <iframe
                src="/"
                title="Website Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
