/**
 * Utilitários para sanitização e validação de inputs
 * 
 * Previne ataques como XSS, SQL Injection e outros problemas de segurança
 * através da limpeza e validação de dados de entrada.
 */

/**
 * Remove caracteres especiais e tags HTML de uma string
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove caracteres especiais perigosos
    .replace(/[<>\"']/g, '')
    // Remove múltiplos espaços
    .replace(/\s+/g, ' ');
}

/**
 * Sanitiza um email removendo caracteres inválidos
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  return email
    .trim()
    .toLowerCase()
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove espaços
    .replace(/\s/g, '');
}

/**
 * Sanitiza um número removendo caracteres não numéricos
 */
export function sanitizeNumber(input: string | number): string {
  if (typeof input === 'number') {
    return input.toString();
  }

  if (typeof input !== 'string') {
    return '';
  }

  // Remove tudo exceto números, ponto e vírgula (para decimais)
  return input.replace(/[^\d.,]/g, '').replace(',', '.');
}

/**
 * Sanitiza um valor monetário
 */
export function sanitizeCurrency(input: string | number): string {
  const sanitized = sanitizeNumber(input);
  
  // Garante que há apenas um ponto decimal
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }

  return sanitized;
}

/**
 * Remove caracteres especiais de uma string, mantendo apenas letras, números e espaços
 */
export function sanitizeAlphanumeric(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Mantém apenas letras, números, espaços e alguns caracteres acentuados
    .replace(/[^a-zA-Z0-9\sáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/g, '')
    // Remove múltiplos espaços
    .replace(/\s+/g, ' ');
}

/**
 * Valida e sanitiza um objeto de formulário
 */
export function sanitizeFormData<T extends Record<string, any>>(
  data: T,
  rules?: Partial<Record<keyof T, (value: any) => any>>
): T {
  const sanitized = { ...data };

  for (const key in sanitized) {
    if (sanitized.hasOwnProperty(key)) {
      const value = sanitized[key];

      // Aplicar regra customizada se fornecida
      if (rules && rules[key]) {
        sanitized[key] = rules[key](value);
      } else if (typeof value === 'string') {
        // Sanitização padrão para strings
        sanitized[key] = sanitizeString(value) as any;
      }
    }
  }

  return sanitized;
}

/**
 * Valida se uma string não contém scripts ou código malicioso
 */
export function isSafeString(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  // Padrões suspeitos
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers como onclick, onerror, etc.
    /eval\(/i,
    /expression\(/i,
    /vbscript:/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Escapa caracteres especiais para uso em HTML
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return input.replace(/[&<>"']/g, (char) => map[char] || char);
}

