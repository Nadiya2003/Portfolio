const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const Hero = require('./models/Hero');
const About = require('./models/About');
const Service = require('./models/Service');
const SiteSettings = require('./models/SiteSettings');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to DB, starting seed...');

    // 1. SiteSettings
    await SiteSettings.deleteMany({});
    await SiteSettings.create({
      siteName: 'Elias Vance',
      siteDescription: 'Digital Product Designer and Developer Portfolio',
      contactEmail: 'hello@eliasvance.design',
      contactPhone: '+1 (555) 123-4567',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com'
      }
    });
    console.log('SiteSettings seeded');

    // 2. Hero
    await Hero.deleteMany({});
    await Hero.create({
      fullName: 'Elias Vance',
      title: 'Digital Architect & Visual Artist',
      subtitle: 'Graphic Designer, Web Developer, UI/UX Designer & Pencil Artist.',
      bio: "I bridge the gap between aesthetics and engineering. With over 8 years of experience spanning digital product design, full-stack development, and traditional fine arts, I create immersive digital experiences that don't just look beautiful-they perform flawlessly.",
      ctaText: 'View My Work',
      ctaSecondaryText: 'Contact Me',
      stats: [
        { label: 'Years Experience', value: 8, suffix: '+' },
        { label: 'Completed Projects', value: 140, suffix: '+' },
        { label: 'Happy Clients', value: 85, suffix: '%' },
        { label: 'Technologies', value: 24, suffix: '' }
      ],
      socials: {
        email: 'hello@eliasvance.design',
        phone: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        behance: 'https://behance.net',
        dribbble: 'https://dribbble.com',
        whatsapp: '+15551234567'
      }
    });
    console.log('Hero seeded');

    // 3. About
    await About.deleteMany({});
    await About.create({
      heading: 'About Me',
      subHeading: 'My Journey',
      description: "I'm a multidisciplinary designer and developer with a passion for creating impactful digital experiences.",
      yearsOfExperience: 8,
      completedProjects: 140,
      skills: [
        { name: 'Photoshop', level: 95, category: 'design' },
        { name: 'Illustrator', level: 90, category: 'design' },
        { name: 'After Effects', level: 80, category: 'design' },
        { name: 'Figma', level: 98, category: 'uiux' },
        { name: 'React', level: 92, category: 'development' },
        { name: 'Node.js', level: 80, category: 'development' },
      ],
      experience: [
        {
          title: 'Creative Director',
          company: 'Nexus Digital Agency',
          startDate: '2023',
          endDate: 'Present',
          current: true,
          description: 'Leading a team of designers and developers to deliver award-winning web experiences for enterprise clients.'
        },
        {
          title: 'Senior UI/UX Designer & Developer',
          company: 'Aura Tech Solutions',
          startDate: '2020',
          endDate: '2023',
          current: false,
          description: 'Spearheaded the design system and front-end architecture for a suite of SaaS products used by 50k+ users.'
        }
      ]
    });
    console.log('About seeded');

    // 4. Services
    await Service.deleteMany({});
    await Service.insertMany([
      {
        title: 'Graphic Design & Video',
        icon: 'Palette',
        color: 'blue',
        skills: ['Flyer Design', 'Social Media Posts', 'Logo Design', 'Video Editing']
      },
      {
        title: 'Web Design & Dev',
        icon: 'Code2',
        color: 'purple',
        skills: ['Responsive Websites', 'E-Commerce', 'Full-Stack Development']
      },
      {
        title: 'UI/UX Design',
        icon: 'Layout',
        color: 'cyan',
        skills: ['Mobile App Design', 'Wireframing', 'Prototyping', 'Design Systems']
      },
      {
        title: 'Pencil Art',
        icon: 'PenTool',
        color: 'blue',
        skills: ['Portrait Drawings', 'Realistic Sketches', 'Concept Art']
      }
    ]);
    console.log('Services seeded');

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
