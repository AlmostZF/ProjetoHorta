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
  email: string;
  phoneNumber: string;
  fullName: string;
  userId?: string | null;
  securityCode?: SecurityCode | null;
  OrderDetails: OrderReservationDetails[];
}

export interface ResultOrder{
  sellerName: string,
  securityCode: string
}
export interface OrderReservationDetails {
  pickupDate: Date;
  pickupDeadline: Date;
  sellerid: string;
  listOrderItens: ListOrderItensRequest[];
  pickupLocation: PickupLocation | null;
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

export interface OrderFront extends OrderCalculated{
  pickupDate?: Date;
  pickupDeadline?: Date;
  selectedPickupLocation?: any;
  disableDays: number[];
  securityCode?: string;
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
