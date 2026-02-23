import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion } from "lucide-react";

const statusConfig = {
  confirmed_match: {
    label: "Confirmed",
    icon: <ShieldAlert className="size-3.5" />,
    cls: "bg-red-50 text-red-700 border-red-200",
  },
  potential_match: {
    label: "Potential",
    icon: <ShieldQuestion className="size-3.5" />,
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  false_positive: {
    label: "False Positive",
    icon: <ShieldX className="size-3.5" />,
    cls: "bg-muted text-muted-foreground",
  },
  cleared: {
    label: "Cleared",
    icon: <ShieldCheck className="size-3.5" />,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const typeStyles = {
  sanctions: "bg-red-50 text-red-700 border-red-200",
  pep: "bg-primary/10 text-primary border-primary/20",
  watchlist: "bg-amber-50 text-amber-700 border-amber-200",
  enforcement: "bg-orange-50 text-orange-700 border-orange-200",
};

function MatchBar({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 85 ? "bg-red-500" : score >= 60 ? "bg-amber-500" : "bg-muted-foreground/40"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums text-muted-foreground">{score}%</span>
    </div>
  );
}

export function SanctionsPepPanel({ items }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ShieldCheck className="size-8 mb-2 opacity-40" />
        <p className="text-sm">No sanctions or PEP matches found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">List</TableHead>
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead className="w-[100px]">Match</TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="w-[90px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const st = statusConfig[item.status] ?? statusConfig.cleared;
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {item.listName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{item.source}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${typeStyles[item.listType] ?? ""}`}
                  >
                    {item.listType.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <MatchBar score={item.matchScore} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={st.cls}>
                    {st.icon}
                    {st.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-md whitespace-normal">
                    {item.details}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-mono text-muted-foreground">{item.listDate}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
