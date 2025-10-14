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
  securityCode: SecurityCode;
  userId: string;
  reservationDate: string;
  pickupDate: string;
  pickupDeadline: string;
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

export interface PickupLocation {
  street: string;
  city: string;
  state: string;
  number: string;
}

export interface OrderItem {
  id: string;
  reservationId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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
  unitPrice: number;
  totalPrice: number;
}

export interface OrderCalculated {
  listOrderItens: OrderItemCalculated[];
  fee: number;
  total: number;
}
