"use client";

import React, { useCallback } from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useModules } from "@/contexts/module-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { getAllParts, getModuleById } from "../../../../actions";
import PartModal from "../PartModal";

export default function ModuleEditorPage() {
  const [moduleData, setModuleData] = useState(null);
  const [parts, setParts] = useState([]);
  const params = useParams();
  const router = useRouter();
  const user = { id: "1", role: "admin" };
  const { updateModule, addPart, deletePart, publishModule } = useModules();
  const moduleId = params.id;

  // const moduleData = getModuleById(moduleId);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPartTitle, setNewPartTitle] = useState("");
  const [newPartVideo, setNewPartVideo] = useState("");
  const [editingModule, setEditingModule] = useState(moduleData);
  const [isLoading, setIsLoading] = useState(false);

  // Update editingModule when module changes
  useEffect(() => {
    const fetchModule = async () => {
      setIsLoading(true);
      const res = await getModuleById(moduleId);
      // console.log("res", res);
      setModuleData(res.data);
      setIsLoading(false);
    };
    fetchModule();
  }, [moduleId]);
  //usecallback
  const fetchParts = useCallback(async () => {
    const res = await getAllParts(moduleId);
    setParts(res.data);
  }, [moduleId]);
  useEffect(() => {
    if (!moduleId) return;

    fetchParts();
  }, [fetchParts, moduleId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !moduleData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">Module not found</p>
        <p className="text-sm text-muted-foreground mb-4">Module ID: {moduleId}</p>
        <Button
          onClick={() => router.push("/dashboard/client/knowledge-hub/training-hub/admin/modules")}
          className="mt-4"
        >
          Back to Modules
        </Button>
      </div>
    );
  }

  const handlePublish = () => {
    if (module.parts.length === 0) {
      alert("Add at least one part before publishing");
      return;
    }
    publishModule(moduleId);
    alert("Module published successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{moduleData.title}</h1>
            <p className="text-muted-foreground">
              Status:{" "}
              <span
                className={`font-semibold ${moduleData.status === "published" ? "text-success" : "text-warning"}`}
              >
                {moduleData.status.charAt(0).toUpperCase() + moduleData.status.slice(1)}
              </span>
            </p>
          </div>
        </div>
        {moduleData.status === "draft" && <Button onClick={handlePublish}>Publish Module</Button>}
      </div>

      {/* Module Info */}
      <Card>
        <CardHeader>
          <CardTitle>Module Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label className="text-muted-foreground">Title</Label>
              <p className="text-lg font-semibold">{moduleData.title}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="text-base">{moduleData.description || "No description"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Module Parts ({moduleData.parts.length})</CardTitle>
            <CardDescription>Each part contains a video and questions</CardDescription>
          </div>
          {/* {openDialog && ( */}
          <PartModal
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            moduleId={moduleId}
            fetchParts={fetchParts}
          />
          {/* )} */}
        </CardHeader>
        <CardContent>
          {parts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No parts yet. Add one to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {parts.map((part, index) => (
                <div
                  key={part.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Part {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground">{part.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{part.videoUrl}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {part.questions.length} question{part.questions.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/client/knowledge-hub/training-hub/admin/modules/${moduleId}/parts/${part.id}`,
                          )
                        }
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePart(moduleId, part.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
