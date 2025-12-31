import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../../../domain/entities/User';
import { firebaseAuthService } from '../../../services/firebaseAuthService';
import { SessionManager } from '../../security/SessionManager';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await firebaseAuthService.login(credentials);
    
    // Inicializar sessão segura após login bem-sucedido
    await SessionManager.initializeSession(response.token, response.user.id);
    
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await firebaseAuthService.register(data);
    
    // Inicializar sessão segura após registro bem-sucedido
    await SessionManager.initializeSession(response.token, response.user.id);
    
    return response;
  }

  async logout(): Promise<void> {
    // Limpar sessão segura antes de fazer logout
    await SessionManager.clearSession();
    return firebaseAuthService.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    // Validar sessão antes de buscar usuário
    const isValid = await SessionManager.validateSession();
    if (!isValid) {
      return null;
    }
    
    return firebaseAuthService.getCurrentUser();
  }

  async refreshToken(): Promise<string> {
    // Usar SessionManager para renovar token
    const token = await SessionManager.refreshToken();
    if (!token) {
      throw new Error('Token não disponível ou sessão expirada');
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
    // Usar SessionManager para obter token válido
    return SessionManager.getValidToken();
  }
}

