"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, Sparkles } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-[#A1A1AA] mb-2">{label}</label>
    {children}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all ${className}`} />
);

const Textarea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all resize-none ${className}`} />
);

export default function HeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [heroData, setHeroData] = useState<Record<string, unknown> | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const stats = watch("stats") || [];

  useEffect(() => {
    api.get("/hero").then((res) => {
      const d = res.data.data;
      setHeroData(d);
      reset({
        fullName: d.fullName, title: d.title, subtitle: d.subtitle, bio: d.bio,
        ctaText: d.ctaText, ctaSecondaryText: d.ctaSecondaryText, stats: d.stats || [],
        "socials.email": d.socials?.email, "socials.phone": d.socials?.phone,
        "socials.whatsapp": d.socials?.whatsapp, "socials.linkedin": d.socials?.linkedin,
        "socials.github": d.socials?.github, "socials.behance": d.socials?.behance,
        "socials.dribbble": d.socials?.dribbble, "socials.instagram": d.socials?.instagram,
      });
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === "stats" || k === "socials") formData.append(k, JSON.stringify(v));
        else formData.append(k, String(v ?? ""));
      });
      if (heroImageFile) formData.append("heroImage", heroImageFile);
      if (resumeFile) formData.append("resume", resumeFile);
      await api.put("/hero", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Hero section saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const addStat = () => setValue("stats", [...stats, { label: "", value: 0, suffix: "" }]);
  const removeStat = (i: number) => setValue("stats", stats.filter((_: unknown, idx: number) => idx !== i));

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Basic Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name"><Input {...register("fullName")} placeholder="Your Name" /></Field>
              <Field label="Professional Title"><Input {...register("title")} placeholder="Creative Director" /></Field>
            </div>
            <Field label="Subtitle"><Input {...register("subtitle")} placeholder="Graphic Designer, Web Developer..." /></Field>
            <Field label="Bio">
              <Textarea {...register("bio")} rows={4} placeholder="Write your bio here..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary CTA Text"><Input {...register("ctaText")} placeholder="View My Work" /></Field>
              <Field label="Secondary CTA Text"><Input {...register("ctaSecondaryText")} placeholder="Contact Me" /></Field>
            </div>
          </div>

          {/* Stats */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Stats</h3>
              <button type="button" onClick={addStat} className="flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">
                <Plus size={13} /> Add Stat
              </button>
            </div>
            <div className="space-y-3">
              {stats.map((_: unknown, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <GripVertical size={14} className="text-[#3f3f46] flex-shrink-0" />
                  <Input {...register(`stats.${i}.label`)} placeholder="Label" className="flex-1" />
                  <Input {...register(`stats.${i}.value`)} type="number" placeholder="0" className="w-20" />
                  <Input {...register(`stats.${i}.suffix`)} placeholder="+" className="w-16" />
                  <button type="button" onClick={() => removeStat(i)} className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Social Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "socials.email", label: "Email", ph: "hello@you.com" },
                { key: "socials.phone", label: "Phone", ph: "+1 555 000 0000" },
                { key: "socials.whatsapp", label: "WhatsApp", ph: "+15550000000" },
                { key: "socials.linkedin", label: "LinkedIn URL", ph: "https://linkedin.com/in/..." },
                { key: "socials.github", label: "GitHub URL", ph: "https://github.com/..." },
                { key: "socials.behance", label: "Behance URL", ph: "https://behance.net/..." },
                { key: "socials.dribbble", label: "Dribbble URL", ph: "https://dribbble.com/..." },
                { key: "socials.instagram", label: "Instagram URL", ph: "https://instagram.com/..." },
              ].map((s) => (
                <Field key={s.key} label={s.label}><Input {...register(s.key)} placeholder={s.ph} /></Field>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Hero Image</h3>
            <ImageUpload
              label="Upload Hero Photo"
              value={heroData?.heroImage as string || ""}
              onChange={setHeroImageFile}
            />
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Resume PDF</h3>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
              <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="hidden" id="resume" />
              <label htmlFor="resume" className="cursor-pointer">
                <p className="text-xs text-[#71717A]">{resumeFile ? resumeFile.name : "Click to upload PDF"}</p>
              </label>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 relative overflow-hidden hidden lg:flex flex-col items-center justify-center min-h-[250px]">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent pointer-events-none" />
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple opacity-20 blur-xl absolute top-10 right-10"
            />
            <div className="relative z-10 text-center">
              <Sparkles className="w-8 h-8 text-neon-purple mx-auto mb-3 opacity-80" />
              <h4 className="text-sm font-semibold text-white mb-1">Make it Pop!</h4>
              <p className="text-xs text-white/50 max-w-[200px]">The hero image and resume you upload here will be the first thing visitors see. Ensure they are high quality.</p>
            </div>
          </div>
          <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full h-11 rounded-xl gradient-purple text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </div>
    </form>
  );
}
