import QuizScreen from "@/views/traininng-module/learner/QuizScreen";
import React from "react";
export default async function LearnerQuizPage({ params }) {
  const { moduleId, partId } = await params;
  return (
    <div>
      <QuizScreen partId={partId} moduleId={moduleId} />
    </div>
  );
}
