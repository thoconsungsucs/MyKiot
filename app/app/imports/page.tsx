"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { createColumns } from "./_components/columns";
import { Import } from "@/lib/types/import";
import { ImportForm, ImportFormData } from "./_components/import_form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Sample data for demonstration
const sampleImports: Import[] = [
  {
    date: "2025-01-15",
    id: "IMP001",
    supplier: "Công ty ABC",
    description: "Nhập hàng tháng 1",
    totalAmount: 10000000,
    refundAmount: 0,
    paidAmount: 8000000,
    remainingAmount: 2000000,
  },
  {
    date: "2025-01-20",
    id: "IMP002",
    supplier: "Công ty XYZ",
    description: "Nhập hàng điện tử",
    totalAmount: 15000000,
    refundAmount: 500000,
    paidAmount: 14500000,
    remainingAmount: 0,
  },
  {
    date: "2025-01-22",
    id: "IMP003",
    supplier: "Nhà cung cấp DEF",
    description: "Nhập phụ kiện",
    totalAmount: 5000000,
    refundAmount: 0,
    paidAmount: 3000000,
    remainingAmount: 2000000,
  },
];

export default function ImportPage() {
  const [imports, setImports] = useState<Import[]>(sampleImports);
  const [showForm, setShowForm] = useState(false);

  const handleView = (imp: Import) => {
    console.log("Viewing import:", imp);
    // TODO: Implement view functionality (e.g., open modal, navigate to detail page)
  };

  const handleCreateImport = (formData: ImportFormData) => {
    // Generate new import ID
    const newImportId = `IMP${String(imports.length + 1).padStart(3, '0')}`;
    
    // Calculate totals from form details
    const totalAmount = formData.details.reduce((sum, detail) => sum + detail.total, 0);
    
    // Create new import
    const newImport: Import = {
      id: newImportId,
      date: formData.date,
      supplier: formData.supplierId, // In real app, you'd look up supplier name by ID
      description: formData.description,
      totalAmount: totalAmount,
      refundAmount: 0,
      paidAmount: 0,
      remainingAmount: totalAmount,
    };

    // Add to imports list
    setImports(prev => [newImport, ...prev]);
    
    // Hide form
    setShowForm(false);
    
    console.log("New import created:", newImport);
    console.log("Import details:", formData.details);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const columns = createColumns({ onView: handleView });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý Nhập hàng</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo phiếu nhập mới
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={imports}
      />

      {/* Import Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[70%]">
          <DialogHeader>
            <DialogTitle>Tạo phiếu nhập hàng</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <ImportForm
              onSubmit={handleCreateImport}
              onCancel={handleCancelForm}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
