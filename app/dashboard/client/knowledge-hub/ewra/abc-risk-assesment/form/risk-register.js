import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronRight } from 'lucide-react'


const statusColors = {
  'In Progress': 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
  Completed: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
  'Review Required': 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
  'Not Started': 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
}

const levelColors = {
  Low: 'bg-green-100 text-green-900',
  Medium: 'bg-yellow-100 text-yellow-900',
  High: 'bg-red-100 text-red-900',
  Critical: 'bg-red-600 text-white',
}

export function RiskRegister({ risks }) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-foreground">ABC Risk Register</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="text-xs font-semibold">Risk ID</TableHead>
              <TableHead className="text-xs font-semibold">Risk Description</TableHead>
              <TableHead className="text-xs font-semibold">Category</TableHead>
              <TableHead className="text-xs font-semibold">Likelihood</TableHead>
              <TableHead className="text-xs font-semibold">Impact</TableHead>
              <TableHead className="text-xs font-semibold">Risk Level</TableHead>
              <TableHead className="text-xs font-semibold">Owner</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((risk) => (
              <TableRow key={risk.id} className="hover:bg-muted/50">
                <TableCell className="text-sm font-mono text-foreground">{risk.id}</TableCell>
                <TableCell className="text-sm text-foreground max-w-xs">{risk.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{risk.category}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{risk.likelihood}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{risk.impact}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${levelColors[risk.level]} border-0`}
                  >
                    {risk.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-foreground">{risk.owner}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${statusColors[risk.status]} border-0`}
                  >
                    {risk.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between p-4 border-t bg-muted/30">
        <span className="text-xs text-muted-foreground">Showing {risks.length} risks</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">1 / 67</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
