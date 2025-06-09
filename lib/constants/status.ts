import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react"

export const statusMap = {
  pending: {
    label: "Chờ xử lý",
    icon: Clock,
    variant: "secondary" as const,
  },
  processing: {
    label: "Đang xử lý",
    icon: Package,
    variant: "warning" as const,
  },
  shipping: {
    label: "Đang giao hàng",
    icon: Truck,
    variant: "info" as const,
  },
  success: {
    label: "Hoàn thành",
    icon: CheckCircle,
    variant: "success" as const,
  },
  failed: {
    label: "Thất bại",
    icon: XCircle,
    variant: "destructive" as const,
  },
} as const

export type StatusType = keyof typeof statusMap 