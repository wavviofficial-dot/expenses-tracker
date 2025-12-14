import React from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-100 shadow-sm">
        <p className="text-slate-400">No transactions found. Start by adding one!</p>
      </div>
    );
  }

  // Sort by date descending
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getAmountColor = (type: TransactionType) => {
    switch(type) {
      case TransactionType.INCOME: return 'text-emerald-600';
      case TransactionType.SAVINGS: return 'text-blue-600';
      case TransactionType.INVESTMENT: return 'text-violet-600';
      case TransactionType.EXPENSE:
      default: return 'text-rose-600';
    }
  };

  const getSign = (type: TransactionType) => {
    return type === TransactionType.INCOME ? '+' : '-';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
              <th className="px-6 py-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[t.category] || '#94a3b8'}20`, // 20 is hex opacity ~12%
                      color: CATEGORY_COLORS[t.category] || '#94a3b8'
                    }}
                  >
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-800 font-medium">{t.description}</td>
                <td className={`px-6 py-4 text-right font-bold whitespace-nowrap ${getAmountColor(t.type)}`}>
                  {getSign(t.type)} LKR {t.amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};