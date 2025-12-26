import { User, LoginCredentials, RegisterData, AuthResponse } from '../entities/User';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<string>;
  forgotPassword(email: string): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  updateProfile(data: Partial<User>): Promise<User>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
  getToken(): Promise<string | null>;
}



