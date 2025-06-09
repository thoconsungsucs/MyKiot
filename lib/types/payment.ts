export type PaymentStatus = 
  | "pending" 
  | "processing" 
  | "shipping" 
  | "success" 
  | "failed"

export type PaymentAction = {
  label: string
  status: PaymentStatus
  action: () => void
  variant?: "default" | "destructive"
}

export const getPaymentActions = (status: PaymentStatus): PaymentAction[] => {
  const actions: Record<PaymentStatus, PaymentAction[]> = {
    pending: [
      {
        label: "Xác nhận đơn hàng",
        status: "pending",
        action: () => {}
      },
      {
        label: "Từ chối đơn hàng",
        status: "pending",
        action: () => {},
        variant: "destructive"
      },
      {
        label: "Hủy đơn hàng",
        status: "pending",
        action: () => {},
        variant: "destructive"
      }
    ],
    processing: [
      {
        label: "Ship đơn hàng",
        status: "processing",
        action: () => {}
      }
    ],
    shipping: [
      {
        label: "Ship không thành công",
        status: "shipping",
        action: () => {},
        variant: "destructive"
      }
    ],
    success: [
      {
        label: "Hoàn đơn hàng",
        status: "success",
        action: () => {}
      }
    ],
    failed: []
  }

  return actions[status] || []
} 