import { useState, useCallback } from 'react';
import { 
  validateRequired, 
  validateAmount, 
  validateAmountRange,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateDate,
  validateDescription,
  validateCategory,
  validateFile
} from '../constants/validation';

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ValidationRules {
  [key: string]: (value: any) => string | null;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((data: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};

    Object.keys(rules).forEach((field) => {
      const value = data[field];
      const rule = rules[field];
      const error = rule(value);
      
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasError = useCallback((field: string): boolean => {
    return !!errors[field];
  }, [errors]);

  const getError = useCallback((field: string): string | undefined => {
    return errors[field];
  }, [errors]);

  return {
    errors,
    validate,
    clearError,
    clearAllErrors,
    hasError,
    getError,
  };
};

// Regras de validação comuns
export const commonValidationRules = {
  required: validateRequired,
  amount: validateAmount,
  amountRange: validateAmountRange,
  email: validateEmail,
  password: validatePassword,
  passwordMatch: validatePasswordMatch,
  date: validateDate,
  description: validateDescription,
  category: validateCategory,
  file: validateFile,
};


