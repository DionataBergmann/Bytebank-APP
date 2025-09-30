export interface CategoryOption {
  label: string;
  group: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  // Investimentos
  { label: 'Fundos de investimento', group: 'Investimentos' },
  { label: 'Tesouro Direto', group: 'Investimentos' },
  { label: 'Previdência Privada', group: 'Investimentos' },
  { label: 'Bolsa de Valores', group: 'Investimentos' },
  { label: 'Criptomoedas', group: 'Investimentos' },
  { label: 'CDB / RDB', group: 'Investimentos' },
  { label: 'FII', group: 'Investimentos' },
  { label: 'ETFs', group: 'Investimentos' },
  
  // Receitas
  { label: 'Salário', group: 'Receitas' },
  { label: 'Renda Extra', group: 'Receitas' },
  
  // Despesas
  { label: 'Alimentação', group: 'Despesas' },
  { label: 'Transporte', group: 'Despesas' },
  { label: 'Saúde', group: 'Despesas' },
  { label: 'Educação', group: 'Despesas' },
  { label: 'Lazer', group: 'Despesas' },
  { label: 'Moradia', group: 'Despesas' },
];

export const CATEGORY_GROUPS = {
  INVESTMENTS: 'Investimentos',
  INCOME: 'Receitas',
  EXPENSES: 'Despesas',
} as const;

export const getCategoriesByGroup = (group: string): CategoryOption[] => {
  return CATEGORY_OPTIONS.filter(option => option.group === group);
};

export const getCategoryGroups = (): string[] => {
  return Array.from(new Set(CATEGORY_OPTIONS.map(option => option.group)));
};








