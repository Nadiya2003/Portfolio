'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  MessageCircle,
  Dribbble,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe,
} from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';
import { MagneticButton } from './ui/MagneticButton';

export function Contact({ settings, hero }: { settings?: any, hero?: any }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Automatically detect if we're on Vercel or local
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
        (process.env.NEXT_PUBLIC_VERCEL_URL 
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/_/backend`
          : 'http://localhost:5000');
          
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to submit form:', err);
      setError(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const email = settings?.contact?.email || 'hello@example.com';
  const phone = settings?.contact?.phone || '+1 234 567 890';
  const whatsapp = settings?.contact?.whatsapp || phone;
  const mapLink = settings?.contact?.mapUrl || settings?.contact?.mapLink || '';
  const socials = settings?.socials || {};

  const getSocialIcon = (key: string) => {
    switch (key) {
      case 'facebook': return <Facebook size={24} />;
      case 'instagram': return <Instagram size={24} />;
      case 'linkedin': return <Linkedin size={24} />;
      case 'twitter': return <Twitter size={24} />;
      case 'github': return <Github size={24} />;
      case 'youtube': return <Youtube size={24} />;
      case 'dribbble': return <Dribbble size={24} />;
      default: return <Globe size={24} />;
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading
          title="Let's Create Something Amazing Together"
          subtitle="Contact"
          color="blue"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`mailto:${email}`}
                className="block"
              >
                <GlassCard
                  className="p-5 md:p-6 flex flex-row sm:flex-col items-center sm:text-center gap-4 cursor-pointer"
                  hoverEffect
                  glowColor="blue"
                >
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue flex-shrink-0">
                    <Mail size={22} />
                  </div>
                  <div className="text-left sm:text-center">
                    <h4 className="text-white font-medium mb-0.5 text-sm md:text-base">Email</h4>
                    <span
                      className="text-white/60 hover:text-neon-blue transition-colors text-xs md:text-sm break-all"
                    >
                      {email}
                    </span>
                  </div>
                </GlassCard>
              </a>

              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <GlassCard
                  className="p-5 md:p-6 flex flex-row sm:flex-col items-center sm:text-center gap-4 cursor-pointer"
                  hoverEffect
                  glowColor="purple"
                >
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple flex-shrink-0">
                    <MessageCircle size={22} />
                  </div>
                  <div className="text-left sm:text-center">
                    <h4 className="text-white font-medium mb-0.5 text-sm md:text-base">WhatsApp</h4>
                    <span
                      className="text-white/60 hover:text-neon-purple transition-colors text-xs md:text-sm"
                    >
                      {phone}
                    </span>
                  </div>
                </GlassCard>
              </a>
            </div>

            {/* Social Links */}
            <GlassCard className="p-6 flex flex-wrap justify-center gap-6">
              {Object.entries(socials).map(([key, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-neon-cyan transition-colors"
                    aria-label={key}
                  >
                    {getSocialIcon(key)}
                  </a>
                );
              })}
            </GlassCard>

            {/* Stylized Dark Map Placeholder */}
            <GlassCard className="h-64 relative overflow-hidden p-0">
              <div className="absolute inset-0 bg-[#0a0a0f] opacity-80 z-10 mix-blend-multiply" />
              {mapLink ? (
                <iframe
                  src={mapLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(1) contrast(1.2)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 z-20 opacity-80"
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                    alt="Map location"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border border-neon-blue animate-ping opacity-75" />
                      <MapPin className="text-neon-blue" size={24} />
                    </div>
                  </div>
                </>
              )}
            </GlassCard>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors peer placeholder-transparent"
                      placeholder="Name"
                    />
                    <label
                      htmlFor="contact-name"
                      className="absolute left-0 top-3 text-white/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-neon-blue peer-valid:-top-4 peer-valid:text-xs"
                    >
                      Your Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      id="contact-email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors peer placeholder-transparent"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="contact-email"
                      className="absolute left-0 top-3 text-white/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-neon-blue peer-valid:-top-4 peer-valid:text-xs"
                    >
                      Your Email
                    </label>
                  </div>
                </div>

                <div className="relative group">
                  <input
                    type="text"
                    name="subject"
                    id="contact-subject"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors peer placeholder-transparent"
                    placeholder="Subject"
                  />
                  <label
                    htmlFor="contact-subject"
                    className="absolute left-0 top-3 text-white/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-neon-blue peer-valid:-top-4 peer-valid:text-xs"
                  >
                    Subject
                  </label>
                </div>

                <div className="relative group pt-2">
                  <textarea
                    name="message"
                    id="contact-message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors peer placeholder-transparent resize-none"
                    placeholder="Message"
                  />
                  <label
                    htmlFor="contact-message"
                    className="absolute left-0 top-5 text-white/50 text-sm transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-neon-blue peer-valid:-top-2 peer-valid:text-xs"
                  >
                    Your Message
                  </label>
                </div>

                {error && (
                  <div className="text-red-400 text-sm font-medium px-2">
                    {error}
                  </div>
                )}

                <MagneticButton
                  type="submit"
                  color={isSuccess ? 'cyan' : 'blue'}
                  className="w-full mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">Sending...</span>
                  ) : isSuccess ? (
                    <span className="flex items-center gap-2 text-dark-900">
                      Message Sent!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <Send size={18} />
                    </span>
                  )}
                </MagneticButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
