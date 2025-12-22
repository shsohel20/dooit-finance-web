"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Eye } from "lucide-react";
import { useTableColumnResize } from "../hooks/use-table-column.resize";
import { DataTableResizer } from "./tableResizer";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

export default function ResizableTable({
  loading = false,
  columns,
  data,
  onDoubleClick,
  onRowClick,
  actions,
  tableId = "1111",
  tableConfig = {
    enableRowSelection: true,
    enableClickRowSelect: false,
    enableKeyboardNavigation: true,
    enableSearch: true,
    enableDateFilter: true,
    enableColumnVisibility: true,
    enableUrlState: true,
    size: "default",
    columnResizingTableId: "user-table",
    searchPlaceholder: "Search users",
    defaultSortBy: "created_at", // Snake_case sorting (matches API response)
    defaultSortOrder: "desc",
  },
  ...props
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [highlightedId, setHighlightedId] = React.useState(null);
  const { columnSizing, setColumnSizing, resetColumnSizing } =
    useTableColumnResize(tableId, tableConfig.enableColumnResizing);

  const handleColumnSizingChange = React.useCallback(
    (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        setColumnSizing((current) => updaterOrValue(current));
      } else {
        setColumnSizing(updaterOrValue);
      }
    },
    [setColumnSizing]
  );

  React.useEffect(() => {
    const newId = localStorage.getItem("newId");
    if (newId) {
      setHighlightedId(newId);
      localStorage.removeItem("newId"); // cleanup

      // remove highlight after few seconds
      setTimeout(() => setHighlightedId(null), 10000);
    }
  }, []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange", // "onChange" updates live, "onEnd" waits until drag ends
    state: {
      sorting,
      columnVisibility,
    },
    // onColumnSizingChange: handleColumnSizingChange,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    ...props,
  });

  const handleDoubleClick = (row) => {
    if (onDoubleClick) {
      onDoubleClick(row);
    }
  };
  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };
  const handleShowAllColumns = () => {
    const allVisible = {};
    table.getAllLeafColumns().forEach((col) => {
      allVisible[col.id] = true;
    });
    setColumnVisibility(allVisible);
  };

  return (
    <div className="overflow-x-auto   text-xs relative bg-white  mt-4 px-4 rounded-md pb-6 shadow">
      {/* Toolbar */}
      <div className="flex items-center justify-end py-4 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-xs"
              size="sm"
            >
              <Eye className="h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table.getAllLeafColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                className="capitalize"
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={handleShowAllColumns}
            >
              Show All Columns
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {actions && actions}
      </div>
      <div className="rounded-md  border border-border/50">
        <Table
          className="w-full transition-[width] duration-700 ease-in-out border "
          // style={{ width: table.getTotalSize() ?? "100%" }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canResize = header.column.getCanResize();

                  return (
                    <TableHead
                      key={header.id}
                      className={
                        "text-xs     bg-zinc-100  text-zinc-700 uppercase sticky top-0 "
                      }
                      style={{
                        position: "relative",
                        width: header.getSize() ?? "auto",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                      {/* Resizer handle */}
                      {canResize && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="absolute right-0 top-0 h-full w-[2px] cursor-col-resize select-none  hover:bg-gray-400 transition font-extrabold"
                        />
                      )}
                      {/* {canResize && (
                      <DataTableResizer header={header} table={table} />
                    )} */}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {loading ? (
            <>
              <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={`skeleton-row-${index}`} className="">
                    {table.getVisibleLeafColumns().map((header) => {
                      return (
                        <TableCell
                          key={header.id}
                          className={" border-r   first:border-l  font-bold  "}
                        >
                          <Skeleton className="w-full h-10 animate-pulse" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-highlighted={highlightedId === row?.original?.id}
                      className={cn(" hover:bg-neutral-100  font-medium ", {
                        "bg-blue-50 ": highlightedId === row?.original?.id,
                      })}
                      onDoubleClick={() => handleDoubleClick(row.original)}
                      onClick={() => handleRowClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          // data-highlighted={highlightedId === row?.id}
                          className={
                            "text-xs text-zinc-700 border-r w-full   border-b "
                          }
                          style={{
                            width: cell.column.getSize() ?? "auto",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      </div>
    </div>
  );
}
