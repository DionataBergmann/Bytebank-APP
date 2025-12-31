import * as SecureStore from 'expo-secure-store';

/**
 * Serviço para armazenamento seguro de dados sensíveis usando expo-secure-store
 * 
 * O expo-secure-store utiliza o Keychain (iOS) e Keystore (Android) para
 * armazenar dados de forma criptografada e segura.
 */
export class SecureStorageService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_ID_KEY = 'user_id';
  private static readonly SESSION_EXPIRY_KEY = 'session_expiry';

  /**
   * Salva um token de autenticação de forma segura
   */
  static async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('[SecureStorage] Erro ao salvar token:', error);
      throw new Error('Falha ao salvar token de autenticação');
    }
  }

  /**
   * Recupera o token de autenticação
   */
  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('[SecureStorage] Erro ao recuperar token:', error);
      return null;
    }
  }

  /**
   * Salva um refresh token de forma segura
   */
  static async setRefreshToken(refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('[SecureStorage] Erro ao salvar refresh token:', error);
      throw new Error('Falha ao salvar refresh token');
    }
  }

  /**
   * Recupera o refresh token
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureStorage] Erro ao recuperar refresh token:', error);
      return null;
    }
  }

  /**
   * Salva o ID do usuário de forma segura
   */
  static async setUserId(userId: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_ID_KEY, userId);
    } catch (error) {
      console.error('[SecureStorage] Erro ao salvar user ID:', error);
      throw new Error('Falha ao salvar ID do usuário');
    }
  }

  /**
   * Recupera o ID do usuário
   */
  static async getUserId(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.USER_ID_KEY);
    } catch (error) {
      console.error('[SecureStorage] Erro ao recuperar user ID:', error);
      return null;
    }
  }

  /**
   * Salva a data de expiração da sessão
   */
  static async setSessionExpiry(expiryTimestamp: number): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        this.SESSION_EXPIRY_KEY,
        expiryTimestamp.toString()
      );
    } catch (error) {
      console.error('[SecureStorage] Erro ao salvar expiração da sessão:', error);
    }
  }

  /**
   * Recupera a data de expiração da sessão
   */
  static async getSessionExpiry(): Promise<number | null> {
    try {
      const expiry = await SecureStore.getItemAsync(this.SESSION_EXPIRY_KEY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      console.error('[SecureStorage] Erro ao recuperar expiração da sessão:', error);
      return null;
    }
  }

  /**
   * Verifica se a sessão ainda é válida
   */
  static async isSessionValid(): Promise<boolean> {
    try {
      const expiry = await this.getSessionExpiry();
      if (!expiry) return false;

      const now = Date.now();
      return now < expiry;
    } catch (error) {
      return false;
    }
  }

  /**
   * Remove todos os dados de autenticação armazenados
   */
  static async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.TOKEN_KEY),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(this.USER_ID_KEY),
        SecureStore.deleteItemAsync(this.SESSION_EXPIRY_KEY),
      ]);
    } catch (error) {
      console.error('[SecureStorage] Erro ao limpar dados de autenticação:', error);
    }
  }

  /**
   * Salva um valor genérico de forma segura
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`[SecureStorage] Erro ao salvar ${key}:`, error);
      throw new Error(`Falha ao salvar ${key}`);
    }
  }

  /**
   * Recupera um valor genérico
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`[SecureStorage] Erro ao recuperar ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove um item específico
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[SecureStorage] Erro ao remover ${key}:`, error);
    }
  }
}

