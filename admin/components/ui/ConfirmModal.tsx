"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import Portal from "@/components/ui/Portal";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export default function ConfirmModal({
  isOpen, title, message, confirmLabel = "Confirm",
  onConfirm, onCancel, loading, danger = true,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative glass rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <button onClick={onCancel} className="absolute top-4 right-4 text-[#71717A] hover:text-white transition-colors">
                <X size={16} />
              </button>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${danger ? "bg-red-500/10" : "bg-yellow-500/10"}`}>
                <AlertTriangle size={22} className={danger ? "text-red-400" : "text-yellow-400"} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-[#A1A1AA] mb-6">{message}</p>
              <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 text-sm text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${danger ? "bg-red-500 hover:bg-red-600" : "gradient-purple"}`}
                >
                  {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
