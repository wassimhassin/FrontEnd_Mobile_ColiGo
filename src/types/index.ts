import { UserRole } from "../constants/app";

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  kycVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
}

export interface KYCData {
  documentType: "passport" | "id_card";
  documentNumber: string;
  documentFront: string;
  documentBack?: string;
  selfie: string;
}

export interface Trip {
  id: string;
  transporterId: string;
  departure: Location;
  destination: Location;
  departureDate: string;
  arrivalDate: string;
  availableWeight: number;
  pricePerKg: number;
  acceptsFragile: boolean;
  acceptsFood: boolean;
  status: "active" | "full" | "completed" | "cancelled";
}

export interface Location {
  city: string;
  country: string;
  countryCode: string;
}

export interface Parcel {
  id: string;
  clientId: string;
  tripId: string;
  weight: number;
  description: string;
  category: ParcelCategory;
  status: ParcelStatus;
  price: number;
  createdAt: string;
}

export type ParcelCategory =
  | "standard"
  | "fragile"
  | "food"
  | "documents"
  | "electronics";

export type ParcelStatus =
  | "pending"
  | "accepted"
  | "paid"
  | "collected"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
