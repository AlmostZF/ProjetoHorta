export interface PickupLocation {
  id?: string | null;
  name: string;
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
  listPickupLocations: PickupLocation[];
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
