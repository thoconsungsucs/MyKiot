"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Employee, statusMap, positions } from "@/lib/types/employee";
import { ColumnDefWithWidth } from "@/components/table/editable-data-table";

/**
 * Column definitions for the employees table with fixed widths.
 * Each column can have an optional 'width' property to set a fixed width.
 * Example: width: "150px" will set the column to exactly 150px wide.
 */

interface ColumnProps {
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

// Export position options for the editable table
export const positionOptions = positions.map((pos) => ({
  value: pos,
  label: pos,
}));

// Export status options for the editable table
export const statusOptions = [
  { value: "active", label: "Đang làm việc" },
  { value: "inactive", label: "Nghỉ việc" },
];

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnProps): ColumnDefWithWidth<Employee>[] => [
  {
    id: "select",
    width: "40px",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="hidden md:flex"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="hidden md:flex"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    width: "60px",
  },
  {
    accessorKey: "name",
    header: "Họ và tên",
    width: "150px",
  },
  {
    accessorKey: "email",
    header: "Email",
    width: "180px",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    width: "120px",
  },
  {
    accessorKey: "position",
    header: "Chức vụ",
    width: "100px",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    width: "120px",
    cell: ({ row }) => statusMap[row.original.status],
  },
  {
    accessorKey: "joinDate",
    header: "Ngày vào làm",
    width: "110px",
  },
  {
    id: "actions",
    width: "70px",
    enableHiding: false,
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(employee)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(employee)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
