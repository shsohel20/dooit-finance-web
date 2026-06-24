"use client"



import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TableHead } from "./table"
import { cn } from "@/lib/utils"



const ResizableTableHead = ({ id, className, children, style: tableHeadStyle }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: transition,
    whiteSpace: 'nowrap',
    width: 200,
    zIndex: isDragging ? 1 : 0,
    ...tableHeadStyle
  }

  return (
    <TableHead ref={setNodeRef} style={style} className={cn("font-bold bg-primary/10 text-primary pt-1", className)}>
      <div className="flex items-center w-full h-full gap-1">
        {/* Drag handle — only this element triggers column reorder */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing shrink-0 opacity-30 hover:opacity-70 px-0.5 select-none"
        >
          ⠿
        </span>
        {children}
      </div>
    </TableHead>
  )
}

export default ResizableTableHead
