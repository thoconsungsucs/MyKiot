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
import { Label } from "@/components/ui/label"
import { ProductForm } from "./product-form"
import { Product } from "@/lib/types/product"

// Add customer type
type Customer = {
  id: string
  name: string
  phone: string
  address: string
}

// Mock data - replace with actual API call
const mockProducts = [
  {
    id: "1",
    productName: "Laptop Dell XPS 13",
    quantity: 10,
    price: 15000000,
    category: "Electronics",
    description: "Laptop cao cấp với màn hình 13 inch",
    updatedAt: "2024-03-20",
    createdAt: "2024-03-20"
  },
  {
    id: "2",
    productName: "iPhone 15 Pro",
    quantity: 5,
    price: 25000000,
    category: "Electronics",
    description: "Điện thoại thông minh mới nhất từ Apple Điện thoại thông minh mới nhất từ Apple Điện thoại thông minh mới nhất từ Apple Điện thoại thông minh mới nhất từ AppleĐiện thoại thông minh mới nhất từ AppleĐiện thoại thông minh mới nhất từ AppleĐiện thoại thông minh mới nhất từ AppleĐiện thoại thông minh mới nhất từ AppleĐiện thoại thông minh mới nhất từ Apple",
    updatedAt: "2024-03-19",
    createdAt: "2024-03-20"
  },
  // Add more mock data as needed
]

// Add mock customers
const mockCustomers: Customer[] = [
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

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Food",
  "Furniture"
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [newCategory, setNewCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerInfo, setCustomerInfo] = useState<Omit<Customer, "id">>({
    name: "",
    phone: "",
    address: ""
  })

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Here you would typically make an API call to add the category
      console.log("Adding new category:", newCategory)
      setNewCategory("")
    }
  }

  const handleAddProduct = (data: Omit<Product, "id" | "updatedDate">) => {
    // Here you would typically make an API call to add the product
    console.log("Adding new product:", data)
  }

  const handleEditProduct = (data: Omit<Product, "id" | "updatedDate">) => {
    // Here you would typically make an API call to update the product
    console.log("Updating product:", data)
    setSelectedProduct(undefined)
  }

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setCustomerInfo({
      name: customer.name,
      phone: customer.phone,
      address: customer.address
    })
  }

  const handleCustomerInfoChange = (field: keyof Omit<Customer, "id">, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const columns = createColumns({
    onEdit: (product) => setSelectedProduct(product)
  })

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục mới</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Tên danh mục</Label>
                  <Input
                    id="category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nhập tên danh mục"
                  />
                </div>
                <Button onClick={handleAddCategory}>Thêm</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
              </DialogHeader>
              <ProductForm categories={categories} onSubmit={handleAddProduct} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredProducts}
      />

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct} 
              categories={categories} 
              onSubmit={handleEditProduct} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
