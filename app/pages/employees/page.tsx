"use client"

import { useState } from "react"
import { DataTable } from "@/components/table/data-table"
import { createColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmployeeForm } from "./employee-form"
import { Employee } from "@/lib/types/employee"

// Mock data - replace with actual API call
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    position: "Quản lý",
    status: "active",
    joinDate: "2024-01-01"
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    position: "Nhân viên bán hàng",
    status: "active",
    joinDate: "2024-02-01"
  },
  // Add more mock data as needed
]

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>()

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch 
  })

  const handleAddEmployee = (data: Omit<Employee, "id">) => {
    // Here you would typically make an API call to add the employee
    console.log("Adding new employee:", data)
  }

  const handleEditEmployee = (data: Omit<Employee, "id">) => {
    // Here you would typically make an API call to update the employee
    console.log("Updating employee:", data)
    setSelectedEmployee(undefined)
  }

  const handleDeleteEmployee = (employee: Employee) => {
    // Here you would typically make an API call to delete the employee
    console.log("Deleting employee:", employee)
  }

  const columns = createColumns({
    onEdit: (employee) => setSelectedEmployee(employee),
    onDelete: handleDeleteEmployee
  })

  return (
    <div className="">
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
      </div>

      <DataTable 
        columns={columns} 
        data={filteredEmployees}
      />

      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(undefined)}>
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
  )
} 