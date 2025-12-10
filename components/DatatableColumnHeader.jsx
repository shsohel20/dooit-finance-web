// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   CaretSortIcon,
//   EyeNoneIcon,
// } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconArrowDown,
  IconArrowUp,
  IconCaretUpDown,
  IconEyeOff,
} from "@tabler/icons-react";
import { ChevronsUpDown } from "lucide-react";

export function DataTableColumnHeader({ column, title, className }) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  // Get the current sort direction for this column
  const currentDirection = column.getIsSorted();

  // Use direct method to set sort with an explicit direction
  const setSorting = (direction) => {
    // If we're clearing sort, use an empty array
    if (direction === false) {
      column.toggleSorting(undefined, false);
      return;
    }

    // Set explicit sort with the direction
    // The second param (false) prevents multi-sort
    column.toggleSorting(direction === "desc", false);
  };

  return (
    <div className={cn("flex items-center  ", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=" h-8 hover:bg-transparent hover:text-primary uppercase"
          >
            <span className="text-xs">{title}</span>
            {currentDirection === "desc" ? (
              <IconArrowDown className="ml-2 size-3" />
            ) : currentDirection === "asc" ? (
              <IconArrowUp className="ml-2 size-3" />
            ) : (
              <ChevronsUpDown className="ml-2 size-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setSorting("asc")}>
            <IconArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSorting("desc")}>
            <IconArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <IconEyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
