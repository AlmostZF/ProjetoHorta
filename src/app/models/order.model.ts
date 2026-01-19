import { PickupLocation, Seller } from "./seller.model";

export interface StatusOrder{
  name: string,
  value: number
}

export interface ReservationResponse {
  id: string;
  securityCode: SecurityCode;
  userId: string;
  reservationDate: string;
  pickupDate: string;
  pickupDeadline: string;
  pickupLocation: PickupLocation;
  reservationFee: number;
  orderStatus: number;
  valueTotal: number;
  listOrderItens: OrderItem[];
  userResponse: UserResponse;
}
export interface ReservationRequest {
  securityCode: SecurityCode | null;
  email: string;
  phoneNumber: string;
  fullName: string;
  userId?: string | null;
  reservationDate: Date;
  pickupDate: Date;
  pickupDeadline: Date;
  pickupLocation: PickupLocation;
  orderStatus: number;
  listOrderItens: ListOrderItensRequest[];
}



export interface SecurityCode {
  value: string;
}

export interface ListOrderItensRequest{
  productId: string;
  sellerId: string;
  quantity: number;
}
export interface CalculateOrder{
  listOrderItens: ListOrderItensRequest[];
}

export interface OrderItem {
  id: string;
  reservationId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  name: string;
  image: string;
  sellerName: string;
}

export interface UserResponse {
  id: string;
  name: string;
  phoneNumber: string;
  securityCode: SecurityCode;
}

export interface OrderItemCalculated {
  id: string | null;
  reservationId: string | null;
  productId: string;
  sellerId: string;
  quantity: number;
  name: string;
  sellerName: string;
  image: string;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderCalculated {
  listOrderItens: OrderItemCalculated[];
  seller: Seller;
  fee: number;
  total: number;
}
