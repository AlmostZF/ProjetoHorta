export interface Login {
  email: string;
  password: string;
}
export interface CustomerSignUp {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
}

export interface SellerSignUp {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
}

export interface Authentication {
  bearerToken: string | null;
  expiration: Date | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
