import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconFiles, IconFile, IconPhoto, IconEye } from "@tabler/icons-react";
import { dateShowFormat, fmt } from "@/lib/utils";

const getDocStatusVariant = (status) => {
  const map = {
    verified: "success",
    approved: "success",
    pending: "warning",
    rejected: "danger",
  };
  return map[status?.toLowerCase()] || "muted";
};

function DocumentRow({ doc }) {
  const isImage = doc.mimeType?.startsWith("image/");
  const statusVariant = getDocStatusVariant(doc.sumsubStatus);

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors group">
      {isImage ? (
        <div className="h-12 w-12 rounded-md overflow-hidden border border-border bg-muted shrink-0">
          <img
            src={doc.url}
            alt={doc.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-muted shrink-0">
          <IconFile className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
          <span className="text-xs text-muted-foreground">{fmt(doc.docType)}</span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-xs text-muted-foreground capitalize">{doc.type}</span>
          {doc.uploadedAt && (
            <>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-xs text-muted-foreground">
                {dateShowFormat(doc.uploadedAt)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <StatusPill variant={statusVariant}>{fmt(doc.sumsubStatus)}</StatusPill>
        <a
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center h-8 w-8 rounded-md border border-border hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          title="View document"
        >
          <IconEye className="h-4 w-4 text-muted-foreground" />
        </a>
      </div>
    </div>
  );
}

export default function DocumentsSection({ staff }) {
  const documents = staff?.documents || [];

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <IconFiles className="h-4 w-4 text-primary" />
            </div>
            Documents
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {documents.length} file{documents.length !== 1 ? "s" : ""}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40 mb-3">
              <IconPhoto className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No documents uploaded</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc, i) => (
              <DocumentRow key={i} doc={doc} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
