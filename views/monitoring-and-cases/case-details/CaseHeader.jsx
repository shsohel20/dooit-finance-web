import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export function CaseHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Admin Core
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-muted-foreground">
                C-2023-001
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Created: 2023-05-10
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Sarah Johnson
              </span>
            </div>
          </div>
          <Badge
            variant="destructive"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive border-destructive/20"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Risk Rating: High
          </Badge>
        </div>
      </div>
    </header>
  );
}
