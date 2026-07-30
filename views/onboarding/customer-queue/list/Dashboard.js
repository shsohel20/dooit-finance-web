"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { CalendarIcon } from "lucide-react"
import NumberAnimation from "@/components/NumberAnimation"
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map"
import { getCustomerStats } from "@/app/dashboard/client/onboarding/customer-queue/actions"

// OpenStreetMap raster basemap for MapLibre GL (genuine OSM tiles).
const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    { id: "osm-tiles", type: "raster", source: "osm", minzoom: 0, maxzoom: 19 },
  ],
}

// Visual config — maps API buckets to colors/labels. Counts come from the API.
const RISK_COLORS = {
  Unacceptable: "var(--primary)",
  High: "var(--danger)",
  Medium: "var(--warning)",
  Low: "var(--accent)",
}

const KYC_META = {
  pending: { label: "Pending", color: "#f59e0b" },
  in_review: { label: "In Review", color: "#3b82f6" },
  verified: { label: "Verified", color: "#10b981" },
  rejected: { label: "Rejected", color: "#ef4444" },
}

const DonutChart = ({ data }) => {
  const hasValues = data.some((d) => d.value > 0)
  return (
    <div className="size-[100px]">
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <PieChart>
          <Tooltip />
          <Pie
            data={hasValues ? data : [{ name: "No data", value: 1, color: "var(--smoke-300, #e5e7eb)" }]}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={45}
            paddingAngle={2}
            dataKey="value"
          >
            {(hasValues ? data : [{ color: "var(--smoke-300, #e5e7eb)" }]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

const Legend = ({ items }) => (
  <div className="flex items-center justify-end gap-2 flex-wrap">
    {items.map((item) => (
      <div key={item.name} className="flex items-center gap-2">
        <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="text-xs">{item.name}</span>
      </div>
    ))}
  </div>
)

// Interactive OpenStreetMap with one marker per geocoded country.
const LocationsMap = ({ markers }) => {
  const maxValue = markers.reduce((m, c) => Math.max(m, c.value), 0) || 1

  // Center on the weighted mean of the markers; zoom out for spread-out data.
  const center = markers.reduce(
    (acc, c) => [acc[0] + c.lng / markers.length, acc[1] + c.lat / markers.length],
    [0, 0],
  )
  const zoom = markers.length <= 1 ? 3 : 1.2

  return (
    <Map center={center} zoom={zoom} styles={{ light: OSM_STYLE, dark: OSM_STYLE }}>
      <MapControls position="bottom-right" showZoom />
      {markers.map((c) => {
        const size = 12 + (c.value / maxValue) * 16 // 12–28px by relative volume
        return (
          <MapMarker key={c.name} longitude={c.lng} latitude={c.lat}>
            <MarkerContent>
              <div
                className="rounded-full border-2 border-white bg-primary shadow-lg"
                style={{ width: `${size}px`, height: `${size}px` }}
              />
            </MarkerContent>
            <MarkerTooltip>
              {c.name}: {c.value}
            </MarkerTooltip>
            <MarkerPopup>
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.value} customer{c.value === 1 ? "" : "s"}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        )
      })}
    </Map>
  )
}

export default function CustomerDashboard({ initialStats = null }) {
  const [stats, setStats] = useState(initialStats)
  const [loading, setLoading] = useState(!initialStats)

  useEffect(() => {
    // Server component already provided the data — no need to re-fetch.
    if (initialStats) return

    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await getCustomerStats()
        if (active && res?.success) setStats(res.data)
      } catch (err) {
        console.error("Failed to load customer stats", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [initialStats])

  const total = stats?.total ?? 0
  const newInWindow = stats?.newInWindow ?? 0
  const windowDays = stats?.windowDays ?? 30
  const pendingKyc = stats?.kyc?.pending ?? 0

  const riskData = (stats?.risk?.distribution ?? []).map((d) => ({
    name: d.label,
    value: d.value,
    color: RISK_COLORS[d.label] ?? "var(--muted)",
  }))

  const kycStatusData = (stats?.kyc?.distribution ?? []).map((d) => ({
    name: KYC_META[d.status]?.label ?? d.status,
    value: d.value,
    color: KYC_META[d.status]?.color ?? "#94a3b8",
  }))

  const countries = stats?.countries ?? []
  // Only countries the API could geocode can be plotted on the map.
  const mapMarkers = useMemo(
    () =>
      countries.filter(
        (c) => typeof c.lat === "number" && typeof c.lng === "number",
      ),
    [countries],
  )

  return (
    <div className="mb-4">
      <div className="space-y-4">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Risk Assessment Card */}
          <Card className="bg-smoke-200 border-0">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Risk Assessment</p>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      <NumberAnimation value={total} />
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="size-4" />
                      <span>+{newInWindow} in last {windowDays} days</span>
                    </p>
                  </div>
                </div>
                <DonutChart data={riskData} />
              </div>
              <Legend items={riskData} />
            </CardContent>
          </Card>

          {/* KYC Status Card */}
          <Card className="bg-smoke-200 border-0">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">KYC Status</p>
                  <p className="text-3xl font-bold text-foreground">
                    <NumberAnimation value={pendingKyc} />
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <DonutChart data={kycStatusData} />
              </div>
              <Legend items={kycStatusData} />
            </CardContent>
          </Card>

          {/* Top Locations Card — interactive OpenStreetMap */}
          <Card className="bg-smoke-200 border-0">
            <CardContent className="space-y-2 ">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Top Locations</p>
                {mapMarkers.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {countries.length} countr{countries.length === 1 ? "y" : "ies"}
                  </span>
                )}
              </div>
              <div className="h-[200px] w-full rounded-md overflow-hidden bg-smoke-300/40">
                {mapMarkers.length > 0 ? (
                  <LocationsMap markers={mapMarkers} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                      {loading ? "Loading…" : "No location data"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
