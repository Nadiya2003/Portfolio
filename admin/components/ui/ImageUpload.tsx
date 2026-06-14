"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (file: File) => void;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // MB
  className?: string;
}

export default function ImageUpload({ label = "Upload Image", value, onChange, onRemove, maxSize = 10, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
    setIsDragging(false);
  }, [onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"] },
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onRemove?.();
  };

  if (preview) {
    return (
      <div className={cn("relative group rounded-xl overflow-hidden border border-white/10", className)} style={{ aspectRatio: "16/9" }}>
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <button className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur text-white text-xs hover:bg-white/20 transition-colors">
              Replace
            </button>
          </div>
          {onRemove && (
            <button onClick={handleRemove} className="w-7 h-7 rounded-lg bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors">
              <X size={13} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
        isDragging ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-white/10 hover:border-white/20 hover:bg-white/3",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isDragging ? "bg-[#8B5CF6]/20" : "bg-white/5")}>
        <Upload size={20} className={isDragging ? "text-[#8B5CF6]" : "text-[#52525b]"} />
      </div>
      <div className="text-center">
        <p className="text-sm text-[#A1A1AA]">{label}</p>
        <p className="text-xs text-[#52525b] mt-1">Drag & drop or click to browse · Max {maxSize}MB</p>
      </div>
    </div>
  );
}
