import PartScreen from "@/views/traininng-module/learner/PartScreen";
import React from "react";

export default async function LearnerPartPage({ params }) {
  const { moduleId, partId } = await params;
  return (
    <div>
      <PartScreen partId={partId} moduleId={moduleId} />
    </div>
  );
}
