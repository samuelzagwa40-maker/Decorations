import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { QuoteRequest, ContactMessage } from '../types';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Inbox, FileText, Settings, LogOut, Search, Clock, CheckCircle, MoreVertical } from 'lucide-react';

export function Admin() {
  const [activeTab, setActiveTab] = useState<'quotes' | 'messages'>('quotes');
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    // Load mock data
    setQuotes(storage.getQuotes());
    setMessages(storage.getContacts());
  }, []);

  const handleUpdateQuoteStatus = (id: string, status: QuoteRequest['status']) => {
    storage.updateQuoteStatus(id, status);
    setQuotes(storage.getQuotes());
  };

  const handleUpdateMessageStatus = (id: string, status: ContactMessage['status']) => {
    storage.updateContactStatus(id, status);
    setMessages(storage.getContacts());
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-royal-950 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-royal-900">
          <Link to="/" className="flex flex-col inline-block">
            <span className="font-display font-bold text-xl tracking-wide text-white">
              ASANTEX <span className="text-burgundy-400">DECOR</span>
            </span>
            <span className="text-[10px] tracking-widest text-royal-300 uppercase">Admin Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('quotes')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'quotes' ? 'bg-royal-900 text-white' : 'text-royal-300 hover:bg-royal-900 hover:text-white'}`}
          >
            <FileText className="w-5 h-5 mr-3" /> Quotes Requests
            {quotes.filter(q => q.status === 'pending').length > 0 && (
              <span className="ml-auto bg-burgundy-600 text-white text-xs px-2 py-0.5 rounded-full">
                {quotes.filter(q => q.status === 'pending').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'messages' ? 'bg-royal-900 text-white' : 'text-royal-300 hover:bg-royal-900 hover:text-white'}`}
          >
            <Inbox className="w-5 h-5 mr-3" /> Contact Enquiries
            {messages.filter(m => m.status === 'unread').length > 0 && (
              <span className="ml-auto bg-burgundy-600 text-white text-xs px-2 py-0.5 rounded-full">
                {messages.filter(m => m.status === 'unread').length}
              </span>
            )}
          </button>
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-royal-400 hover:bg-royal-900 hover:text-white transition-colors cursor-not-allowed opacity-50">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Manage Content
          </button>
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-royal-400 hover:bg-royal-900 hover:text-white transition-colors cursor-not-allowed opacity-50">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-royal-900">
          <Link to="/" className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-royal-300 hover:bg-royal-900 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'quotes' ? 'Quote Requests' : 'Contact Enquiries'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage incoming requests from the website</p>
          </div>
          
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-royal-500 bg-white shadow-sm"
            />
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'quotes' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">Customer Details</th>
                    <th className="px-6 py-4 font-medium">Service & Date</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quotes.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No quote requests found.</td></tr>
                  ) : quotes.map(quote => (
                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{quote.name}</p>
                        <p className="text-sm text-gray-500">{quote.phone}</p>
                        {quote.email && <p className="text-sm text-gray-500">{quote.email}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-royal-100 text-royal-800 mb-2">
                          {quote.serviceRequired}
                        </span>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          Pref: {quote.preferredDate || 'Not specified'}
                        </p>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={quote.projectDescription}>
                        <p className="text-sm text-gray-600 truncate">{quote.projectDescription}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          quote.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          value={quote.status}
                          onChange={(e) => handleUpdateQuoteStatus(quote.id, e.target.value as QuoteRequest['status'])}
                          className="text-sm border border-gray-200 rounded-md p-1 outline-none focus:border-royal-500 bg-white"
                        >
                          <option value="pending">Mark Pending</option>
                          <option value="reviewed">Mark Reviewed</option>
                          <option value="contacted">Mark Contacted</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">Sender Details</th>
                    <th className="px-6 py-4 font-medium">Message Content</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {messages.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No contact messages found.</td></tr>
                  ) : messages.map(msg => (
                    <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${msg.status === 'unread' ? 'bg-royal-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{msg.name}</p>
                        <p className="text-sm text-gray-500">{msg.phone}</p>
                        {msg.email && <p className="text-sm text-gray-500">{msg.email}</p>}
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          msg.status === 'unread' ? 'bg-red-100 text-red-800' :
                          msg.status === 'read' ? 'bg-gray-100 text-gray-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          value={msg.status}
                          onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value as ContactMessage['status'])}
                          className="text-sm border border-gray-200 rounded-md p-1 outline-none focus:border-royal-500 bg-white"
                        >
                          <option value="unread">Mark Unread</option>
                          <option value="read">Mark Read</option>
                          <option value="replied">Mark Replied</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
