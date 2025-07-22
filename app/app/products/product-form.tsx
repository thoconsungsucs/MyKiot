"use client"

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
import { Textarea } from "@/components/ui/textarea"

interface ProductFormProps {
  product?: Product
  categories: string[]
  onSubmit: (data: Omit<Product, "id" | "updatedDate">) => void
}

export function ProductForm({ product, categories, onSubmit }: ProductFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSubmit({
      productName: formData.get("productName") as string,
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
      category: formData.get("category") as string,
      description: formData.get("description") as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="productName">Tên sản phẩm</Label>
        <Input
          id="productName"
          name="productName"
          defaultValue={product?.productName}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="quantity">Số lượng</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={product?.quantity}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Giá</Label>
          <Input
            id="price"
            name="price"
            type="number"
            defaultValue={product?.price}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Danh mục</Label>
        <Select name="category" defaultValue={product?.category} required>
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description}
          required
        />
      </div>
      <Button type="submit">
        {product ? "Cập nhật" : "Thêm"} sản phẩm
      </Button>
    </form>
  )
} 