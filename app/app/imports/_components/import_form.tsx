"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { EditableDataTable } from "@/components/table/editable-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { createImportDetailColumns } from "./import-detail-columns";
import { ImportDetail } from "@/lib/types/import_detail";


export interface ImportFormData {
  supplierId: string;
  date: string;
  description: string;
  details: ImportDetail[];
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

export function ImportForm({ onSubmit, onCancel, initialData }: ImportFormProps) {
  const [formData, setFormData] = useState<ImportFormData>({
    supplierId: initialData?.supplierId || "",
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || "",
    details: initialData?.details || [],
  });

  // Generate new ID for import details
  const generateId = () => `detail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new row to import details
  const handleAddRow = () => {
    const newDetail: ImportDetail = {
      id: generateId(),
      productId: "",
      productName: "",
      inventoryId: "",
      inventoryName: "",
      unitCaculation: "",
      quantity: 0,
      price: 0,
      total: 0,
    };
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, newDetail],
    }));
  };

  // Update import detail
  const handleUpdateDetail = (rowIndex: number, columnId: string, value: string) => {
    const updatedDetails = [...formData.details];
    const detail = updatedDetails[rowIndex];
    
    if (columnId === 'productName') {
      detail.productName = value;
    } else if (columnId === 'quantity') {
      const quantity = parseFloat(value) || 0;
      detail.quantity = quantity;
      detail.totalPrice = quantity * detail.unitPrice;
    } else if (columnId === 'unitPrice') {
      const unitPrice = parseFloat(value) || 0;
      detail.unitPrice = unitPrice;
      detail.totalPrice = detail.quantity * unitPrice;
    }

    setFormData(prev => ({
      ...prev,
      details: updatedDetails,
    }));
  };

  // Delete import detail
  const handleDeleteDetail = (detailId: string) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter(detail => detail.id !== detailId),
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
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            {/* Supplier Selection */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="supplier">Nhà cung cấp *</Label>
              <Combobox
                options={supplierOptions}
                value={formData.supplierId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
                placeholder="Chọn nhà cung cấp"
                searchPlaceholder="Tìm kiếm nhà cung cấp..."
                emptyText="Không tìm thấy nhà cung cấp."
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-5">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                placeholder="Nhập mô tả cho phiếu nhập hàng..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Date */}
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="date">Ngày nhập *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
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
            editableColumns={['productName', 'quantity', 'unitPrice']}
          />
          
          {/* Total */}
          <div className="mt-4 flex justify-end">
            <div className="text-right">
              <div className="text-lg font-semibold">
                Tổng tiền: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
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
