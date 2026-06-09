import { Product } from "./product.model";

export interface ImportProgressData {
  current: number;
  total: number;
  percentage: number;
  messageDto: MessageDto; 
}

interface MessageDto{
messageError: string;
  createdAt: string;
  productDto: Product;
  lineError: string;
}