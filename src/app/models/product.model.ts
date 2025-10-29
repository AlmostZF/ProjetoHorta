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

export const productTypesList: productType[] = [
  {name: 'Verduras', value: 0 },
  {name: 'Legumes', value: 1 },
  {name: 'Fruta', value: 2 },
  {name: 'Grão', value: 3 },
  {name: 'Outro', value: 4 },
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