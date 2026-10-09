import { Service, Project } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'wall-screeding',
    title: 'Interior & Exterior Wall Screeding',
    description: 'Professional wall preparation and smooth finishing for a flawless canvas.',
    features: ['Achieving straight and precise/plumb edges', 'Smooth finishing', 'Professional wall preparation'],
    icon: 'Trowel',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'wallpaper',
    title: 'Wallpaper Installation',
    description: 'Transform spaces instantly with our professional wallpaper installation services.',
    features: ['Professional installation', 'Modern designs', 'Homes, offices, & commercial spaces'],
    icon: 'Image',
    imageUrl: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pop-designs',
    title: 'POP Designs',
    description: 'Modern and decorative ceiling finishing that adds elegance to any room.',
    features: ['Modern POP ceiling designs', 'Decorative ceiling finishing', 'Custom designs for all buildings'],
    icon: 'Box',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'graphitex',
    title: 'Graphitex Design',
    description: 'Modern Graphitex wall finishing for striking exterior and interior aesthetics.',
    features: ['Modern Graphitex finishing', 'Decorative exterior designs', 'Interior statement walls'],
    icon: 'Brush',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'stucco',
    title: 'Premium Stucco',
    description: 'Textured and modern wall finishes using premium decorative stucco.',
    features: ['Premium decorative finishing', 'Textured wall finishes', 'Durable and modern'],
    icon: 'Layers',
    imageUrl: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'taroline',
    title: 'Taroline Finishing',
    description: 'Professional Taroline decorative finishing for durable and attractive wall surfaces.',
    features: ['Professional Taroline finishing', 'Durable surfaces', 'Attractive decorative finish'],
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'general-painting',
    title: 'General Painting',
    description: 'Expert residential and commercial painting with professional color selection.',
    features: ['Interior & exterior painting', 'Residential & commercial', 'Professional color selection'],
    icon: 'PaintRoller',
    imageUrl: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&q=80&w=800'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Modern Living Room POP',
    category: 'POP Designs',
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    title: 'Luxury Bedroom Wallpaper',
    category: 'Wallpaper',
    imageUrl: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p3',
    title: 'Exterior Stucco Finish',
    category: 'Exterior Finishing',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p4',
    title: 'Commercial Office Painting',
    category: 'Painting',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p5',
    title: 'Flawless Wall Screeding',
    category: 'Wall Screeding',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p6',
    title: 'Elegant Interior Decoration',
    category: 'Interior Decoration',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
  }
];
