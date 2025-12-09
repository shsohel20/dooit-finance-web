"use client"


import { useEffect } from "react"

import { useRef } from "react"

import { useState } from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  Mail,
  Info,
  ChevronRight,
  Network,
  GitBranch,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

const sampleRelationsData = [
  {
    active: true,
    client: "69246e8ea7290611c64300",
    id: "69292461fc63b70e30fbb9b5",
    inviteCreatedAt: null,
    inviteToken: null,
    inviteTokenExpire: null,
    invitedBy: null,
    notes: "",
    onboardingChannel: "API",
    registeredAt: "2025-11-28T04:26:09.235Z",
    source: "api",
    type: "individual",
    _id: "69292461fc63b70e30fbb9b5",
  },
  {
    active: true,
    client: "69246e8ea7290611c64300",
    id: "69292461fc63b70e30fbb9b6",
    inviteCreatedAt: "2025-11-20T10:15:30.123Z",
    inviteToken: "inv_abc123xyz",
    inviteTokenExpire: "2025-12-20T10:15:30.123Z",
    invitedBy: "69292461fc63b70e30fbb9b5",
    notes: "Referred by primary account holder. High-value client prospect.",
    onboardingChannel: "Referral",
    registeredAt: "2025-11-25T14:30:45.789Z",
    source: "referral",
    type: "individual",
    _id: "69292461fc63b70e30fbb9b6",
  },
  {
    active: true,
    client: "69246e8ea7290611c64301",
    id: "69292461fc63b70e30fbb9b7",
    inviteCreatedAt: "2025-11-22T08:20:15.456Z",
    inviteToken: "inv_def456uvw",
    inviteTokenExpire: "2025-12-22T08:20:15.456Z",
    invitedBy: "69292461fc63b70e30fbb9b6",
    notes: "Second-tier referral. Standard onboarding process.",
    onboardingChannel: "Referral",
    registeredAt: "2025-11-26T16:45:20.234Z",
    source: "referral",
    type: "business",
    _id: "69292461fc63b70e30fbb9b7",
  },
  {
    active: false,
    client: "69246e8ea7290611c64302",
    id: "69292461fc63b70e30fbb9b8",
    inviteCreatedAt: "2025-11-18T12:00:00.000Z",
    inviteToken: "inv_ghi789rst",
    inviteTokenExpire: "2025-12-18T12:00:00.000Z",
    invitedBy: "69292461fc63b70e30fbb9b5",
    notes: "Invite expired. Follow-up required.",
    onboardingChannel: "Email",
    registeredAt: "2025-11-27T09:30:15.567Z",
    source: "email",
    type: "individual",
    _id: "69292461fc63b70e30fbb9b8",
  },
]

export function RelationsTree() {
  const relations = sampleRelationsData
  // Group relations by invitedBy to create tree structure
  const rootNodes = relations?.filter((r) => !r.invitedBy || r.invitedBy === "null")
  const childNodes = relations?.filter((r) => r.invitedBy && r.invitedBy !== "null")

  const getChildren = (parentId) => {
    return childNodes.filter((r) => r.invitedBy === parentId)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const [nodePositions, setNodePositions] = useState(new Map())
  const [draggedNode, setDraggedNode] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef(null)

  // Initialize node positions
  useEffect(() => {
    const positions = new Map()
    let yOffset = 50

    const layoutNode = (relation, x, y, level) => {
      positions.set(relation.id, { id: relation.id, x, y })

      const children = getChildren(relation.id)
      if (children.length > 0) {
        const spacing = Math.max(250, 400 / (level + 1))
        children.forEach((child, index) => {
          const childY = y + 200
          const childX = x + (index - (children.length - 1) / 2) * spacing
          layoutNode(child, childX, childY, level + 1)
        })
      }
    }

    rootNodes.forEach((root, index) => {
      layoutNode(root, 400 + index * 300, yOffset, 0)
      yOffset += 600
    })

    setNodePositions(positions)
  }, [relations])

  const handleMouseDown = (e, nodeId) => {
    const pos = nodePositions.get(nodeId)
    if (pos) {
      setDraggedNode(nodeId)
      setDragOffset({
        x: e.clientX - pos.x * zoom,
        y: e.clientY - pos.y * zoom,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (draggedNode) {
      const newX = (e.clientX - dragOffset.x) / zoom
      const newY = (e.clientY - dragOffset.y) / zoom

      setNodePositions((prev) => {
        const newMap = new Map(prev)
        newMap.set(draggedNode, { id: draggedNode, x: newX, y: newY })
        return newMap
      })
    }
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
  }

  const DraggableNode = ({ relation }) => {
    const position = nodePositions.get(relation.id)
    if (!position) return null

    const children = getChildren(relation.id)
    const initials = relation.client
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    return (
      <>
        {/* Connection lines to children */}
        {children?.map((child) => {
          const childPos = nodePositions.get(child.id)
          if (!childPos) return null

          return (
            <svg
              key={`line-${relation.id}-${child.id}`}
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
                zIndex: 0,
              }}
            >
              <defs>
                <linearGradient id={`gradient-${relation.id}-${child.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d={`M ${position.x + 60} ${position.y + 60} Q ${position.x + 60} ${(position.y + childPos.y) / 2}, ${childPos.x + 60} ${childPos.y + 60}`}
                stroke={`url(#gradient-${relation.id}-${child.id})`}
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
              />
            </svg>
          )
        })}

        {/* Node */}
        <div
          className={`absolute cursor-move transition-opacity ${draggedNode === relation.id ? "opacity-80" : "opacity-100"}`}
          style={{
            left: position.x,
            top: position.y,
            zIndex: 10,
          }}
          onMouseDown={(e) => handleMouseDown(e, relation.id)}
        >
          <Card className="w-[280px] border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 bg-background/95 backdrop-blur-sm">
            <div className="p-4 space-y-3">
              {/* Avatar and Status */}
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="size-12 border-2 border-primary/30 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-background ${relation.active ? "bg-success" : "bg-muted-foreground"}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate mb-1">{relation.client}</h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {relation.active ? (
                      <Badge className="bg-success/15 text-success border-success/30 text-xs h-5">
                        <CheckCircle2 className="size-2.5 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border-border text-xs h-5">
                        <XCircle className="size-2.5 mr-1" />
                        Inactive
                      </Badge>
                    )}
                    {children.length > 0 && (
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 text-xs h-5">
                        <GitBranch className="size-2.5 mr-1" />
                        {children.length}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate capitalize">{relation.onboardingChannel}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Network className="size-3 shrink-0" />
                  <span className="truncate capitalize">{relation.type}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3 shrink-0" />
                  <span className="truncate">{formatDate(relation.registeredAt)}</span>
                </div>
              </div>

              {/* Notes */}
              {relation.notes && (
                <div className="p-2 rounded bg-muted/50 border border-border/30">
                  <div className="flex items-start gap-2">
                    <Info className="size-3 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{relation.notes}</p>
                  </div>
                </div>
              )}

              {/* View Details Button */}
              {/* <Button variant="ghost" size="sm" className="w-full h-7 text-xs">
                View Details
                <ChevronRight className="size-3 ml-1" />
              </Button> */}
            </div>
          </Card>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-6">

      {/* Interactive Tree Canvas */}
      <Card className="border-border/50 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GitBranch className="size-5 text-primary" />
              Interactive Relationship Network
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                <ZoomOut className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                <ZoomIn className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
                <Maximize2 className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden">
            <div
              ref={canvasRef}
              className="relative bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_1px)] bg-[length:24px_24px] select-none"
              style={{
                width: "100%",
                height: "600px",
                cursor: draggedNode ? "grabbing" : "default",
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "0 0",
                  width: `${100 / zoom}%`,
                  height: `${100 / zoom}%`,
                }}
              >
                {relations.map((relation) => (
                  <DraggableNode key={relation.id} relation={relation} />
                ))}
              </div>

              {/* Help text */}
              <div className="absolute bottom-4 left-4 p-3 bg-background/95 backdrop-blur-sm rounded-lg border border-border/50 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Info className="size-3" />
                  Drag nodes to rearrange the network
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
