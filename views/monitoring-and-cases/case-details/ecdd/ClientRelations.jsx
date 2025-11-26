import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar } from "lucide-react";

export function ClientRelations({ relations }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4" />
          Client Relations
          <Badge variant="secondary" className="ml-auto">
            {relations?.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relations?.map((relation) => (
            <div
              key={relation._id}
              className="rounded-lg border bg-card p-3 space-y-2 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        relation?.type === "individual"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {relation?.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {relation?.source}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground truncate">
                    Client: {relation?.client}
                  </p>

                  {relation.branch && (
                    <p className="text-xs text-muted-foreground truncate">
                      Branch: {relation?.branch}
                    </p>
                  )}
                </div>

                {relation?.active && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-accent/10 shrink-0"
                  >
                    Active
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Registered: {formatDate(relation?.registeredAt)}</span>
              </div>

              {relation?.notes && (
                <p className="text-xs text-muted-foreground italic">
                  {relation?.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
