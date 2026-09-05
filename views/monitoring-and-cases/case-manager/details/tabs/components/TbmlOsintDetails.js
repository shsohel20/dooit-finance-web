"use client";

import { getTBMLosintReportDetails } from "@/app/dashboard/client/onboarding/customer-queue/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  CircleAlert,
  Coins,
  FileSearch,
  FileText,
  Flag,
  Gavel,
  Globe2,
  Hash,
  Lightbulb,
  ListChecks,
  Loader2,
  MapPin,
  Route,
  ScrollText,
  SearchX,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

// ── Lightweight markdown (subset) → JSX renderer for narrative_report ────────
// Supports the shape the OSINT service emits: "## " section headers,
// "**bold**" inline emphasis, "* "/"- " bullets and "1. " ordered lists.

function renderInline(text, keyPrefix) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part !== "")
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <React.Fragment key={`${keyPrefix}-t${i}`}>{part}</React.Fragment>
      ),
    );
}

function parseMarkdownBlocks(text) {
  const blocks = [];
  let currentList = null;
  let paragraphLines = [];

  const flushParagraph = () => {
    if (paragraphLines.length) {
      blocks.push({ type: "p", text: paragraphLines.join(" ") });
      paragraphLines = [];
    }
  };
  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  String(text || "")
    .split("\n")
    .forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph();
        flushList();
        return;
      }
      const bulletMatch = line.match(/^[*-]\s+(.*)/);
      const numberedMatch = line.match(/^\d+\.\s+(.*)/);
      if (bulletMatch) {
        flushParagraph();
        if (!currentList || currentList.type !== "ul") {
          flushList();
          currentList = { type: "ul", items: [] };
        }
        currentList.items.push(bulletMatch[1]);
      } else if (numberedMatch) {
        flushParagraph();
        if (!currentList || currentList.type !== "ol") {
          flushList();
          currentList = { type: "ol", items: [] };
        }
        currentList.items.push(numberedMatch[1]);
      } else {
        flushList();
        paragraphLines.push(line);
      }
    });
  flushParagraph();
  flushList();
  return blocks;
}

function parseNarrativeSections(markdown) {
  if (!markdown) return [];
  const matches = [...String(markdown).matchAll(/^##\s+(.*)$/gm)];
  if (matches.length === 0) {
    return [{ title: null, blocks: parseMarkdownBlocks(markdown) }];
  }
  const sections = [];
  if (matches[0].index > 0) {
    const intro = markdown.slice(0, matches[0].index).trim();
    if (intro) sections.push({ title: null, blocks: parseMarkdownBlocks(intro) });
  }
  matches.forEach((m, idx) => {
    const contentStart = m.index + m[0].length;
    const contentEnd = idx + 1 < matches.length ? matches[idx + 1].index : markdown.length;
    sections.push({
      title: m[1].trim(),
      blocks: parseMarkdownBlocks(markdown.slice(contentStart, contentEnd).trim()),
    });
  });
  return sections;
}

const SECTION_ICON_RULES = [
  { match: /executive summary/i, icon: FileText, wrap: "bg-primary/10", tint: "text-primary" },
  { match: /transaction overview/i, icon: ScrollText, wrap: "bg-sky-50", tint: "text-sky-600" },
  { match: /product analysis/i, icon: ListChecks, wrap: "bg-violet-50", tint: "text-violet-600" },
  { match: /market research/i, icon: Globe2, wrap: "bg-cyan-50", tint: "text-cyan-600" },
  { match: /risk indicator/i, icon: ShieldAlert, wrap: "bg-red-50", tint: "text-red-600" },
  { match: /price analysis/i, icon: TrendingUp, wrap: "bg-amber-50", tint: "text-amber-600" },
  { match: /trade route/i, icon: Route, wrap: "bg-indigo-50", tint: "text-indigo-600" },
  { match: /document consistency/i, icon: FileSearch, wrap: "bg-slate-100", tint: "text-slate-600" },
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
    return <p className="text-sm leading-7 text-slate-600">{renderInline(block.text, keyPrefix)}</p>;
  }
  if (block.type === "ul") {
    return (
      <ul className="list-disc space-y-1.5 pl-5">
        {block.items.map((item, i) => (
          <li key={i} className="text-sm leading-6 text-slate-600 marker:text-primary/60">
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
          <li key={i} className="text-sm leading-6 text-slate-600 marker:font-semibold marker:text-slate-400">
            {renderInline(item, `${keyPrefix}-${i}`)}
          </li>
        ))}
      </ol>
    );
  }
  return null;
}

function NarrativeReport({ markdown }) {
  const sections = useMemo(() => parseNarrativeSections(markdown), [markdown]);

  if (!sections.length) {
    return <EmptyState icon={ScrollText} title="No narrative report available" />;
  }

  return (
    <div className="space-y-4">
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
          <Card
            key={`${section.title}-${idx}`}
            className={cn(
              "gap-0 overflow-hidden border-border/70 py-0 shadow-sm ring-1 ring-black/[0.03]",
              isExecutiveSummary && "border-primary/20 ring-primary/10",
            )}
          >
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-muted/40 to-transparent px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/50 shadow-sm",
                    wrap,
                  )}
                >
                  <Icon aria-hidden="true" className={cn("size-3.5", tint)} />
                </span>
                <h4 className="text-sm font-semibold tracking-tight text-slate-800">{section.title}</h4>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              {section.blocks.map((block, bIdx) => (
                <MarkdownBlock key={bIdx} block={block} keyPrefix={`${idx}-${bIdx}`} />
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── osint_results ─────────────────────────────────────────────────────────

function availabilityStyles(availability) {
  const a = String(availability || "").toUpperCase();
  if (a === "SUFFICIENT") return { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Sufficient Data" };
  if (a === "LIMITED") return { badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Limited Data" };
  if (!a) return { badge: "bg-slate-100 text-slate-600 border-slate-200", label: "Unknown" };
  return {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    label: a.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

function OsintResultCard({ result }) {
  const [expanded, setExpanded] = useState(false);
  const availability = availabilityStyles(result.data_availability);
  const hasFindings = Boolean(result.aggregated_findings);
  const findingsAreLong = hasFindings && result.aggregated_findings.length > 260;
  const hasPriceRange = Boolean(
    result.reference_price_low || result.reference_price_high || result.reference_price_mid,
  );
  const hasMeta =
    result.typical_origin_countries?.length > 0 ||
    result.typical_trade_routes?.length > 0 ||
    result.hs_codes_observed?.length > 0;

  return (
    <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm ring-1 ring-black/[0.03]">
      <CardHeader className="border-b border-border/60 bg-muted/20 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-cyan-50 shadow-sm">
              <Coins aria-hidden="true" className="size-3.5 text-cyan-600" />
            </span>
            <h4
              className="text-sm leading-snug font-semibold text-slate-800"
              title={result.product_description}
            >
              {result.product_description || result.product_key}
            </h4>
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center gap-1.5">
            <Badge className={cn("border font-medium", availability.badge)}>{availability.label}</Badge>
            {result.sanctioned_jurisdiction_flag && (
              <Badge className="border border-red-200 bg-red-50 font-medium text-red-700">
                <Flag className="size-3" /> Sanctioned Jurisdiction
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 py-4">
        {hasPriceRange && (
          <div className="rounded-lg border border-border/60 bg-gradient-to-br from-slate-50 to-white px-3.5 py-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
              <span>Reference Price Range</span>
              {result.price_observation_count != null && (
                <span>
                  {result.price_observation_count} observation
                  {result.price_observation_count === 1 ? "" : "s"}
                </span>
              )}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] tracking-wide text-slate-400 uppercase">Low</p>
                <p className="text-xs font-semibold text-slate-700">{result.reference_price_low || "—"}</p>
              </div>
              <div className="border-x border-border/60">
                <p className="text-[10px] tracking-wide text-slate-400 uppercase">Mid</p>
                <p className="text-sm font-bold text-primary">{result.reference_price_mid || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-wide text-slate-400 uppercase">High</p>
                <p className="text-xs font-semibold text-slate-700">{result.reference_price_high || "—"}</p>
              </div>
            </div>
          </div>
        )}

        {result.availability_note && (
          <p className="text-xs leading-relaxed text-slate-500">{result.availability_note}</p>
        )}

        {hasMeta && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {result.typical_origin_countries?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0 text-slate-400" />
                <span className="text-slate-500">{result.typical_origin_countries.join(", ")}</span>
              </div>
            )}
            {result.typical_trade_routes?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Route className="size-3.5 shrink-0 text-slate-400" />
                <span className="text-slate-500">{result.typical_trade_routes.join(", ")}</span>
              </div>
            )}
            {result.hs_codes_observed?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Hash className="size-3.5 shrink-0 text-slate-400" />
                <span className="text-slate-500">{result.hs_codes_observed.join(", ")}</span>
              </div>
            )}
          </div>
        )}

        {result.price_sources?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Globe2 className="size-3.5 shrink-0 text-slate-400" />
            {result.price_sources.map((src, i) => (
              <Badge key={i} variant="outline" className="text-[10px] font-normal text-slate-500">
                {src}
              </Badge>
            ))}
          </div>
        )}

        {hasFindings && (
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3.5 py-3">
            <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Market Research Notes
            </p>
            <p
              className={cn(
                "text-xs leading-relaxed whitespace-pre-line text-slate-600",
                !expanded && findingsAreLong && "line-clamp-3",
              )}
            >
              {result.aggregated_findings}
            </p>
            {findingsAreLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
                <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── shared bits ──────────────────────────────────────────────────────────

function EmptyState({ icon: Icon = SearchX, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white py-16 text-center">
      <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Icon aria-hidden="true" className="size-5 text-slate-400" />
      </div>
      <div className="space-y-1 px-6">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────────

export default function TbmlOsintDetails({ open, setOpen, reportId = "TBML-9829B96207DE" }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const getDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTBMLosintReportDetails(reportId);
        if (active) setReportData(response);
      } catch (err) {
        if (active) setError(err?.message || "Failed to load OSINT report");
      } finally {
        if (active) setLoading(false);
      }
    };
    getDetails();
    return () => {
      active = false;
    };
  }, [reportId]);

  const osintResults = Array.isArray(reportData?.osint_results) ? reportData.osint_results : [];
  const reviewReasons = Array.isArray(reportData?.review_reasons) ? reportData.review_reasons : [];
  const narrative = reportData?.narrative_report;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-2xl" side="right">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <FileSearch className="size-4.5 text-primary" />
            TBML / OSINT Report
          </SheetTitle>
          {reportData?.report_id && (
            <SheetDescription className="font-mono text-[11px]">{reportData.report_id}</SheetDescription>
          )}
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm text-slate-500">Loading OSINT report…</p>
            </div>
          ) : error ? (
            <EmptyState icon={AlertTriangle} title="Unable to load report" description={error} />
          ) : !reportData ? (
            <EmptyState icon={SearchX} title="No report data available" />
          ) : (
            <div className="space-y-5">
              {reviewReasons.length > 0 && (
                <Alert variant="destructive">
                  <ShieldAlert />
                  <AlertTitle>Analyst Review Required</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc space-y-1 pl-4">
                      {reviewReasons.map((reason, i) => (
                        <li key={i} className="text-xs leading-relaxed">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="narrative">
                <TabsList>
                  <TabsTrigger value="narrative">
                    <ScrollText className="size-3.5" /> Narrative Report
                  </TabsTrigger>
                  <TabsTrigger value="market">
                    <Coins className="size-3.5" /> Market Research
                    {osintResults.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {osintResults.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="narrative" className="mt-4">
                  <NarrativeReport markdown={narrative} />
                </TabsContent>

                <TabsContent value="market" className="mt-4">
                  {osintResults.length === 0 ? (
                    <EmptyState icon={SearchX} title="No market research data available" />
                  ) : (
                    <div className="space-y-4">
                      {osintResults.map((result, i) => (
                        <OsintResultCard key={result.product_key || i} result={result} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
