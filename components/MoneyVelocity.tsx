import React, { useMemo } from 'react';
import { Clock, Calendar, CalendarDays, TrendingUp, TrendingDown } from 'lucide-react';
import { FinancialSummary, Transaction } from '../types';

interface MoneyVelocityProps {
  summary: FinancialSummary;
  timeRange: 'daily' | 'monthly' | 'yearly' | 'all';
  selectedDate: Date;
  filteredTransactions: Transaction[];
}

export const MoneyVelocity: React.FC<MoneyVelocityProps> = ({ 
  summary, 
  timeRange, 
  selectedDate,
  filteredTransactions 
}) => {

  const metrics = useMemo(() => {
    let days = 1;

    if (timeRange === 'daily') {
      days = 1;
    } else if (timeRange === 'monthly') {
      // Get number of days in the selected month
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      days = new Date(year, month, 0).getDate();
    } else if (timeRange === 'yearly') {
      const year = selectedDate.getFullYear();
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      days = isLeap ? 366 : 365;
    } else if (timeRange === 'all') {
      if (filteredTransactions.length > 1) {
        // Sort to find range
        const dates = filteredTransactions.map(t => new Date(t.date).getTime());
        const min = Math.min(...dates);
        const max = Math.max(...dates);
        const diffTime = Math.abs(max - min);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        days = diffDays || 1;
      } else {
        days = 1;
      }
    }

    // Helper to calculate rates
    // Note: 30.44 days is the average month length (365.25 / 12)
    const calculateRates = (total: number) => {
        let hourly = 0;
        let daily = 0;
        let monthly = 0;

        if (timeRange === 'daily') {
            // If viewing a single day, "per month" is a projection
            hourly = total / 24;
            daily = total;
            monthly = total * 30.44; 
        } else if (timeRange === 'monthly') {
            // If viewing a month, "per month" is the total
            hourly = total / (days * 24);
            daily = total / days;
            monthly = total;
        } else if (timeRange === 'yearly') {
            hourly = total / (days * 24);
            daily = total / days;
            monthly = total / 12;
        } else {
            // All time
            hourly = total / (days * 24);
            daily = total / days;
            monthly = total / (days / 30.44);
        }
        
        return { hourly, daily, monthly };
    };

    return {
        income: calculateRates(summary.totalIncome),
        expense: calculateRates(summary.totalExpense)
    };
  }, [summary, timeRange, selectedDate, filteredTransactions]);

  const formatCurrency = (val: number) => 
    `LKR ${Math.abs(val).toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-6">
        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-slate-500" />
            Money Velocity 
            <span className="ml-2 text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">
                {timeRange === 'daily' ? 'Projected from Today' : 'Averages for Period'}
            </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Income Velocity */}
            <div>
                <div className="flex items-center space-x-2 mb-4 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">Earning Velocity</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                        <div className="text-[10px] text-emerald-600/70 uppercase font-bold mb-1">Per Hour</div>
                        <div className="text-sm font-bold text-emerald-700 truncate" title={formatCurrency(metrics.income.hourly)}>
                            {formatCurrency(metrics.income.hourly)}
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                        <div className="text-[10px] text-emerald-600/70 uppercase font-bold mb-1">Per Day</div>
                        <div className="text-sm font-bold text-emerald-700 truncate" title={formatCurrency(metrics.income.daily)}>
                             {formatCurrency(metrics.income.daily)}
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                        <div className="text-[10px] text-emerald-600/70 uppercase font-bold mb-1">Per Month</div>
                        <div className="text-sm font-bold text-emerald-700 truncate" title={formatCurrency(metrics.income.monthly)}>
                             {formatCurrency(metrics.income.monthly)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expense Velocity */}
            <div>
                <div className="flex items-center space-x-2 mb-4 text-rose-600">
                    <TrendingDown className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">Burning Velocity</span>
                </div>
                 <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 text-center">
                        <div className="text-[10px] text-rose-600/70 uppercase font-bold mb-1">Per Hour</div>
                        <div className="text-sm font-bold text-rose-700 truncate" title={formatCurrency(metrics.expense.hourly)}>
                             {formatCurrency(metrics.expense.hourly)}
                        </div>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 text-center">
                        <div className="text-[10px] text-rose-600/70 uppercase font-bold mb-1">Per Day</div>
                        <div className="text-sm font-bold text-rose-700 truncate" title={formatCurrency(metrics.expense.daily)}>
                             {formatCurrency(metrics.expense.daily)}
                        </div>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 text-center">
                        <div className="text-[10px] text-rose-600/70 uppercase font-bold mb-1">Per Month</div>
                        <div className="text-sm font-bold text-rose-700 truncate" title={formatCurrency(metrics.expense.monthly)}>
                             {formatCurrency(metrics.expense.monthly)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};