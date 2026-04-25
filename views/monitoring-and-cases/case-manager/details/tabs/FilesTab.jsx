"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconFile,
  IconFileTypePdf,
  IconFileTypeXls,
  IconPhoto,
  IconUpload,
  IconDownload,
  IconTrash,
} from "@tabler/icons-react";
import { dateShowFormat } from "@/lib/utils";

const fileIcons = {
  pdf: IconFileTypePdf,
  excel: IconFileTypeXls,
  image: IconPhoto,
};

const fileIconColors = {
  pdf: "text-red-500",
  excel: "text-green-600",
  image: "text-blue-500",
};

export default function FilesTab({ caseData }) {
  const [files, setFiles] = useState(caseData?.files || []);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const newFiles = selected.map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toISOString(),
      type: f.name.endsWith(".pdf")
        ? "pdf"
        : f.name.match(/\.(xlsx|xls|csv)$/)
          ? "excel"
          : f.name.match(/\.(jpg|jpeg|png|gif)$/)
            ? "image"
            : "file",
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    const newFiles = dropped.map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toISOString(),
      type: f.name.endsWith(".pdf")
        ? "pdf"
        : f.name.match(/\.(xlsx|xls|csv)$/)
          ? "excel"
          : f.name.match(/\.(jpg|jpeg|png|gif)$/)
            ? "image"
            : "file",
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  };

  const handleRemove = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Zone */}
      <Card className="border border-border ">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconUpload className="size-4" />
            Upload Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <IconUpload className="mx-auto mb-2 size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-heading">
              Drag & drop files here, or{" "}
              <span className="text-primary underline underline-offset-2">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports PDF, Excel, Images (max 50 MB each)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
            />
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card className="border border-border ">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconFile className="size-4" />
            Uploaded Files ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No files uploaded yet.</p>
          ) : (
            <div className="divide-y">
              {files.map((file, i) => {
                const Icon = fileIcons[file.type] || IconFile;
                const iconColor = fileIconColors[file.type] || "text-muted-foreground";
                return (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className="rounded-md bg-muted p-2">
                      <Icon className={`size-4 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-heading">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.size} · {dateShowFormat(file.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant="outline" className="text-xs uppercase">
                        {file.type}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <IconDownload className="size-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleRemove(i)}
                      >
                        <IconTrash className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
