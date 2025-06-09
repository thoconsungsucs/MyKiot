"use client"

import { Employee } from "@/lib/types/employee"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { positions } from "@/lib/types/employee"

interface EmployeeFormProps {
  employee?: Employee
  onSubmit: (data: Omit<Employee, "id">) => void
}

export function EmployeeForm({ employee, onSubmit }: EmployeeFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSubmit({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      position: formData.get("position") as string,
      status: formData.get("status") as Employee["status"],
      joinDate: formData.get("joinDate") as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Họ và tên</Label>
        <Input
          id="name"
          name="name"
          defaultValue={employee?.name}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={employee?.email}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={employee?.phone}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="position">Chức vụ</Label>
        <Select name="position" defaultValue={employee?.position} required>
          <SelectTrigger>
            <SelectValue placeholder="Chọn chức vụ" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Select name="status" defaultValue={employee?.status || "active"} required>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Đang làm việc</SelectItem>
            <SelectItem value="inactive">Nghỉ việc</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="joinDate">Ngày vào làm</Label>
        <Input
          id="joinDate"
          name="joinDate"
          type="date"
          defaultValue={employee?.joinDate}
          required
        />
      </div>
      <Button type="submit">
        {employee ? "Cập nhật" : "Thêm"} nhân viên
      </Button>
    </form>
  )
} 