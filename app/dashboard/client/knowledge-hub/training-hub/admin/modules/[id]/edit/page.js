"use client";

import React, { useCallback } from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, Edit2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllParts, getModuleById, publishModule, deletePart } from "../../../../actions";
import PartModal from "../PartModal";
import { toast } from "sonner";

export default function ModuleEditorPage() {
  const [moduleData, setModuleData] = useState(null);
  const [parts, setParts] = useState([]);
  const params = useParams();
  const router = useRouter();
  const user = { id: "1", role: "admin" };
  const [isPublishing, setIsPublishing] = useState(false);
  const moduleId = params.id;
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletePartTarget, setDeletePartTarget] = useState(null);
  const [isDeletingPart, setIsDeletingPart] = useState(false);

  const fetchModule = async () => {
    setIsLoading(true);
    const res = await getModuleById(moduleId);
    // console.log("res", res);
    setModuleData(res.data);
    setIsLoading(false);
  };
  // Update editingModule when module changes
  useEffect(() => {
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

  const handleDeletePart = async () => {
    if (!deletePartTarget) return;
    setIsDeletingPart(true);
    const res = await deletePart(deletePartTarget._id);
    setIsDeletingPart(false);
    setDeletePartTarget(null);
    if (res.success) {
      toast.success("Part deleted");
      fetchParts();
      fetchModule();
    } else {
      toast.error("Failed to delete part");
    }
  };

  const handlePublish = async () => {
    if (moduleData.parts.length === 0) {
      toast("Add at least one part before publishing");
      return;
    }
    const data = {
      status: "published",
    };
    setIsPublishing(true);
    const res = await publishModule(moduleId, data);
    if (res.success) {
      toast.success("Module published successfully");
      fetchModule();
    }
    setIsPublishing(false);
  };

  return (
    <>
    <AlertDialog open={!!deletePartTarget} onOpenChange={(open) => !open && setDeletePartTarget(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Part</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{deletePartTarget?.title}&quot;? This will also remove all questions in this part.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeletingPart}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeletePart}
            disabled={isDeletingPart}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeletingPart ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
        {moduleData.status === "draft" && (
          <Button variant={"outline"} onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? "Publishing..." : "Publish Module"}
          </Button>
        )}
      </div>

      {/* Parts Section */}
      <Card className={"border-0"}>
        <CardHeader className="flex flex-row items-center justify-between p-0">
          <div>
            <CardTitle>Module Parts ({moduleData.parts.length})</CardTitle>
            <CardDescription>Each part contains a video and questions</CardDescription>
          </div>
          {/* {openDialog && ( */}
          {openDialog && (
            <PartModal
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              moduleId={moduleId}
              fetchParts={fetchParts}
            />
          )}
          <Button size="sm" className="gap-2" onClick={() => setOpenDialog(true)}>
            <Plus className="w-4 h-4" />
            Add Part
          </Button>
          {/* )} */}
        </CardHeader>
        <CardContent className={"p-0"}>
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
                      <p className="text-sm text-muted-foreground mt-1">{part.video?.url}</p>
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
                        onClick={() => setDeletePartTarget(part)}
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
    </>
  );
}
