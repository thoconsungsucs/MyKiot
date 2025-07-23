import { ColumnDef } from "@tanstack/react-table";
import { Import } from "@/lib/types/import";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ColumnProps {
  onView: (imp: Import) => void
}

export const createColumns = ({ onView }: ColumnProps): ColumnDef<Import>[] => [
    {
        accessorKey: "date",
        header: "Ngày nhập",
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "supplier",
        header: "Nhà cung cấp",
    },
    {
        accessorKey: "totalAmount",
        header: "Tổng tiền",
        cell: ({ row }) => formatCurrency(row.getValue("totalAmount")),
    },
    {
        accessorKey: "refundAmount",
        header: "Số tiền hoàn",
        cell: ({ row }) => formatCurrency(row.getValue("refundAmount")),
    },
    {
        accessorKey: "paidAmount",
        header: "Số tiền đã trả",
        cell: ({ row }) => formatCurrency(row.getValue("paidAmount")),
    },
    {
        accessorKey: "remainingAmount",
        header: "Số tiền còn lại",
        cell: ({ row }) => formatCurrency(row.getValue("remainingAmount")),
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => onView(row.original)}
                >
                    Chi tiết
                </Button>
            </div>
        ),
    },
];