"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, Upload, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/store/useSettingsStore";

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
  <input
    {...props}
    className={`w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all ${className}`}
  />
);

function FilePicker({
  label,
  value,
  onChange,
  square,
  hint,
}: {
  label: string;
  value?: string;
  onChange: (f: File) => void;
  square?: boolean;
  hint?: string;
}) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const id = `fp-${label.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
        {label}
        {hint && <span className="text-[#52525b] font-normal ml-1">({hint})</span>}
      </label>
      <label
        htmlFor={id}
        className={`relative block rounded-xl border-2 border-dashed border-white/10 hover:border-[#8B5CF6]/50 cursor-pointer transition-all overflow-hidden bg-white/2 ${
          square ? "w-24 h-24" : "w-full h-32"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className={`w-full h-full ${square ? "object-contain p-2" : "object-contain p-3"}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Upload size={18} className="text-[#52525b]" />
            <span className="text-xs text-[#52525b]">Click to upload</span>
          </div>
        )}
        <input id={id} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [settingsData, setSettingsData] = useState<any>(null);
  const { fetchSettings, setSettings } = useSettingsStore();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => {
        const d = res.data.data;
        setSettingsData(d);
        reset({
          siteName: d.siteName,
          tagline: d.tagline,
          footerText: d.footerText,
          copyrightText: d.copyrightText,
          "seo.metaTitle": d.seo?.metaTitle || "",
          "seo.metaDescription": d.seo?.metaDescription || "",
          "seo.metaKeywords": d.seo?.keywords?.join(", ") || "",
          maintenanceMode: d.maintenanceMode || false,
          "socials.facebook": d.socials?.facebook || "",
          "socials.instagram": d.socials?.instagram || "",
          "socials.linkedin": d.socials?.linkedin || "",
          "socials.twitter": d.socials?.twitter || "",
          "socials.github": d.socials?.github || "",
          "socials.behance": d.socials?.behance || "",
          "socials.dribbble": d.socials?.dribbble || "",
          "socials.youtube": d.socials?.youtube || "",
        });
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const formData = new FormData();

      // Scalar fields
      formData.append("siteName", data.siteName || "");
      formData.append("tagline", data.tagline || "");
      formData.append("footerText", data.footerText || "");
      formData.append("copyrightText", data.copyrightText || "");
      formData.append("maintenanceMode", String(data.maintenanceMode || false));

      // SEO as JSON
      formData.append(
        "seo",
        JSON.stringify({
          metaTitle: data["seo.metaTitle"] || "",
          metaDescription: data["seo.metaDescription"] || "",
          keywords: (data["seo.metaKeywords"] || "")
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean),
        })
      );

      // Socials as JSON
      formData.append(
        "socials",
        JSON.stringify({
          facebook: data["socials.facebook"] || "",
          instagram: data["socials.instagram"] || "",
          linkedin: data["socials.linkedin"] || "",
          twitter: data["socials.twitter"] || "",
          github: data["socials.github"] || "",
          behance: data["socials.behance"] || "",
          dribbble: data["socials.dribbble"] || "",
          youtube: data["socials.youtube"] || "",
        })
      );

      if (logoFile) formData.append("logo", logoFile);
      if (faviconFile) formData.append("favicon", faviconFile);

      const res = await api.put("/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh store so Sidebar logo/name updates immediately
      const updated = res.data.data;
      setSettingsData(updated);
      setSettings(updated);
      await fetchSettings();

      toast.success("Site settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="skeleton h-64 rounded-2xl max-w-4xl" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — text fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* General */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">General Settings</h3>
            <Field label="Site Name" hint="shown in sidebar & browser tab">
              <Input {...register("siteName")} placeholder="My Portfolio" />
            </Field>
            <Field label="Tagline">
              <Input {...register("tagline")} placeholder="Creative Designer & Developer" />
            </Field>
            <Field label="Footer Text">
              <Input {...register("footerText")} placeholder="Crafted with passion" />
            </Field>
            <Field label="Copyright Text">
              <Input {...register("copyrightText")} placeholder="© 2024 All rights reserved." />
            </Field>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                {...register("maintenanceMode")}
                className="w-4 h-4 rounded accent-[#8B5CF6]"
              />
              <span className="text-sm text-white">Enable Maintenance Mode</span>
            </label>
          </div>

          {/* SEO */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">SEO &amp; Meta Tags</h3>
            <Field label="Meta Title">
              <Input {...register("seo.metaTitle")} placeholder="John Doe | Designer & Developer" />
            </Field>
            <Field label="Meta Description">
              <textarea
                {...register("seo.metaDescription")}
                rows={3}
                placeholder="Brief description of your portfolio..."
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all resize-none"
              />
            </Field>
            <Field label="Keywords" hint="comma separated">
              <Input
                {...register("seo.metaKeywords")}
                placeholder="graphic design, UI/UX, web development"
              />
            </Field>
          </div>

          {/* Social Media */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Facebook"><Input {...register("socials.facebook")} placeholder="https://facebook.com/..." /></Field>
              <Field label="Instagram"><Input {...register("socials.instagram")} placeholder="https://instagram.com/..." /></Field>
              <Field label="LinkedIn"><Input {...register("socials.linkedin")} placeholder="https://linkedin.com/in/..." /></Field>
              <Field label="Twitter"><Input {...register("socials.twitter")} placeholder="https://twitter.com/..." /></Field>
              <Field label="GitHub"><Input {...register("socials.github")} placeholder="https://github.com/..." /></Field>
              <Field label="Behance"><Input {...register("socials.behance")} placeholder="https://behance.net/..." /></Field>
              <Field label="Dribbble"><Input {...register("socials.dribbble")} placeholder="https://dribbble.com/..." /></Field>
              <Field label="YouTube"><Input {...register("socials.youtube")} placeholder="https://youtube.com/..." /></Field>
            </div>
          </div>
        </div>

        {/* Right column — image fields + save */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Site Logo</h3>
            <p className="text-xs text-[#71717A]">Shown in the sidebar header. PNG/SVG recommended.</p>
            <FilePicker
              label="Upload Logo"
              value={settingsData?.logo}
              onChange={setLogoFile}
            />
          </div>

          {/* Favicon */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Browser Favicon</h3>
            <p className="text-xs text-[#71717A]">
              Shown in the browser tab. Use a square PNG (32×32 or 64×64).
            </p>
            <div className="flex items-center gap-4">
              <FilePicker
                label="Upload Favicon"
                value={settingsData?.favicon}
                onChange={setFaviconFile}
                square
              />
              {settingsData?.favicon && (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={settingsData.favicon} alt="favicon" className="w-4 h-4 object-contain" />
                    <span className="text-xs text-[#A1A1AA]">Current tab preview</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save button */}
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full h-11 rounded-xl gradient-purple text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </motion.button>
        </div>
      </div>
    </form>
  );
}
