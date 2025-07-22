"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  Cell,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditableDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onUpdate?: (rowIndex: number, columnId: string, value: string) => void;
  editableColumns?: string[];
  dropdownOptions?: Record<string, { value: string; label: string }[]>;
}

export function EditableDataTable<TData, TValue>({
  columns,
  data,
  onUpdate,
  editableColumns = [],
  dropdownOptions = {},
}: EditableDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const startEditing = (
    rowIndex: number,
    columnId: string,
    currentValue: string
  ) => {
    if (editableColumns.includes(columnId)) {
      setEditingCell({ rowIndex, columnId });
      setEditValue(currentValue);
    }
  };
  const saveEdit = () => {
    if (editingCell && onUpdate) {
      onUpdate(editingCell.rowIndex, editingCell.columnId, String(editValue));
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const renderEditableCell = (cell: Cell<TData, TValue>, rowIndex: number) => {
    const columnId = cell.column.id;
    const isEditing =
      editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId;
    const isEditable = editableColumns.includes(columnId);
    const cellValue = cell.getValue();

    if (isEditing) {
      // Check if this column has dropdown options
      if (dropdownOptions[columnId]) {
        return (
          <div className="flex items-center gap-2">
            {" "}
            <Select
              value={editValue}
              onValueChange={(value) => setEditValue(value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions[columnId].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      } else {
        // Regular input field
        return (
          <div className="">
            {" "}
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 w-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
            />
          </div>
        );
      }
    } // Display mode
    return (
      <div
        className={`${
          isEditable ? "cursor-pointer hover:bg-muted/50 p-1 rounded" : ""
        }`}
        onClick={() =>
          isEditable && startEditing(rowIndex, columnId, String(cellValue))
        }
        title={isEditable ? "Click to edit" : ""}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {renderEditableCell(cell, rowIndex)}
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
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4 p-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, rowIndex) => (
            <Card key={row.id}>
              <CardContent className="space-y-2 pt-4">
                {row.getVisibleCells().map((cell) => {
                  const header = table
                    .getHeaderGroups()[0]
                    .headers.find((h) => h.column.id === cell.column.id);
                  return (
                    <div
                      key={cell.id}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium">
                        {header
                          ? flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          : cell.column.id}
                      </span>
                      <div className="flex-1 ml-4">
                        {renderEditableCell(cell, rowIndex)}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-4">No results.</div>
        )}
      </div>
    </div>
  );
}
