export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  imageUrl: string;
  buttonText?: string;
  buttonUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  order?: number;
  isActive?: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  badge?: string;
  link?: string;
  isActive: boolean;
}

export interface ExecutiveMember {
  id: string;
  name: string;
  position: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
}

export interface ParentsAssociation {
  title: string;
  description: string;
  chairmanName: string;
  chairmanTitle: string;
  chairmanPhoto: string;
  chairmanMessage: string;
  contactEmail: string;
  contactPhone: string;
  meetingsInfo: string;
  executives?: ExecutiveMember[];
  eventPhotos?: string[];
  isPublished: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  category: string;
  url: string;
  sizeKB: number;
  createdAt: string;
  type?: 'image' | 'video';
  thumbnailUrl?: string;
  duration?: number;
  embedType?: 'file' | 'youtube' | 'vimeo' | 'external';
}

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceRequired: string;
  projectDescription: string;
  preferredDate: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
  createdAt: string;
  type?: 'quote';
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'completed';
  createdAt: string;
  type?: 'contact';
}

export interface WebsiteSettings {
  companyName?: string;
  companyDescription?: string;
  logoUrl?: string;
  faviconUrl?: string;
  mission?: string;
  vision?: string;
  history?: string;
  values?: string;
  founderName?: string;
  founderMessage?: string;
  founderPhoto?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  openingHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  heroHeading?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  heroVideoUrl?: string;
  heroButtonText?: string;
  heroButtonUrl?: string;
  heroButton2Text?: string;
  heroButton2Url?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  footerCopyright?: string;
  footerBio?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  mapsEmbedUrl?: string;
  statProjects?: string;
  statClients?: string;
  statExperience?: string;
  statSatisfaction?: string;
  // Section ordering & toggles
  sectionsConfig?: {
    hero: boolean;
    announcements: boolean;
    services: boolean;
    whyChooseUs: boolean;
    stats: boolean;
    projects: boolean;
    parentsAssociation: boolean;
    team: boolean;
    testimonials: boolean;
    cta: boolean;
  };
}
