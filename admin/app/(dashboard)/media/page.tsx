"use client";

import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, Image as ImageIcon, File, Video, Copy, Search, Check } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { formatFileSize, formatDate } from "@/lib/utils";

interface Media {
  _id: string;
  name: string;
  url: string;
  resourceType: string;
  format: string;
  size: number;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.get("/media", { params: { search, limit: 100 } });
      setFiles(res.data.data || []);
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      acceptedFiles.forEach((f) => formData.append("files", f));
      formData.append("folder", "media-library");
      await api.post("/media/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`${acceptedFiles.length} files uploaded`);
      load();
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/media/${deleteId}`);
      setFiles((prev) => prev.filter((f) => f._id !== deleteId));
      toast.success("File deleted");
    } catch { toast.error("Delete failed"); }
    finally { setDeleteId(null); }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media by name..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#8B5CF6]/50 transition-all" />
        </div>
      </div>

      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"}`}>
        <input {...getInputProps()} />
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Upload size={24} className={isDragActive ? "text-[#8B5CF6]" : "text-[#71717A]"} />
        </div>
        <p className="text-sm text-white font-medium mb-1">Click or drag files to upload</p>
        <p className="text-xs text-[#71717A]">Supports images, videos, and PDFs</p>
        {uploading && <div className="mt-4 text-xs text-[#8B5CF6] flex items-center gap-2"><div className="w-3 h-3 border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6] rounded-full animate-spin" /> Uploading...</div>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading ? (
          [...Array(12)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)
        ) : files.length === 0 ? (
          <div className="col-span-full py-20 text-center text-[#52525b]">No media found</div>
        ) : (
          files.map((file, i) => (
            <motion.div key={file._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }} className="group relative glass rounded-2xl overflow-hidden aspect-square">
              {file.resourceType === "image" ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              ) : file.resourceType === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]"><Video size={32} className="text-[#3f3f46]" /></div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]"><File size={32} className="text-[#3f3f46]" /></div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-1">
                  <button onClick={() => handleCopy(file.url)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
                    {copiedUrl === file.url ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                  <button onClick={() => setDeleteId(file._id)} className="w-7 h-7 rounded-lg bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div>
                  <p className="text-[10px] text-white font-medium truncate">{file.name}</p>
                  <p className="text-[9px] text-[#A1A1AA]">{formatFileSize(file.size)} • {file.format.toUpperCase()}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Delete File" message="This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
