"use client";

import { useState } from "react";
import { EditableDataTable } from "@/components/table/editable-data-table";
import { createColumns, positionOptions, statusOptions } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmployeeForm } from "./employee-form";
import { Employee } from "@/lib/types/employee";

// Mock data - replace with actual API call
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    position: "Quản lý",
    status: "active",
    joinDate: "2024-01-01",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    position: "Sale",
    status: "active",
    joinDate: "2024-02-01",
  },
  // Add more mock data as needed
];

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddEmployee = (data: Omit<Employee, "id">) => {
    // Here you would typically make an API call to add the employee
    const newEmployee = { ...data, id: Date.now().toString() };
    setEmployees([...employees, newEmployee]);
    console.log("Adding new employee:", data);
  };

  const handleAddRowInline = () => {
    // Add a new empty row that can be edited inline
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: "Nhân viên mới", // Placeholder name
      email: "",
      phone: "",
      position: "Sale", // Default position
      status: "active", // Default status
      joinDate: new Date().toISOString().split('T')[0], // Today's date
    };
    setEmployees([...employees, newEmployee]);
    console.log("Adding new row for inline editing:", newEmployee);
  };

  const handleEditEmployee = (data: Omit<Employee, "id">) => {
    // Here you would typically make an API call to update the employee
    if (selectedEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === selectedEmployee.id
            ? { ...data, id: selectedEmployee.id }
            : emp
        )
      );
    }
    console.log("Updating employee:", data);
    setSelectedEmployee(undefined);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    // Here you would typically make an API call to delete the employee
    setEmployees(employees.filter((emp) => emp.id !== employee.id));
    console.log("Deleting employee:", employee);
  };
  const handleInlineUpdate = (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    const employeeToUpdate = filteredEmployees[rowIndex];
    const updatedEmployee = { ...employeeToUpdate, [columnId]: value };

    setEmployees(
      employees.map((emp) =>
        emp.id === employeeToUpdate.id ? updatedEmployee : emp
      )
    );

    console.log("Inline update:", { rowIndex, columnId, value });
  };

  const columns = createColumns({
    onEdit: (employee) => setSelectedEmployee(employee),
    onDelete: handleDeleteEmployee,
  });

  // Define which columns are editable and their options
  const editableColumns = ["name", "email", "phone", "position", "status"];
  const dropdownOptions = {
    position: positionOptions,
    status: statusOptions,
  };

  // Column widths are now defined directly in the column definitions in columns.tsx
  // No need for a separate columnWidths object

  return (
    <div className="">
      {" "}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
              </DialogHeader>
              <EmployeeForm onSubmit={handleAddEmployee} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm nhân viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>{" "}
      <EditableDataTable
        columns={columns}
        data={filteredEmployees}
        onUpdate={handleInlineUpdate}
        onAddRow={handleAddRowInline}
        addRowButtonText="Thêm nhân viên mới"
        editableColumns={editableColumns}
        dropdownOptions={dropdownOptions}
      />
      <Dialog
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm
              employee={selectedEmployee}
              onSubmit={handleEditEmployee}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
