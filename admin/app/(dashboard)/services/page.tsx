"use client";

import { useState } from "react";
import { ContentTable } from "@/components/sections/ContentTable";
import { useForm } from "react-hook-form";
import { X, Save } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const INPUT_CLASS = "w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all";
const LABEL_CLASS = "block text-xs font-medium text-[#A1A1AA] mb-2";

function ServiceForm({ item, onClose, onSaved }: { item?: any; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: item
      ? { ...item, skills: Array.isArray(item.skills) ? item.skills.join(", ") : "" }
      : { status: "published", color: "blue" },
  });

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        icon: data.icon,
        color: data.color,
        status: data.status,
        skills: data.skills ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      };
      if (item) {
        await api.put(`/services/${item._id}`, payload);
        toast.success("Service updated!");
      } else {
        await api.post("/services", payload);
        toast.success("Service created!");
      }
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h2 className="text-lg font-semibold text-white">{item ? "Edit Service" : "New Service"}</h2>
        <button onClick={onClose} className="text-[#71717A] hover:text-white transition-colors"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={LABEL_CLASS}>Title *</label>
            <input {...register("title", { required: true })} placeholder="e.g. Graphic Design" className={INPUT_CLASS} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Lucide Icon Name *</label>
              <input {...register("icon", { required: true })} placeholder="e.g. Palette, Code2, Monitor" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Color Theme</label>
              <select {...register("color")} className={INPUT_CLASS}>
                {["blue", "purple", "cyan", "pink", "green", "yellow"].map(c => (
                  <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS}>Skills / Features (comma separated)</label>
            <input {...register("skills")} placeholder="e.g. Logo Design, Brand Identity, Print Design" className={INPUT_CLASS} />
            <p className="text-xs text-[#52525b] mt-1">These appear as checklist items on the frontend.</p>
          </div>
          <div>
            <label className={LABEL_CLASS}>Status</label>
            <select {...register("status")} className={INPUT_CLASS}>
              {["published", "draft", "archived"].map(s => (
                <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      <div className="p-6 border-t flex justify-end gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button onClick={onClose} className="h-10 px-4 rounded-xl bg-white/5 text-sm text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors">Cancel</button>
        <button form="service-form" type="submit" disabled={saving}
          className="h-10 px-6 rounded-xl gradient-purple text-white text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="max-w-7xl">
      <ContentTable
        endpoint="services"
        title="Services"
        fields={[{ key: "icon", label: "Icon" }, { key: "color", label: "Color" }]}
        FormComponent={(props) => <ServiceForm {...props} />}
      />
    </div>
  );
}
