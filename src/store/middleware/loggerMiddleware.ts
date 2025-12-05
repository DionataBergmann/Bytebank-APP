import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const loggerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (__DEV__) {
    console.group(`[Redux] ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    
    const result = next(action);
    
    console.log('Next State:', store.getState());
    console.groupEnd();
    
    return result;
  }
  
  return next(action);
};

