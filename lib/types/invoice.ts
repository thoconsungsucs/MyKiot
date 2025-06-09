import { CheckCircle, Clock, Package, Truck, XCircle, RotateCcw } from "lucide-react"
import { InvoiceService } from "@/lib/services/invoice-service"

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
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    variant: "destructive" as const,
  },
  refunded: {
    label: "Đã hoàn lại",
    icon: XCircle,
    variant: "destructive" as const,
  },
} as const

export type StatusType = keyof typeof statusMap

export type InvoiceItem = {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export type Invoice = {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: InvoiceItem[]
  totalAmount: number
  status: StatusType
  employeeId: string
  employeeName?: string
  createdAt: string
  updatedAt: string
}

export type InvoiceAction = {
  label: string
  icon: typeof CheckCircle | typeof XCircle | typeof Truck | typeof RotateCcw
  variant: "default" | "destructive" | "outline"
  action: (invoice: Invoice) => Promise<void>
}

const invoiceService = InvoiceService.getInstance()

export const getInvoiceActions = (invoice: Invoice): InvoiceAction[] => {
  const actions: Record<StatusType, InvoiceAction[]> = {
    pending: [
      {
        label: "Xác nhận",
        icon: CheckCircle,
        variant: "default",
        action: (invoice) => invoiceService.updateInvoiceStatus(invoice, 'processing'),
      },
      {
        label: "Từ chối",
        icon: XCircle,
        variant: "destructive",
        action: (invoice) => invoiceService.updateInvoiceStatus(invoice, 'failed'),
      },
      {
        label: "Hủy đơn hàng",
        icon: XCircle,
        variant: "outline",
        action: (invoice) => invoiceService.updateInvoiceStatus(invoice, 'cancelled'),
      },
    ],
    processing: [
      {
        label: "Hủy đơn hàng",
        icon: XCircle,
        variant: "outline",
        action: (invoice) => invoiceService.updateInvoiceStatus(invoice, 'cancelled'),
      },
      {
        label: "Ship đơn hàng",
        icon: Truck,
        variant: "default",
        action: (invoice) => invoiceService.updateInvoiceStatus(invoice, 'shipping'),
      },
    ],
    shipping: [
      {
        label: "Giao hàng thất bại",
        icon: XCircle,
        variant: "destructive",
        action: (invoice) => invoiceService.updateInvoiceStatus(invoice, 'failed'),
      },
      {
        label: "Giao hàng thành công",
        icon: CheckCircle,
        variant: "default",
        action: (invoice) => invoiceService.updateInvoiceStatus(invoice, 'success'),
      },
    ],
    success: [
      {
        label: "Hoàn hàng",
        icon: RotateCcw,
        variant: "outline",
        action: (invoice) => invoiceService.updateInvoiceStatus(invoice, 'refunded'),
      },
    ],
    failed: [],
    cancelled: [],
    refunded: [],
  }

  return actions[invoice.status] || []
} 

