import { Badge } from "@/components/ui/badge";
import { ExternalLink, Newspaper } from "lucide-react";

const severityStyles = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

function RelevanceDots({ score }) {
  const filled = Math.round(score / 20);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Relevance ${score}%`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`size-1.5 rounded-full ${i < filled ? "bg-primary" : "bg-border"}`}
        />
      ))}
      <span className="ml-1 text-[10px] font-mono text-muted-foreground">{score}%</span>
    </div>
  );
}

export function AdverseMediaPanel({ items }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Newspaper className="size-8 mb-2 opacity-40" />
        <p className="text-sm">No adverse media results found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/20"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant="outline" className={severityStyles[item.severity]}>
                  {item.severity.toUpperCase()}
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">{item.source}</span>
                <span className="text-xs text-muted-foreground">{item.publishDate}</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground leading-snug mb-1.5">
                {item.headline}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <RelevanceDots score={item.relevanceScore} />
                <div className="flex flex-wrap gap-1">
                  {item.matchedTerms.map((term) => (
                    <span
                      key={term}
                      className="rounded bg-primary/5 px-1.5 py-0.5 text-[10px] font-mono text-primary border border-primary/10"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md border border-border p-2 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              aria-label={`Open source: ${item.headline}`}
            >
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
