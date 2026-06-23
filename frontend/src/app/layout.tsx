import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// Dynamically fetch SEO metadata from backend
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL}/_/backend`
    : 'http://localhost:5000');

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [settingsRes, heroRes] = await Promise.all([
      fetch(`${BASE_URL}/api/settings`, { next: { revalidate: 300 } }),
      fetch(`${BASE_URL}/api/hero`, { next: { revalidate: 300 } }),
    ]);

    const settings = settingsRes.ok ? (await settingsRes.json()).data : null;
    const hero = heroRes.ok ? (await heroRes.json()).data : null;

    const name = hero?.fullName || settings?.siteName || 'Portfolio';
    const title = settings?.seo?.metaTitle || `${name} | Creative Designer & Developer`;
    const description =
      settings?.seo?.metaDescription ||
      hero?.bio ||
      `Portfolio of ${name} — Graphic Designer, Web Developer & UI/UX Designer.`;
    const keywords: string[] =
      settings?.seo?.keywords?.length > 0
        ? settings.seo.keywords
        : ['graphic design', 'web development', 'UI/UX design', 'portfolio'];
    const image = settings?.seo?.socialPreviewImage || hero?.heroImage || '';
    const siteName = settings?.siteName || name;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        siteName,
        ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: name }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
      icons: {
        icon: settings?.favicon || '/favicon.ico',
        apple: settings?.favicon || '/favicon.ico',
      },
    };
  } catch {
    return {
      title: 'Portfolio | Creative Designer & Developer',
      description: 'Creative portfolio showcasing graphic design, web development & UI/UX work.',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
