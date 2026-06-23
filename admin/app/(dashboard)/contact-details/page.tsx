"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, Mail, Phone, MapPin, Globe, MessageCircle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
      {label}
      {hint && <span className="text-[#52525b] font-normal ml-1">({hint})</span>}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all ${className}`} />
);

export default function ContactDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    api.get("/settings").then((res) => {
      const d = res.data.data;
      reset({
        "contact.email": d.contact?.email || "",
        "contact.phone": d.contact?.phone || "",
        "contact.whatsapp": d.contact?.whatsapp || "",
        "contact.address": d.contact?.address || "",
        "contact.mapLink": d.contact?.mapLink || "",
        "socials.facebook": d.socials?.facebook || "",
        "socials.twitter": d.socials?.twitter || "",
        "socials.instagram": d.socials?.instagram || "",
        "socials.linkedin": d.socials?.linkedin || "",
        "socials.github": d.socials?.github || "",
        "socials.dribbble": d.socials?.dribbble || "",
        "socials.behance": d.socials?.behance || "",
        "socials.youtube": d.socials?.youtube || "",
      });
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      // Must use FormData because the settings route uses multer middleware
      const formData = new FormData();
      formData.append("contact", JSON.stringify({
        email: data["contact.email"] || "",
        phone: data["contact.phone"] || "",
        whatsapp: data["contact.whatsapp"] || "",
        address: data["contact.address"] || "",
        mapLink: data["contact.mapLink"] || "",
      }));
      formData.append("socials", JSON.stringify({
        facebook: data["socials.facebook"] || "",
        twitter: data["socials.twitter"] || "",
        instagram: data["socials.instagram"] || "",
        linkedin: data["socials.linkedin"] || "",
        github: data["socials.github"] || "",
        dribbble: data["socials.dribbble"] || "",
        behance: data["socials.behance"] || "",
        youtube: data["socials.youtube"] || "",
      }));
      await api.put("/settings", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Contact details saved!");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to save");
    }
    finally { setSaving(false); }
  };

  if (loading) return <div className="skeleton h-64 rounded-2xl max-w-4xl" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      {/* Contact Info */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><Mail size={15} className="text-blue-400" /></div>
          <h3 className="text-sm font-semibold text-white">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address">
            <Input {...register("contact.email")} type="email" placeholder="hello@example.com" />
          </Field>
          <Field label="Phone Number">
            <Input {...register("contact.phone")} placeholder="+94 76 822 4295" />
          </Field>
          <Field label="WhatsApp Number" hint="with country code">
            <Input {...register("contact.whatsapp")} placeholder="+94768224295" />
          </Field>
          <Field label="Office / Location">
            <Input {...register("contact.address")} placeholder="Colombo, Sri Lanka" />
          </Field>
        </div>
        <Field label="Google Maps Embed URL" hint="paste the iframe src URL from Google Maps → Share → Embed">
          <Input {...register("contact.mapLink")} placeholder="https://www.google.com/maps/embed?pb=..." />
        </Field>
      </div>

      {/* Social Media */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Globe size={15} className="text-purple-400" /></div>
          <h3 className="text-sm font-semibold text-white">Social Media Links</h3>
          <span className="text-xs text-[#52525b] ml-1">— shown in Contact section &amp; Footer</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "facebook",  label: "Facebook",    ph: "https://facebook.com/yourpage" },
            { key: "instagram", label: "Instagram",   ph: "https://instagram.com/yourhandle" },
            { key: "twitter",   label: "Twitter (X)", ph: "https://twitter.com/yourhandle" },
            { key: "linkedin",  label: "LinkedIn",    ph: "https://linkedin.com/in/yourprofile" },
            { key: "github",    label: "GitHub",      ph: "https://github.com/yourusername" },
            { key: "behance",   label: "Behance",     ph: "https://behance.net/yourprofile" },
            { key: "dribbble",  label: "Dribbble",    ph: "https://dribbble.com/yourhandle" },
            { key: "youtube",   label: "YouTube",     ph: "https://youtube.com/@yourchannel" },
          ].map((s) => (
            <Field key={s.key} label={s.label}>
              <Input {...register(`socials.${s.key}`)} placeholder={s.ph} />
            </Field>
          ))}
        </div>
      </div>

      <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
        className="h-11 px-6 rounded-xl gradient-purple text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg">
        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
        Save All Changes
      </motion.button>
    </form>
  );
}
