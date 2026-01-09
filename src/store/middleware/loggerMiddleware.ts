import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const loggerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (__DEV__) {
    
    const result = next(action);
    
    console.groupEnd();
    
    return result;
  }
  
  return next(action);
};

