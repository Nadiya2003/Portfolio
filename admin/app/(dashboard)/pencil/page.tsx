"use client";

import { ContentTable } from "@/components/sections/ContentTable";
import GenericForm from "@/components/sections/GenericForm";

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "select", options: ["Portrait", "Landscape", "Abstract", "Sketch", "Other"], required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: ["published", "draft", "archived"], required: true },
] as const;

export default function PencilPage() {
  return (
    <div className="max-w-7xl">
      <ContentTable
        endpoint="pencil"
        title="Pencil Arts"
        categories={["Portrait", "Landscape", "Abstract", "Sketch", "Other"]}
        fields={[{ key: "category", label: "Category" }]}
        FormComponent={(props) => <GenericForm {...props} endpoint="pencil" fields={fields as any} hasThumbnail hasBeforeImage hasTags hasArtworkImages />}
      />
    </div>
  );
}

