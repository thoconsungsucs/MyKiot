enum ImportUnit {
  PIECE = "Cái",
  BOX = "Hộp",
  PACKET = "Gói",
  SET = "Bộ",
}
export interface ImportDetail {
  id: string;
  productId: string;
  productName: string;
  inventoryId: string;
  calculationUnit?: ImportUnit;
  quantity: number;
  price: number;
  totalPrice: number;
}
