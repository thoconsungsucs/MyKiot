"use client"

import React from "react"
import {ColumnDef} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getPaymentActions } from "@/lib/types/payment"

const statusMap = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  success: "Hoàn thành",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
  canceled: "Đã hủy"
} as const

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invoice = {
  id: string
  productName: string
  quantity: number
  amount: number
  status: keyof typeof statusMap
  employeeName: string
  customerName: string
  date: string
}

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
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
    header: "ID"
  },
  {
    accessorKey: "productName",
    header: "Sản phẩm",
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
  },
  {
    accessorKey: "amount",
    header: "Thành tiền",
    cell: ({ row }) => {
      const amount = row.original.amount
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => statusMap[row.original.status]
  },
  {
    accessorKey: "employeeName",
    header: "Nhân viên",
  },
  {
    accessorKey: "customerName",
    header: "Khách hàng",
  },
  {
    accessorKey: "date",
    header: "Ngày",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const invoice = row.original
      
      if (invoice.status === "failed" || invoice.status === "canceled" || invoice.status === "refunded") {
        return null
      }

      const actions = getPaymentActions(invoice.status)

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
            {actions.map((action, index) => (
              <React.Fragment key={action.label}>
                <DropdownMenuItem 
                  onClick={action.action}
                  className={action.variant === "destructive" ? "text-red-600" : ""}
                >
                  {action.label}
                </DropdownMenuItem>
                {index < actions.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
