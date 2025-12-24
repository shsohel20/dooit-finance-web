import { getRandomNumber } from "@/lib/utils"

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
export default GaugeChart;