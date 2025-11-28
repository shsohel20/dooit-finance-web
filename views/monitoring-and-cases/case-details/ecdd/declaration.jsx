import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck, CheckCircle2 } from "lucide-react";

export function Declaration({ customer }) {
  const declaration = customer?.customer?.declaration;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileCheck className="h-4 w-4" />
          Declaration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {declaration?.declarations_accepted && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Declarations Accepted</span>
          </div>
        )}

        <div className="space-y-2 border-t pt-4">
          <div className="space-y-1">
            <dt className="text-xs font-medium text-muted-foreground">
              Signatory Name
            </dt>
            <dd className="text-sm font-medium">
              {declaration?.signatory_name}
            </dd>
          </div>

          <div className="space-y-1">
            <dt className="text-xs font-medium text-muted-foreground">
              Date Signed
            </dt>
            <dd className="text-sm">{formatDate(declaration?.date)}</dd>
          </div>

          {declaration?.signature && (
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">
                Signature
              </dt>
              <dd className="text-sm">
                <Badge variant="outline" className="font-normal">
                  Verified
                </Badge>
              </dd>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
