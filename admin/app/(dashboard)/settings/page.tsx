"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-[#A1A1AA] mb-2">{label}</label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all ${className}`} />
);

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [settingsData, setSettingsData] = useState<any>(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    api.get("/settings").then((res) => {
      const d = res.data.data;
      setSettingsData(d);
      reset({
        siteName: d.siteName, tagline: d.tagline, footerText: d.footerText, copyrightText: d.copyrightText,
        seo: d.seo || {}, maintenanceMode: d.maintenanceMode || false
      });
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === "seo") formData.append("seo", JSON.stringify(v));
        else formData.append(k, String(v));
      });
      if (logoFile) formData.append("logo", logoFile);
      if (faviconFile) formData.append("favicon", faviconFile);
      await api.put("/settings", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Site settings saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="skeleton h-64 rounded-2xl max-w-4xl" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">General Settings</h3>
            <Field label="Site Name"><Input {...register("siteName")} /></Field>
            <Field label="Tagline"><Input {...register("tagline")} /></Field>
            <Field label="Footer Text"><Input {...register("footerText")} /></Field>
            <Field label="Copyright Text"><Input {...register("copyrightText")} /></Field>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" {...register("maintenanceMode")} className="w-4 h-4 rounded accent-[#8B5CF6]" />
              <span className="text-sm text-white">Enable Maintenance Mode</span>
            </label>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">SEO & Meta Tags</h3>
            <Field label="Meta Title"><Input {...register("seo.metaTitle")} /></Field>
            <Field label="Meta Description"><textarea {...register("seo.metaDescription")} rows={3} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none resize-none" /></Field>
            <Field label="Meta Keywords (comma separated)"><Input {...register("seo.metaKeywords")} /></Field>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Site Logo</h3>
            <ImageUpload value={settingsData?.logo} onChange={setLogoFile} className="aspect-auto h-32" />
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Favicon</h3>
            <ImageUpload value={settingsData?.favicon} onChange={setFaviconFile} className="aspect-square h-32 w-32 mx-auto" />
          </div>
          <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full h-11 rounded-xl gradient-purple text-white font-semibold text-sm flex items-center justify-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />} Save Settings
          </motion.button>
        </div>
      </div>
    </form>
  );
}
