import { Category, TransactionType } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  // Income (Emerald/Teal)
  [Category.JOB]: '#10b981', 
  [Category.BUSINESS]: '#059669', 
  [Category.FREELANCE]: '#34d399', 
  [Category.INVESTMENT_INCOME]: '#6ee7b7', 
  [Category.OTHER_INCOME]: '#a7f3d0', 

  // Expense (Red/Orange/Pink)
  [Category.FOOD]: '#ef4444', 
  [Category.TRANSPORT]: '#f97316', 
  [Category.RENT]: '#eab308', 
  [Category.UTILITIES]: '#84cc16', 
  [Category.LOAN]: '#c2410c', // Orange-700
  [Category.ENTERTAINMENT]: '#ec4899', 
  [Category.HEALTH]: '#db2777', 
  [Category.SHOPPING]: '#f43f5e', 
  [Category.EDUCATION]: '#6366f1', 
  [Category.OTHER_EXPENSE]: '#64748b', 

  // Savings (Blue)
  [Category.GENERAL_SAVINGS]: '#3b82f6', 
  [Category.EMERGENCY_FUND]: '#2563eb',
  [Category.RETIREMENT]: '#1d4ed8',

  // Investing (Violet/Purple)
  [Category.GENERAL_INVESTING]: '#8b5cf6', 
  [Category.STOCKS]: '#7c3aed',
  [Category.CRYPTO]: '#a78bfa',
  [Category.REAL_ESTATE]: '#6d28d9',
};

export const INCOME_CATEGORIES = [
  Category.JOB,
  Category.BUSINESS,
  Category.FREELANCE,
  Category.INVESTMENT_INCOME,
  Category.OTHER_INCOME
];

export const EXPENSE_CATEGORIES = [
  Category.FOOD,
  Category.TRANSPORT,
  Category.RENT,
  Category.UTILITIES,
  Category.LOAN,
  Category.ENTERTAINMENT,
  Category.HEALTH,
  Category.SHOPPING,
  Category.EDUCATION,
  Category.OTHER_EXPENSE
];

export const SAVINGS_CATEGORIES = [
  Category.GENERAL_SAVINGS,
  Category.EMERGENCY_FUND,
  Category.RETIREMENT
];

export const INVESTMENT_CATEGORIES = [
  Category.GENERAL_INVESTING,
  Category.STOCKS,
  Category.REAL_ESTATE,
  Category.CRYPTO
];

// Categories that are generally hard to reduce/negotiate in the short term
export const FIXED_EXPENSE_CATEGORIES = [
  Category.RENT,
  Category.LOAN,
  Category.UTILITIES,
  Category.EDUCATION,
  Category.HEALTH,
  Category.TRANSPORT // Commute is often essential
];

export const STORAGE_KEY = 'spendsmart_transactions_v1';
export const TEMPLATES_STORAGE_KEY = 'spendsmart_templates_v1';