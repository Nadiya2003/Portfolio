"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
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
  <input {...props} className={`w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all ${className}`} />
);

const Textarea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all resize-none ${className}`} />
);

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [aboutData, setAboutData] = useState<Record<string, unknown> | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const skills = watch("skills") || [];
  const experience = watch("experience") || [];
  const education = watch("education") || [];

  useEffect(() => {
    api.get("/about").then((res) => {
      const d = res.data.data;
      setAboutData(d);
      reset({
        heading: d.heading, subHeading: d.subHeading, description: d.description,
        yearsOfExperience: d.yearsOfExperience, completedProjects: d.completedProjects,
        skills: Array.isArray(d.skills) ? d.skills : [],
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
        if (k === "skills" || k === "experience" || k === "education") formData.append(k, JSON.stringify(v));
        else formData.append(k, String(v ?? ""));
      });
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      
      await api.put("/about", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("About section saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const addSkill = () => setValue("skills", [...skills, { name: "", level: 50, category: "frontend" }]);
  const removeSkill = (i: number) => setValue("skills", skills.filter((_: unknown, idx: number) => idx !== i));

  const addExp = () => setValue("experience", [...experience, { title: "", company: "", startDate: "", endDate: "", current: false, description: "" }]);
  const removeExp = (i: number) => setValue("experience", experience.filter((_: unknown, idx: number) => idx !== i));

  const addEdu = () => setValue("education", [...education, { degree: "", institution: "", startDate: "", endDate: "", description: "" }]);
  const removeEdu = (i: number) => setValue("education", education.filter((_: unknown, idx: number) => idx !== i));

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

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Skills</h3>
              <button type="button" onClick={addSkill} className="flex items-center gap-1 text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"><Plus size={13} /> Add Skill</button>
            </div>
            <div className="space-y-3">
              {skills.map((_: unknown, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <GripVertical size={14} className="text-[#3f3f46] flex-shrink-0" />
                  <Input {...register(`skills.${i}.name`)} placeholder="Skill Name" className="flex-1" />
                  <Input {...register(`skills.${i}.level`)} type="number" placeholder="%" className="w-20" min="0" max="100" />
                  <select {...register(`skills.${i}.category`)} className="w-32 h-10 px-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none">
                    <option value="frontend">Frontend</option><option value="backend">Backend</option><option value="design">Design</option><option value="other">Other</option>
                  </select>
                  <button type="button" onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Experience</h3>
              <button type="button" onClick={addExp} className="flex items-center gap-1 text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"><Plus size={13} /> Add Exp</button>
            </div>
            <div className="space-y-4">
              {experience.map((_: unknown, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/3 space-y-3 relative">
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
              {education.map((_: unknown, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/3 space-y-3 relative">
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
