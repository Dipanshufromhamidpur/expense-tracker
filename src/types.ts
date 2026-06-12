import { Timestamp } from 'firebase/firestore';

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  paymentMethod?: string;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ExpenseInput {
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod?: string;
  tags?: string[];
}

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringExpense {
  id?: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  category: string;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
  lastProcessedDate?: string;
  description?: string;
  paymentMethod?: string;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RecurringExpenseInput {
  name: string;
  amount: number;
  currency: string;
  category: string;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
  description?: string;
  paymentMethod?: string;
  tags?: string[];
}

export interface UserSettings {
  userId: string;
  monthlyBudget: number;
  defaultCurrency: string;
  updatedAt: Timestamp;
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'] as const;
export const CATEGORIES = ['Housing', 'Food', 'Transportation', 'Utilities', 'Insurance', 'Medical', 'Saving', 'Personal', 'Entertainment', 'Other'] as const;
export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile App'] as const;

