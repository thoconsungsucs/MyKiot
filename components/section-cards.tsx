import { 
  TrendingDownIcon, 
  TrendingUpIcon,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SummaryData, formatCurrency, formatNumber } from "@/lib/types/summary"

// Mock data - replace with actual API call
const summaryData: SummaryData = {
  monthlyRevenue: 13444250000,
  pendingInvoice: 1234,
  packagingInvoice: 4,
  shippingInvoice: 45678,
  completedInvoice: 4
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <Card className="@container/card col-span-2 md:col-span-1">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
            <CardDescription>Doanh thu trong tháng</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(summaryData.monthlyRevenue)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <TrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-muted-foreground" />
            <CardDescription>Đơn cần xử lý</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatNumber(summaryData.pendingInvoice)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5 text-muted-foreground" />
            <CardDescription>Đơn chờ đóng gói</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatNumber(summaryData.packagingInvoice)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5 text-muted-foreground" />
            <CardDescription>Đơn đang ship</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatNumber(summaryData.shippingInvoice)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-muted-foreground" />
            <CardDescription>Đơn đã hoàn thành</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatNumber(summaryData.completedInvoice)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
