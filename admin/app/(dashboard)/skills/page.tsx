"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Zap, BarChart2, Circle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

// ─── Styled primitives ────────────────────────────────────────────────────────

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={`w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 outline-none focus:border-[#8B5CF6]/60 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all ${className}`}
    />
  )
);
Input.displayName = "Input";

// ─── Tool row inside a category ────────────────────────────────────────────────
function ToolRow({
  catIndex,
  toolIndex,
  register,
  remove,
}: {
  catIndex: number;
  toolIndex: number;
  register: any;
  remove: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <GripVertical size={14} className="text-white/20 flex-shrink-0" />
      <Input
        {...register(`categories.${catIndex}.tools.${toolIndex}.name`)}
        placeholder="Tool / Skill name (e.g. Photoshop)"
        className="flex-1"
      />
      <div className="relative w-24 flex-shrink-0">
        <Input
          {...register(`categories.${catIndex}.tools.${toolIndex}.level`)}
          type="number"
          min={0}
          max={100}
          placeholder="0-100"
          className="w-full pr-8"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">%</span>
      </div>
      <button
        type="button"
        onClick={() => remove(toolIndex)}
        className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Category card ─────────────────────────────────────────────────────────────
function CategoryCard({
  catIndex,
  register,
  control,
  remove: removeCategory,
}: {
  catIndex: number;
  register: any;
  control: any;
  remove: (i: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const { fields: toolFields, append: appendTool, remove: removeTool } = useFieldArray({
    control,
    name: `categories.${catIndex}.tools`,
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <GripVertical size={15} className="text-white/20 flex-shrink-0" />

        <Input
          {...register(`categories.${catIndex}.categoryName`)}
          placeholder="Category Name (e.g. Graphic Design)"
          className="flex-1 font-semibold"
        />

        {/* Display style toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
          <label className="relative">
            <input
              type="radio"
              value="rings"
              {...register(`categories.${catIndex}.displayStyle`)}
              className="sr-only peer"
            />
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 peer-checked:text-white peer-checked:bg-[#8B5CF6]/30 cursor-pointer transition-all">
              <Circle size={11} />
              Rings
            </span>
          </label>
          <label className="relative">
            <input
              type="radio"
              value="bars"
              {...register(`categories.${catIndex}.displayStyle`)}
              className="sr-only peer"
            />
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 peer-checked:text-white peer-checked:bg-[#8B5CF6]/30 cursor-pointer transition-all">
              <BarChart2 size={11} />
              Bars
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-white/40 hover:text-white transition-colors flex-shrink-0"
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <button
          type="button"
          onClick={() => removeCategory(catIndex)}
          className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Tools list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-2 border-t border-white/5 pt-4">
              {/* Column headers */}
              {toolFields.length > 0 && (
                <div className="flex items-center gap-3 px-1 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                  <div className="w-[14px]" />
                  <div className="flex-1">Tool / Skill Name</div>
                  <div className="w-24">Proficiency</div>
                  <div className="w-[14px]" />
                </div>
              )}

              <div className="space-y-2">
                {toolFields.map((field, ti) => (
                  <ToolRow
                    key={field.id}
                    catIndex={catIndex}
                    toolIndex={ti}
                    register={register}
                    remove={removeTool}
                  />
                ))}
              </div>

              {toolFields.length === 0 && (
                <p className="text-center text-sm text-white/20 py-4">
                  No tools yet — add your first one below.
                </p>
              )}

              <button
                type="button"
                onClick={() => appendTool({ name: "", level: 80 })}
                className="mt-3 flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
              >
                <Plus size={13} /> Add Tool
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function SkillsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: { categories: [] as any[] },
  });

  const { fields: catFields, append: appendCat, remove: removeCat } = useFieldArray({
    control,
    name: "categories",
  });

  useEffect(() => {
    api
      .get("/skills")
      .then((res) => {
        const d = res.data.data;
        reset({ categories: Array.isArray(d.categories) ? d.categories : [] });
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.put("/skills", { categories: data.categories });
      toast.success("Skills saved!");
    } catch {
      toast.error("Failed to save skills");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () =>
    appendCat({ categoryName: "", displayStyle: "rings", tools: [] });

  if (loading)
    return (
      <div className="max-w-4xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24 rounded-2xl" />
        ))}
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-white/40 mt-0.5">
            Organise your skills into categories. Choose ring or bar display style per category.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
          >
            <Plus size={14} /> Add Category
          </button>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 h-10 px-5 rounded-xl gradient-purple text-white text-sm font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-60"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Save Changes
          </motion.button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 px-1">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Circle size={12} className="text-[#8B5CF6]" />
          <span>Rings — great for 4 or fewer tools (circular progress)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <BarChart2 size={12} className="text-[#8B5CF6]" />
          <span>Bars — best for 5+ tools (horizontal progress bars)</span>
        </div>
      </div>

      {/* Category cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {catFields.map((field, ci) => (
            <CategoryCard
              key={field.id}
              catIndex={ci}
              register={register}
              control={control}
              remove={removeCat}
            />
          ))}
        </AnimatePresence>

        {catFields.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/10"
          >
            <Zap size={32} className="text-white/20 mb-3" />
            <p className="text-white/40 text-sm">No skill categories yet</p>
            <button
              type="button"
              onClick={addCategory}
              className="mt-4 flex items-center gap-2 h-9 px-4 rounded-xl bg-[#8B5CF6]/20 text-[#A78BFA] text-sm hover:bg-[#8B5CF6]/30 transition-colors"
            >
              <Plus size={14} /> Add your first category
            </button>
          </motion.div>
        )}
      </div>
    </form>
  );
}
