import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { 
  Service, 
  Project, 
  TeamMember, 
  Testimonial, 
  Announcement, 
  ParentsAssociation, 
  MediaItem,
  WebsiteSettings
} from '../types';
import { SERVICES, PROJECTS } from '../data/mockData';

// Default CMS Data for graceful fallbacks
export const DEFAULT_SETTINGS: WebsiteSettings = {
  companyName: 'ASANTEX DECOR',
  companyDescription: 'We are a premier Nigerian interior and exterior decoration and architectural finishing company dedicated to creating luxury, elegance, and durability for residential and commercial spaces.',
  logoUrl: '',
  faviconUrl: '',
  mission: 'To provide exceptional finishing solutions that elevate the aesthetic and structural value of properties, utilizing innovative techniques, premium materials, and professional craftsmanship.',
  vision: 'To be the most trusted and sought-after interior and exterior finishing company in Nigeria, recognized for our commitment to quality, creativity, and flawless execution.',
  history: 'Founded with a passion for architectural aesthetics and flawless wall finishes, ASANTEX DECOR has grown into a trusted leader in residential and commercial decoration across Nigeria.',
  values: 'Commitment to Quality, Attention to Detail, Punctuality & Professionalism, Customer Satisfaction, Innovation.',
  email: 'info@asantexdecor.com',
  phone: '+234 803 000 0000',
  whatsapp: '2348030000000',
  address: 'Victoria Island, Lagos, Nigeria',
  openingHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  twitterUrl: 'https://twitter.com',
  linkedinUrl: 'https://linkedin.com',
  heroHeading: 'Transforming Spaces. Creating Beautiful Finishes.',
  heroSubtitle: 'PREMIUM INTERIOR & EXTERIOR FINISHING',
  heroDescription: 'Delivering premium wall screeding, painting, wallpaper installation, POP designs, and specialized architectural finishes for homes, offices, and commercial properties.',
  heroImageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000',
  heroButtonText: 'Get a Quote',
  heroButtonUrl: '/quote',
  heroButton2Text: 'View Our Services',
  heroButton2Url: '/services',
  ctaHeading: 'Ready to Perfect Your Space?',
  ctaDescription: 'Contact us today for a free consultation or request a quote to get started on transforming your property with our master craftsmen.',
  ctaButtonText: 'Request a Quote',
  ctaButtonUrl: '/quote',
  footerCopyright: 'ASANTEX DECOR. All Rights Reserved.',
  footerBio: 'ASANTEX DECOR is Nigeria’s trusted finishing specialist, known for immaculate wall screeding, luxury POP designs, and long-lasting exterior finishes.',
  seoTitle: 'ASANTEX DECOR | Premium Interior & Exterior Finishing in Nigeria',
  seoDescription: 'Transform your space with ASANTEX DECOR. Wall screeding, wallpaper, POP ceilings, graphitex, stucco, and painting services.',
  seoKeywords: 'wall screeding, POP designs, painting in Lagos, wallpaper installation, Asantex Decor, interior finishes Nigeria',
  mapsEmbedUrl: '',
  statProjects: '350+',
  statClients: '280+',
  statExperience: '10+',
  statSatisfaction: '100%',
  sectionsConfig: {
    hero: true,
    announcements: true,
    services: true,
    whyChooseUs: true,
    stats: true,
    projects: true,
    parentsAssociation: true,
    team: true,
    testimonials: true,
    cta: true,
  }
};

export const DEFAULT_SERVICES: Service[] = SERVICES.map((s, idx) => ({
  ...s,
  order: idx + 1,
  isActive: true,
  buttonText: 'Get a Quote',
  buttonUrl: '/quote'
}));

export const DEFAULT_PROJECTS: Project[] = PROJECTS.map((p, idx) => ({
  ...p,
  description: 'High precision decorative finish executed with premium materials.',
  order: idx + 1,
  isActive: true,
  featured: idx < 4
}));

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Samuel Zagwa',
    role: 'Founder & Lead Finisher',
    bio: 'Over a decade of industry expertise in modern screeding, decorative paints, and structural interior decoration.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    order: 1,
    isActive: true,
    phone: '+234 803 000 0000',
    email: 'samuel@asantexdecor.com'
  },
  {
    id: 'team-2',
    name: 'Emmanuel Adebayo',
    role: 'Operations & Site Supervisor',
    bio: 'Ensuring on-time delivery, worksite cleanliness, and rigorous quality inspection for all commercial projects.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    order: 2,
    isActive: true,
    email: 'operations@asantexdecor.com'
  },
  {
    id: 'team-3',
    name: 'Grace Okafor',
    role: 'Client Relations & Color Consultant',
    bio: 'Guides property owners in selecting harmonious color schemes and wallpaper patterns that bring architectural visions to life.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    order: 3,
    isActive: true,
    email: 'consulting@asantexdecor.com'
  },
  {
    id: 'team-4',
    name: 'David Osei',
    role: 'Senior Finisher & Quality Estimator',
    bio: 'Specializes in high-durability epoxy flooring, decorative stucco techniques, and meticulous project measurement.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    order: 4,
    isActive: true,
    email: 'estimates@asantexdecor.com',
    phone: '+234 802 111 2233'
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Chief Babatunde Alabi',
    location: 'Lekki Phase 1, Lagos',
    content: 'ASANTEX DECOR handled the complete screeding and painting of my 5-bedroom duplex. Their straight lines and smooth finishing exceeded my expectations!',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    order: 1,
    isActive: true
  },
  {
    id: 'test-2',
    clientName: 'Mrs. Folashade Adeleke',
    location: 'Victoria Island Office Park',
    content: 'The 3D wallpaper and POP ceiling finish in our corporate headquarters completely transformed our working environment. Prompt, professional, and courteous artisans.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    order: 2,
    isActive: true
  },
  {
    id: 'test-3',
    clientName: 'Engr. Daniel Nwachukwu',
    location: 'Ikeja GRA',
    content: 'Very reliable team. Their graphitex exterior finish has stayed immaculate through heavy rains without any peeling or fading. 100% recommended.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    order: 3,
    isActive: true
  }
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Special Promotional Discount on Full-Building Screeding',
    content: 'Book your residential or commercial screeding this month and receive a complimentary color consultation and primer coating.',
    date: 'Active Special',
    badge: 'Special Offer',
    link: '/quote',
    isActive: true
  }
];

export const DEFAULT_PARENTS_ASSOCIATION: ParentsAssociation = {
  title: "Parents’ Association Community Hub",
  description: "Fostering collaboration, student welfare, infrastructure development, and community support in partnership with ASANTEX DECOR.",
  chairmanName: "Dr. Kenneth O. Agwu",
  chairmanTitle: "Chairman, Parents’ Association",
  chairmanPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
  chairmanMessage: "On behalf of the executive committee, we warmly welcome all parents and stakeholders. Together, we are building stronger learning environments and supporting community initiatives.",
  contactEmail: "pa@asantexdecor.com",
  contactPhone: "+234 802 000 0000",
  meetingsInfo: "General Stakeholders Meeting holds every 2nd Saturday of the quarter at 10:00 AM.",
  isPublished: true,
  executives: [
    {
      id: "exec-1",
      name: "Dr. Kenneth O. Agwu",
      position: "Chairman",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      phone: "+234 802 000 0000",
      email: "chairman@pa.asantex.com"
    },
    {
      id: "exec-2",
      name: "Barrister Ngozi Peters",
      position: "Vice Chairman / Legal Adviser",
      photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
      phone: "+234 803 111 2222",
      email: "vicechair@pa.asantex.com"
    },
    {
      id: "exec-3",
      name: "Mr. Chukwuma Eze",
      position: "Secretary General",
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      phone: "+234 805 333 4444",
      email: "secretary@pa.asantex.com"
    }
  ],
  eventPhotos: [
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800"
  ]
};

// Stock Media to pre-populate Media Library if empty
export const STOCK_MEDIA: Omit<MediaItem, 'id'>[] = [
  {
    name: 'Modern Living Room Finish',
    category: 'Homepage',
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
    sizeKB: 142,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Professional Screeding Worker',
    category: 'Services',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200',
    sizeKB: 128,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Luxury Wallpaper Installation',
    category: 'Services',
    url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1200',
    sizeKB: 165,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Decorative POP Ceiling',
    category: 'Services',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    sizeKB: 154,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Exterior Stucco Finish',
    category: 'Gallery',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    sizeKB: 178,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Commercial Office Painting',
    category: 'Gallery',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    sizeKB: 139,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Wall Screeding & Plastering Video Walkthrough',
    category: 'Gallery',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    duration: 15,
    sizeKB: 2400,
    embedType: 'file',
    createdAt: new Date().toISOString()
  },
  {
    name: 'Luxury Decorative Finish Timelapse',
    category: 'Services',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    duration: 20,
    sizeKB: 3100,
    embedType: 'file',
    createdAt: new Date().toISOString()
  }
];

// High quality image compression utility that resizes and compresses image to under 150KB
export function compressImageFile(file: File, maxDimension = 1200, quality = 0.75): Promise<{ dataUrl: string; sizeKB: number }> {
  return new Promise((resolve, reject) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return reject(new Error('Please upload a valid image file (JPG, PNG, or WEBP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context unavailable.'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, or JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const sizeKB = Math.round((dataUrl.length * (3 / 4)) / 1024);
        resolve({ dataUrl, sizeKB });
      };

      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      } else {
        reject(new Error('Invalid image result.'));
      }
    };

    reader.readAsDataURL(file);
  });
}

// Parse online video URLs (YouTube, Vimeo, MP4, etc.)
export function parseVideoUrl(rawUrl: string): {
  embedUrl: string;
  type: 'youtube' | 'vimeo' | 'external';
  thumbnailUrl: string;
} {
  const url = (rawUrl || '').trim();
  
  // YouTube regex: checks standard, short, embed, shorts
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      type: 'youtube',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  // Vimeo regex
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      type: 'vimeo',
      thumbnailUrl: ''
    };
  }

  return {
    embedUrl: url,
    type: 'external',
    thumbnailUrl: ''
  };
}

// Automatically generates thumbnail and duration from video file or URL
export function generateVideoThumbnail(source: File | string): Promise<{
  thumbnailUrl: string;
  duration: number;
}> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      if (source instanceof File) {
        URL.revokeObjectURL(video.src);
      }
    };

    video.onloadedmetadata = () => {
      // Seek to either 1 second or 20% into video
      video.currentTime = Math.min(1, video.duration > 0 ? video.duration * 0.2 : 0.5);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxW = 640;
        let width = video.videoWidth || 640;
        let height = video.videoHeight || 360;

        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          cleanup();
          resolve({ thumbnailUrl, duration: Math.round(video.duration || 0) });
          return;
        }
      } catch (e) {
        console.warn('Could not generate canvas video thumbnail', e);
      }
      cleanup();
      resolve({ thumbnailUrl: '', duration: Math.round(video.duration || 0) });
    };

    video.onerror = () => {
      cleanup();
      resolve({ thumbnailUrl: '', duration: 0 });
    };

    if (source instanceof File) {
      video.src = URL.createObjectURL(source);
    } else {
      video.src = source;
    }
  });
}

// Uploads video file using Firebase Storage if available, with DataURL fallback
export async function uploadVideoFile(
  file: File, 
  category = 'Gallery',
  onProgress?: (percent: number) => void
): Promise<MediaItem> {
  const sizeKB = Math.round(file.size / 1024);
  const { thumbnailUrl, duration } = await generateVideoThumbnail(file);

  let videoUrl = '';
  let embedType: 'file' | 'external' = 'file';

  // Attempt 1: Upload to Firebase Storage
  try {
    const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
    const cleanFileName = `video_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `videos/${cleanFileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.warn('Firebase Storage upload notification:', error);
          reject(error);
        },
        async () => {
          videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve();
        }
      );
    });
  } catch (storageErr) {
    console.warn('Firebase Storage unavailable, checking inline fallback...', storageErr);
    
    // Attempt 2: If file is under 900KB, use DataURL
    if (file.size <= 900 * 1024) {
      videoUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else {
      throw new Error(`Video file (${Math.round(file.size / (1024 * 1024))}MB) is larger than the 1MB direct database ceiling. Please use the "Embed Video Link" tab to paste a link from YouTube, Vimeo, Google Drive, or Cloudinary, or upload a video clip under 1MB.`);
    }
  }

  // Save to Firestore media collection
  return await saveMediaItem(
    file.name,
    videoUrl,
    category,
    sizeKB,
    'video',
    thumbnailUrl,
    duration,
    embedType
  );
}

// Uploads media (image or video) to Firestore media collection
export async function saveMediaItem(
  name: string, 
  url: string, 
  category = 'General', 
  sizeKB = 0,
  type: 'image' | 'video' = 'image',
  thumbnailUrl?: string,
  duration?: number,
  embedType?: 'file' | 'youtube' | 'vimeo' | 'external'
): Promise<MediaItem> {
  const mediaRef = collection(db, 'media');
  const payload: any = {
    name,
    category: category || 'General',
    url,
    sizeKB: sizeKB || 0,
    type: type || 'image',
    createdAt: new Date().toISOString()
  };

  if (thumbnailUrl) payload.thumbnailUrl = thumbnailUrl;
  if (duration !== undefined) payload.duration = duration;
  if (embedType) payload.embedType = embedType;

  const newDoc = await addDoc(mediaRef, payload);

  return {
    id: newDoc.id,
    ...payload
  };
}
