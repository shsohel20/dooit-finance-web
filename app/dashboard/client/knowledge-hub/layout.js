import { ModuleProvider } from "@/contexts/module-context";
import React from "react";

export default function KnowledgeHubLayout({ children }) {
  return (
    <div>
      <ModuleProvider>{children}</ModuleProvider>
    </div>
  );
}
