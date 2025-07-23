"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { EditableDataTable } from "@/components/table/editable-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { createImportDetailColumns } from "./import-detail-columns";
import { type ImportDetail } from "@/lib/types/import_detail";
import { DatePicker } from "@/components/ui/date-picker";

export interface ImportFormData {
  supplierId: string;
  date: string;
  description: string;
  details: ImportDetail[];
  paymentStatus: "paid" | "unpaid";
  paidAmount?: number;
  paymentMethod?: "cash" | "bank_transfer";
}

interface ImportFormProps {
  onSubmit?: (data: ImportFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ImportFormData>;
}

// Sample supplier options
const supplierOptions: ComboboxOption[] = [
  { value: "SUP001", label: "Công ty ABC - Nhà cung cấp điện tử" },
  { value: "SUP002", label: "Công ty XYZ - Phụ kiện công nghệ" },
  { value: "SUP003", label: "Nhà cung cấp DEF - Thiết bị văn phòng" },
  { value: "SUP004", label: "Công ty GHI - Máy tính & linh kiện" },
];

// Sample product options
const productOptions: ComboboxOption[] = [
  { value: "PROD001", label: "Laptop Dell XPS 13" },
  { value: "PROD002", label: "Smartphone Samsung Galaxy S21" },
  { value: "PROD003", label: "Tai nghe Sony WH-1000XM4" },
  { value: "PROD004", label: "Máy in Canon PIXMA" },
];

// Sample inventory options
const inventoryOptions: ComboboxOption[] = [
  { value: "INV001", label: "Kho chính" },
  { value: "INV002", label: "Kho phụ" },
  { value: "INV003", label: "Kho hàng điện tử" },
  { value: "INV004", label: "Kho linh kiện" },
];

export function ImportForm({
  onSubmit,
  onCancel,
  initialData,
}: ImportFormProps) {
  const [formData, setFormData] = useState<ImportFormData>({
    supplierId: initialData?.supplierId || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    description: initialData?.description || "",
    details: initialData?.details || [],
    paymentStatus: initialData?.paymentStatus || "unpaid",
    paidAmount: initialData?.paidAmount || 0,
  });

  // Convert date string to Date object for the date picker
  const getDateValue = () => {
    return formData.date ? new Date(formData.date) : new Date();
  };

  // Handle date change from date picker
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: date.toISOString().split("T")[0],
      }));
    }
  };

  // Generate new ID for import details
  const generateId = () =>
    `detail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new row to import details
  const handleAddRow = () => {
    const newDetail: ImportDetail = {
      id: generateId(),
      productId: "",
      productName: "",
      inventoryId: "",
      quantity: 0,
      price: 0,
      totalPrice: 0,
    };
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, newDetail],
    }));
  };

  // Update import detail
  const handleUpdateDetail = (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    const detailToUpdate = formData.details[rowIndex];

    const updatedDetail = { ...detailToUpdate, [columnId]: value };

    if (columnId === "quantity" || columnId === "price") {
      const quantity = parseFloat(updatedDetail.quantity.toString()) || 0;
      const price = parseFloat(updatedDetail.price.toString()) || 0;
      updatedDetail.totalPrice = quantity * price;
    } else if (columnId === "productId") {
      const product = productOptions.find((option) => option.value === value);
      updatedDetail.productName = product ? product.label : "";
    }

    setFormData((prev) => ({
      ...prev,
      details: prev.details.map((detail, idx) =>
        idx === rowIndex ? updatedDetail : detail
      ),
    }));
  };

  // Delete import detail
  const handleDeleteDetail = (detailId: string) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((detail) => detail.id !== detailId),
    }));
  };

  // Calculate total amount
  const getTotalAmount = () => {
    return formData.details.reduce((sum, detail) => sum + detail.totalPrice, 0);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Create columns using the separated function
  const detailColumns = createImportDetailColumns(handleDeleteDetail);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-9 gap-4">
            {/* Payment Status Radio Group */}
            <div className="space-y-2 col-span-3">
              <Label>Trạng thái thanh toán</Label>
              <RadioGroup
                value={formData.paymentStatus}
                onValueChange={(value: "paid" | "unpaid") =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentStatus: value,
                    paidAmount: value === "unpaid" ? 0 : prev.paidAmount,
                  }))
                }
                className="flex gap-6 border px-4 py-2 rounded-xl"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unpaid" id="unpaid" />
                  <Label htmlFor="unpaid">Chưa thanh toán</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Đã thanh toán</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Paid Amount Input (only show when paid is selected) */}
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="paidAmount">Số tiền đã thanh toán</Label>
              <Input
                id="paidAmount"
                placeholder="Nhập số tiền đã thanh toán..."
                value={formData.paidAmount || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paidAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                disabled={formData.paymentStatus === "unpaid"}
              />
            </div>

            {/* Payment Method (only show when paid is selected) */}
            <div className="space-y-2 md:col-span-2">
              <Label>Thanh toán</Label>
              <Combobox
                disabled={formData.paymentStatus === "unpaid"}
                options={[
                  { value: "cash", label: "Tiền mặt" },
                  { value: "bank_transfer", label: "Chuyển khoản" },
                ]}
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: value as "cash" | "bank_transfer",
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-9 gap-4">
            {/* Supplier Selection */}
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="supplier">Nhà cung cấp *</Label>
              <Combobox
                options={supplierOptions}
                value={formData.supplierId}
                onValueChange={(value: string) => {
                  const option = supplierOptions.find(
                    (opt) => opt.value === value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    supplierId: value,
                    description: option
                      ? `Mua hàng của ${option.label}`
                      : prev.description,
                  }));
                }}
                placeholder="Chọn nhà cung cấp"
                searchPlaceholder="Tìm kiếm nhà cung cấp..."
                emptyText="Không tìm thấy nhà cung cấp."
              />
            </div>
            {/* Description */}
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                placeholder="Nhập mô tả cho phiếu nhập hàng..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />{" "}
            </div>{" "}
            {/* Date */}
            <div className="space-y-2 md:col-span-2">
              <DatePicker
                value={getDateValue()}
                onChange={handleDateChange}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Details */}
      <Card>
        <CardContent className="pt-6">
          <EditableDataTable
            columns={detailColumns}
            data={formData.details}
            onUpdate={handleUpdateDetail}
            onAddRow={handleAddRow}
            addRowButtonText="Thêm sản phẩm"
            editableColumns={["productId", "quantity", "price", "inventoryId"]}
            dropdownOptions={{
              productId: productOptions,
              inventoryId: inventoryOptions,
            }}
          />{" "}
          {/* Total */}
          <div className="mt-4 flex justify-end">
            <div className="text-right">
              <div className="text-lg font-semibold">
                Tổng tiền:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(getTotalAmount())}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={!formData.supplierId || formData.details.length === 0}
        >
          Lưu phiếu nhập
        </Button>
      </div>
    </form>
  );
}
