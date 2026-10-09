import React, { useState } from 'react';
import { useSettings } from '../../lib/SettingsContext';
import { 
  Inbox, 
  Phone, 
  Mail, 
  MessageCircle, 
  Trash2, 
  Check, 
  Filter, 
  Search, 
  Calendar, 
  Clock 
} from 'lucide-react';

export function AdminInquiries() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useSettings();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = filterStatus === 'All' || inq.status === filterStatus.toLowerCase();
    const matchesSearch = !searchQuery || 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateInquiryStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete inquiry from ${name}?`)) {
      try {
        await deleteInquiry(id);
      } catch (err) {
        console.error('Failed to delete inquiry', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Customer Messages & Inquiries</h1>
          <p className="text-xs text-gray-500 mt-1">
            Incoming quote requests and general consultations submitted through your website forms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-burgundy-50 text-burgundy-800 rounded-lg text-xs font-bold border border-burgundy-200">
            Total: {inquiries.length}
          </span>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold border border-amber-200">
            Pending: {inquiries.filter(i => i.status === 'pending' || (i as any).status === 'unread').length}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['All', 'Pending', 'Reviewed', 'Contacted', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-burgundy-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
          />
        </div>
      </div>

      {/* Inquiries Cards */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400">
          <Inbox className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-semibold text-gray-700">No customer messages found</p>
          <p className="text-xs text-gray-400 mt-1">Submitted quote requests will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((item) => {
            const rawPhone = (item.phone || '').replace(/[^0-9]/g, '');
            const waPhone = rawPhone.startsWith('0') ? '234' + rawPhone.slice(1) : rawPhone;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${item.name}, thank you for contacting ASANTEX DECOR regarding your project enquiry.`)}`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-burgundy-100 text-burgundy-800 flex items-center justify-center font-bold text-sm">
                      {item.name ? item.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500">
                        Submitted on: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={item.status || 'pending'}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                        item.status === 'pending' || (item as any).status === 'unread'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : item.status === 'contacted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-green-50 text-green-800 border-green-300'
                      }`}
                    >
                      <option value="pending">Status: Pending</option>
                      <option value="reviewed">Status: Reviewed</option>
                      <option value="contacted">Status: Contacted</option>
                      <option value="completed">Status: Completed</option>
                    </select>

                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    {(item as any).serviceRequired && (
                      <p>
                        <span className="font-bold text-gray-700">Requested Service: </span>
                        <span className="text-burgundy-800 font-semibold">{(item as any).serviceRequired}</span>
                      </p>
                    )}
                    {(item as any).preferredDate && (
                      <p>
                        <span className="font-bold text-gray-700">Preferred Inspection Date: </span>
                        <span className="text-gray-600">{(item as any).preferredDate}</span>
                      </p>
                    )}
                    <div className="pt-1 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-800 block mb-1">Message / Project Description:</span>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {(item as any).projectDescription || (item as any).message || 'No additional details provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Customer Direct Contact Shortcuts */}
                  <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-800">Quick Reply Options:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Reply on WhatsApp
                      </a>
                      <a
                        href={`tel:${item.phone}`}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call ({item.phone})
                      </a>
                      {item.email && (
                        <a
                          href={`mailto:${item.email}?subject=ASANTEX DECOR Project Consultation`}
                          className="px-3 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
