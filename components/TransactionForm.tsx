import React, { useState } from 'react';
import { PlusCircle, X, Wallet, TrendingUp, PiggyBank, ArrowDownCircle } from 'lucide-react';
import { Category, TransactionType, Transaction } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, SAVINGS_CATEGORIES, INVESTMENT_CATEGORIES } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, onClose }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTransaction: Transaction = {
      id: uuidv4(),
      date,
      description,
      amount: parseFloat(amount),
      type,
      category,
    };

    onAddTransaction(newTransaction);
    onClose();
  };

  const getCategoriesForType = (t: TransactionType) => {
    switch (t) {
      case TransactionType.INCOME: return INCOME_CATEGORIES;
      case TransactionType.SAVINGS: return SAVINGS_CATEGORIES;
      case TransactionType.INVESTMENT: return INVESTMENT_CATEGORIES;
      case TransactionType.EXPENSE: 
      default: return EXPENSE_CATEGORIES;
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const validCategories = getCategoriesForType(newType);
    setCategory(validCategories[0]);
  };

  const currentCategories = getCategoriesForType(type);

  const getTypeColor = (t: TransactionType) => {
    switch(t) {
      case TransactionType.INCOME: return 'bg-emerald-600 hover:bg-emerald-700';
      case TransactionType.EXPENSE: return 'bg-rose-600 hover:bg-rose-700';
      case TransactionType.SAVINGS: return 'bg-blue-600 hover:bg-blue-700';
      case TransactionType.INVESTMENT: return 'bg-violet-600 hover:bg-violet-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add Transaction</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Grid */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange(TransactionType.INCOME)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                  type === TransactionType.INCOME
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200'
                }`}
              >
                <Wallet className="w-4 h-4 mb-1" />
                <span className="text-xs font-semibold">Income</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange(TransactionType.EXPENSE)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                  type === TransactionType.EXPENSE
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-rose-200'
                }`}
              >
                <ArrowDownCircle className="w-4 h-4 mb-1" />
                <span className="text-xs font-semibold">Expense</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange(TransactionType.SAVINGS)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                  type === TransactionType.SAVINGS
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200'
                }`}
              >
                <PiggyBank className="w-4 h-4 mb-1" />
                <span className="text-xs font-semibold">Savings</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange(TransactionType.INVESTMENT)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                  type === TransactionType.INVESTMENT
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-violet-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 mb-1" />
                <span className="text-xs font-semibold">Invest</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">LKR</span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Salary, Groceries, Stock purchase"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 ${getTypeColor(type)}`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </form>
      </div>
    </div>
  );
};