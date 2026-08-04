"use client";

import { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconFile,
  IconFileTypePdf,
  IconFileTypeXls,
  IconPhoto,
  IconUpload,
  IconDownload,
  IconPencil,
  IconTrash,
  IconSearch,
} from "@tabler/icons-react";
import { dateShowFormat } from "@/lib/utils";

const FILE_ICONS = { pdf: IconFileTypePdf, excel: IconFileTypeXls, image: IconPhoto };
const FILE_ICON_COLORS = { pdf: "text-red-500", excel: "text-green-600", image: "text-blue-500" };
const FILE_ICON_BG = { pdf: "bg-red-50", excel: "bg-green-50", image: "bg-blue-50" };

function inferType(name) {
  if (name.endsWith(".pdf")) return "pdf";
  if (name.match(/\.(xlsx|xls|csv)$/)) return "excel";
  if (name.match(/\.(jpg|jpeg|png|gif)$/)) return "image";
  return "file";
}

export default function FilesTab({ caseData }) {
  const [files, setFiles] = useState(caseData?.files || []);
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const fileInputRef = useRef(null);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toISOString(),
      by: "You",
      type: inferType(f.name),
    }));
    if (incoming.length) setFiles((prev) => [...incoming, ...prev]);
    setUploadOpen(false);
  };

  const handleRemove = (file) => setFiles((prev) => prev.filter((f) => f !== file));

  const filtered = useMemo(() => {
    if (!search.trim()) return files;
    const q = search.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, search]);

  return (
    <Card className="border-border py-0 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-base font-semibold text-heading">
            <IconFile className="size-4" />
            Files
          </span>
          <Badge variant="outline" className="text-xs">
            {files.length} total
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-56 pl-8 text-sm"
            />
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => setUploadOpen((v) => !v)}>
            <IconUpload className="size-3.5" />
            Upload files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
            accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {uploadOpen && (
        <CardContent className="pb-0 pt-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <IconUpload className="mx-auto mb-2 size-7 text-muted-foreground" />
            <p className="text-sm font-medium text-heading">
              Drag & drop files here, or <span className="text-primary underline underline-offset-2">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Supports PDF, Excel, Images (max 50 MB each)</p>
          </div>
        </CardContent>
      )}

      <div className="grid grid-cols-[36px_3fr_1.4fr_1.2fr_1fr_120px] items-center gap-2 border-b border-border bg-muted/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <div />
        <div>Name</div>
        <div>Format</div>
        <div>Created By</div>
        <div>Date</div>
        <div className="text-right">Actions</div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {files.length === 0 ? "No files uploaded yet." : "No files match your search."}
        </p>
      ) : (
        <div className="divide-y divide-border">
          {filtered.map((file, i) => {
            const Icon = FILE_ICONS[file.type] || IconFile;
            return (
              <div
                key={`${file.name}-${i}`}
                className="grid grid-cols-[36px_3fr_1.4fr_1.2fr_1fr_120px] items-center gap-2 px-5 py-3 text-sm"
              >
                <div className="size-4 rounded border border-border" />
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${FILE_ICON_BG[file.type] || "bg-muted"}`}>
                    <Icon className={`size-3.5 ${FILE_ICON_COLORS[file.type] || "text-muted-foreground"}`} />
                  </span>
                  <span className="truncate font-medium text-heading">{file.name}</span>
                </div>
                <div>
                  <Badge variant="outline" className="text-xs uppercase">
                    {file.type}
                  </Badge>
                </div>
                <div className="truncate text-muted-foreground">{file.by || caseData?.assignedAnalyst || "—"}</div>
                <div className="text-muted-foreground">{dateShowFormat(file.date)}</div>
                <div className="flex items-center justify-end gap-3 text-muted-foreground">
                  <button type="button" title="Download" className="hover:text-heading">
                    <IconDownload className="size-4" />
                  </button>
                  <button type="button" title="Rename" className="hover:text-heading">
                    <IconPencil className="size-4" />
                  </button>
                  <button type="button" title="Delete" onClick={() => handleRemove(file)} className="hover:text-danger">
                    <IconTrash className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
