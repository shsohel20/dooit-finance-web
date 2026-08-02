import CaseDetails from "@/views/monitoring-and-cases/case-manager/details/CaseDetails";

export const metadata = {
  title: "Case Details",
};

export default async function CaseDetailsPage({ params }) {
  const { id } = await params;
  return (
    <div className="p-4 md:p-6">
      <CaseDetails caseId={id} />
    </div>
  );
}
