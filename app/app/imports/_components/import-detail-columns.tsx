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
    id: "productId",
    accessorKey: "productId",
    header: "Mã sản phẩm",
    width: "130px",
  },
  {
    id: "productName",
    accessorKey: "productName",
    header: "Tên sản phẩm",
    width: "150px",
  },
  {
    accessorKey: "inventoryId",
    header: "Kho",
    width: "120px",
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Số lượng",
    width: "100px",
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Đơn giá",
    width: "120px",
    cell: ({ row }) => formatCurrency(row.getValue("price")),
  },
  {
    id: "totalPrice",
    accessorKey: "totalPrice",
    header: "Thành tiền",
    width: "120px",
    cell: ({ row }) => formatCurrency(row.getValue("totalPrice")),
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
