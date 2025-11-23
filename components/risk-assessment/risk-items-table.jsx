"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const getRiskBadgeColor = (rating) => {
  switch (rating.toLowerCase()) {
    case "low":
      return "bg-green-500 text-white hover:bg-green-600";
    case "medium":
      return "bg-yellow-500 text-white hover:bg-yellow-600";
    case "high":
      return "bg-orange-500 text-white hover:bg-orange-600";
    case "very high":
      return "bg-red-500 text-white hover:bg-red-600";
    case "critical":
      return "bg-purple-600 text-white hover:bg-purple-700";
    default:
      return "bg-gray-500 text-white";
  }
};

const getControlBadgeColor = (assessment) => {
  switch (assessment.toLowerCase()) {
    case "excellent":
      return "bg-blue-500 text-white";
    case "good":
      return "bg-green-500 text-white";
    case "adequate":
      return "bg-yellow-500 text-white";
    case "poor":
      return "bg-orange-500 text-white";
    case "deficient":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export function RiskItemsTable({ risks, onEdit, onDelete }) {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  if (risks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg">
        <p>No risk items found. Add your first risk item to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Risk Indicator</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Inherent Risk</TableHead>
                <TableHead>Control Assessment</TableHead>
                <TableHead>Residual Risk</TableHead>
                <TableHead>Control Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className="font-medium">
                    {risk.riskIndicator}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {risk.category}
                  </TableCell>
                  <TableCell className="text-sm">
                    {risk.inherentRisk.likelihood}
                  </TableCell>
                  <TableCell className="text-sm">
                    {risk.inherentRisk.impact}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getRiskBadgeColor(risk.inherentRisk.rating)}
                    >
                      {risk.inherentRisk.rating} ({risk.inherentRisk.score})
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getControlBadgeColor(
                        risk.residualRisk.controlAssessment
                      )}
                    >
                      {risk.residualRisk.controlAssessment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getRiskBadgeColor(risk.residualRisk.rating)}
                    >
                      {risk.residualRisk.rating} ({risk.residualRisk.score})
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {risk.residualRisk.controlOwner || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRisk(risk);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(risk)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(risk.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Risk Item Details</DialogTitle>
            <DialogDescription>
              Comprehensive view of the risk assessment
            </DialogDescription>
          </DialogHeader>
          {selectedRisk && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Risk Indicator</h4>
                <p className="text-sm">{selectedRisk.riskIndicator}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Category</h4>
                <p className="text-sm">{selectedRisk.category}</p>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Inherent Risk Assessment</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Likelihood
                    </span>
                    <p className="text-sm font-medium">
                      {selectedRisk.inherentRisk.likelihood}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Impact
                    </span>
                    <p className="text-sm font-medium">
                      {selectedRisk.inherentRisk.impact}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Rating
                    </span>
                    <div className="mt-1">
                      <Badge
                        className={getRiskBadgeColor(
                          selectedRisk.inherentRisk.rating
                        )}
                      >
                        {selectedRisk.inherentRisk.rating} (
                        {selectedRisk.inherentRisk.score})
                      </Badge>
                    </div>
                  </div>
                  {selectedRisk.inherentRisk.nraRating && (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        NRA Rating
                      </span>
                      <p className="text-sm font-medium">
                        {selectedRisk.inherentRisk.nraRating}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Residual Risk Assessment</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Control Measures
                    </span>
                    <p className="text-sm mt-1">
                      {selectedRisk.residualRisk.controls || "—"}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Control Owner
                      </span>
                      <p className="text-sm font-medium">
                        {selectedRisk.residualRisk.controlOwner || "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Control Assessment
                      </span>
                      <div className="mt-1">
                        <Badge
                          className={getControlBadgeColor(
                            selectedRisk.residualRisk.controlAssessment
                          )}
                        >
                          {selectedRisk.residualRisk.controlAssessment}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Residual Risk Rating
                      </span>
                      <div className="mt-1">
                        <Badge
                          className={getRiskBadgeColor(
                            selectedRisk.residualRisk.rating
                          )}
                        >
                          {selectedRisk.residualRisk.rating} (
                          {selectedRisk.residualRisk.score})
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
