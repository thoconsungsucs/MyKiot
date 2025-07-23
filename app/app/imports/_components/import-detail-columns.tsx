import { ColumnDefWithWidth } from "@/components/table/editable-data-table";
import { Button } from "@/components/ui/button";
import { ImportDetail } from "@/lib/types/import_detail";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";



// Create columns for import detail table
export const createImportDetailColumns = (
  handleDeleteDetail: (detailId: string) => void
): ColumnDefWithWidth<ImportDetail>[] => [
  {
    accessorKey: "productName",
    header: "Tên sản phẩm",
    width: "200px",
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
    width: "100px",
  },
  {
    accessorKey: "price",
    header: "Đơn giá",
    width: "120px",
    cell: ({ row }) => formatCurrency(row.getValue("price")),
  },
  {
    accessorKey: "total",
    header: "Thành tiền",
    width: "120px",
    cell: ({ row }) => formatCurrency(row.getValue("total")),
  },
  {
    id: "actions",
    header: "Hành động",
    width: "100px",
    cell: ({ row }) => (
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleDeleteDetail(row.original.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ),
  },
];
