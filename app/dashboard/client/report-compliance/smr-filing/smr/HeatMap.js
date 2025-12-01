"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

// Mock SMR cases with different remaining hours
const mockCases = [
  { id: "SMR_1764402006593", remainingHours: 68 },
  { id: "SMR_1764389124821", remainingHours: 52 },
  { id: "SMR_1764376543210", remainingHours: 38 },
  { id: "SMR_1764363982741", remainingHours: 24 },
  { id: "SMR_1764351421089", remainingHours: 15 },
  { id: "SMR_1764338859437", remainingHours: 8 },
  { id: "SMR_1764326297785", remainingHours: 3 },
  { id: "SMR_1764313736133", remainingHours: 71 },
  { id: "SMR_1764301174481", remainingHours: 45 },
  { id: "SMR_1764288612829", remainingHours: 19 },
]

// Helper function to get color based on urgency
const getUrgencyColor = (currentHour, remainingHours) => {
  const hoursLeft = remainingHours - currentHour

  if (hoursLeft > 48) return "bg-green-500/80" // Green: Safe zone
  if (hoursLeft > 24) return "bg-yellow-500/80" // Yellow: Moderate
  if (hoursLeft > 12) return "bg-orange-500/80" // Orange: Urgent
  if (hoursLeft > 0) return "bg-red-500/80" // Red: Critical
  return "bg-gray-800" // Expired
}

// Helper to get readable label
const getUrgencyLabel = (currentHour, remainingHours) => {
  const hoursLeft = remainingHours - currentHour

  if (hoursLeft > 48) return "Safe"
  if (hoursLeft > 24) return "Moderate"
  if (hoursLeft > 12) return "Urgent"
  if (hoursLeft > 0) return "Critical"
  return "Expired"
}

export function SMRHeatmap() {
  const [hoveredCell, setHoveredCell] = useState(null)

  // Generate hour markers (every 6 hours)
  const hourMarkers = Array.from({ length: 13 }, (_, i) => i * 6)

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">SMR 72-Hour Countdown</h1>
        <p className="text-muted-foreground">Real-time urgency tracking for suspicious matter reports</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Case Timeline Overview</CardTitle>
          <CardDescription>Each row represents an SMR case with hourly urgency status</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex items-center gap-6 mb-6 pb-4 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Urgency Level:</span>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-green-500/80" />
              <span className="text-xs text-muted-foreground">Safe (48+ hrs)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-yellow-500/80" />
              <span className="text-xs text-muted-foreground">Moderate (24-48 hrs)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-orange-500/80" />
              <span className="text-xs text-muted-foreground">Urgent (12-24 hrs)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-red-500/80" />
              <span className="text-xs text-muted-foreground">Critical (0-12 hrs)</span>
            </div>
          </div>

          {/* Heatmap */}
          <div className="relative overflow-x-auto">
            <div className="min-w-max">
              {/* Hour markers */}
              <div className="flex items-center mb-2">
                <div className="w-40 shrink-0" />
                <div className="flex items-center gap-px">
                  {hourMarkers.map((hour) => (
                    <div key={hour} className="w-16 text-center text-xs text-muted-foreground">
                      {hour}h
                    </div>
                  ))}
                </div>
              </div>

              {/* Cases */}
              {mockCases.map((smrCase) => (
                <div key={smrCase.id} className="flex items-center gap-2 mb-1">
                  {/* Case ID and Remaining Hours */}
                  <div className="w-40 shrink-0 pr-4">
                    <div className="text-sm font-medium">{smrCase.id}</div>
                    <div className="text-xs text-muted-foreground">{smrCase.remainingHours}h remaining</div>
                  </div>

                  {/* Hour cells */}
                  <div className="flex items-center gap-px">
                    {Array.from({ length: 72 }, (_, i) => i + 1).map((hour) => (
                      <div
                        key={hour}
                        className={`h-10 w-2 rounded-sm transition-all cursor-pointer ${getUrgencyColor(
                          hour,
                          smrCase.remainingHours,
                        )} hover:ring-2 hover:ring-white hover:scale-110`}
                        onMouseEnter={() => setHoveredCell({ caseId: smrCase.id, hour })}
                        onMouseLeave={() => setHoveredCell(null)}
                        title={`Hour ${hour}: ${getUrgencyLabel(hour, smrCase.remainingHours)} (${smrCase.remainingHours - hour
                          }h left)`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tooltip */}
            {hoveredCell && (
              <div className="fixed z-50 pointer-events-none bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-3 text-sm top-1/2">
                <div className="font-medium">{hoveredCell.caseId}</div>
                <div className="text-muted-foreground">
                  Hour {hoveredCell.hour} •{" "}
                  {mockCases.find((c) => c.id === hoveredCell.caseId).remainingHours - hoveredCell.hour}h remaining
                </div>
                <div className="text-xs mt-1">
                  Status:{" "}
                  {getUrgencyLabel(
                    hoveredCell.hour,
                    mockCases.find((c) => c.id === hoveredCell.caseId).remainingHours,
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
