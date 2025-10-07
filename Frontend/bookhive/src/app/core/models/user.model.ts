export type Role = 'USER' | 'ADMIN';

export interface Address {
  line: string; // simple text address
}

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: Address;
  role: Role;
  token?: string; // JWT after login
}
