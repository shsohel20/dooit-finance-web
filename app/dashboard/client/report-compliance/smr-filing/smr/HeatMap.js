"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRandomNumber } from "@/lib/utils"
import { useState } from "react"

// Sample SMR case data with urgency levels
const smrCases = [
  { id: "SMR_176440200659", remaining: 68, urgency: "safe" },
  { id: "SMR_176438912482", remaining: 52, urgency: "moderate" },
  { id: "SMR_176437654321", remaining: 38, urgency: "moderate" },
  { id: "SMR_176436398274", remaining: 24, urgency: "urgent" },
  { id: "SMR_176435142108", remaining: 15, urgency: "urgent" },
  { id: "SMR_176433885943", remaining: 8, urgency: "critical" },
  { id: "SMR_176432629778", remaining: 3, urgency: "critical" },
  { id: "SMR_176431373613", remaining: 71, urgency: "safe" },
  { id: "SMR_176430117448", remaining: 45, urgency: "moderate" },
  { id: "SMR_176428861282", remaining: 19, urgency: "urgent" },
]


function GaugeChart({ value, caseId }) {
  // Determine urgency level
  const getUrgencyLevel = (hours) => {
    if (hours >= 48) return { level: "Safe", color: "#22c55e", range: "48+ hrs", startAngle: 0, endAngle: 60, }
    if (hours >= 24) return { level: "Moderate", color: "#eab308", range: "24-48 hrs", startAngle: 60, endAngle: 120, }
    if (hours >= 12) return { level: "Urgent", color: "#f97316", range: "12-24 hrs", startAngle: 120, endAngle: 150, }
    return { level: "Critical", color: "#ef4444", range: "0-12 hrs", startAngle: 150, endAngle: 180, }
  }

  const urgency = getUrgencyLevel(value)

  // Map 0-72 hours to 0-180 degrees (left to right)
  const percentage = Math.min(value / 72, 1)
  const needleAngle = 90 + getRandomNumber(urgency.startAngle, urgency.endAngle)

  const segments = [
    { color: "#22c55e", startAngle: 0, endAngle: 60, label: "Safe" },
    { color: "#eab308", startAngle: 60, endAngle: 120, label: "Moderate" },
    { color: "#f97316", startAngle: 120, endAngle: 150, label: "Urgent" },
    { color: "#ef4444", startAngle: 150, endAngle: 180, label: "Critical" },
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md aspect-[2/1]">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Draw gauge segments */}
          {segments.map((segment, i) => {
            const startRad = (segment.startAngle * Math.PI) / 180
            const endRad = (segment.endAngle * Math.PI) / 180
            const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0

            const x1 = 100 + 80 * Math.cos(Math.PI - startRad)
            const y1 = 100 - 80 * Math.sin(Math.PI - startRad)
            const x2 = 100 + 80 * Math.cos(Math.PI - endRad)
            const y2 = 100 - 80 * Math.sin(Math.PI - endRad)

            const innerX1 = 100 + 60 * Math.cos(Math.PI - startRad)
            const innerY1 = 100 - 60 * Math.sin(Math.PI - startRad)
            const innerX2 = 100 + 60 * Math.cos(Math.PI - endRad)
            const innerY2 = 100 - 60 * Math.sin(Math.PI - endRad)

            const pathData = `
              M ${x1} ${y1}
              A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}
              L ${innerX2} ${innerY2}
              A 60 60 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}
              Z
            `

            return <path key={i} d={pathData} fill={segment.color} opacity="0.8" />
          })}

          <g transform={`rotate(${needleAngle - 180}, 100, 100)`}>
            <line x1="100" y1="100" x2="100" y2="30" stroke={urgency.color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="100" r="6" fill={urgency.color} />
          </g>

          {/* Center circle */}
          <circle cx="100" cy="100" r="4" fill="white" />

          {/* Value text */}
          <text x="100" y="95" textAnchor="middle" className="fill-foreground font-bold text-2xl">
            {value}
          </text>
          <text x="100" y="108" textAnchor="middle" className="fill-muted-foreground text-xs">
            hours
          </text>
        </svg>
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: urgency.color }} />
          <span className="font-semibold text-lg">{urgency.level}</span>
          <span className="text-sm text-muted-foreground">({urgency.range})</span>
        </div>
        <p className="text-sm text-muted-foreground">{caseId}</p>
      </div>
    </div>
  )
}

export default function HeatMap() {
  const [selectedCase, setSelectedCase] = useState(smrCases[0].id)
  const currentCase = smrCases.find((c) => c.id === selectedCase) || smrCases[0]

  return (
    <div className=" p-4 bg-background">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Urgency Gauge</CardTitle>
            <CardDescription>
              Monitor SMR case urgency levels with real-time remaining time visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select SMR Case</label>
              <Select value={selectedCase} onValueChange={setSelectedCase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {smrCases.map((smrCase) => (
                    <SelectItem key={smrCase.id} value={smrCase.id}>
                      {smrCase.id} - {smrCase.remaining}h remaining
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <GaugeChart value={currentCase.remaining} caseId={currentCase.id} />
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Urgency Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
                <div>
                  <p className="font-medium text-sm">Safe</p>
                  <p className="text-xs text-muted-foreground">48+ hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#eab308]" />
                <div>
                  <p className="font-medium text-sm">Moderate</p>
                  <p className="text-xs text-muted-foreground">24-48 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#f97316]" />
                <div>
                  <p className="font-medium text-sm">Urgent</p>
                  <p className="text-xs text-muted-foreground">12-24 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
                <div>
                  <p className="font-medium text-sm">Critical</p>
                  <p className="text-xs text-muted-foreground">0-12 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
