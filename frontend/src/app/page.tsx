import { Layout } from '@/components/Layout';
import { IntroSequence } from '@/components/IntroSequence';
import { Navigation } from '@/components/Navigation';
import { FaviconUpdater } from '@/components/FaviconUpdater';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Portfolio } from '@/components/Portfolio';
import { Skills } from '@/components/Skills';
import { Testimonials } from '@/components/Testimonials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { FloatingControls } from '@/components/FloatingControls';

// Automatically detect if we're on Vercel or local
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL}/_/backend`
    : 'http://localhost:5000');

const fetchAPI = async (endpoint: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/${endpoint}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`[API] Failed to fetch ${endpoint} - Status: ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json.data;
  } catch (error: any) {
    console.error(`[API] Network error fetching ${endpoint}:`, error.message);
    return null;
  }
};

export default async function Home() {
  // Fetch all data
  const [
    hero,
    about,
    services,
    testimonials,
    settings,
    projects,
    graphic,
    uiux,
    web,
    video,
    pencil
  ] = await Promise.all([
    fetchAPI('hero'),
    fetchAPI('about'),
    fetchAPI('services'),
    fetchAPI('testimonials'),
    fetchAPI('settings'),
    fetchAPI('projects'),
    fetchAPI('graphic'),
    fetchAPI('uiux'),
    fetchAPI('web'),
    fetchAPI('video'),
    fetchAPI('pencil'),
  ]);

  // Merge projects — tag each with its section type for frontend filtering
  const tagItems = (items: any[] | null, sectionType: string) =>
    (items || []).map(item => ({ ...item, _sectionType: sectionType }));

  const allProjects = [
    ...tagItems(projects, 'Projects'),
    ...tagItems(graphic,  'Graphic Design'),
    ...tagItems(uiux,     'UI/UX Design'),
    ...tagItems(web,      'Web Development'),
    ...tagItems(video,    'Video Editing'),
    ...tagItems(pencil,   'Pencil Arts'),
  ].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <Layout>
      {settings?.favicon && <FaviconUpdater faviconUrl={settings.favicon} />}
      <IntroSequence />
      <Navigation settings={settings} />
      <Hero data={hero} />
      <About data={about} />
      <Services data={services} />
      <Portfolio projects={allProjects} />
      <Skills />
      <Testimonials data={testimonials} />
      <Contact settings={settings} hero={hero} />
      <Footer settings={settings} hero={hero} />
      <FloatingControls />
    </Layout>
  );
}
