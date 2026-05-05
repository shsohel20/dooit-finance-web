"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  IconBell,
  IconLoader2,
  IconUnlink,
  IconAlertTriangle,
  IconPlus,
} from "@tabler/icons-react";
import { dateShowFormat } from "@/lib/utils";
import {
  getCaseAlerts,
  unlinkAlert,
  linkAlerts,
} from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";
import LinkAlertsDialog from "../../LinkAlertsDialog";

const ALERT_STATUS_VARIANT = {
  new:                "info",
  under_review:       "warning",
  escalated_to_case:  "success",
  dismissed:          "outline",
  false_positive:     "muted",
};

const ALERT_STATUS_LABEL = {
  new:                "New",
  under_review:       "Under Review",
  escalated_to_case:  "Escalated",
  dismissed:          "Dismissed",
  false_positive:     "False Positive",
};

export default function LinkedAlertsTab({ caseData, onCaseUpdate }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlinking, setUnlinking] = useState(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const reload = async () => {
    if (!caseData?._id) return;
    setLoading(true);
    try {
      const res = await getCaseAlerts(caseData._id);
      if (res?.succeed) setAlerts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseData?._id]);

  const handleLink = async (alertIds) => {
    const res = await linkAlerts(caseData._id, alertIds);
    if (res?.succeed) {
      onCaseUpdate?.(res.data);
      await reload();
    }
  };

  const handleUnlink = async (alertId) => {
    setUnlinking(alertId);
    try {
      const res = await unlinkAlert(caseData._id, alertId);
      if (res?.succeed) {
        setAlerts((prev) => prev.filter((a) => a._id !== alertId));
        onCaseUpdate?.({
          ...caseData,
          linkedAlerts: (caseData.linkedAlerts || []).filter(
            (a) => (a._id || a) !== alertId
          ),
        });
      }
    } finally {
      setUnlinking(null);
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <IconBell className="size-4" />
          Linked Alerts ({alerts.length})
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 text-xs"
          onClick={() => setLinkDialogOpen(true)}
        >
          <IconPlus className="size-3" />
          Link Alerts
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <IconAlertTriangle className="size-8 opacity-30" />
            <p className="text-sm">No alerts linked to this case.</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 h-7 gap-1 text-xs"
              onClick={() => setLinkDialogOpen(true)}
            >
              <IconPlus className="size-3" />
              Link Alerts
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-heading">
                      {alert.uid}
                    </span>
                    <StatusPill variant={ALERT_STATUS_VARIANT[alert.status] || "outline"}>
                      {ALERT_STATUS_LABEL[alert.status] || alert.status}
                    </StatusPill>
                    {alert.riskLabel && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {alert.riskLabel} risk
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {alert.caseType && <span>{alert.caseType}</span>}
                    {alert.riskScore != null && <span>Score: {alert.riskScore}</span>}
                    {alert.customer?.name && <span>Customer: {alert.customer.name}</span>}
                    <span>{dateShowFormat(alert.createdAt)}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                  disabled={!!unlinking}
                  onClick={() => handleUnlink(alert._id)}
                  title="Unlink alert"
                >
                  {unlinking === alert._id ? (
                    <IconLoader2 className="size-3.5 animate-spin" />
                  ) : (
                    <IconUnlink className="size-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <LinkAlertsDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onConfirm={handleLink}
        excludeIds={alerts.map((a) => a._id)}
      />
    </Card>
  );
}
