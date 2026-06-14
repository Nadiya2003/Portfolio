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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact`, {
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

  const email = hero?.socials?.email || settings?.email || 'hello@example.com';
  const phone = hero?.socials?.phone || settings?.phone || '+1 234 567 890';
  const whatsapp = hero?.socials?.whatsapp || settings?.whatsapp || phone;

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
              <GlassCard
                className="p-6 flex flex-col items-center text-center gap-4"
                hoverEffect
                glowColor="blue"
              >
                <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Email</h4>
                  <a
                    href={`mailto:${email}`}
                    className="text-white/60 hover:text-neon-blue transition-colors text-sm"
                  >
                    {email}
                  </a>
                </div>
              </GlassCard>

              <GlassCard
                className="p-6 flex flex-col items-center text-center gap-4"
                hoverEffect
                glowColor="purple"
              >
                <div className="w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">WhatsApp</h4>
                  <a
                    href={`tel:${whatsapp}`}
                    className="text-white/60 hover:text-neon-purple transition-colors text-sm"
                  >
                    {phone}
                  </a>
                </div>
              </GlassCard>
            </div>

            {/* Social Links */}
            <GlassCard className="p-6 flex justify-center gap-6">
              {hero?.socials?.linkedin && (
                <a
                  href={hero.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-neon-blue transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {hero?.socials?.github && (
                <a
                  href={hero.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
              )}
              {hero?.socials?.dribbble && (
                <a
                  href={hero.socials.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-neon-cyan transition-colors"
                  aria-label="Dribbble"
                >
                  <Dribbble size={24} />
                </a>
              )}
            </GlassCard>

            {/* Stylized Dark Map Placeholder */}
            <GlassCard className="h-64 relative overflow-hidden p-0">
              <div className="absolute inset-0 bg-[#0a0a0f] opacity-80 z-10 mix-blend-multiply" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                alt="Map location"
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-neon-blue animate-ping opacity-75" />
                  <MapPin className="text-neon-blue" size={24} />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 md:p-10">
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
