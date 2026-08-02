"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconUpload, IconDownload, IconFile, IconX, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { importTransactionsCsv } from "@/app/dashboard/client/transactions/actions";

// ── CSV template the user can download to know the expected format ────────────
const TEMPLATE_HEADERS = [
  "Type", "Status", "Channel", "Amount", "Currency", "Amount (AUD)",
  "Reference", "Narrative", "Purpose",
  "Sender Name", "Sender Account", "Sender Institution",
  "Receiver Name", "Receiver Account",
  "Beneficiary Name", "Beneficiary Account",
  "Risk Score",
].join(",");

const TEMPLATE_ROW =
  "transfer,pending,online,1000.00,AUD,1000.00,REF-001,Payment for services,General," +
  "John Smith,123456789,ANZ Bank,Jane Doe,987654321,,,0";

const TEMPLATE_CSV = `${TEMPLATE_HEADERS}\n${TEMPLATE_ROW}\n`;

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "transactions-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ImportModal({ open, setOpen, onSuccess }) {
  const inputRef = useRef(null);
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null); // { created, failed, errors, message }

  const reset = () => {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && (f.type === "text/csv" || f.name.endsWith(".csv"))) {
      setFile(f);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      // Read file as ArrayBuffer (serialisable across server-action boundary)
      const arrayBuffer = await file.arrayBuffer();
      const res = await importTransactionsCsv(arrayBuffer, file.name);
      setResult(res);
      if (res.success && res.created > 0 && onSuccess) onSuccess();
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk-import transactions. Download the template
            to see the expected column format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* Template download */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={downloadTemplate}
          >
            <IconDownload className="size-3.5" />
            Download CSV Template
          </Button>

          {/* Drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            {file ? (
              <>
                <IconFile className="size-8 text-primary" />
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </>
            ) : (
              <>
                <IconUpload className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Drag &amp; drop a CSV file here, or <span className="text-primary font-medium">click to browse</span>
                </p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* File selected — clear button */}
          {file && !result && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <IconX className="size-3" /> Remove file
            </button>
          )}

          {/* Result summary */}
          {result && (
            <div className={`rounded-lg border p-4 space-y-2 ${
              result.success
                ? "border-success/30 bg-success/5"
                : "border-destructive/30 bg-destructive/5"
            }`}>
              <div className="flex items-center gap-2">
                {result.success
                  ? <IconCheck className="size-4 text-success shrink-0" />
                  : <IconAlertTriangle className="size-4 text-destructive shrink-0" />}
                <p className="text-sm font-medium">{result.message}</p>
              </div>

              {result.success && (
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="text-success font-medium">{result.created} created</span>
                  {result.failed > 0 && (
                    <span className="text-destructive font-medium">{result.failed} failed</span>
                  )}
                </div>
              )}

              {result.errors?.length > 0 && (
                <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto text-xs text-destructive">
                  {result.errors.map((e, i) => (
                    <li key={i}>Row {e.row}: {e.reason}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button
              disabled={!file || loading}
              onClick={handleImport}
              className="gap-1.5"
            >
              {loading ? (
                <><span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Importing…</>
              ) : (
                <><IconUpload className="size-3.5" />Import</>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
