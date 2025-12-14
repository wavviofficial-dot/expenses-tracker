import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { FinancialSummary } from '../types';

interface SummaryCardsProps {
  summary: FinancialSummary;
  periodLabel: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, periodLabel }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Balance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <Wallet className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{periodLabel} Balance</p>
          <h3 className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
            {formatCurrency(summary.balance)}
          </h3>
        </div>
      </div>

      {/* Income */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
          <ArrowUpCircle className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{periodLabel} Income</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            {formatCurrency(summary.totalIncome)}
          </h3>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-rose-50 rounded-full text-rose-600">
          <ArrowDownCircle className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{periodLabel} Expenses</p>
          <h3 className="text-2xl font-bold text-rose-600">
            {formatCurrency(summary.totalExpense)}
          </h3>
        </div>
      </div>
    </div>
  );
};