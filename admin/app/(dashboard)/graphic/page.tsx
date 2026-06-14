"use client";

import { ContentTable } from "@/components/sections/ContentTable";
import GenericForm from "@/components/sections/GenericForm";

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "select", options: ["Logo Design", "Flyer Design", "Banner Design", "Branding", "Other"], required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "clientName", label: "Client Name", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["published", "draft", "archived"], required: true },
] as const;

export default function GraphicDesignPage() {
  return (
    <div className="max-w-7xl">
      <ContentTable
        endpoint="graphic"
        title="Graphic Designs"
        categories={["Logo Design", "Flyer Design", "Banner Design", "Branding", "Other"]}
        fields={[{ key: "category", label: "Category" }]}
        FormComponent={(props) => <GenericForm {...props} endpoint="graphic" fields={fields as any} hasThumbnail hasBeforeImage hasTags hasGallery />}
      />
    </div>
  );
}

