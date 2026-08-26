"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CircleAlert,
  FileSearch,
  FileText,
  Gavel,
  Globe2,
  Lightbulb,
  ListChecks,
  Route,
  ScrollText,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { parseNarrativeSections, renderInline } from "./narrativeMarkdown";

const SECTION_ICON_RULES = [
  { match: /executive summary/i, icon: FileText, wrap: "bg-primary/10", tint: "text-primary" },
  { match: /transaction overview/i, icon: ScrollText, wrap: "bg-sky-50", tint: "text-sky-600" },
  { match: /product analysis/i, icon: ListChecks, wrap: "bg-violet-50", tint: "text-violet-600" },
  { match: /market research/i, icon: Globe2, wrap: "bg-cyan-50", tint: "text-cyan-600" },
  { match: /risk indicator/i, icon: ShieldAlert, wrap: "bg-red-50", tint: "text-red-600" },
  { match: /price analysis/i, icon: TrendingUp, wrap: "bg-amber-50", tint: "text-amber-600" },
  { match: /trade route/i, icon: Route, wrap: "bg-indigo-50", tint: "text-indigo-600" },
  {
    match: /document consistency/i,
    icon: FileSearch,
    wrap: "bg-slate-100",
    tint: "text-slate-600",
  },
  { match: /limitation/i, icon: CircleAlert, wrap: "bg-orange-50", tint: "text-orange-600" },
  { match: /recommendation/i, icon: Lightbulb, wrap: "bg-yellow-50", tint: "text-yellow-700" },
  { match: /conclusion/i, icon: Gavel, wrap: "bg-emerald-50", tint: "text-emerald-600" },
];

const getSectionIcon = (title) =>
  SECTION_ICON_RULES.find((rule) => rule.match.test(title || "")) || {
    icon: BookOpen,
    wrap: "bg-muted",
    tint: "text-primary",
  };

function MarkdownBlock({ block, keyPrefix }) {
  if (block.type === "p") {
    return (
      <p className="text-sm leading-7 text-muted-foreground">
        {renderInline(block.text, keyPrefix)}
      </p>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="list-disc space-y-1.5 pl-5">
        {block.items.map((item, i) => (
          <li key={i} className="text-sm leading-6 text-muted-foreground marker:text-primary/60">
            {renderInline(item, `${keyPrefix}-${i}`)}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "ol") {
    return (
      <ol className="list-decimal space-y-1.5 pl-5">
        {block.items.map((item, i) => (
          <li key={i} className="text-sm leading-6 text-muted-foreground marker:font-semibold">
            {renderInline(item, `${keyPrefix}-${i}`)}
          </li>
        ))}
      </ol>
    );
  }
  return null;
}

// Renders `narrative_report`'s "## " sections as a stack of cards, each with
// an icon keyed off the section title.
export default function NarrativeReportTab({ markdown }) {
  const sections = useMemo(() => parseNarrativeSections(markdown), [markdown]);

  if (!sections.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No narrative report available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, idx) => {
        if (!section.title) {
          return (
            <div key={`intro-${idx}`} className="space-y-3">
              {section.blocks.map((block, bIdx) => (
                <MarkdownBlock key={bIdx} block={block} keyPrefix={`intro-${idx}-${bIdx}`} />
              ))}
            </div>
          );
        }

        const { icon: Icon, wrap, tint } = getSectionIcon(section.title);
        const isExecutiveSummary = /executive summary/i.test(section.title);

        return (
          <div
            key={`${section.title}-${idx}`}
            className={cn(
              "overflow-hidden rounded-xl border border-border ",
              isExecutiveSummary && "border-primary/20 ",
            )}
          >
            <div className="flex items-center gap-2.5 border-b border-border/60 bg-muted/30 px-4 py-3">
              <span
                className={cn(
                  "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/50",
                  wrap,
                )}
              >
                <Icon aria-hidden="true" className={cn("size-3.5", tint)} />
              </span>
              <h4 className="text-sm font-semibold text-heading">{section.title}</h4>
            </div>
            <div className="space-y-3 px-4 py-4">
              {section.blocks.map((block, bIdx) => (
                <MarkdownBlock key={bIdx} block={block} keyPrefix={`${idx}-${bIdx}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
