import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileSearch } from "lucide-react";

export function PublicRecordsPanel({ items }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <FileSearch className="size-8 mb-2 opacity-40" />
        <p className="text-sm">No public records found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/20"
        >
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-[10px] bg-secondary">
              {item.type}
            </Badge>
            <span className="text-[10px] font-mono text-muted-foreground">{item.jurisdiction}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed flex-1">{item.summary}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{item.source}</span>
              <span>&middot;</span>
              <span className="font-mono">{item.date}</span>
            </div>
            {item.url !== "#" && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink className="size-3" />
                Source
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
