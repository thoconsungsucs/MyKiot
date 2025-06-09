export type SummaryData = {
  monthlyRevenue: number
  pendingInvoice: number
  packagingInvoice: number
  shippingInvoice: number
  completedInvoice: number
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value)
} 