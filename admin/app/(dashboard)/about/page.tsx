"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, Trash2, Plus, Zap, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-[#A1A1AA] mb-2">{label}</label>
    {children}
  </div>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} {...props} className={`w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all ${className}`} />
  )
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea ref={ref} {...props} className={`w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all resize-none ${className}`} />
  )
);
Textarea.displayName = "Textarea";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [aboutData, setAboutData] = useState<Record<string, unknown> | null>(null);

  const { register, handleSubmit, reset, control } = useForm();
  
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });

  useEffect(() => {
    api.get("/about").then((res) => {
      const d = res.data.data;
      setAboutData(d);
      reset({
        heading: d.heading, subHeading: d.subHeading, description: d.description,
        yearsOfExperience: d.yearsOfExperience, completedProjects: d.completedProjects,
        experience: Array.isArray(d.experience) ? d.experience : [],
        education: Array.isArray(d.education) ? d.education : []
      });
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === "experience" || k === "education") formData.append(k, JSON.stringify(v));
        else formData.append(k, String(v ?? ""));
      });
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      
      await api.put("/about", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("About section saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const addExp = () => appendExp({ title: "", company: "", startDate: "", endDate: "", current: false, description: "" });
  const addEdu = () => appendEdu({ degree: "", institution: "", startDate: "", endDate: "", description: "" });

  if (loading) return <div className="skeleton h-64 rounded-2xl max-w-4xl" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">General Information</h3>
            <Field label="Heading"><Input {...register("heading")} placeholder="About Me" /></Field>
            <Field label="Sub Heading"><Input {...register("subHeading")} placeholder="Get to know me better" /></Field>
            <Field label="Description"><Textarea {...register("description")} rows={5} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Years of Experience"><Input {...register("yearsOfExperience")} type="number" /></Field>
              <Field label="Completed Projects"><Input {...register("completedProjects")} type="number" /></Field>
            </div>
          </div>


          {/* Skills → managed in its own dedicated section */}
          <div className="glass rounded-2xl p-5 border border-[#8B5CF6]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                  <Zap size={15} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Skills &amp; Tools</p>
                  <p className="text-xs text-white/40 mt-0.5">Managed in the dedicated Skills section</p>
                </div>
              </div>
              <a href="/skills" className="flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors font-medium">
                Go to Skills <ArrowRight size={12} />
              </a>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Experience</h3>
              <button type="button" onClick={addExp} className="flex items-center gap-1 text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"><Plus size={13} /> Add Exp</button>
            </div>
            <div className="space-y-4">
              {expFields.map((field, i) => (
                <div key={field.id} className="p-4 rounded-xl border border-white/10 bg-white/3 space-y-3 relative">
                  <button type="button" onClick={() => removeExp(i)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                  <div className="grid grid-cols-2 gap-3 pr-8">
                    <Field label="Job Title"><Input {...register(`experience.${i}.title`)} placeholder="Senior Dev" /></Field>
                    <Field label="Company"><Input {...register(`experience.${i}.company`)} placeholder="Company Inc" /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Start Date"><Input {...register(`experience.${i}.startDate`)} placeholder="Jan 2020" /></Field>
                    <Field label="End Date"><Input {...register(`experience.${i}.endDate`)} placeholder="Present" /></Field>
                  </div>
                  <label className="flex items-center gap-2"><input type="checkbox" {...register(`experience.${i}.current`)} /> <span className="text-xs text-[#A1A1AA]">Current Job</span></label>
                  <Field label="Description"><Textarea {...register(`experience.${i}.description`)} rows={2} /></Field>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Education</h3>
              <button type="button" onClick={addEdu} className="flex items-center gap-1 text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"><Plus size={13} /> Add Edu</button>
            </div>
            <div className="space-y-4">
              {eduFields.map((field, i) => (
                <div key={field.id} className="p-4 rounded-xl border border-white/10 bg-white/3 space-y-3 relative">
                  <button type="button" onClick={() => removeEdu(i)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                  <div className="grid grid-cols-2 gap-3 pr-8">
                    <Field label="Degree"><Input {...register(`education.${i}.degree`)} placeholder="BSc Computer Science" /></Field>
                    <Field label="Institution"><Input {...register(`education.${i}.institution`)} placeholder="University Name" /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Start Date"><Input {...register(`education.${i}.startDate`)} placeholder="2015" /></Field>
                    <Field label="End Date"><Input {...register(`education.${i}.endDate`)} placeholder="2019" /></Field>
                  </div>
                  <Field label="Description"><Textarea {...register(`education.${i}.description`)} rows={2} /></Field>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Profile Image</h3>
            <ImageUpload label="Upload Profile Photo" value={aboutData?.profileImage as string || ""} onChange={setProfileImageFile} />
          </div>
          <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full h-11 rounded-xl gradient-purple text-white font-semibold text-sm flex items-center justify-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />} Save Changes
          </motion.button>
        </div>
      </div>
    </form>
  );
}
