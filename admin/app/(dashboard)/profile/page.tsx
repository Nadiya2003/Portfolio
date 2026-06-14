"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, Lock } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const { admin, fetchMe } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { register: regProfile, handleSubmit: submitProfile, reset: resetProfile } = useForm();
  const { register: regPass, handleSubmit: submitPass, reset: resetPass } = useForm();

  useEffect(() => {
    if (admin) resetProfile({ name: admin.name, email: admin.email });
  }, [admin, resetProfile]);

  const onProfileSave = async (data: any) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (photoFile) formData.append("profilePhoto", photoFile);
      await api.put("/auth/update-profile", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchMe();
      toast.success("Profile updated");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const onPassSave = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) return toast.error("Passwords do not match");
    setSaving(true);
    try {
      await api.put("/auth/change-password", { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success("Password changed");
      resetPass();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed to change password"); }
    finally { setSaving(false); }
  };

  if (!admin) return null;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="glass rounded-2xl p-6 flex gap-8">
        <div className="w-40 flex-shrink-0">
          <h3 className="text-sm font-semibold text-white mb-4">Profile Photo</h3>
          <ImageUpload value={admin.profilePhoto} onChange={setPhotoFile} className="aspect-square rounded-full" />
        </div>
        <form onSubmit={submitProfile(onProfileSave)} className="flex-1 space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-white">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-2">Full Name</label>
              <input {...regProfile("name")} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-2">Email Address</label>
              <input {...regProfile("email")} type="email" className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none" />
            </div>
          </div>
          <motion.button type="submit" disabled={saving} className="h-10 px-6 rounded-xl gradient-purple text-white text-sm font-semibold">
            Save Changes
          </motion.button>
        </form>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Lock size={16} /> Change Password</h3>
        <form onSubmit={submitPass(onPassSave)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-2">Current Password</label>
            <input {...regPass("currentPassword")} type="password" required className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-2">New Password</label>
            <input {...regPass("newPassword")} type="password" required className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-2">Confirm Password</label>
            <input {...regPass("confirmPassword")} type="password" required className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none" />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <motion.button type="submit" disabled={saving} className="h-10 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors">
              Update Password
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
