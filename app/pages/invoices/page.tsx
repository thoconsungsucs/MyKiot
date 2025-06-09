"use client"

import {useState} from "react"
import {DataTable} from "@/components/table/data-table"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {InvoiceForm} from "@/app/pages/invoices/invoice-form"
import {createColumns} from "@/app/pages/invoices/columns"
import {Invoice} from "@/lib/types/invoice"
import {Product} from "@/lib/types/product"
import {formatCurrency} from "@/lib/utils"
import {Label} from "@/components/ui/label"
import {SectionCards} from "@/components/section-cards"
import {Separator} from "@/components/ui/separator"
import {Plus, CheckCircle, XCircle, Truck, Package, RotateCcw} from "lucide-react"
import {StatusBadge} from "@/components/status-badge"
import {statusMap, getInvoiceActions} from "@/lib/types/invoice"
import {ScrollArea} from "@/components/ui/scroll-area"

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    productName: "Sản phẩm 1",
    price: 100000,
    quantity: 10,
    category: "category1",
    description: "Mô tả sản phẩm 1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    productName: "Sản phẩm 2",
    price: 200000,
    quantity: 20,
    category: "category2",
    description: "Mô tả sản phẩm 2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockCustomers = [
  {
    id: "1",
    name: "Khách hàng 1",
    phone: "0123456789",
    address: "Địa chỉ 1",
  },
  {
    id: "2",
    name: "Khách hàng 2",
    phone: "0987654321",
    address: "Địa chỉ 2",
  },
]

const mockInvoices: Invoice[] = [
  {
    id: "INV001",
    customerId: "1",
    customerName: "Nguyễn Văn A",
    customerPhone: "0123456789",
    customerAddress: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    items: [
      {
        productId: "1",
        productName: "Laptop Dell XPS 13",
        quantity: 1,
        price: 25000000,
        total: 25000000,
      },
      {
        productId: "2",
        productName: "Chuột không dây Logitech",
        quantity: 2,
        price: 500000,
        total: 1000000,
      }
    ],
    totalAmount: 26000000,
    status: "success",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-15T08:30:00").toISOString(),
    updatedAt: new Date("2024-03-15T09:00:00").toISOString(),
  },
  {
    id: "INV002",
    customerId: "2",
    customerName: "Trần Thị B",
    customerPhone: "0987654321",
    customerAddress: "456 Đường Lê Lợi, Quận 3, TP.HCM",
    items: [
      {
        productId: "3",
        productName: "iPhone 15 Pro",
        quantity: 1,
        price: 30000000,
        total: 30000000,
      }
    ],
    totalAmount: 30000000,
    status: "pending",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-16T10:00:00").toISOString(),
    updatedAt: new Date("2024-03-16T10:00:00").toISOString(),
  },
  {
    id: "INV003",
    customerId: "3",
    customerName: "Lê Văn C",
    customerPhone: "0912345678",
    customerAddress: "789 Đường Võ Văn Tần, Quận 5, TP.HCM",
    items: [
      {
        productId: "4",
        productName: "Samsung Galaxy S24",
        quantity: 1,
        price: 28000000,
        total: 28000000,
      },
      {
        productId: "5",
        productName: "Tai nghe Samsung Buds",
        quantity: 1,
        price: 2000000,
        total: 2000000,
      }
    ],
    totalAmount: 30000000,
    status: "processing",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-16T14:30:00").toISOString(),
    updatedAt: new Date("2024-03-16T15:00:00").toISOString(),
  },
  {
    id: "INV004",
    customerId: "4",
    customerName: "Phạm Thị D",
    customerPhone: "0923456789",
    customerAddress: "321 Đường Nguyễn Đình Chiểu, Quận 3, TP.HCM",
    items: [
      {
        productId: "6",
        productName: "MacBook Pro M3",
        quantity: 1,
        price: 35000000,
        total: 35000000,
      }
    ],
    totalAmount: 35000000,
    status: "shipping",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-17T09:15:00").toISOString(),
    updatedAt: new Date("2024-03-17T10:30:00").toISOString(),
  },
  {
    id: "INV005",
    customerId: "5",
    customerName: "Hoàng Văn E",
    customerPhone: "0934567890",
    customerAddress: "654 Đường Lý Tự Trọng, Quận 1, TP.HCM",
    items: [
      {
        productId: "7",
        productName: "iPad Pro 12.9",
        quantity: 1,
        price: 28000000,
        total: 28000000,
      },
      {
        productId: "8",
        productName: "Apple Pencil 2",
        quantity: 1,
        price: 3000000,
        total: 3000000,
      }
    ],
    totalAmount: 31000000,
    status: "failed",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-17T11:00:00").toISOString(),
    updatedAt: new Date("2024-03-17T11:30:00").toISOString(),
  },
  {
    id: "INV006",
    customerId: "6",
    customerName: "Đỗ Thị F",
    customerPhone: "0945678901",
    customerAddress: "987 Đường Đồng Khởi, Quận 1, TP.HCM",
    items: [
      {
        productId: "9",
        productName: "Sony WH-1000XM5",
        quantity: 1,
        price: 8000000,
        total: 8000000,
      }
    ],
    totalAmount: 8000000,
    status: "success",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-18T08:45:00").toISOString(),
    updatedAt: new Date("2024-03-18T09:15:00").toISOString(),
  },
  {
    id: "INV007",
    customerId: "7",
    customerName: "Vũ Văn G",
    customerPhone: "0956789012",
    customerAddress: "147 Đường Lê Duẩn, Quận 1, TP.HCM",
    items: [
      {
        productId: "10",
        productName: "Dell Monitor 27\"",
        quantity: 2,
        price: 5000000,
        total: 10000000,
      }
    ],
    totalAmount: 10000000,
    status: "pending",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-18T13:20:00").toISOString(),
    updatedAt: new Date("2024-03-18T13:20:00").toISOString(),
  },
  {
    id: "INV008",
    customerId: "8",
    customerName: "Bùi Thị H",
    customerPhone: "0967890123",
    customerAddress: "258 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
    items: [
      {
        productId: "11",
        productName: "Microsoft Surface Pro",
        quantity: 1,
        price: 32000000,
        total: 32000000,
      },
      {
        productId: "12",
        productName: "Surface Pen",
        quantity: 1,
        price: 2500000,
        total: 2500000,
      }
    ],
    totalAmount: 34500000,
    status: "processing",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-19T10:00:00").toISOString(),
    updatedAt: new Date("2024-03-19T10:30:00").toISOString(),
  },
  {
    id: "INV009",
    customerId: "9",
    customerName: "Đặng Văn I",
    customerPhone: "0978901234",
    customerAddress: "369 Đường Võ Văn Kiệt, Quận 5, TP.HCM",
    items: [
      {
        productId: "13",
        productName: "Asus ROG Gaming Laptop",
        quantity: 1,
        price: 45000000,
        total: 45000000,
      }
    ],
    totalAmount: 45000000,
    status: "shipping",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-19T14:15:00").toISOString(),
    updatedAt: new Date("2024-03-19T15:00:00").toISOString(),
  },
  {
    id: "INV010",
    customerId: "10",
    customerName: "Ngô Thị K",
    customerPhone: "0989012345",
    customerAddress: "741 Đường Nguyễn Trãi, Quận 1, TP.HCM",
    items: [
      {
        productId: "14",
        productName: "AirPods Pro 2",
        quantity: 1,
        price: 6000000,
        total: 6000000,
      },
      {
        productId: "15",
        productName: "Apple Watch Series 9",
        quantity: 1,
        price: 12000000,
        total: 12000000,
      }
    ],
    totalAmount: 18000000,
    status: "failed",
    employeeId: "1",
    employeeName: "Admin",
    createdAt: new Date("2024-03-20T09:30:00").toISOString(),
    updatedAt: new Date("2024-03-20T10:00:00").toISOString(),
  }
]

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [selectedInvoiceForProducts, setSelectedInvoiceForProducts] = useState<Invoice | null>(null)

  const handleCreateInvoice = (data: Omit<Invoice, "id" | "status" | "createdAt" | "updatedAt">) => {
    console.log("Create invoice:", data)
    // TODO: Call API to create invoice
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
  }

  const handlePrintInvoice = (invoice: Invoice) => {
    console.log("Print invoice:", invoice)
    // TODO: Implement print functionality
  }

  const handleShowProducts = (invoice: Invoice) => {
    setSelectedInvoiceForProducts(invoice)
  }

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerPhone.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const columns = createColumns({
    onView: handleViewInvoice,
  })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Xin chào, Admin</h1>
          <p className="text-muted-foreground">
            Đây là tổng quan về hoạt động kinh doanh của bạn
          </p>
        </div>
        <Separator/>

        {/* Stats Cards */}
        <SectionCards/>
      </div>

      {/* Actions and Filters Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[300px]"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipping">Đang giao hàng</SelectItem>
                <SelectItem value="success">Hoàn thành</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4"/>
                Tạo đơn hàng
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-w-[95vw] p-0">
              <DialogHeader className="p-4 sm:p-6">
                <DialogTitle className="text-xl sm:text-2xl">Tạo đơn hàng mới</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-10rem)]">
                <div className="p-4 sm:p-6">
                  <InvoiceForm
                    products={mockProducts}
                    customers={mockCustomers}
                    onSubmit={handleCreateInvoice}
                    submitButton={false}
                  />
                </div>
              </ScrollArea>
              <DialogFooter className="p-4 sm:p-6 border-t flex justify-start">
                <Button className="flex-1 w-full sm:w-auto" type="submit" form="invoice-form">Tạo đơn hàng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table Section */}
        <div className="border rounded-lg">
          <DataTable
            columns={columns}
            data={filteredInvoices}
          />
        </div>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-3xl max-w-[95vw] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader className="p-2 sm:p-4">
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-10rem)] ">
            <div className="p-2 sm:p-4">
              {selectedInvoice && (
                <div className="grid gap-6">
                  {/* Action Buttons Section */}

                  {/* Basic Info Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mã đơn hàng</Label>
                      <Input value={selectedInvoice.id} readOnly/>
                    </div>
                    <div className="space-y-2">
                      <Label>Trạng thái</Label>
                      <StatusBadge status={selectedInvoice.status} config={statusMap}/>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="space-y-2">
                    <Label>Sản phẩm</Label>
                    <div className="border rounded-lg divide-y">
                      {selectedInvoice.items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between p-4 hover:bg-muted/50">
                          <div className="flex-1">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} x {formatCurrency(item.price)} = {formatCurrency(item.total)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="p-4 font-medium text-right bg-muted/50">
                        Tổng cộng: {formatCurrency(selectedInvoice.totalAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info Section */}
                  <div className="space-y-2">
                    <Label>Thông tin khách hàng</Label>
                    <div className="grid gap-4 p-4 border rounded-lg bg-muted/5">
                      <div className="grid gap-2">
                        <Label>Tên</Label>
                        <Input value={selectedInvoice.customerName} readOnly/>
                      </div>
                      <div className="grid gap-2">
                        <Label>Số điện thoại</Label>
                        <Input value={selectedInvoice.customerPhone} readOnly/>
                      </div>
                      <div className="grid gap-2">
                        <Label>Địa chỉ</Label>
                        <Input value={selectedInvoice.customerAddress} readOnly/>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Section */}
                  <div className="space-y-2">
                    <Label>Thông tin bổ sung</Label>
                    <div className="grid gap-4 p-4 border rounded-lg bg-muted/5">
                      <div className="grid gap-2">
                        <Label>Nhân viên</Label>
                        <Input value={selectedInvoice.employeeName} readOnly/>
                      </div>
                      <div className="grid gap-2">
                        <Label>Ngày tạo</Label>
                        <Input value={new Date(selectedInvoice.createdAt).toLocaleDateString("vi-VN")} readOnly/>
                      </div>
                      <div className="grid gap-2">
                        <Label>Ngày cập nhật</Label>
                        <Input value={new Date(selectedInvoice.updatedAt).toLocaleDateString("vi-VN")} readOnly/>
                      </div>
                    </div>
                  </div>

                </div>

              )}
            </div>
          </ScrollArea>
          {selectedInvoice && (
            <DialogFooter className="p-4 sm:p-6 border-t flex justify-start gap-2">
              {getInvoiceActions(selectedInvoice).map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  className="flex-1 w-full sm:w-auto"
                  onClick={() => action.action(selectedInvoice)}
                >
                  <action.icon className="h-4 w-4 mr-2"/>
                  {action.label}
                </Button>
              ))}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 