import { IAuthRepository } from '../repositories/IAuthRepository';
import { User, LoginCredentials, RegisterData } from '../entities/User';

export class AuthUseCases {
  constructor(private repository: IAuthRepository) {}

  async login(credentials: LoginCredentials) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email e senha são obrigatórios');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Email inválido');
    }

    return this.repository.login(credentials);
  }

  async register(data: RegisterData) {
    if (data.password !== data.confirmPassword) {
      throw new Error('As senhas não coincidem');
    }
    if (data.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }
    if (!data.name?.trim()) {
      throw new Error('Nome é obrigatório');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Email inválido');
    }

    return this.repository.register(data);
  }

  async logout() {
    return this.repository.logout();
  }

  async getCurrentUser() {
    return this.repository.getCurrentUser();
  }

  async refreshToken() {
    return this.repository.refreshToken();
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new Error('Email é obrigatório');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
    return this.repository.forgotPassword(email);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    if (newPassword.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }
    return this.repository.changePassword(currentPassword, newPassword);
  }

  async updateProfile(data: Partial<User>) {
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Email inválido');
      }
    }
    return this.repository.updateProfile(data);
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return this.repository.onAuthStateChanged(callback);
  }

  async getToken() {
    return this.repository.getToken();
  }
}



