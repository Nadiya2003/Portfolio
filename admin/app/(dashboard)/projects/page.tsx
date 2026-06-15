"use client";

import { ContentTable } from "@/components/sections/ContentTable";
import GenericForm from "@/components/sections/GenericForm";

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "select", options: ["Frontend", "Backend", "Full Stack", "Mobile App", "Other"], required: true },
  { key: "description", label: "Description", type: "textarea", required: true },
  { key: "client", label: "Client", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "duration", label: "Duration", type: "text" },
  { key: "liveUrl", label: "Live URL", type: "url" },
  { key: "githubUrl", label: "GitHub URL", type: "url" },
  { key: "status", label: "Status", type: "select", options: ["published", "draft", "archived"], required: true },
] as const;

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl">
      <ContentTable
        endpoint="projects"
        title="Portfolio Projects"
        fields={[{ key: "category", label: "Category" }]}
        FormComponent={(props) => <GenericForm {...props} endpoint="projects" fields={fields as any} hasThumbnail hasBeforeImage hasTags hasGallery />}
      />
    </div>
  );
}

