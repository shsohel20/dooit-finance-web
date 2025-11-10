import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

const LabelDetails = ({ label = "", value = "", loading = false }) => {
  return (
    <div className="space-y-2">
      <Label className={"text-muted-foreground"}>{label}</Label>
      <p className="font-bold text-gray-900">
        {loading ? <Skeleton className="w-full h-4" /> : value ? value : "-"}
      </p>
    </div>
  );
};
export default LabelDetails;
