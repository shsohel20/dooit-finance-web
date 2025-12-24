"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRandomNumber } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useState } from "react"
const GaugeChart = dynamic(() => import("./GaugeChart"), {
  ssr: false,
});


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



export default function HeatMap() {
  const [selectedCase, setSelectedCase] = useState(smrCases[0].id)
  const currentCase = smrCases.find((c) => c.id === selectedCase) || smrCases[0]

  return (
    <div className="">
      <div className=" space-y-6">
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
