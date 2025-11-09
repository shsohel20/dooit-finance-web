"use client";
import React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import { TrainingRegister } from "./training-register";
import { TrainingDashboard } from "./training-dashboard";
import { AssignTrainingDialog } from "./assign-training-dialog";

export function TrainingSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training Register</h2>
          <p className="text-muted-foreground">
            AML/CTF training compliance management
          </p>
        </div>
        <Button onClick={() => setShowAssignDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Training
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, employee ID, or training topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Training Tabs */}
      <Tabs defaultValue="register" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="register">Training Register</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <TrainingDashboard />
        </TabsContent>

        <TabsContent value="register">
          <TrainingRegister searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>

      <AssignTrainingDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
      />
    </div>
  );
}
