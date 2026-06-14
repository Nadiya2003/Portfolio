"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-[#A1A1AA] mb-2">{label}</label>
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
      reset({ contact: d.contact || {}, socials: d.socials || {} });
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.put("/settings", data);
      toast.success("Contact details saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="skeleton h-64 rounded-2xl max-w-4xl" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact Email"><Input {...register("contact.email")} type="email" placeholder="hello@example.com" /></Field>
          <Field label="Contact Phone"><Input {...register("contact.phone")} placeholder="+1 234 567 890" /></Field>
        </div>
        <Field label="Office Address"><Input {...register("contact.address")} placeholder="123 Creative Street, NY" /></Field>
        <Field label="Google Maps Embed URL"><Input {...register("contact.mapUrl")} placeholder="https://www.google.com/maps/embed?pb=..." /></Field>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Social Media Links</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "facebook", label: "Facebook" },
            { key: "twitter", label: "Twitter (X)" },
            { key: "instagram", label: "Instagram" },
            { key: "linkedin", label: "LinkedIn" },
            { key: "github", label: "GitHub" },
            { key: "dribbble", label: "Dribbble" },
            { key: "behance", label: "Behance" },
            { key: "youtube", label: "YouTube" },
          ].map((s) => (
            <Field key={s.key} label={s.label}><Input {...register(`socials.${s.key}`)} placeholder={`https://${s.key}.com/...`} /></Field>
          ))}
        </div>
      </div>

      <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
        className="h-11 px-6 rounded-xl gradient-purple text-white font-semibold text-sm flex items-center justify-center gap-2">
        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />} Save Changes
      </motion.button>
    </form>
  );
}
