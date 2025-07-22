"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Invoice } from "@/lib/types/invoice"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ColumnProps {
  onView: (invoice: Invoice) => void
}

export const createColumns = ({ onView }: ColumnProps): ColumnDef<Invoice>[] => [
  {
    accessorKey: "id",
    header: "Mã đơn hàng",
  },
  {
    accessorKey: "customerName",
    header: "Khách hàng",
  },
  {
    accessorKey: "customerPhone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ row }) => formatCurrency(row.getValue("totalAmount")),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString("vi-VN"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(invoice)}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 