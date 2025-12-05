import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const errorMiddleware: Middleware<{}, RootState> = () => (next) => (action) => {
  if (
    action &&
    typeof action === 'object' &&
    'type' in action &&
    typeof action.type === 'string' &&
    action.type.endsWith('/rejected')
  ) {
    const error = ('error' in action ? action.error : null) || ('payload' in action ? action.payload : null);
    
    if (error) {
      console.error(`[Redux Error] ${action.type}:`, error);
      
      // Aqui você pode adicionar lógica adicional como:
      // - Enviar erro para serviço de monitoramento (Sentry, etc)
      // - Mostrar toast de erro
      // - Logging customizado
    }
  }
  
  return next(action);
};

