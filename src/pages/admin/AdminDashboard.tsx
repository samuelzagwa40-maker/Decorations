import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../lib/SettingsContext';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Briefcase, 
  Image as ImageIcon, 
  Users, 
  MessageSquareQuote, 
  Inbox, 
  FileImage, 
  ArrowRight, 
  CheckCircle, 
  Phone, 
  Eye, 
  Plus, 
  Sparkles,
  Users2,
  Clock,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

export function AdminDashboard() {
  const { 
    services, 
    projects, 
    team, 
    testimonials, 
    inquiries, 
    mediaItems,
    parentsAssociation,
    settings 
  } = useSettings();

  const [adminCount, setAdminCount] = useState<number>(1);

  useEffect(() => {
    async function loadAdminCount() {
      try {
        const snap = await getDocs(collection(db, 'admins'));
        const distinct = new Set(snap.docs.map(d => (d.data().email || d.id).toLowerCase()));
        distinct.add('samuelzagwa40@gmail.com');
        setAdminCount(distinct.size);
      } catch (e) {
        // Fallback default
      }
    }
    loadAdminCount();
  }, []);

  const pendingInquiries = inquiries.filter(i => i.status === 'pending' || (i as any).status === 'unread');

  const stats = [
    { name: 'Active Services', count: services.filter(s => s.isActive !== false).length, icon: Briefcase, color: 'text-blue-600 bg-blue-50', link: '/admin/services' },
    { name: 'Gallery Projects', count: projects.length, icon: ImageIcon, color: 'text-purple-600 bg-purple-50', link: '/admin/gallery' },
    { name: 'Team Members', count: team.length, icon: Users, color: 'text-green-600 bg-green-50', link: '/admin/team' },
    { name: 'Testimonials', count: testimonials.length, icon: MessageSquareQuote, color: 'text-amber-600 bg-amber-50', link: '/admin/testimonials' },
    { name: 'Media Library Items', count: mediaItems.length, icon: FileImage, color: 'text-pink-600 bg-pink-50', link: '/admin/media' },
    { name: 'Customer Inquiries', count: inquiries.length, icon: Inbox, color: 'text-burgundy-700 bg-burgundy-50', link: '/admin/inquiries' },
    { name: 'Admin Members', count: adminCount, icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50', link: '/admin/users' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-royal-950 via-royal-900 to-burgundy-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-burgundy-200">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            Live Cloud CMS Synchronized
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Welcome to Asantex.com CMS
          </h1>
          <p className="text-sm text-royal-200 max-w-xl">
            Manage everything on your website without writing code. Edit text, swap photos from your phone or computer, add services, and monitor customer quote requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-royal-800 hover:bg-royal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 border border-royal-700/50"
          >
            <UserPlus className="w-4 h-4 text-royal-300" />
            Add Admin Member
          </Link>
          <Link
            to="/admin/homepage"
            className="px-4 py-2.5 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            Edit Homepage
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Public Site
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Website Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.link}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-burgundy-300 transition-all flex flex-col group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                <span className="text-xs text-gray-500 font-medium mt-1 group-hover:text-burgundy-700 transition-colors">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Quick Homepage Shortcuts</h3>
            <Sparkles className="w-4 h-4 text-burgundy-600" />
          </div>
          <div className="space-y-2">
            <Link
              to="/admin/homepage"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 border border-gray-100"
            >
              <span>Edit Hero Banner & Headlines</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
            <Link
              to="/admin/services"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 border border-gray-100"
            >
              <span>Manage Services ({services.length})</span>
              <Plus className="w-3.5 h-3.5 text-burgundy-600" />
            </Link>
            <Link
              to="/admin/gallery"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 border border-gray-100"
            >
              <span>Upload Gallery Photos</span>
              <Plus className="w-3.5 h-3.5 text-burgundy-600" />
            </Link>
            <Link
              to="/admin/parents-association"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 border border-gray-100"
            >
              <span className="flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-burgundy-700" />
                Parents’ Association
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${parentsAssociation.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {parentsAssociation.isPublished ? 'Published' : 'Draft'}
              </span>
            </Link>
          </div>
        </div>

        {/* WhatsApp & Contact Quick Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Contact & WhatsApp Setup</h3>
            <Phone className="w-4 h-4 text-green-600" />
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div className="text-xs text-gray-500">Active WhatsApp Number:</div>
            <div className="text-base font-bold text-gray-900 font-mono">
              +{settings.whatsapp || '2348030000000'}
            </div>
            <p className="text-[11px] text-gray-500">
              Used automatically on all WhatsApp chat buttons, quote forms, and footer links across the site.
            </p>
          </div>
          <Link
            to="/admin/contact"
            className="block text-center py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Update WhatsApp & Contact Info
          </Link>
        </div>

        {/* Media Library Quick Uploader */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">Media Library</h3>
              <FileImage className="w-4 h-4 text-pink-600" />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload photos once, reuse everywhere on your site. All uploaded photos are automatically optimized for mobile screens.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 text-center">
            <p className="text-xs font-semibold text-gray-700">{mediaItems.length} photos in library</p>
            <Link
              to="/admin/media"
              className="mt-3 inline-flex items-center justify-center px-4 py-2 bg-royal-900 hover:bg-royal-800 text-white text-xs font-semibold rounded-lg transition-colors w-full"
            >
              Open Media Library
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Customer Inquiries */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Recent Quote & Contact Requests</h3>
            <p className="text-xs text-gray-500 mt-0.5">Direct inquiries submitted by visitors from the website</p>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1"
          >
            View All ({inquiries.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Inbox className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">No inquiries received yet.</p>
            <p className="text-xs mt-1">Customer inquiries will appear here automatically when submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Service Requested</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.slice(0, 5).map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {inq.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div>{inq.phone}</div>
                      <div className="text-[10px] text-gray-400">{inq.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {(inq as any).serviceRequired || 'General Consultation'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inq.status === 'pending' || inq.status === 'unread'
                          ? 'bg-amber-100 text-amber-800'
                          : inq.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {inq.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/admin/inquiries"
                        className="text-burgundy-700 hover:text-burgundy-900 font-semibold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
