import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  WebsiteSettings, 
  Service, 
  Project, 
  TeamMember, 
  Testimonial, 
  Announcement, 
  ParentsAssociation, 
  MediaItem,
  QuoteRequest,
  ContactMessage
} from '../types';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_SERVICES, 
  DEFAULT_PROJECTS, 
  DEFAULT_TEAM, 
  DEFAULT_TESTIMONIALS, 
  DEFAULT_ANNOUNCEMENTS, 
  DEFAULT_PARENTS_ASSOCIATION,
  STOCK_MEDIA
} from './cmsData';

interface SettingsContextType {
  settings: WebsiteSettings;
  loading: boolean;
  updateSettings: (updates: Partial<WebsiteSettings>) => Promise<void>;
  
  // Collections
  services: Service[];
  projects: Project[];
  team: TeamMember[];
  testimonials: Testimonial[];
  announcements: Announcement[];
  parentsAssociation: ParentsAssociation;
  mediaItems: MediaItem[];
  inquiries: (QuoteRequest | ContactMessage)[];

  // Mutation Handlers
  saveService: (service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  saveProject: (project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  saveTeamMember: (member: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  saveTestimonial: (item: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  saveAnnouncement: (item: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  updateParentsAssociation: (data: Partial<ParentsAssociation>) => Promise<void>;

  deleteMedia: (id: string) => Promise<void>;
  addMediaItem: (item: Omit<MediaItem, 'id'>) => Promise<string>;

  updateInquiryStatus: (id: string, status: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  createInquiry: (inquiry: Record<string, any>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  updateSettings: async () => {},
  services: DEFAULT_SERVICES,
  projects: DEFAULT_PROJECTS,
  team: DEFAULT_TEAM,
  testimonials: DEFAULT_TESTIMONIALS,
  announcements: DEFAULT_ANNOUNCEMENTS,
  parentsAssociation: DEFAULT_PARENTS_ASSOCIATION,
  mediaItems: [],
  inquiries: [],
  saveService: async () => {},
  deleteService: async () => {},
  saveProject: async () => {},
  deleteProject: async () => {},
  saveTeamMember: async () => {},
  deleteTeamMember: async () => {},
  saveTestimonial: async () => {},
  deleteTestimonial: async () => {},
  saveAnnouncement: async () => {},
  deleteAnnouncement: async () => {},
  updateParentsAssociation: async () => {},
  deleteMedia: async () => {},
  addMediaItem: async () => '',
  updateInquiryStatus: async () => {},
  deleteInquiry: async () => {},
  createInquiry: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [parentsAssociation, setParentsAssociation] = useState<ParentsAssociation>(DEFAULT_PARENTS_ASSOCIATION);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [inquiries, setInquiries] = useState<(QuoteRequest | ContactMessage)[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Listen to Global Settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as WebsiteSettings;
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
          sectionsConfig: {
            ...DEFAULT_SETTINGS.sectionsConfig,
            ...(data.sectionsConfig || {})
          }
        });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      setLoading(false);
    }, (error) => {
      console.warn('Settings snapshot error (using defaults):', error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2. Listen to Services
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        const list: Service[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setServices(list);
      } else {
        setServices(DEFAULT_SERVICES);
      }
    }, (err) => console.warn('Services listener:', err));

    return () => unsub();
  }, []);

  // 3. Listen to Projects
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        const list: Project[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(list);
      } else {
        setProjects(DEFAULT_PROJECTS);
      }
    }, (err) => console.warn('Projects listener:', err));

    return () => unsub();
  }, []);

  // 4. Listen to Team
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'team'), (snap) => {
      if (!snap.empty) {
        const list: TeamMember[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setTeam(list);
      } else {
        setTeam(DEFAULT_TEAM);
      }
    }, (err) => console.warn('Team listener:', err));

    return () => unsub();
  }, []);

  // 5. Listen to Testimonials
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'testimonials'), (snap) => {
      if (!snap.empty) {
        const list: Testimonial[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setTestimonials(list);
      } else {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    }, (err) => console.warn('Testimonials listener:', err));

    return () => unsub();
  }, []);

  // 6. Listen to Announcements
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'announcements'), (snap) => {
      if (!snap.empty) {
        const list: Announcement[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
        setAnnouncements(list);
      } else {
        setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      }
    }, (err) => console.warn('Announcements listener:', err));

    return () => unsub();
  }, []);

  // 7. Listen to Parents' Association
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'parents_association', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setParentsAssociation({
          ...DEFAULT_PARENTS_ASSOCIATION,
          ...(docSnap.data() as ParentsAssociation)
        });
      } else {
        setParentsAssociation(DEFAULT_PARENTS_ASSOCIATION);
      }
    }, (err) => console.warn('PA listener:', err));

    return () => unsub();
  }, []);

  // 8. Listen to Media Library
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'media'), (snap) => {
      if (!snap.empty) {
        const list: MediaItem[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem));
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setMediaItems(list);
      } else {
        // Map stock media
        const mappedStock: MediaItem[] = STOCK_MEDIA.map((m, idx) => ({
          id: `stock-${idx}`,
          ...m
        }));
        setMediaItems(mappedStock);
      }
    }, (err) => console.warn('Media listener:', err));

    return () => unsub();
  }, []);

  // 9. Listen to Inquiries (Quote requests & Contact submissions)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'inquiries'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as (QuoteRequest | ContactMessage)));
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setInquiries(list);
      } else {
        setInquiries([]);
      }
    }, (err) => console.warn('Inquiries listener:', err));

    return () => unsub();
  }, []);

  // Mutation Handlers
  const updateSettings = async (updates: Partial<WebsiteSettings>) => {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, updates);
    } else {
      await setDoc(docRef, { ...DEFAULT_SETTINGS, ...updates });
    }
  };

  const saveService = async (service: Partial<Service>) => {
    if (service.id && !service.id.startsWith('temp-')) {
      const docRef = doc(db, 'services', service.id);
      const { id, ...data } = service;
      await setDoc(docRef, data, { merge: true });
    } else {
      const { id, ...data } = service;
      await addDoc(collection(db, 'services'), {
        ...data,
        order: service.order ?? services.length + 1,
        isActive: service.isActive ?? true
      });
    }
  };

  const deleteService = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
  };

  const saveProject = async (project: Partial<Project>) => {
    if (project.id && !project.id.startsWith('temp-')) {
      const docRef = doc(db, 'projects', project.id);
      const { id, ...data } = project;
      await setDoc(docRef, data, { merge: true });
    } else {
      const { id, ...data } = project;
      await addDoc(collection(db, 'projects'), {
        ...data,
        order: project.order ?? projects.length + 1,
        isActive: project.isActive ?? true,
        featured: project.featured ?? false
      });
    }
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  const saveTeamMember = async (member: Partial<TeamMember>) => {
    if (member.id && !member.id.startsWith('temp-')) {
      const docRef = doc(db, 'team', member.id);
      const { id, ...data } = member;
      await setDoc(docRef, data, { merge: true });
    } else {
      const { id, ...data } = member;
      await addDoc(collection(db, 'team'), {
        ...data,
        order: member.order ?? team.length + 1,
        isActive: member.isActive ?? true
      });
    }
  };

  const deleteTeamMember = async (id: string) => {
    await deleteDoc(doc(db, 'team', id));
  };

  const saveTestimonial = async (item: Partial<Testimonial>) => {
    if (item.id && !item.id.startsWith('temp-')) {
      const docRef = doc(db, 'testimonials', item.id);
      const { id, ...data } = item;
      await setDoc(docRef, data, { merge: true });
    } else {
      const { id, ...data } = item;
      await addDoc(collection(db, 'testimonials'), {
        ...data,
        order: item.order ?? testimonials.length + 1,
        isActive: item.isActive ?? true
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    await deleteDoc(doc(db, 'testimonials', id));
  };

  const saveAnnouncement = async (item: Partial<Announcement>) => {
    if (item.id && !item.id.startsWith('temp-')) {
      const docRef = doc(db, 'announcements', item.id);
      const { id, ...data } = item;
      await setDoc(docRef, data, { merge: true });
    } else {
      const { id, ...data } = item;
      await addDoc(collection(db, 'announcements'), {
        ...data,
        isActive: item.isActive ?? true,
        date: item.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }
  };

  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, 'announcements', id));
  };

  const updateParentsAssociation = async (data: Partial<ParentsAssociation>) => {
    const docRef = doc(db, 'parents_association', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, { ...DEFAULT_PARENTS_ASSOCIATION, ...data });
    }
  };

  const deleteMedia = async (id: string) => {
    await deleteDoc(doc(db, 'media', id));
  };

  const addMediaItem = async (item: Omit<MediaItem, 'id'>) => {
    const res = await addDoc(collection(db, 'media'), item);
    return res.id;
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'inquiries', id), { status });
  };

  const deleteInquiry = async (id: string) => {
    await deleteDoc(doc(db, 'inquiries', id));
  };

  const createInquiry = async (inquiry: Record<string, any>) => {
    await addDoc(collection(db, 'inquiries'), {
      ...inquiry,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateSettings,
      services,
      projects,
      team,
      testimonials,
      announcements,
      parentsAssociation,
      mediaItems,
      inquiries,
      saveService,
      deleteService,
      saveProject,
      deleteProject,
      saveTeamMember,
      deleteTeamMember,
      saveTestimonial,
      deleteTestimonial,
      saveAnnouncement,
      deleteAnnouncement,
      updateParentsAssociation,
      deleteMedia,
      addMediaItem,
      updateInquiryStatus,
      deleteInquiry,
      createInquiry
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
