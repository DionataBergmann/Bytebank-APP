import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuthService } from '../services/firebaseAuthService';
import { setToken, getCurrentUser } from '../store/slices/authSlice';
import { SessionManager } from '../infrastructure/security/SessionManager';

export const useAuthState = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Configurar listener para mudanças no estado de autenticação
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (user) => {
      if (user) {
        // Usuário está autenticado
        try {
          const token = await firebaseAuthService.getToken();
          if (token && user.id) {
            dispatch(setToken(token));
  
            try {
              await SessionManager.initializeSession(token, user.id);
            } catch (error) {
             
              console.warn('⚠️ Sessão já inicializada ou erro ao salvar userId:', error);
            }
            
            dispatch(getCurrentUser() as any);
          }
        } catch (error) {
          console.error('Erro ao obter token:', error);
        }
      } else {
        // Usuário não está autenticado
        dispatch(setToken(''));
      }
    });

    // Cleanup do listener quando o componente for desmontado
    return () => unsubscribe();
  }, [dispatch]);
};


