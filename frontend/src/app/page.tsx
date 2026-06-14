import { Layout } from '@/components/Layout';
import { IntroSequence } from '@/components/IntroSequence';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Portfolio } from '@/components/Portfolio';
import { Skills } from '@/components/Skills';
import { Testimonials } from '@/components/Testimonials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const fetchAPI = async (endpoint: string) => {
  try {
    const res = await fetch(`http://localhost:5000/api/${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
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

  // Merge projects
  const allProjects = [
    ...(projects || []),
    ...(graphic || []),
    ...(uiux || []),
    ...(web || []),
    ...(video || []),
    ...(pencil || []),
  ].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <Layout>
      <IntroSequence />
      <Navigation />
      <Hero data={hero} />
      <About data={about} />
      <Services data={services} />
      <Portfolio projects={allProjects} />
      <Skills data={about} />
      <Testimonials data={testimonials} />
      <Contact settings={settings} hero={hero} />
      <Footer settings={settings} hero={hero} />
    </Layout>
  );
}
