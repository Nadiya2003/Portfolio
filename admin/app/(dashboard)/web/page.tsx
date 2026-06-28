"use client";

import { ContentTable } from "@/components/sections/ContentTable";
import GenericForm from "@/components/sections/GenericForm";

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "type", label: "Project Type", type: "select", options: ["Frontend", "Backend", "Full Stack", "E-Commerce", "Portfolio", "Landing Page", "Web App", "Other"], required: true },
  { key: "description", label: "Description", type: "textarea" },
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
        categories={["Frontend", "Backend", "Full Stack", "E-Commerce", "Portfolio", "Landing Page", "Web App", "Other"]}
        fields={[{ key: "type", label: "Type" }]}
        FormComponent={(props) => <GenericForm {...props} endpoint="web" fields={fields as any} hasThumbnail hasBeforeImage hasTags hasScreenshots />}
      />
    </div>
  );
}
