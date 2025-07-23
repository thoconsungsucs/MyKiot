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
import { Plus } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";

// Extended ColumnDef type with width property - exported for use in other components
export type ColumnDefWithWidth<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  width?: string; // Optional CSS width value (e.g., "150px", "20%", "auto")
};

interface EditableDataTableProps<TData, TValue> {
  columns: ColumnDefWithWidth<TData, TValue>[];
  data: TData[];
  onUpdate?: (rowIndex: number, columnId: string, value: string) => void;
  onAddRow?: () => void;
  addRowButtonText?: string;
  editableColumns?: string[];
  dropdownOptions?: Record<string, ComboboxOption[]>;
  /**
   * @deprecated Use width property in column definitions instead
   * Optional fixed widths for columns. Key should match column id, value should be CSS width string.
   * Example: { id: "80px", name: "200px", email: "220px" }
   */
  columnWidths?: Record<string, string>;
}

export function EditableDataTable<TData, TValue>({
  columns,
  data,
  onUpdate,
  onAddRow,
  addRowButtonText = "Thêm dòng mới",
  editableColumns = [],
  dropdownOptions = {},
  columnWidths = {},
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
    console.log("Edit value:", editValue);
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
          <div className="absolute bottom-2 left-[3.4px] right-2">
            <Combobox
              options={dropdownOptions[columnId]}
              value={editValue}
              onValueChange={(value) => {
                console.log("Selected value:", value);
                setEditValue(value);
                // Save immediately with the new value instead of waiting for state update
                if (editingCell && onUpdate) {
                  onUpdate(editingCell.rowIndex, editingCell.columnId, value);
                }
                cancelEdit();
              }}
            />
          </div>
        );
      } else {
        // Regular input field
        return (
          <div className="absolute bottom-2.5 left-[3.4px] right-2">
            {" "}
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8 w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              onBlur={() => saveEdit()}
              autoFocus
            />
          </div>
        );
      }
    } // Display mode
    return (
      <div
        className={`${
          isEditable ? "h-8 cursor-pointer hover:bg-muted/50 p-1 rounded" : ""
        } truncate`}
        onClick={() =>
          isEditable && startEditing(rowIndex, columnId, String(cellValue))
        }
        title={isEditable ? "Nhấn để sửa đổi" : String(cellValue)}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    );
  };

  const hasFixedWidths =
    columns.some((col) => (col as ColumnDefWithWidth<TData, TValue>).width) ||
    Object.keys(columnWidths).length > 0;

  return (
    <div className="space-y-4">
      {/* Add Row Button - Only show if onAddRow is provided */}
      {onAddRow && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={onAddRow}
            size="sm"
            variant="outline"
            className="text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            {addRowButtonText}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <Table
            style={
              hasFixedWidths
                ? { tableLayout: "fixed", width: "100%" }
                : undefined
            }
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnDef = header.column
                      .columnDef as ColumnDefWithWidth<TData, TValue>;
                    const width =
                      columnDef.width || columnWidths[header.column.id];
                    return (
                      <TableHead
                        key={header.id}
                        className="whitespace-nowrap px-3 py-2"
                        style={
                          width
                            ? { width, minWidth: width, maxWidth: width }
                            : undefined
                        }
                      >
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
                    {row.getVisibleCells().map((cell) => {
                      const columnDef = cell.column
                        .columnDef as ColumnDefWithWidth<TData, TValue>;
                      const width =
                        columnDef.width || columnWidths[cell.column.id];
                      return (
                        <TableCell
                          key={cell.id}
                          className="px-3 py-2 text-ellipsis overflow-hidden relative"
                          style={
                            width
                              ? { width, minWidth: width, maxWidth: width }
                              : undefined
                          }
                        >
                          {renderEditableCell(cell, rowIndex)}
                        </TableCell>
                      );
                    })}
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
                        className="flex justify-between items-start"
                      >
                        <span className="font-medium min-w-0 flex-shrink-0 mr-4">
                          {header
                            ? flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            : cell.column.id}
                        </span>
                        <div className="flex-1 min-w-0 text-right">
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
    </div>
  );
}
