export interface PickupLocation {
  street: string;
  city: string;
  state: string;
  number: string;
}

export interface Seller {
  id: string;
  name: string;
  phoneNumber: string;
  pickupLocation: PickupLocation;
}