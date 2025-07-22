"use client"

import { useState, useEffect } from "react"
import { Invoice, InvoiceItem } from "@/lib/types/invoice"
import { Product } from "@/lib/types/product"
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
import { formatCurrency } from "@/lib/utils"
import { X, Plus } from "lucide-react"

interface InvoiceFormProps {
  products: Product[]
  customers: Array<{
    id: string
    name: string
    phone: string
    address: string
  }>
  onSubmit: (data: Omit<Invoice, "id" | "status" | "createdAt" | "updatedAt">) => void
  submitButton?: boolean
}

export function InvoiceForm({ products: initialProducts, customers, onSubmit, submitButton = true }: InvoiceFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<{
    name: string
    phone: string
    address: string
  }>({
    name: "",
    phone: "",
    address: ""
  })
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [productSearch, setProductSearch] = useState("")
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

  // Get unique categories from initial products
  const categories = ["all", ...new Set(initialProducts.map(p => p.category))]

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory === "all") {
        setProducts(initialProducts)
        return
      }

      setIsLoading(true)
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch(`/api/products?category=${selectedCategory}`)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to initial products if API call fails
        setProducts(initialProducts.filter(p => p.category === selectedCategory))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, initialProducts])

  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(productSearch.toLowerCase())
  )

  useEffect(() => {
    const customer = customers.find(c => c.id === selectedCustomer)
    if (customer) {
      setCustomerInfo({
        name: customer.name,
        phone: customer.phone,
        address: customer.address
      })
    }
  }, [selectedCustomer, customers])

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return

    const product = products.find(p => p.id === selectedProduct)
    if (!product) return

    const existingItem = items.find(item => item.productId === selectedProduct)
    if (existingItem) {
      setItems(items.map(item => 
        item.productId === selectedProduct 
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
          : item
      ))
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.productName,
        quantity,
        price: product.price,
        total: product.price * quantity
      }])
    }

    setSelectedProduct("")
    setQuantity(1)
  }

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedCustomer || items.length === 0) return

    onSubmit({
      customerId: selectedCustomer,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      items,
      totalAmount: items.reduce((sum, item) => sum + item.total, 0),
      employeeId: "1", // TODO: Get from auth context
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4 py-2 sm:py-4">
      <div className="grid gap-1.5 sm:gap-2">
        <Label htmlFor="customer">Khách hàng</Label>
        <Select 
          value={selectedCustomer} 
          onValueChange={setSelectedCustomer}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn khách hàng" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCustomer && (
        <div className="grid gap-2 p-3 sm:p-4 border rounded-lg">
          <div className="grid gap-1">
            <Label>Tên</Label>
            <Input 
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-1">
            <Label>Số điện thoại</Label>
            <Input 
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="grid gap-1">
            <Label>Địa chỉ</Label>
            <Input 
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
        </div>
      )}

      <div className="grid gap-1.5 sm:gap-2">
        <Label>Sản phẩm</Label>
        <div className="grid gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="flex-1"
            />
            
            <Select 
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "Tất cả" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select 
              value={selectedProduct} 
              onValueChange={setSelectedProduct}
              disabled={isLoading}
            >
              <SelectTrigger className="flex-1 w-full">
                <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn sản phẩm"} />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.productName} - {formatCurrency(product.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 w-full sm:w-[180px]">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddItem}
                disabled={!selectedProduct || quantity <= 0 || isLoading}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="grid gap-1.5 sm:gap-2">
          <Label>Sản phẩm đã chọn</Label>
          <div className="border rounded-lg divide-y">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-2 sm:p-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.productName}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.quantity} x {formatCurrency(item.price)} = {formatCurrency(item.total)}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.productId)}
                  className="shrink-0 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="p-2 sm:p-3 font-medium text-right">
              Tổng cộng: {formatCurrency(items.reduce((sum, item) => sum + item.total, 0))}
            </div>
          </div>
        </div>
      )}

      {submitButton && (
        <Button 
          type="submit" 
          disabled={!selectedCustomer || items.length === 0}
          className="mt-2"
        >
          Tạo đơn hàng
        </Button>
      )}
    </form>
  )
} 