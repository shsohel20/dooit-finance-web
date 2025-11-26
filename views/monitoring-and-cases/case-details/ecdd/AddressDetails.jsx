import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function AddressDetails({ title, address }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <address className="not-italic text-sm space-y-1">
          <div>{address?.address}</div>
          <div>{address?.suburb || "N/A"}</div>
          <div>
            {address?.state || "N/A"} {address?.postcode || "N/A"}
          </div>
          <div className="font-medium">{address?.country || "N/A"}</div>
        </address>
      </CardContent>
    </Card>
  );
}
