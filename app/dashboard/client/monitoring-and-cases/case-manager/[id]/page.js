import CaseDetails from "@/views/monitoring-and-cases/case-manager/details/CaseDetails";

export const metadata = {
  title: "Case Details",
};

export default function CaseDetailsPage({ params }) {
  return (
    <div className="p-4 md:p-6">
      <CaseDetails caseId={params.id} />
    </div>
  );
}
