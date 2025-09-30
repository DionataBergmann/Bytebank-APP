export const VALIDATION_RULES = {
  REQUIRED: 'Este campo é obrigatório',
  MIN_AMOUNT: 'O valor deve ser maior que zero',
  MAX_AMOUNT: 'O valor deve ser menor que R$ 1.000.000,00',
  INVALID_EMAIL: 'Email inválido',
  MIN_PASSWORD: 'A senha deve ter pelo menos 6 caracteres',
  PASSWORDS_NOT_MATCH: 'As senhas não coincidem',
  INVALID_DATE: 'Data inválida',
  FUTURE_DATE: 'A data não pode ser futura',
  PAST_DATE: 'A data não pode ser muito antiga',
  MIN_DESCRIPTION: 'A descrição deve ter pelo menos 3 caracteres',
  MAX_DESCRIPTION: 'A descrição deve ter no máximo 100 caracteres',
  INVALID_CATEGORY: 'Categoria inválida',
  FILE_TOO_LARGE: 'Arquivo muito grande',
  INVALID_FILE_TYPE: 'Tipo de arquivo não suportado',
} as const;

export const validateRequired = (value: any): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return VALIDATION_RULES.REQUIRED;
  }
  return null;
};

export const validateAmount = (value: number): string | null => {
  if (!value || value <= 0) {
    return VALIDATION_RULES.MIN_AMOUNT;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return VALIDATION_RULES.INVALID_EMAIL;
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return VALIDATION_RULES.MIN_PASSWORD;
  }
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return VALIDATION_RULES.PASSWORDS_NOT_MATCH;
  }
  return null;
};

export const validateAmountRange = (value: number): string | null => {
  if (value <= 0) {
    return VALIDATION_RULES.MIN_AMOUNT;
  }
  if (value >= 1000000) {
    return VALIDATION_RULES.MAX_AMOUNT;
  }
  return null;
};

export const validateDate = (dateString: string): string | null => {
  const date = new Date(dateString);
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  if (isNaN(date.getTime())) {
    return VALIDATION_RULES.INVALID_DATE;
  }

  if (date > today) {
    return VALIDATION_RULES.FUTURE_DATE;
  }

  if (date < oneYearAgo) {
    return VALIDATION_RULES.PAST_DATE;
  }

  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description || description.trim().length < 3) {
    return VALIDATION_RULES.MIN_DESCRIPTION;
  }
  if (description.length > 100) {
    return VALIDATION_RULES.MAX_DESCRIPTION;
  }
  return null;
};

export const validateCategory = (category: string, validCategories: string[]): string | null => {
  if (!category || category.trim() === '') {
    return VALIDATION_RULES.REQUIRED;
  }
  if (!validCategories.includes(category)) {
    return VALIDATION_RULES.INVALID_CATEGORY;
  }
  return null;
};

export const validateFile = (file: any, maxSizeMB: number = 10, allowedTypes: string[] = ['image/*', 'application/pdf']): string | null => {
  if (!file) {
    return null; // Arquivo é opcional
  }

  // Verificar tamanho
  if (file.size && file.size > maxSizeMB * 1024 * 1024) {
    return VALIDATION_RULES.FILE_TOO_LARGE;
  }

  // Verificar tipo (se disponível)
  if (file.mimeType && !allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.mimeType.startsWith(type.slice(0, -1));
    }
    return file.mimeType === type;
  })) {
    return VALIDATION_RULES.INVALID_FILE_TYPE;
  }

  return null;
};


