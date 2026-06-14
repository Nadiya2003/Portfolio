export const PERSONA = {
  name: 'Elias Vance',
  title: 'Creative Director & Full-Stack Designer',
  headline: 'Designing Experiences. Building Digital Excellence.',
  subheading:
    'Graphic Designer, Web Developer, UI/UX Designer & Pencil Artist.',
  bio: "I bridge the gap between aesthetics and engineering. With over 8 years of experience spanning digital product design, full-stack development, and traditional fine arts, I create immersive digital experiences that don't just look beautiful—they perform flawlessly.",
  stats: [
    { label: 'Years Experience', value: 8, suffix: '+' },
    { label: 'Completed Projects', value: 140, suffix: '+' },
    { label: 'Happy Clients', value: 85, suffix: '%' },
    { label: 'Technologies', value: 24, suffix: '' },
  ],
  socials: {
    email: 'hello@eliasvance.design',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    behance: 'https://behance.net',
    dribbble: 'https://dribbble.com',
    whatsapp: '+15551234567',
  },
};

export const TIMELINE = [
  {
    year: '2023 - Present',
    role: 'Creative Director',
    company: 'Nexus Digital Agency',
    description:
      'Leading a team of designers and developers to deliver award-winning web experiences for enterprise clients.',
  },
  {
    year: '2020 - 2023',
    role: 'Senior UI/UX Designer & Developer',
    company: 'Aura Tech Solutions',
    description:
      'Spearheaded the design system and front-end architecture for a suite of SaaS products used by 50k+ users.',
  },
  {
    year: '2018 - 2020',
    role: 'Graphic Designer & Illustrator',
    company: 'Freelance',
    description:
      'Collaborated with international brands on identity design, motion graphics, and custom illustrations.',
  },
  {
    year: '2016 - 2018',
    role: 'Fine Arts & Design Studies',
    company: 'Institute of Creative Arts',
    description:
      'Honed foundational skills in traditional pencil art, color theory, and digital media.',
  },
];

export const SERVICES = [
  {
    id: 'graphic-video',
    title: 'Graphic Design & Video',
    icon: 'Palette',
    color: 'blue',
    skills: [
      'Flyer Design',
      'Social Media Posts',
      'Posters',
      'Banners',
      'Business Cards',
      'Logo Design',
      'Brand Identity',
      'Motion Graphics',
      'Video Editing',
      'Promotional Videos',
    ],
  },
  {
    id: 'web-dev',
    title: 'Web Design & Dev',
    icon: 'Code2',
    color: 'purple',
    skills: [
      'Responsive Websites',
      'Business Websites',
      'E-Commerce',
      'Portfolio Websites',
      'Landing Pages',
      'Full-Stack Development',
      'Custom Web Apps',
      'API Integration',
    ],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    icon: 'Layout',
    color: 'cyan',
    skills: [
      'Mobile App Design',
      'Web App Design',
      'Wireframing',
      'Prototyping',
      'User Research',
      'Design Systems',
      'Usability Testing',
      'Interaction Design',
    ],
  },
  {
    id: 'pencil-art',
    title: 'Pencil Art',
    icon: 'PenTool',
    color: 'blue',
    skills: [
      'Portrait Drawings',
      'Realistic Sketches',
      'Custom Artwork',
      'Hand-Drawn Illustrations',
      'Concept Art',
      'Storyboarding',
      'Character Design',
    ],
  },
];

export const SKILLS = {
  design: [
    { name: 'Photoshop', level: 95 },
    { name: 'Illustrator', level: 90 },
    { name: 'Lightroom', level: 85 },
    { name: 'After Effects', level: 80 },
    { name: 'Premiere Pro', level: 85 },
  ],
  uiux: [
    { name: 'Figma', level: 98 },
    { name: 'Adobe XD', level: 90 },
    { name: 'Framer', level: 85 },
  ],
  development: [
    { name: 'HTML/CSS', level: 95 },
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 92 },
    { name: 'Node.js', level: 80 },
    { name: 'Express.js', level: 75 },
    { name: 'MongoDB', level: 70 },
  ],
};

export const PROJECTS = [
  {
    id: 'p1',
    title: 'Aura FinTech Dashboard',
    category: 'UI/UX Design',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    beforeImage:
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop',
    description:
      'A complete redesign of a complex financial dashboard. The goal was to simplify data visualization while maintaining powerful filtering capabilities for power users. The new design increased user engagement by 45%.',
    tags: ['Figma', 'Design System', 'Data Viz'],
  },
  {
    id: 'p2',
    title: 'Lumina E-Commerce',
    category: 'Web Development',
    image:
      'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2064&auto=format&fit=crop',
    beforeImage:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1974&auto=format&fit=crop',
    description:
      'A high-performance headless e-commerce platform built for a luxury lighting brand. Features smooth page transitions, 3D product viewers, and a sub-second initial load time.',
    tags: ['React', 'Next.js', 'Tailwind', 'Shopify API'],
  },
  {
    id: 'p3',
    title: 'Neon Nights Brand Identity',
    category: 'Graphic Design',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
    beforeImage:
      'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1974&auto=format&fit=crop',
    description:
      'Comprehensive brand identity for an electronic music festival. Included logo design, typography selection, social media templates, and physical stage banner designs.',
    tags: ['Illustrator', 'Photoshop', 'Branding'],
  },
  {
    id: 'p4',
    title: 'HyperDrive Promo Video',
    category: 'Video Editing',
    image:
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000&auto=format&fit=crop',
    beforeImage:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop',
    description:
      'A high-energy promotional video for a new sports car launch. Combined live-action footage with custom motion graphics and kinetic typography.',
    tags: ['Premiere Pro', 'After Effects', 'Color Grading'],
  },
  {
    id: 'p5',
    title: 'Elder Statesman Portrait',
    category: 'Pencil Art',
    image:
      'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=2052&auto=format&fit=crop',
    beforeImage:
      'https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=2070&auto=format&fit=crop',
    description:
      'A hyper-realistic charcoal and graphite portrait commissioned by a private collector. Took over 80 hours to complete, focusing on micro-textures in the skin and fabric.',
    tags: ['Graphite', 'Charcoal', 'Realism'],
  },
  {
    id: 'p6',
    title: 'Zenith Architecture Site',
    category: 'Web Development',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    beforeImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop',
    description:
      'An immersive portfolio website for an award-winning architecture firm. Utilized WebGL for subtle background effects and complex scroll-triggered animations.',
    tags: ['React', 'Framer Motion', 'WebGL'],
  },
  {
    id: 'p7',
    title: 'Oasis Wellness App',
    category: 'UI/UX Design',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
    beforeImage:
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070&auto=format&fit=crop',
    description:
      'End-to-end product design for a meditation and wellness application. Focused on creating a calming, intuitive interface with soft micro-interactions.',
    tags: ['Figma', 'Prototyping', 'User Testing'],
  },
  {
    id: 'p8',
    title: 'Urban Decay Editorial',
    category: 'Graphic Design',
    image:
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2194&auto=format&fit=crop',
    beforeImage:
      'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1974&auto=format&fit=crop',
    description:
      'A 40-page editorial spread exploring brutalist architecture in modern cities. Custom typography and experimental layout grids.',
    tags: ['InDesign', 'Typography', 'Print'],
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'CMO at Aura Tech',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
    text: 'Elias completely transformed our digital presence. The new dashboard design not only looks stunning but has significantly reduced our user onboarding time. A true visionary.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Founder, Lumina',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
    text: 'Working with Elias was a masterclass in professional web development. He delivered a blazing fast e-commerce site that perfectly captured our luxury brand aesthetic.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Director, Nexus Agency',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
    text: 'Rarely do you find someone who is equally talented in deep technical development and high-end visual design. Elias is that rare unicorn. Highly recommended.',
    rating: 5,
  },
];
