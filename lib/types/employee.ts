export type EmployeeStatus = "active" | "inactive"

export type Employee = {
  id: string
  name: string
  email: string
  phone: string
  position: string
  status: EmployeeStatus
  joinDate: string
}

export const statusMap = {
  active: "Đang làm việc",
  inactive: "Nghỉ việc"
} as const

export const positions = [
  "Quản lý",
  "Sale",
  "Kho",
] as const
