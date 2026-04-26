import CaseManagerDashboard from "@/views/monitoring-and-cases/case-manager/CaseManagerDashboard";

export const metadata = {
  title: "Case Manager",
};

export default function CaseManagerPage() {
  return (
    <div className="p-4 md:p-6">
      <CaseManagerDashboard />
    </div>
  );
}
