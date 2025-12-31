import { SecureStorageService } from './SecureStorageService';
import { firebaseAuthService } from '../../services/firebaseAuthService';

/**
 * Gerenciador de sessão com validação automática e refresh token
 * 
 * Responsável por:
 * - Validar se a sessão ainda é válida
 * - Renovar tokens automaticamente antes de expirar
 * - Gerenciar o ciclo de vida da sessão
 */
export class SessionManager {
  private static refreshInterval: NodeJS.Timeout | null = null;
  private static readonly TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutos (tokens Firebase expiram em ~1h)
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas

  /**
   * Inicializa a sessão após login bem-sucedido
   */
  static async initializeSession(token: string, userId: string): Promise<void> {
    try {
      // Salvar token e user ID de forma segura
      await SecureStorageService.setToken(token);
      await SecureStorageService.setUserId(userId);

      // Calcular e salvar expiração da sessão (24 horas)
      const expiry = Date.now() + this.SESSION_DURATION;
      await SecureStorageService.setSessionExpiry(expiry);

      // Iniciar refresh automático de token
      this.startTokenRefresh();
    } catch (error) {
      console.error('[SessionManager] Erro ao inicializar sessão:', error);
      throw error;
    }
  }

  /**
   * Valida se a sessão atual ainda é válida
   */
  static async validateSession(): Promise<boolean> {
    try {
      // Verificar se há token armazenado
      const token = await SecureStorageService.getToken();
      if (!token) {
        return false;
      }

      // Verificar se a sessão não expirou
      const isValid = await SecureStorageService.isSessionValid();
      if (!isValid) {
        await this.clearSession();
        return false;
      }

      // Verificar se o token do Firebase ainda é válido
      const currentUser = await firebaseAuthService.getCurrentUser();
      if (!currentUser) {
        await this.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('[SessionManager] Erro ao validar sessão:', error);
      return false;
    }
  }

  /**
   * Renova o token de autenticação
   */
  static async refreshToken(): Promise<string | null> {
    try {
      const currentUser = await firebaseAuthService.getCurrentUser();
      if (!currentUser) {
        await this.clearSession();
        return null;
      }

      // Obter novo token do Firebase
      const newToken = await firebaseAuthService.getToken();
      if (!newToken) {
        await this.clearSession();
        return null;
      }

      // Atualizar token armazenado
      await SecureStorageService.setToken(newToken);

      // Atualizar expiração da sessão
      const expiry = Date.now() + this.SESSION_DURATION;
      await SecureStorageService.setSessionExpiry(expiry);

      return newToken;
    } catch (error) {
      console.error('[SessionManager] Erro ao renovar token:', error);
      await this.clearSession();
      return null;
    }
  }

  /**
   * Inicia o refresh automático de token
   */
  private static startTokenRefresh(): void {
    // Limpar intervalo anterior se existir
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Configurar refresh automático a cada 50 minutos
    this.refreshInterval = setInterval(async () => {
      try {
        const isValid = await this.validateSession();
        if (isValid) {
          await this.refreshToken();
        } else {
          this.stopTokenRefresh();
        }
      } catch (error) {
        console.error('[SessionManager] Erro no refresh automático:', error);
        this.stopTokenRefresh();
      }
    }, this.TOKEN_REFRESH_INTERVAL);
  }

  /**
   * Para o refresh automático de token
   */
  static stopTokenRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Limpa todos os dados da sessão
   */
  static async clearSession(): Promise<void> {
    try {
      this.stopTokenRefresh();
      await SecureStorageService.clearAuthData();
    } catch (error) {
      console.error('[SessionManager] Erro ao limpar sessão:', error);
    }
  }

  /**
   * Obtém o token atual (com validação)
   */
  static async getValidToken(): Promise<string | null> {
    try {
      const isValid = await this.validateSession();
      if (!isValid) {
        return null;
      }

      return await SecureStorageService.getToken();
    } catch (error) {
      console.error('[SessionManager] Erro ao obter token válido:', error);
      return null;
    }
  }

  /**
   * Obtém o ID do usuário atual
   */
  static async getCurrentUserId(): Promise<string | null> {
    try {
      return await SecureStorageService.getUserId();
    } catch (error) {
      console.error('[SessionManager] Erro ao obter user ID:', error);
      return null;
    }
  }
}

