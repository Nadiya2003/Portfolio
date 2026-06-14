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

export const metadata: Metadata = {
  title: 'Elias Vance | Creative Director & Full-Stack Designer',
  description:
    'Portfolio of Elias Vance — Graphic Designer, Web Developer, UI/UX Designer & Pencil Artist. Over 8 years of experience crafting immersive digital experiences.',
  keywords: [
    'graphic design',
    'web development',
    'UI/UX design',
    'portfolio',
    'full-stack developer',
    'creative director',
  ],
  openGraph: {
    title: 'Elias Vance | Creative Director & Full-Stack Designer',
    description:
      'Designing Experiences. Building Digital Excellence.',
    type: 'website',
  },
};

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
