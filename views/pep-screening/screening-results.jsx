"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  User,
  Building2,
  Globe,
  Calendar,
  MapPin,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock screening results based on entity name
const generateMockResults = (entityName) => {
  const nameWords = entityName.toLowerCase().split(" ");
  const hasCommonName =
    nameWords.some((w) => ["bank", "corp", "trading", "international", "global"].includes(w)) ||
    entityName.length > 5;

  if (!hasCommonName) {
    return [];
  }

  return [
    {
      id: "1",
      name: entityName.toUpperCase() + " LTD",
      matchScore: 95,
      riskLevel: "critical",
      listType: "Sanctions",
      listSource: "OFAC SDN",
      country: "Russia",
      dateAdded: "2023-03-15",
      aliases: [entityName + " Holdings", entityName + " Group"],
      matchingFields: ["Name", "Alias"],
      details:
        "Entity designated pursuant to Executive Order 14024 for operating in the financial services sector of the Russian Federation economy.",
    },
    {
      id: "2",
      name: entityName.toUpperCase() + " HOLDINGS",
      matchScore: 78,
      riskLevel: "high",
      listType: "PEP",
      listSource: "World-Check",
      country: "United Arab Emirates",
      dateAdded: "2022-08-20",
      aliases: [entityName + " Investments"],
      matchingFields: ["Name"],
      details:
        "Connected to politically exposed person. Beneficial owner linked to government official in high-risk jurisdiction.",
    },
    {
      id: "3",
      name: entityName.split(" ")[0]?.toUpperCase() + " INTERNATIONAL",
      matchScore: 52,
      riskLevel: "medium",
      listType: "Adverse Media",
      listSource: "Dow Jones",
      country: "Singapore",
      dateAdded: "2024-01-10",
      aliases: [],
      matchingFields: ["Partial Name"],
      details: "Subject of regulatory investigation for potential AML violations. Case ongoing.",
    },
    {
      id: "4",
      name: "Similar: " + entityName.slice(0, 3).toUpperCase() + "TECH SOLUTIONS",
      matchScore: 35,
      riskLevel: "low",
      listType: "Enforcement",
      listSource: "FCA",
      country: "United Kingdom",
      dateAdded: "2021-05-22",
      aliases: [],
      matchingFields: ["Phonetic"],
      details: "Historical enforcement action. Fine paid and remediation completed.",
    },
  ];
};

const getRiskColor = (level) => {
  switch (level) {
    case "critical":
      return "bg-red-100 text-red-700 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "low":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
};

const getRiskBgColor = (level) => {
  switch (level) {
    case "critical":
      return "bg-red-50 border-red-200";
    case "high":
      return "bg-orange-50 border-orange-200";
    case "medium":
      return "bg-amber-50 border-amber-200";
    case "low":
      return "bg-emerald-50 border-emerald-200";
  }
};

export function ScreeningResults({ entityName, entityType, caseId }) {
  const [expandedMatches, setExpandedMatches] = useState(["1"]);
  const matches = generateMockResults(entityName);

  const toggleMatch = (id) => {
    setExpandedMatches((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const totalMatches = matches.length;
  const criticalMatches = matches.filter((m) => m.riskLevel === "critical").length;
  const highMatches = matches.filter((m) => m.riskLevel === "high").length;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Results Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800">Screening Results</h3>
          <Badge variant="outline" className="text-slate-600">
            Case ID: {caseId}
          </Badge>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            {entityType === "individual" ? (
              <User className="h-4 w-4 text-slate-500" />
            ) : (
              <Building2 className="h-4 w-4 text-slate-500" />
            )}
            <span className="font-medium text-slate-700">{entityName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">
              Total Matches: <span className="font-semibold text-slate-700">{totalMatches}</span>
            </span>
            {criticalMatches > 0 && (
              <span className="text-red-600">
                Critical: <span className="font-semibold">{criticalMatches}</span>
              </span>
            )}
            {highMatches > 0 && (
              <span className="text-orange-600">
                High: <span className="font-semibold">{highMatches}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Results List */}
      {matches.length === 0 ? (
        <div className="p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <h4 className="text-lg font-medium text-slate-800 mb-1">No Matches Found</h4>
          <p className="text-slate-500">
            The entity does not appear on any watchlists or sanctions lists.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {matches.map((match) => (
            <Collapsible
              key={match.id}
              open={expandedMatches.includes(match.id)}
              onOpenChange={() => toggleMatch(match.id)}
            >
              <CollapsibleTrigger
                className={cn(
                  "w-full p-4 hover:bg-slate-50 transition-colors",
                  getRiskBgColor(match.riskLevel),
                )}
              >
                <div className="flex items-center gap-4">
                  <button className="shrink-0">
                    {expandedMatches.includes(match.id) ? (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-slate-800">{match.name}</span>
                      <Badge className={cn("text-xs", getRiskColor(match.riskLevel))}>
                        {match.riskLevel.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {match.listType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {match.listSource}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {match.country}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-slate-800">{match.matchScore}%</div>
                    <div className="text-xs text-slate-500">Match Score</div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4 pt-2 ml-9 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="text-xs font-semibold text-slate-500 mb-2">MATCHING FIELDS</h5>
                      <div className="flex flex-wrap gap-1">
                        {match.matchingFields.map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-500 mb-2">DATE ADDED</h5>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="h-3 w-3" />
                        {match.dateAdded}
                      </div>
                    </div>
                  </div>

                  {match.aliases.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-slate-500 mb-2">ALIASES</h5>
                      <div className="flex flex-wrap gap-1">
                        {match.aliases.map((alias) => (
                          <Badge key={alias} variant="outline" className="text-xs">
                            {alias}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h5 className="text-xs font-semibold text-slate-500 mb-2">DETAILS</h5>
                    <p className="text-sm text-slate-600">{match.details}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <FileText className="h-3 w-3 mr-1" />
                      View Full Profile
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open Source
                    </Button>
                    <div className="ml-auto flex items-center gap-2">
                      <Button size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        False Positive
                      </Button>
                      <Button size="sm" className="text-xs bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        True Match
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
