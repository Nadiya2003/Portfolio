"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Upload, FileText, Globe, ExternalLink } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "url" | "date";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
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
  hasPdf?: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function ImagePicker({
  label,
  value,
  onChange,
  onRemove,
}: {
  label: string;
  value?: string;
  onChange: (f: File) => void;
  onRemove?: () => void;
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
        className="relative block w-full rounded-xl border-2 border-dashed border-white/10 hover:border-[#8B5CF6]/50 cursor-pointer transition-all overflow-hidden group"
        style={{ height: "120px" }}
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium">Change Image</span>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setPreview(null);
                  onRemove();
                }}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Image"
              >
                <X size={14} />
              </button>
            )}
          </>
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
  hasPdf,
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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [webPreviewUrl, setWebPreviewUrl] = useState<string | null>(null);
  const previewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [existingGallery, setExistingGallery] = useState<any[]>(item?.gallery || []);
  const [existingScreenshots, setExistingScreenshots] = useState<any[]>(item?.screenshots || []);
  const [existingArtworkImages, setExistingArtworkImages] = useState<any[]>(item?.artworkImages || []);

  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  const [removeBeforeImage, setRemoveBeforeImage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: item
      ? { ...item, tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags }
      : { status: "published" },
  });

  // Live URL preview for web projects
  const liveUrlValue = watch("liveUrl");
  useEffect(() => {
    if (!liveUrlValue) { setWebPreviewUrl(null); return; }
    if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
    previewDebounceRef.current = setTimeout(() => {
      try {
        const clean = liveUrlValue.startsWith('http') ? liveUrlValue : `https://${liveUrlValue}`;
        setWebPreviewUrl(`https://image.thum.io/get/width/800/crop/600/${encodeURIComponent(clean)}`);
      } catch { setWebPreviewUrl(null); }
    }, 800);
    return () => { if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current); };
  }, [liveUrlValue]);

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
      if (pdfFile) formData.append("pdf", pdfFile);
      galleryFiles.forEach((f) => formData.append("gallery", f));
      screenshotFiles.forEach((f) => formData.append("screenshots", f));
      artworkFiles.forEach((f) => formData.append("artworkImages", f));

      if (hasGallery) formData.append("existingGallery", JSON.stringify(existingGallery));
      if (hasScreenshots) formData.append("existingScreenshots", JSON.stringify(existingScreenshots));
      if (hasArtworkImages) formData.append("existingArtworkImages", JSON.stringify(existingArtworkImages));

      if (removeThumbnail) formData.append("removeThumbnail", "true");
      if (removeBeforeImage) formData.append("removeBeforeImage", "true");

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
                  {/* Live website preview below liveUrl field */}
                  {f.key === "liveUrl" && webPreviewUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/10 relative" style={{ height: 120 }}>
                      <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white/60">
                        <Globe size={9} /> Live Preview
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={webPreviewUrl}
                        alt="Website preview"
                        className="w-full h-full object-cover object-top"
                        onError={() => setWebPreviewUrl(null)}
                      />
                    </div>
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
                    onChange={(f) => { setThumbnailFile(f); setRemoveThumbnail(false); }}
                    onRemove={() => { setThumbnailFile(null); setRemoveThumbnail(true); }}
                  />
                )}
                {hasBeforeImage && (
                  <ImagePicker
                    label="Before Image (Slider)"
                    value={item?.beforeImage}
                    onChange={(f) => { setBeforeImageFile(f); setRemoveBeforeImage(false); }}
                    onRemove={() => { setBeforeImageFile(null); setRemoveBeforeImage(true); }}
                  />
                )}
              </div>
            )}

            {/* Additional images (gallery/screenshots/artwork) */}
            {(hasGallery || hasScreenshots || hasArtworkImages) && (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[#A1A1AA]">
                  Additional Images
                </label>
                
                {/* Existing Images Preview */}
                {(existingGallery.length > 0 || existingScreenshots.length > 0 || existingArtworkImages.length > 0) && (
                  <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
                    {hasGallery && existingGallery.map((img) => (
                      <div key={img.publicId} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setExistingGallery(prev => prev.filter(i => i.publicId !== img.publicId))}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                    {hasScreenshots && existingScreenshots.map((img) => (
                      <div key={img.publicId} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="Screenshot" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setExistingScreenshots(prev => prev.filter(i => i.publicId !== img.publicId))}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                    {hasArtworkImages && existingArtworkImages.map((img) => (
                      <div key={img.publicId} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="Artwork" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setExistingArtworkImages(prev => prev.filter(i => i.publicId !== img.publicId))}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

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

            {/* PDF Upload */}
            {hasPdf && (
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                  PDF File
                  {item?.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[#8B5CF6] hover:underline font-normal"
                    >
                      (view current PDF)
                    </a>
                  )}
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center gap-3 h-10 px-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-[#8B5CF6]/50 cursor-pointer transition-all">
                    <FileText size={15} className="text-[#A1A1AA] flex-shrink-0" />
                    <span className="text-xs text-[#52525b] truncate">
                      {pdfFile ? pdfFile.name : "Click to upload PDF"}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {pdfFile && (
                    <button
                      type="button"
                      onClick={() => setPdfFile(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-[#71717A] hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
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
