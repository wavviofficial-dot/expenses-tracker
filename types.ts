export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT'
}

export enum Category {
  // Income
  JOB = 'Job',
  BUSINESS = 'Business',
  FREELANCE = 'Freelance',
  INVESTMENT_INCOME = 'Investment Return',
  OTHER_INCOME = 'Other Income',

  // Expense
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  RENT = 'Rent',
  UTILITIES = 'Utilities',
  LOAN = 'Loan Installment',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  SHOPPING = 'Shopping',
  EDUCATION = 'Education',
  OTHER_EXPENSE = 'Other Expense',
  
  // Savings (Mapping 'Savings' to GENERAL_SAVINGS for backward compat)
  EMERGENCY_FUND = 'Emergency Fund',
  RETIREMENT = 'Retirement',
  GENERAL_SAVINGS = 'Savings', 

  // Investing (Mapping 'Investing' to GENERAL_INVESTING for backward compat)
  STOCKS = 'Stocks',
  CRYPTO = 'Crypto',
  REAL_ESTATE = 'Real Estate',
  GENERAL_INVESTING = 'Investing'
}

export type Frequency = 'DAILY' | 'MONTHLY' | 'YEARLY';

export interface Transaction {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export interface TransactionTemplate {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: Category;
  frequency: Frequency;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  totalInvestment: number;
  balance: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}