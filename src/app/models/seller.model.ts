export interface PickupLocation {
  id?: string | null;
  street: string;
  number: string;
  city: string;
  zipCode: string;
  neighborhood: string;
  state: string;
  pickupDays: number[];
}
export enum WeekDay {
  Domingo = 0,
  Segunda = 1,
  Terca = 2,
  Quarta = 3,
  Quinta = 4,
  Sexta = 5,
  Sabado = 6
}

export const WEEK_DAYS: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado'
};


export interface Seller {
  id: string;
  name: string;
  phoneNumber: string;
  pickupLocation: PickupLocation[];
}