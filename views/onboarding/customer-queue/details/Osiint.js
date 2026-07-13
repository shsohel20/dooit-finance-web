"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, dateShowFormatWithTime } from "@/lib/utils";
import dummyOsiintReport from "./dummyOsiintReport.json";
import {
  ExternalLink,
  Globe2,
  Newspaper,
  Users,
  Activity,
  Radar,
  Search,
  SearchCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getOSINTdata } from "@/app/dashboard/client/onboarding/customer-queue/actions";

function scoreTone(score) {
  if (score <= 30) return "text-success";
  if (score <= 60) return "text-warning-foreground";
  return "text-danger";
}

function scoreBadgeClass(score) {
  if (score <= 30) return "bg-success/15 text-success border-success/30";
  if (score <= 60) return "bg-warning/15 text-warning-foreground border-warning/30";
  return "bg-danger/15 text-danger border-danger/30";
}

function confidenceBadge(confidence) {
  const c = (confidence || "").toLowerCase();
  if (c === "high") return "bg-success/15 text-success border-success/30";
  if (c === "medium") return "bg-warning/15 text-warning-foreground border-warning/30";
  return "bg-muted text-muted-foreground border-border";
}

export function Osiint({ data, details }) {
  const [query, setQuery] = useState("");
  const [reportData, setReportData] = useState(null);
  const id = useSearchParams().get("id");
  const report = data && typeof data === "object" ? data : dummyOsiintReport;

  const getOsiintReport = async () => {
    const response = await getOSINTdata("customers", id);
    setReportData(response);
    console.log(" osiint response", response);
  };

  useEffect(() => {
    getOsiintReport();
  }, [id]);

  const q = query.toLowerCase();
  const profiles = (report.profiles ?? []).filter(
    (p) => !q || p.source?.toLowerCase().includes(q) || p.url?.toLowerCase().includes(q),
  );
  const adverseMedia = (report.adverseMedia ?? []).filter(
    (m) => !q || m.headline?.toLowerCase().includes(q) || m.source?.toLowerCase().includes(q),
  );
  const associates = (report.associates ?? []).filter(
    (a) => !q || a.name?.toLowerCase().includes(q) || a.relation?.toLowerCase().includes(q),
  );
  const activitySignals = (report.activitySignals ?? []).filter(
    (s) => !q || s.type?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q),
  );

  return (
    <div className="space-y-4  ">
      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
        <Search className="size-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search profiles, media, associates…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="">
        <div className="">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{reportData?.entity_name}</h2>
                <Badge variant="outline" className="font-normal">
                  individual
                </Badge>
              </div>
              {reportData?.report?.key_findings.map((itm, i) => {
                return (
                  <p key={itm?.split(" ")[0] + i} className="text-sm text-muted-foreground">
                    {itm}
                  </p>
                );
              })}
            </div>
          </div>
          {report.lastUpdated && (
            <p className="mt-4 text-xs text-muted-foreground">
              Last updated: {dateShowFormatWithTime(reportData?.generated_at)}
            </p>
          )}
        </div>
      </div>

      <div>
        <h6 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Globe2 className="size-4 text-primary" />
          Queries run
        </h6>
        <div className="flex flex-wrap gap-2">
          {reportData?.queries_run?.map((query) => (
            <div key={query.query} className="rounded-md border border-border/80 p-3 flex-shrink-0">
              <p className="text-sm font-mono  flex items-center gap-2">
                <SearchCheck className="size-4 text-primary" />
                {query.query}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid ">
        <div>
          <div className="">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Globe2 className="size-4 text-primary" />
              Open-source profiles
            </h3>
            {profiles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No profile links recorded.</p>
            ) : (
              <ul className="space-y-3">
                {profiles.map((p, i) => (
                  <li
                    key={`${p.url}-${i}`}
                    className="flex flex-col gap-2 rounded-md border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{p.source}</p>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline break-all"
                        >
                          {p.url}
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      )}
                    </div>
                    {p.confidence != null && (
                      <Badge
                        variant="outline"
                        className={cn("w-fit shrink-0", confidenceBadge(p.confidence))}
                      >
                        {String(p.confidence)} confidence
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Newspaper className="size-4 text-primary" />
            Adverse media
          </h3>
          {adverseMedia.length === 0 ? (
            <p className="text-sm text-muted-foreground">No adverse media items.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted text-left text-xs font-medium text-neutral-800">
                    <th className="p-2 font-medium">Headline</th>
                    {/* <th className="p-2 font-medium">Source</th> */}
                    <th className="p-2 font-medium whitespace-nowrap">Published</th>
                    {/* <th className="p-2 font-medium text-right whitespace-nowrap">Score</th> */}
                    {/* <th className="p-2 font-medium whitespace-nowrap">Sentiment</th> */}
                  </tr>
                </thead>
                <tbody>
                  {adverseMedia.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                    >
                      <td className="p-2 align-top font-medium w-full max-w-md text-xs">
                        {m.headline}
                        <p className="text-xs text-muted-foreground">{m.source}</p>
                      </td>
                      {/* <td className="p-2 align-top text-muted-foreground">{m.source}</td> */}
                      <td className="p-2 align-top whitespace-nowrap text-muted-foreground">
                        {m.publishedDate}
                      </td>
                      {/* <td className="p-2 align-top text-right">
                        <span
                          className={cn("font-semibold tabular-nums", scoreTone(m.riskScore ?? 0))}
                        >
                          {m.riskScore ?? "—"}
                        </span>
                      </td> */}
                      {/* <td className="p-2 align-top">
                        {m.sentiment != null && (
                          <Badge variant="outline" className={sentimentBadge(m.sentiment)}>
                            {m.sentiment}
                          </Badge>
                        )}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 ">
        <div>
          <div className="">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Users className="size-4 text-primary" />
              Associates
            </h3>
            {associates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No associates listed.</p>
            ) : (
              <ul className="space-y-3">
                {associates.map((a, i) => (
                  <li key={`${a.name}-${i}`} className="rounded-md border border-border/80 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.relation}</p>
                      </div>
                      {a.riskScore != null && (
                        <Badge variant="outline" className={scoreBadgeClass(a.riskScore)}>
                          {a.riskScore}
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* <Card>
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              Geographic exposure
            </h3>
            {geographicExposure.length === 0 ? (
              <p className="text-sm text-muted-foreground">No geographic exposure data.</p>
            ) : (
              <ul className="space-y-2">
                {geographicExposure.map((g, i) => (
                  <li
                    key={`${g.country}-${i}`}
                    className="flex items-center justify-between gap-2 rounded-md border border-border/80 px-3 py-2"
                  >
                    <span className="text-sm font-medium">{g.country}</span>
                    {g.riskLevel != null && (
                      <Badge variant="outline" className={geoRiskBadge(g.riskLevel)}>
                        {g.riskLevel}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card> */}
      </div>

      <div>
        <div className="">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            Activity signals
          </h3>
          {activitySignals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity signals.</p>
          ) : (
            <ul className="divide-y divide-border">
              {activitySignals.map((sig, i) => (
                <li key={`${sig.type}-${sig.date}-${i}`} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <p className="text-sm font-medium">{sig.type}</p>
                    {sig.date && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {sig.date}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {sig.description}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
