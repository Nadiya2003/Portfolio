"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Upload, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "url" | "date";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface GenericFormProps {
  endpoint: string;
  item?: any;
  fields: FieldDef[];
  hasThumbnail?: boolean;
  hasBeforeImage?: boolean;
  hasTags?: boolean;
  hasGallery?: boolean;
  hasScreenshots?: boolean;
  hasArtworkImages?: boolean;
  hasVideo?: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (f: File) => void;
}) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const id = `img-picker-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-[#A1A1AA] mb-2">{label}</label>
      <label
        htmlFor={id}
        className="relative block w-full rounded-xl border-2 border-dashed border-white/10 hover:border-[#8B5CF6]/50 cursor-pointer transition-all overflow-hidden"
        style={{ height: "120px" }}
      >
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
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

export default function GenericForm({
  endpoint,
  item,
  fields,
  hasThumbnail,
  hasBeforeImage,
  hasTags,
  hasGallery,
  hasScreenshots,
  hasArtworkImages,
  hasVideo,
  onClose,
  onSaved,
}: GenericFormProps) {
  const [saving, setSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [artworkFiles, setArtworkFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: item
      ? { ...item, tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags }
      : { status: "published" },
  });

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([k, v]) => {
        if (
          v !== undefined &&
          v !== null &&
          !["thumbnail", "beforeImage", "gallery", "screenshots", "artworkImages", "video", "tags", "_id", "__v", "createdAt", "updatedAt"].includes(k)
        ) {
          formData.append(k, String(v));
        }
      });

      if (hasTags && data.tags) {
        const tagsStr =
          typeof data.tags === "string"
            ? data.tags
            : Array.isArray(data.tags)
            ? data.tags.join(",")
            : "";
        const tagsArray = tagsStr
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean);
        tagsArray.forEach((t: string) => formData.append("tags", t));
      }

      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      if (beforeImageFile) formData.append("beforeImage", beforeImageFile);
      if (videoFile) formData.append("video", videoFile);
      galleryFiles.forEach((f) => formData.append("gallery", f));
      screenshotFiles.forEach((f) => formData.append("screenshots", f));
      artworkFiles.forEach((f) => formData.append("artworkImages", f));

      if (item?._id) {
        await api.put(`/${endpoint}/${item._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Updated successfully!");
      } else {
        await api.post(`/${endpoint}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Created successfully!");
      }
      onSaved();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to save";
      toast.error(msg);
      console.error("Save error:", err?.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-base font-semibold text-white">
          {item?._id ? "Edit Item" : "Create New Item"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5" style={{ overscrollBehavior: "contain" }}>
        <form id="generic-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Regular fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                    {f.label}
                    {f.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      {...register(f.key, { required: f.required })}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all resize-none"
                    />
                  ) : f.type === "select" ? (
                    <select
                      {...register(f.key, { required: f.required })}
                      className="w-full h-10 px-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm outline-none focus:border-[#8B5CF6]/50 transition-all"
                    >
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#18181b]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      {...register(f.key, { required: f.required })}
                      placeholder={f.placeholder}
                      className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all"
                    />
                  )}
                  {errors[f.key] && (
                    <p className="text-xs text-red-400 mt-1">This field is required</p>
                  )}
                </div>
              ))}
            </div>

            {/* Tags */}
            {hasTags && (
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Tags <span className="text-[#52525b]">(comma separated)</span>
                </label>
                <input
                  type="text"
                  {...register("tags")}
                  placeholder="e.g. React, UI Design, Photoshop"
                  className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all"
                />
              </div>
            )}

            {/* Image uploads */}
            {(hasThumbnail || hasBeforeImage) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {hasThumbnail && (
                  <ImagePicker
                    label="Main Image / Thumbnail"
                    value={item?.thumbnail}
                    onChange={setThumbnailFile}
                  />
                )}
                {hasBeforeImage && (
                  <ImagePicker
                    label="Before Image (Slider)"
                    value={item?.beforeImage}
                    onChange={setBeforeImageFile}
                  />
                )}
              </div>
            )}

            {/* Additional images (gallery/screenshots/artwork) */}
            {(hasGallery || hasScreenshots || hasArtworkImages) && (
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Additional Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (hasGallery) setGalleryFiles(files);
                    if (hasScreenshots) setScreenshotFiles(files);
                    if (hasArtworkImages) setArtworkFiles(files);
                  }}
                  className="w-full text-sm text-[#A1A1AA] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer"
                />
              </div>
            )}

            {/* Video */}
            {hasVideo && (
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-[#A1A1AA] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer"
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-4 rounded-xl bg-white/5 text-sm text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          form="generic-form"
          type="submit"
          disabled={saving}
          className="h-9 px-5 rounded-xl gradient-purple text-white text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
