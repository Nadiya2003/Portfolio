"use client";

import { ContentTable } from "@/components/sections/ContentTable";
import GenericForm from "@/components/sections/GenericForm";

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "select", options: ["E-commerce", "Corporate", "Portfolio", "Blog", "Other"], required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "client", label: "Client", type: "text" },
  { key: "liveUrl", label: "Live URL", type: "url" },
  { key: "githubUrl", label: "GitHub URL", type: "url" },
  { key: "status", label: "Status", type: "select", options: ["published", "draft", "archived"], required: true },
] as const;

export default function WebPage() {
  return (
    <div className="max-w-7xl">
      <ContentTable
        endpoint="web"
        title="Web Development Projects"
        categories={["E-commerce", "Corporate", "Portfolio", "Blog", "Other"]}
        fields={[{ key: "category", label: "Category" }]}
        FormComponent={(props) => <GenericForm {...props} endpoint="web" fields={fields as any} hasThumbnail hasBeforeImage hasTags hasScreenshots />}
      />
    </div>
  );
}

