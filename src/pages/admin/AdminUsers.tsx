import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit2, 
  Copy, 
  Check, 
  UserCheck, 
  AlertCircle, 
  Search, 
  Mail, 
  Phone, 
  Building, 
  Share2, 
  KeyRound, 
  RefreshCw,
  X,
  CheckCircle2,
  Briefcase,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export type AdminRole = 
  | 'Super Administrator'
  | 'Administrator'
  | 'Content Editor'
  | 'Inquiry Coordinator';

export interface AdminAccount {
  id: string; // document ID, usually normalized lowercase email
  email: string;
  name: string;
  profession: string; // Profession / Job title (e.g., Founder & Lead Finisher, Operations & Site Supervisor)
  role: AdminRole;
  phone?: string;
  department?: string;
  status?: 'Active' | 'Pending First Login';
  addedAt?: string;
  addedBy?: string;
  lastLoginAt?: string;
}

// Four Standard Professional Admin Profiles
export const FOUR_DEFAULT_ADMINS: AdminAccount[] = [
  {
    id: 'samuelzagwa40@gmail.com',
    email: 'samuelzagwa40@gmail.com',
    name: 'Samuel Zagwa',
    profession: 'Founder & Lead Finisher',
    role: 'Super Administrator',
    department: 'Executive Management',
    phone: '+234 803 000 0000',
    status: 'Active',
    addedAt: '2024-01-15T08:00:00.000Z',
    addedBy: 'System Master'
  },
  {
    id: 'operations@asantexdecor.com',
    email: 'operations@asantexdecor.com',
    name: 'Emmanuel Adebayo',
    profession: 'Operations & Site Supervisor',
    role: 'Administrator',
    department: 'Field Operations & Screeding',
    phone: '+234 802 345 6789',
    status: 'Active',
    addedAt: '2024-02-10T10:00:00.000Z',
    addedBy: 'Samuel Zagwa'
  },
  {
    id: 'consulting@asantexdecor.com',
    email: 'consulting@asantexdecor.com',
    name: 'Grace Okafor',
    profession: 'Client Relations & Color Consultant',
    role: 'Content Editor',
    department: 'Design, Paints & Wallpaper Styling',
    phone: '+234 809 876 5432',
    status: 'Active',
    addedAt: '2024-03-01T11:30:00.000Z',
    addedBy: 'Samuel Zagwa'
  },
  {
    id: 'estimates@asantexdecor.com',
    email: 'estimates@asantexdecor.com',
    name: 'David Osei',
    profession: 'Senior Finisher & Quality Estimator',
    role: 'Inquiry Coordinator',
    department: 'Cost Estimations & Quality Control',
    phone: '+234 802 111 2233',
    status: 'Active',
    addedAt: '2024-04-12T09:15:00.000Z',
    addedBy: 'Samuel Zagwa'
  }
];

const SUGGESTED_PROFESSIONS = [
  'Founder & Lead Finisher',
  'Operations & Site Supervisor',
  'Client Relations & Color Consultant',
  'Senior Finisher & Quality Estimator',
  'Interior Decorator & Architect',
  'Epoxy Flooring Specialist',
  'POP Screeding Master Artisan',
  'Wallpaper Installation Expert'
];

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  'Super Administrator': 'Full unrestricted access to all website content, CMS settings, SEO, inquiries, and admin user management.',
  'Administrator': 'Can edit all website content, hero sections, services, gallery projects, announcements, and respond to customer inquiries.',
  'Content Editor': 'Focused on creating and editing showcase items: services, portfolio gallery, team profiles, and testimonials.',
  'Inquiry Coordinator': 'Can view, process, and update the status of customer inquiries and quote requests.'
};

export function AdminUsers() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal & Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    role: 'Administrator' as AdminRole,
    phone: '',
    department: ''
  });

  const loginUrl = `${window.location.origin}/admin/login`;

  const fetchAdmins = async () => {
    try {
      const snap = await getDocs(collection(db, 'admins'));
      const list: AdminAccount[] = [];
      const seenEmails = new Set<string>();

      snap.docs.forEach((d) => {
        const data = d.data();
        const email = (data.email || d.id).toLowerCase().trim();
        
        // Skip duplicate documents that merely mirror an email or uid
        if (seenEmails.has(email)) return;
        seenEmails.add(email);

        list.push({
          id: d.id,
          email,
          name: data.name || (email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
          profession: data.profession || (data.department ? `${data.department} Specialist` : 'Interior Decorator & Finisher'),
          role: (data.role as AdminRole) || 'Administrator',
          phone: data.phone || '',
          department: data.department || '',
          status: data.lastLoginAt ? 'Active' : (data.status || 'Active'),
          addedAt: data.addedAt || new Date().toISOString(),
          addedBy: data.addedBy || 'System Administrator',
          lastLoginAt: data.lastLoginAt
        });
      });

      // If Firestore collection has fewer than 4 members, populate with the 4 default professional members
      if (list.length < 4) {
        for (const defAdmin of FOUR_DEFAULT_ADMINS) {
          if (!seenEmails.has(defAdmin.email.toLowerCase())) {
            list.push(defAdmin);
            seenEmails.add(defAdmin.email.toLowerCase());
            // Persist to Firestore so each member is a real database record
            try {
              await setDoc(doc(db, 'admins', defAdmin.id), defAdmin, { merge: true });
            } catch (err) {
              console.warn('Could not seed admin member to Firestore:', defAdmin.email, err);
            }
          }
        }
      }

      // Sort with Super Administrator / Founder first
      list.sort((a, b) => {
        if (a.role === 'Super Administrator') return -1;
        if (b.role === 'Super Administrator') return 1;
        return a.name.localeCompare(b.name);
      });

      setAdmins(list);
    } catch (err) {
      console.error('Error fetching admin members', err);
      // Fallback to the 4 default members if network/permission issue occurs
      setAdmins(FOUR_DEFAULT_ADMINS);
      try {
        handleFirestoreError(err, OperationType.LIST, 'admins');
      } catch (_) {}
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      profession: 'Senior Finisher & Decorator',
      role: 'Administrator',
      phone: '',
      department: 'Decorative Works'
    });
    setMessage(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (admin: AdminAccount) => {
    setEditingId(admin.id);
    setFormData({
      name: admin.name || '',
      email: admin.email,
      profession: admin.profession || '',
      role: admin.role,
      phone: admin.phone || '',
      department: admin.department || ''
    });
    setMessage(null);
    setIsFormOpen(true);
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim().toLowerCase();
    
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setMessage({ type: 'error', text: 'Please enter a valid Google email address.' });
      return;
    }

    if (!formData.profession.trim()) {
      setMessage({ type: 'error', text: 'Please specify the profession or designation for this admin.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const docId = editingId || cleanEmail;
      const existing = admins.find(a => a.id === docId || a.email.toLowerCase() === cleanEmail);

      const adminPayload: AdminAccount = {
        id: docId,
        email: cleanEmail,
        name: formData.name.trim() || cleanEmail.split('@')[0],
        profession: formData.profession.trim(),
        role: formData.role,
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        status: existing?.status || 'Active',
        addedAt: existing?.addedAt || new Date().toISOString(),
        addedBy: user?.email || 'Administrator',
        lastLoginAt: existing?.lastLoginAt
      };

      await setDoc(doc(db, 'admins', docId), adminPayload, { merge: true });

      setMessage({ 
        type: 'success', 
        text: editingId 
          ? `Successfully updated ${adminPayload.name} (${adminPayload.profession}).` 
          : `Successfully added ${adminPayload.name} as ${adminPayload.profession}!` 
      });

      setIsFormOpen(false);
      await fetchAdmins();
    } catch (err: any) {
      console.error('Error saving admin', err);
      setMessage({ 
        type: 'error', 
        text: 'Failed to save admin member: ' + (err.message || 'Permission denied') 
      });
      try {
        handleFirestoreError(err, OperationType.WRITE, 'admins');
      } catch (_) {}
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminAccount) => {
    const isMaster = admin.email.toLowerCase() === 'samuelzagwa40@gmail.com';
    const confirmMessage = isMaster 
      ? `Warning: This is the owner account (${admin.name || admin.email}). Are you sure you want to delete this admin member?`
      : `Are you sure you want to delete ${admin.name} (${admin.profession}) from admin members? They will immediately lose access to the CMS.`;

    if (window.confirm(confirmMessage)) {
      try {
        await deleteDoc(doc(db, 'admins', admin.id));
        setMessage({ type: 'success', text: `Successfully deleted ${admin.name} (${admin.profession}).` });
        
        // Update local state immediately
        setAdmins(prev => prev.filter(a => a.id !== admin.id && a.email.toLowerCase() !== admin.email.toLowerCase()));
      } catch (err: any) {
        console.error('Error deleting admin', err);
        setMessage({ type: 'error', text: 'Failed to delete member: ' + (err.message || 'Error') });
        try {
          handleFirestoreError(err, OperationType.DELETE, `admins/${admin.id}`);
        } catch (_) {}
      }
    }
  };

  const handleResetToDefaultFour = async () => {
    if (window.confirm('Reset admin members to the 4 standard professional roles (Samuel Zagwa, Emmanuel Adebayo, Grace Okafor, David Osei)?')) {
      setRefreshing(true);
      try {
        for (const member of FOUR_DEFAULT_ADMINS) {
          await setDoc(doc(db, 'admins', member.id), member, { merge: true });
        }
        setMessage({ type: 'success', text: 'Restored the 4 professional admin members successfully.' });
        await fetchAdmins();
      } catch (err: any) {
        console.error('Error restoring defaults', err);
        setMessage({ type: 'error', text: 'Failed to restore: ' + (err.message || 'Unknown error') });
      } finally {
        setRefreshing(false);
      }
    }
  };

  const copyLoginLink = () => {
    navigator.clipboard.writeText(loginUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyInviteDetails = (admin: AdminAccount) => {
    const text = `Hello ${admin.name},\n\nYou have been authorized as ${admin.profession} (${admin.role}) for the Asantex Decor Management Portal.\n\nPlease sign in with your Google account (${admin.email}) here:\n${loginUrl}\n\nBest regards,\nAsantex Decor Leadership`;
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: `Copied invitation details for ${admin.name} to clipboard.` });
  };

  const getWhatsAppShareUrl = (admin: AdminAccount) => {
    const text = encodeURIComponent(`Hello ${admin.name}, you have been authorized as ${admin.profession} (${admin.role}) on the Asantex Decor CMS portal. Log in with your Google account (${admin.email}) at: ${loginUrl}`);
    const phone = admin.phone?.replace(/[^0-9]/g, '');
    if (phone) {
      return `https://wa.me/${phone}?text=${text}`;
    }
    return `https://wa.me/?text=${text}`;
  };

  // Filtered admin accounts
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const matchesSearch = 
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (admin.department && admin.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        admin.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || admin.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [admins, searchQuery, roleFilter]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-18 z-20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-gray-900">Admin Members & Professions</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-burgundy-50 text-burgundy-800 border border-burgundy-200">
              {admins.length} {admins.length === 4 ? '(4 Standard Members)' : 'Members'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage administrative members, professional designations, security roles, and access credentials.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleResetToDefaultFour}
            disabled={refreshing}
            className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-burgundy-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to 4 Standard Professional Members"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 4 Members</span>
          </button>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchAdmins();
            }}
            disabled={refreshing}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 cursor-pointer"
            title="Refresh Members"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-burgundy-700' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Professions Overview Banner */}
      <div className="bg-gradient-to-r from-royal-950 via-royal-900 to-burgundy-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-royal-200 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            4 Core Professional Disciplines
          </div>
          <h2 className="text-lg font-bold font-display">Craftsmanship Leadership Structure</h2>
          <p className="text-xs text-royal-200 leading-relaxed">
            Asantex Decor administrative operations are anchored around 4 core professional functions:
            <strong className="text-white"> Lead Finisher</strong>, 
            <strong className="text-white"> Site Operations Supervisor</strong>, 
            <strong className="text-white"> Color & Finishing Consultant</strong>, and 
            <strong className="text-white"> Quality Estimator</strong>. You can customize, delete, or add new members at any time.
          </p>
        </div>

        <div className="bg-white/10 border border-white/15 rounded-xl p-4 w-full md:w-auto shrink-0 flex flex-col gap-2">
          <span className="text-[11px] font-medium text-royal-200">Admin Portal Sign-In URL:</span>
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-xs font-mono text-royal-100 truncate max-w-[220px]">
              {loginUrl}
            </span>
            <button
              onClick={copyLoginLink}
              className="p-1 text-royal-200 hover:text-white rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              title="Copy URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {copiedLink && (
            <span className="text-[10px] text-green-300 font-medium">Link copied to clipboard!</span>
          )}
        </div>
      </div>

      {/* Search & Role Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, profession, email, or department..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Filter:</span>
          {['all', 'Super Administrator', 'Administrator', 'Content Editor', 'Inquiry Coordinator'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === role
                  ? 'bg-burgundy-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Members List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Authorized Admin Members</h3>
            <p className="text-xs text-gray-500 mt-0.5">Active team members with dedicated professions and CMS permissions.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-burgundy-700" />
            <p className="text-xs font-medium">Loading administrator members...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <ShieldCheck className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">No admin members found</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              You can add a new admin member with their profession, or reset to the 4 standard members.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-burgundy-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Add New Member
              </button>
              <button
                onClick={handleResetToDefaultFour}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 cursor-pointer"
              >
                Restore 4 Defaults
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAdmins.map((admin) => {
              const isCurrentUser = user?.email?.toLowerCase() === admin.email.toLowerCase();

              return (
                <div
                  key={admin.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar Initials */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burgundy-700 to-royal-800 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                      {admin.name ? admin.name.charAt(0).toUpperCase() : admin.email.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-1.5">
                      {/* Name, Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-gray-900">
                          {admin.name}
                        </span>

                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                            You (Current)
                          </span>
                        )}

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          admin.role === 'Super Administrator'
                            ? 'bg-purple-100 text-purple-800'
                            : admin.role === 'Administrator'
                            ? 'bg-blue-100 text-blue-800'
                            : admin.role === 'Content Editor'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {admin.role}
                        </span>
                      </div>

                      {/* Profession Designation */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-burgundy-700 bg-burgundy-50/70 border border-burgundy-100/80 px-2.5 py-1 rounded-lg w-fit">
                        <Briefcase className="w-3.5 h-3.5 shrink-0 text-burgundy-600" />
                        <span>Profession: {admin.profession}</span>
                      </div>

                      {/* Contact & Department */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {admin.email}
                        </span>

                        {admin.department && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-gray-400" />
                            {admin.department}
                          </span>
                        )}

                        {admin.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {admin.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit, WhatsApp, Copy, Delete */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* WhatsApp Share */}
                    <a
                      href={getWhatsAppShareUrl(admin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Send WhatsApp Invite"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>

                    {/* Copy Invitation */}
                    <button
                      onClick={() => copyInviteDetails(admin)}
                      className="p-2 text-gray-400 hover:text-royal-600 hover:bg-royal-50 rounded-lg transition-colors cursor-pointer"
                      title="Copy Sign-in Invitation"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit Member */}
                    <button
                      onClick={() => handleOpenEdit(admin)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Edit Admin Member"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Member */}
                    <button
                      onClick={() => handleDeleteAdmin(admin)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Delete Admin Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Permission & Roles Guide */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-burgundy-700" />
          Access Permissions Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(ROLE_DESCRIPTIONS) as AdminRole[]).map((role) => (
            <div key={role} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 space-y-1">
              <span className="font-bold text-xs text-gray-900">{role}</span>
              <p className="text-xs text-gray-500 leading-relaxed">
                {ROLE_DESCRIPTIONS[role]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Admin Member Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900">
                  {editingId ? 'Edit Admin Member' : 'Add New Admin Member'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Set their decorating profession, job title, and portal permissions.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Samuel Zagwa, David Osei, etc."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              {/* Profession / Job Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Profession / Designation <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-gray-400 font-normal">Click a suggestion below to apply</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g. Founder & Lead Finisher, Operations & Site Supervisor..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                />

                {/* Quick suggestion pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SUGGESTED_PROFESSIONS.map((prof) => (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => setFormData({ ...formData, profession: prof })}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        formData.profession === prof
                          ? 'bg-burgundy-100 text-burgundy-900 border-burgundy-300 font-bold'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {prof}
                    </button>
                  ))}
                </div>
              </div>

              {/* Google Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Google Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={editingId !== null}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. member@gmail.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Used by the admin to authenticate with their Google account on the login page.
                </p>
              </div>

              {/* Administrative Access Role */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Administrative Access Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500 bg-white"
                >
                  <option value="Administrator">Administrator (Edit all content, projects & inquiries)</option>
                  <option value="Super Administrator">Super Administrator (Full settings, SEO & user access)</option>
                  <option value="Content Editor">Content Editor (Services, Gallery & Announcements)</option>
                  <option value="Inquiry Coordinator">Inquiry Coordinator (Customer requests & quotes)</option>
                </select>
                <p className="text-[11px] text-burgundy-700 mt-1 font-medium">
                  {ROLE_DESCRIPTIONS[formData.role]}
                </p>
              </div>

              {/* Department & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Operations, Finishing, Design"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +234 803 000 0000"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-burgundy-700 hover:bg-burgundy-800 disabled:bg-burgundy-400 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{editingId ? 'Save Changes' : 'Add Admin Member'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
