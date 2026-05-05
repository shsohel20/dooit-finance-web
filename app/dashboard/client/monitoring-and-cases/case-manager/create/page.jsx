import { redirect } from "next/navigation";

// The create form lives in a left-side Sheet inside CaseManagerDashboard.
// This route exists only as a redirect for any old links.
export default function CreateCasePage() {
  redirect("/dashboard/client/monitoring-and-cases/case-manager");
}
