"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, Star, StarOff } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Portal from "@/components/ui/Portal";
import { formatDate, truncate } from "@/lib/utils";

interface ContentItem {
  _id: string;
  title: string;
  category?: string;
  type?: string;
  status: string;
  isFeatured?: boolean;
  thumbnail?: string;
  createdAt: string;
}

interface ContentTableProps {
  endpoint: string;
  title: string;
  categories?: string[];
  fields: { key: string; label: string }[];
  FormComponent: React.ComponentType<{ item?: ContentItem; onClose: () => void; onSaved: () => void }>;
}

export function ContentTable({ endpoint, categories, fields, FormComponent }: ContentTableProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editItem, setEditItem] = useState<ContentItem | null | "new">(null);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: "50" };
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;
      const res = await api.get(`/${endpoint}`, { params });
      setItems(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load data");
    } finally { setLoading(false); }
  }, [endpoint, search, category, status]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/${endpoint}/${deleteId}`);
      setItems((p) => p.filter((i) => i._id !== deleteId));
      toast.success("Deleted successfully");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete item");
    } finally { setDeleting(false); }
  };

  const handleToggleStatus = async (item: ContentItem) => {
    try {
      await api.patch(`/${endpoint}/${item._id}/toggle-status`);
      setItems((p) => p.map((i) => i._id === item._id ? { ...i, status: i.status === "published" ? "draft" : "published" } : i));
      toast.success("Status updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="w-full h-9 pl-8 pr-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all" />
        </div>
        {categories && (
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-[#A1A1AA] outline-none focus:border-[#8B5CF6]/50 transition-all">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-[#A1A1AA] outline-none focus:border-[#8B5CF6]/50 transition-all">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <span className="text-xs text-[#52525b] ml-auto">{total} items</span>
        <button onClick={() => setEditItem("new")}
          className="flex items-center gap-2 h-9 px-4 rounded-xl gradient-purple text-white text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all">
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#52525b]">
            <p className="text-sm">No items found</p>
            <button onClick={() => setEditItem("new")} className="mt-3 text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">+ Add your first item</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#52525b] uppercase tracking-wider">Item</th>
                  {fields.map((f) => <th key={f.key} className="text-left px-4 py-3 text-xs font-semibold text-[#52525b] uppercase tracking-wider hidden md:table-cell">{f.label}</th>)}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#52525b] uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#52525b] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <motion.tr key={item._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="border-b hover:bg-white/3 transition-colors" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.thumbnail && (
                          <img src={item.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-white/5" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{truncate(item.title, 40)}</p>
                          <p className="text-xs text-[#71717A]">{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    {fields.map((f) => (
                      <td key={f.key} className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-[#A1A1AA]">{(item as any)[f.key] as string || "—"}</span>
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${item.status === "published" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {item.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditItem(item)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#71717A] hover:text-white transition-colors">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => setDeleteId(item._id)} className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal — rendered in portal so it escapes overflow-auto */}
      {editItem && (
        <Portal>
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setEditItem(null)}
            />
            <div
              className="relative z-10 w-full max-w-2xl glass rounded-2xl shadow-2xl flex flex-col"
              style={{ maxHeight: "calc(100vh - 80px)", minHeight: "400px" }}
            >
              <FormComponent
                item={editItem === "new" ? undefined : editItem}
                onClose={() => setEditItem(null)}
                onSaved={() => { load(); setEditItem(null); }}
              />
            </div>
          </div>
        </Portal>
      )}

      <ConfirmModal isOpen={!!deleteId} title="Delete Item" message="This cannot be undone."
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </>
  );
}
