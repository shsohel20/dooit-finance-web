"use client"



import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TableHead } from "./table"
import { cn } from "@/lib/utils"



const ResizableTableHead = ({ id, className, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: transition,
    whiteSpace: 'nowrap',
    width: 200,
    zIndex: isDragging ? 1 : 0
  }

  return (
    <TableHead ref={setNodeRef} style={style} className={cn("font-bold bg-primary/10 text-primary pt-1", className)}>
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </div>
    </TableHead>
  )
}

export default ResizableTableHead
