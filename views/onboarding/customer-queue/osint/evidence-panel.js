import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Archive,
  Paperclip,
} from "lucide-react";

const typeIcon = {
  screenshot: <ImageIcon className="size-3.5" />,
  document: <FileText className="size-3.5" />,
  link: <LinkIcon className="size-3.5" />,
  archived_page: <Archive className="size-3.5" />,
};

const typeStyle = {
  screenshot: "bg-primary/10 text-primary border-primary/20",
  document: "bg-amber-50 text-amber-700 border-amber-200",
  link: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived_page: "bg-muted text-muted-foreground border-border",
};

export function EvidencePanel({ items }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Paperclip className="size-8 mb-2 opacity-40" />
        <p className="text-sm">No evidence items attached.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead>Label</TableHead>
            <TableHead className="w-[140px]">Source</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="w-[200px]">Integrity Hash</TableHead>
            <TableHead className="w-[60px]">Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Badge variant="outline" className={`text-[10px] ${typeStyle[item.type] ?? ""}`}>
                  {typeIcon[item.type]}
                  {item.type.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">{item.source}</span>
              </TableCell>
              <TableCell>
                <span className="text-xs font-mono text-muted-foreground">{item.date}</span>
              </TableCell>
              <TableCell>
                {item.hash ? (
                  <span className="text-[10px] font-mono text-muted-foreground">{item.hash}</span>
                ) : (
                  <span className="text-xs text-muted-foreground/50">--</span>
                )}
              </TableCell>
              <TableCell>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                  aria-label={`Open evidence: ${item.label}`}
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
