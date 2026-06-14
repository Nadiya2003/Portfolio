"use client";

import { ContentTable } from "@/components/sections/ContentTable";
import GenericForm from "@/components/sections/GenericForm";

const fields = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "select", options: ["Promo", "Vlog", "Motion Graphics", "Short Film", "Other"], required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "client", label: "Client", type: "text" },
  { key: "youtubeUrl", label: "YouTube/Vimeo URL", type: "url" },
  { key: "status", label: "Status", type: "select", options: ["published", "draft", "archived"], required: true },
] as const;

export default function VideoPage() {
  return (
    <div className="max-w-7xl">
      <ContentTable
        endpoint="video"
        title="Video Editing Projects"
        categories={["Promo", "Vlog", "Motion Graphics", "Short Film", "Other"]}
        fields={[{ key: "category", label: "Category" }]}
        FormComponent={(props) => <GenericForm {...props} endpoint="video" fields={fields as any} hasThumbnail hasBeforeImage hasTags hasVideo />}
      />
    </div>
  );
}

