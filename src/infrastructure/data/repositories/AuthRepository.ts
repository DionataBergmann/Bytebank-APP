import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../../../domain/entities/User';
import { firebaseAuthService } from '../../../../services/firebaseAuthService';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return firebaseAuthService.login(credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return firebaseAuthService.register(data);
  }

  async logout(): Promise<void> {
    return firebaseAuthService.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return firebaseAuthService.getCurrentUser();
  }

  async refreshToken(): Promise<string> {
    const token = await firebaseAuthService.getToken();
    if (!token) {
      throw new Error('Token não disponível');
    }
    return token;
  }

  async forgotPassword(email: string): Promise<void> {
    return firebaseAuthService.forgotPassword(email);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return firebaseAuthService.changePassword(currentPassword, newPassword);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return firebaseAuthService.updateProfile(data);
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return firebaseAuthService.onAuthStateChanged(callback);
  }

  async getToken(): Promise<string | null> {
    return firebaseAuthService.getToken();
  }
}

