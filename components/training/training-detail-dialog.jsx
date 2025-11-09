"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Download, FileText, User } from "lucide-react";

export function TrainingDetailDialog({ record, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-5 w-5" />
            {record.participantName}
            <Badge variant="outline">{record.employeeId}</Badge>
          </DialogTitle>
          <DialogDescription>
            {record.department} • {record.role}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Training Details</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Training Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Training Topic
                  </div>
                  <div className="mt-1">{record.trainingTopic}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Training Type
                  </div>
                  <div className="mt-1">
                    <Badge variant="outline">{record.trainingType}</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Delivery Method
                  </div>
                  <div className="mt-1">{record.deliveryMethod}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Trainer Name
                  </div>
                  <div className="mt-1">{record.trainerName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Material Version
                  </div>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {record.trainingMaterialVersion}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Industry Type
                  </div>
                  <div className="mt-1">{record.industryType || "General"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Completion & Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Date Completed
                  </div>
                  <div className="mt-1">
                    {record.dateCompleted || "Not completed"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Score / Result
                  </div>
                  <div className="mt-1 font-medium">{record.score || "—"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Assessment Attempts
                  </div>
                  <div className="mt-1">
                    {record.assessmentAttempts > 1 ? (
                      <Badge variant="secondary">
                        {record.assessmentAttempts} attempts
                      </Badge>
                    ) : (
                      `${record.assessmentAttempts} attempt`
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Refresh Frequency
                    </div>
                    <div className="mt-1">{record.refreshFrequency} months</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Next Refresh Date
                    </div>
                    <div className="mt-1 font-medium">
                      {record.nextRefreshDate || "—"}
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Current Status
                  </div>
                  <Badge
                    variant={
                      record.complianceStatus === "Compliant"
                        ? "default"
                        : record.complianceStatus === "Due Soon"
                        ? "secondary"
                        : "destructive"
                    }
                    className="gap-1"
                  >
                    {record.complianceStatus === "Compliant" && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {record.complianceStatus === "Due Soon" && (
                      <Clock className="h-3 w-3" />
                    )}
                    {record.complianceStatus}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {record.complianceStatus === "Compliant" &&
                      "Training is up to date and compliant with requirements."}
                    {record.complianceStatus === "Due Soon" &&
                      "Training refresh is due within 30 days. Schedule renewal soon."}
                    {record.complianceStatus === "Overdue" &&
                      "Training is overdue. Immediate action required."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Manager Acknowledgment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {record.managerAcknowledgment.acknowledged ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Acknowledged</span>
                    </div>
                    <div className="text-sm">
                      <div>
                        <span className="text-muted-foreground">Manager: </span>
                        {record.managerAcknowledgment.managerName}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date: </span>
                        {record.managerAcknowledgment.timestamp &&
                          new Date(
                            record.managerAcknowledgment.timestamp
                          ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock className="h-4 w-4" />
                    <span>Pending manager acknowledgment</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {record.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{record.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="evidence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Training Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                {record.evidence.length > 0 ? (
                  <div className="space-y-3">
                    {record.evidence.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">
                              {file.fileName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Uploaded: {file.uploadDate}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No evidence files attached
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="text-sm text-muted-foreground w-32">
                      Created
                    </div>
                    <div className="text-sm">
                      {new Date(record.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-sm text-muted-foreground w-32">
                      Last Updated
                    </div>
                    <div className="text-sm">
                      {new Date(record.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
