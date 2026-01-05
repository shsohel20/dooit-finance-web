"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/risk-badge";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={`transition-all ${expanded ? "ring-2 ring-primary/20" : ""}`}>
      <CardContent className="p-0">
        {/* Main Row */}
        <div className="flex items-center gap-4 p-4">
          {/* Score Circle */}
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold ${
              match.riskTier === "critical"
                ? "bg-red-100 text-red-700"
                : match.riskTier === "high"
                  ? "bg-orange-100 text-orange-700"
                  : match.riskTier === "medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {match.matchScore}%
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-foreground truncate">{match.name}</h3>
              <RiskBadge tier={match.riskTier} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="font-mono text-xs">
                  {match.listType}
                </Badge>
              </span>
              <span>DOB: {match.dob}</span>
              <span>{match.nationality}</span>
            </div>
          </div>

          {/* Matched Fields */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Matched:</span>
            {match.matchedFields.map((field) => (
              <Badge key={field} variant="secondary" className="text-xs">
                {field}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="border-t bg-muted/30 p-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Designation</h4>
                  <p className="text-sm">{match.designation}</p>
                </div>
                {match.aliases.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Known Aliases
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {match.aliases.map((alias, i) => (
                        <Badge key={i} variant="outline">
                          {alias}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View Source
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="mr-2 h-3 w-3" />
                    Flag for Review
                  </Button>
                </div>
              </div>

              {/* Right Column - Actions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Quick Decision</h4>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    True Positive - Escalate
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 bg-transparent"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    False Positive - Clear
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-amber-600 hover:bg-amber-50 hover:text-amber-700 bg-transparent"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Potential Match - Investigate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
