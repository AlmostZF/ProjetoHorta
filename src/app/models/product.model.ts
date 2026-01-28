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
  image: File | null;
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
  isActive:boolean;
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

export const productTypesList: productType[] = [
  {name: 'verduras', value: 0 },
  {name: 'legumes', value: 1 },
  {name: 'frutas', value: 2 },
  {name: 'grãos', value: 3 },
  {name: 'outros', value: 4 },
];

export interface Filter{
    name?: string;
    seller?: string;
    productType?: number;
    PageNumber?: number;
    MaxItensPerPage?: number;
}

export interface ProductFitered{
    products: Product[];
    pagination: Pagination;
}

export interface Pagination{
    pageNumber: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number
}