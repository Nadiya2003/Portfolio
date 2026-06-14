"use client";

import { ContentTable } from "@/components/sections/ContentTable";
import GenericForm from "@/components/sections/GenericForm";

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "select", options: ["Web App", "Mobile App", "Dashboard", "Landing Page", "Other"], required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "designProcess", label: "Design Process", type: "textarea" },
  { key: "figmaLink", label: "Figma Link", type: "url" },
  { key: "prototypeLink", label: "Prototype Link", type: "url" },
  { key: "status", label: "Status", type: "select", options: ["published", "draft", "archived"], required: true },
] as const;

export default function UIUXPage() {
  return (
    <div className="max-w-7xl">
      <ContentTable
        endpoint="uiux"
        title="UI/UX Designs"
        categories={["Web App", "Mobile App", "Dashboard", "Landing Page", "Other"]}
        fields={[{ key: "category", label: "Category" }]}
        FormComponent={(props) => <GenericForm {...props} endpoint="uiux" fields={fields as any} hasThumbnail hasBeforeImage hasTags hasScreenshots />}
      />
    </div>
  );
}

