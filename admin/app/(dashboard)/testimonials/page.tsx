"use client";

import { ContentTable } from "@/components/sections/ContentTable";
import GenericForm from "@/components/sections/GenericForm";

const fields = [
  { key: "clientName", label: "Client Name", type: "text", required: true },
  { key: "company", label: "Company", type: "text" },
  { key: "position", label: "Position", type: "text" },
  { key: "review", label: "Review", type: "textarea", required: true },
  { key: "rating", label: "Rating (1-5)", type: "number", required: true },
  { key: "status", label: "Status", type: "select", options: ["published", "draft", "archived"], required: true },
] as const;

export default function TestimonialsPage() {
  return (
    <div className="max-w-7xl">
      <ContentTable
        endpoint="testimonials"
        title="Testimonials"
        fields={[{ key: "clientName", label: "Client" }, { key: "company", label: "Company" }]}
        FormComponent={(props) => <GenericForm {...props} endpoint="testimonials" fields={fields as any} hasThumbnail />}
      />
    </div>
  );
}
