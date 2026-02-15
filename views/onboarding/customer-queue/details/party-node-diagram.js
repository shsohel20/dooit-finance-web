"use client";

import { useState } from "react";
import { Circle, User, Building2 } from "lucide-react";



function NodeCard({ node, viewMode }) {
  // Color based on party type
  const getTypeColor = () => {
    if (node.partyType === "INDIVIDUAL") return "#3b82f6";
    if (node.partyType === "BUSINESS") return "#a855f7";
    if (node.partyType === "LEGAL_ENTITY") return "#14b8a6";
    return "#6b7280";
  };

  // Risk rating color
  const getRiskColor = () => {
    if (node.riskRating === "HIGH") return "#ef4444";
    if (node.riskRating === "MEDIUM") return "#f59e0b";
    return "#22c55e";
  };

  const totalTransactionAmount =
    node.transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

  const hasTransactions = node.transactions && node.transactions.length > 0;

  return (
    <div
      className="relative rounded-lg border-2 bg-card shadow-sm p-3 min-w-[200px] max-w-[240px] hover:shadow-md transition-shadow"
      style={{ borderColor: getTypeColor() }}
    >
      {/* Type Icon Badge */}
      <div
        className="absolute -top-2.5 -left-2.5 rounded-full p-1.5 bg-card border-2 shadow-sm"
        style={{ borderColor: getTypeColor() }}
      >
        {node.partyType === "INDIVIDUAL" ? (
          <User className="h-3.5 w-3.5" style={{ color: getTypeColor() }} />
        ) : (
          <Building2 className="h-3.5 w-3.5" style={{ color: getTypeColor() }} />
        )}
      </div>

      {/* Risk Badge */}
      <div className="absolute -top-2.5 -right-2.5 flex items-center gap-1 rounded-full px-2 py-0.5 bg-card border-2 border-border shadow-sm">
        <Circle className="h-2 w-2 fill-current" style={{ color: getRiskColor() }} />
        <span className="text-[10px] font-semibold text-foreground">{node.riskRating}</span>
      </div>

      {/* Content */}
      <div className="pt-1">
        <div className="font-semibold text-sm text-foreground text-balance mb-1">
          {node.partyName}
        </div>

        <div className="space-y-0.5 text-[11px] text-muted-foreground">
          <div>{node.partyType.replace(/_/g, " ")}</div>
          {node.role && <div className="font-medium text-foreground">{node.role.replace(/_/g, " ")}</div>}
          
          {node.relationshipToParent && (
            <div className="mt-1 pt-1 border-t border-border">
              <span className="font-medium" style={{ color: getTypeColor() }}>
                {node.relationshipToParent}
              </span>
            </div>
          )}

          {node.ownershipPercentage !== undefined && (
            <div className="text-foreground font-semibold">
              {node.ownershipPercentage}% ownership
            </div>
          )}

          {node.pepFlag && (
            <div className="mt-1">
              <span className="inline-flex items-center rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700 border border-red-200">
                PEP
              </span>
            </div>
          )}

          {viewMode === "transaction" && hasTransactions && (
            <div
              className="mt-1 pt-1 border-t text-[11px] font-semibold"
              style={{ borderColor: "#ea580c", color: "#ea580c" }}
            >
              ${(totalTransactionAmount / 1000).toFixed(0)}K
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DiagramNode({ node, level, path, viewMode }) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = node.children.length > 0;
  const hasTransactions = node.transactions && node.transactions.length > 0;

  // Filter children in transaction mode
  const visibleChildren =
    viewMode === "transaction"
      ? node.children.filter((child) => {
          const childHasTransaction = child.transactions && child.transactions.length > 0;
          const hasNestedTransactions = (n) => {
            if (n.transactions && n.transactions.length > 0) return true;
            return n.children.some(hasNestedTransactions);
          };
          return childHasTransaction || hasNestedTransactions(child);
        })
      : node.children;

  const shouldShowNode =
    viewMode === "family" || hasTransactions || visibleChildren.length > 0;

  if (!shouldShowNode) return null;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className="relative cursor-pointer"
        onClick={() => hasChildren && visibleChildren.length > 0 && setIsExpanded(!isExpanded)}
      >
        <NodeCard node={node} viewMode={viewMode} />
        
        {/* Expand indicator */}
        {hasChildren && visibleChildren.length > 0 && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
            {isExpanded ? "−" : "+"}
          </div>
        )}
      </div>

      {/* Vertical line to children */}
      {isExpanded && visibleChildren.length > 0 && (
        <>
          <div className="w-0.5 h-8 bg-border" />

          {/* Horizontal line across children */}
          {visibleChildren.length > 1 && (
            <div className="relative w-full flex justify-center">
              <div className="absolute top-0 h-0.5 bg-border" style={{ width: `${(visibleChildren.length - 1) * 280 + 20}px` }} />
            </div>
          )}

          {/* Children container */}
          <div className="flex items-start gap-10 pt-8">
            {visibleChildren.map((child, idx) => (
              <div key={`${path}-${idx}`} className="flex flex-col items-center">
                {/* Vertical line from horizontal bar */}
                <div className="w-0.5 h-8 bg-border -mt-8" />
                <DiagramNode
                  node={child}
                  level={level + 1}
                  path={`${path}-${idx}`}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PartyNodeDiagram({
  data,
  viewMode,
}) {
  return (
    <div className="h-full overflow-auto p-8">
      <div className="flex justify-center min-w-max">
        <DiagramNode node={data} level={0} path="root" viewMode={viewMode} />
      </div>
    </div>
  );
}
