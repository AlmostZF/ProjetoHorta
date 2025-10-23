import { Seller } from "./seller.model";

export interface Product {
  id: string;
  name: string;
  productType: number;
  unitPrice: number;
  seller: Seller;
  quantity?: number;
  conservationDays: string;
  image: string;
  shortDescription: string;
  largeDescription: string;
  weight:string;
}
export interface UpdateProduct {
  id: string;
  name: string;
  productType: number;
  unitPrice: number;
  sellerId: string;
  conservationDays: string;
  image: string;
  shortDescription: string;
  largeDescription: string;
  weight:string;
}

export interface CreateProduct{
  name: string;
  productType: number;
  unitPrice: number;
  sellerId: string;
  conservationDays: string;
  image: string;
  shortDescription: string;
  largeDescription: string;
  weight: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  quantity: number;
  total: number;
  movementDate: string;
  product: Product;
}
export interface StockAvailable {
  stockLimit: number;
  product: Product;
}

export interface UpdateStock{
  id: string;
  quantity: number;
}

export interface CreateStock{
  productId: string;
  quantity: number;
}

export interface productType{
    name: string;
    value: number;
}