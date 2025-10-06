export interface StatusOrder{
  name: string,
  value: number
}

export interface Reservation {
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

export interface SecurityCode {
  value: string;
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
