import CaseDetails from "@/views/monitoring-and-cases/case-manager/details/CaseDetails";

export const metadata = {
  title: "Case Details",
};

export default function CaseDetailsPage({ params }) {
  return (
    <div className="">
      <CaseDetails caseId={params.id} />
    </div>
  );
}
