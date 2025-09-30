import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuthService } from '../services/firebaseAuthService';
import { setToken } from '../store/slices/authSlice';

export const useAuthState = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Configurar listener para mudanças no estado de autenticação
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (user) => {
      if (user) {
        // Usuário está autenticado
        try {
          const token = await firebaseAuthService.getToken();
          if (token) {
            dispatch(setToken(token));
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


