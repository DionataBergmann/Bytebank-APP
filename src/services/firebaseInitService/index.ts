import { firebaseAuthService } from '../firebaseAuthService';
import { store } from '../../store';
import { setToken, getCurrentUser, logout } from '../../store/slices/authSlice';

export const firebaseInitService = {
  // Inicializar Firebase e verificar autenticação
  async initialize(): Promise<void> {
    try {
      // Configurar listener para mudanças de autenticação
      firebaseAuthService.onAuthStateChanged(async (user) => {
        
        
        if (user) {
          // Usuário logado
          
          const token = await firebaseAuthService.getToken();
          if (token) {
            
            store.dispatch(setToken(token));
            store.dispatch(getCurrentUser());
          } else {
            
            store.dispatch(setToken(''));
          }
        } else {
          // Usuário não logado
          
          // Limpar estado de autenticação
          store.dispatch(setToken(''));
        }
      });
    } catch (error) {
      console.error('Erro ao inicializar Firebase:', error);
      // Em caso de erro, garantir que o loading seja false
      store.dispatch(setToken(''));
    }
  },

  // Verificar se o usuário está autenticado
  async checkAuthStatus(): Promise<boolean> {
    try {
      const user = await firebaseAuthService.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  },

  // Fazer logout e limpar estado
  async clearAuth(): Promise<void> {
    try {
      
      await store.dispatch(logout());
      
    } catch (error) {
      console.error('❌ Erro ao limpar autenticação:', error);
    }
  },
};






