import React, { useState, useEffect, useMemo } from 'react';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { FinancialPieChart } from './components/Charts';
import { AIInsights } from './components/AIInsights';
import { QuickAddModal } from './components/QuickAddModal';
import { FinancialHealthAnalysis } from './components/FinancialHealthAnalysis';
import { MoneyVelocity } from './components/MoneyVelocity';
import { Transaction, TransactionType, FinancialSummary, Category } from './types';
import { STORAGE_KEY } from './constants';
import { Plus, LayoutDashboard, PieChart as PieChartIcon, Calendar, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

type TimeRange = 'daily' | 'monthly' | 'yearly' | 'all';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  // Save to local storage whenever transactions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter(t => t.id !== id));
  };

  // Helper to safely set date from inputs
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    const newDate = new Date(selectedDate);
    
    if (timeRange === 'daily') {
      // val is YYYY-MM-DD
      if (val) {
        const [y, m, d] = val.split('-').map(Number);
        newDate.setFullYear(y);
        newDate.setMonth(m - 1);
        newDate.setDate(d);
      }
    } else if (timeRange === 'monthly') {
      // val is YYYY-MM
      if (val) {
        const [y, m] = val.split('-').map(Number);
        newDate.setFullYear(y);
        newDate.setMonth(m - 1);
      }
    } else if (timeRange === 'yearly') {
      // val is YYYY
      newDate.setFullYear(parseInt(val));
    }
    
    setSelectedDate(newDate);
  };

  // Helper to shift date (prev/next)
  const shiftDate = (direction: -1 | 1) => {
    const newDate = new Date(selectedDate);
    if (timeRange === 'daily') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (timeRange === 'monthly') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (timeRange === 'yearly') {
      newDate.setFullYear(newDate.getFullYear() + direction);
    }
    setSelectedDate(newDate);
  };

  // Filter transactions based on selected time range and specific date
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (timeRange === 'all') return true;

      // Transaction date is YYYY-MM-DD string
      const [tYear, tMonth, tDay] = t.date.split('-').map(Number);
      
      const sYear = selectedDate.getFullYear();
      const sMonth = selectedDate.getMonth() + 1; // 1-12
      const sDay = selectedDate.getDate();

      if (timeRange === 'daily') {
        return tYear === sYear && tMonth === sMonth && tDay === sDay;
      } else if (timeRange === 'monthly') {
        return tYear === sYear && tMonth === sMonth;
      } else if (timeRange === 'yearly') {
        return tYear === sYear;
      }
      return true;
    });
  }, [transactions, timeRange, selectedDate]);

  // Memoized summary calculation based on FILTERED transactions
  const summary: FinancialSummary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavings = 0;
    let totalInvestment = 0;

    filteredTransactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        totalIncome += t.amount;
      } else if (t.type === TransactionType.SAVINGS || t.category === Category.GENERAL_SAVINGS || t.category === Category.EMERGENCY_FUND || t.category === Category.RETIREMENT) {
        totalSavings += t.amount;
      } else if (t.type === TransactionType.INVESTMENT || t.category === Category.GENERAL_INVESTING || t.category === Category.STOCKS || t.category === Category.REAL_ESTATE || t.category === Category.CRYPTO) {
        totalInvestment += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      totalSavings,
      totalInvestment,
      balance: totalIncome - (totalExpense + totalSavings + totalInvestment)
    };
  }, [filteredTransactions]);

  const periodLabel = useMemo(() => {
    if (timeRange === 'all') return "All Time";
    
    const locale = 'en-US';
    if (timeRange === 'daily') {
      return selectedDate.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
    } else if (timeRange === 'monthly') {
      return selectedDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    } else if (timeRange === 'yearly') {
      return selectedDate.getFullYear().toString();
    }
    return "";
  }, [timeRange, selectedDate]);

  // Format helper for inputs
  const getInputDateValue = () => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    
    if (timeRange === 'daily') return `${y}-${m}-${d}`;
    if (timeRange === 'monthly') return `${y}-${m}`;
    return `${y}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
               <PieChartIcon className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">SpendSmart AI</h1>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight sm:hidden">SpendSmart</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-2 rounded-lg font-medium text-sm flex items-center space-x-1 transition-colors shadow-sm border border-amber-200"
              title="Quick Add Fixed Expense"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Add</span>
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Top Controls: Tabs & Time Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* View Tabs */}
            <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'analytics' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                 <div className="flex items-center space-x-2">
                  <PieChartIcon className="w-4 h-4" />
                  <span>Analytics</span>
                </div>
              </button>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm overflow-x-auto w-fit">
              <Calendar className="w-4 h-4 text-slate-400 ml-2 mr-2 hidden sm:block" />
              {(['daily', 'monthly', 'yearly', 'all'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                    timeRange === range
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker Controls (Only if not 'all') */}
          {timeRange !== 'all' && (
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm w-fit">
              <button 
                onClick={() => shiftDate(-1)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-2">
                {timeRange === 'daily' && (
                  <input
                    type="date"
                    value={getInputDateValue()}
                    onChange={handleDateChange}
                    className="text-sm font-medium text-slate-700 border-none focus:ring-0 bg-transparent outline-none cursor-pointer"
                  />
                )}
                {timeRange === 'monthly' && (
                  <input
                    type="month"
                    value={getInputDateValue()}
                    onChange={handleDateChange}
                    className="text-sm font-medium text-slate-700 border-none focus:ring-0 bg-transparent outline-none cursor-pointer"
                  />
                )}
                {timeRange === 'yearly' && (
                  <select
                    value={getInputDateValue()}
                    onChange={handleDateChange}
                    className="text-sm font-medium text-slate-700 border-none focus:ring-0 bg-transparent outline-none cursor-pointer pr-8"
                  >
                    {Array.from({ length: 11 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                )}
              </div>

              <button 
                onClick={() => shiftDate(1)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        <SummaryCards summary={summary} periodLabel={periodLabel} />

        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
             {/* Show a mini chart on dashboard if we have data */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
                </div>
                <div className="lg:col-span-1">
                   <FinancialPieChart transactions={filteredTransactions} />
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
             <MoneyVelocity 
                summary={summary} 
                timeRange={timeRange} 
                selectedDate={selectedDate}
                filteredTransactions={filteredTransactions}
             />
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-1">
                 <FinancialPieChart transactions={filteredTransactions} />
               </div>
               <div className="lg:col-span-2">
                  <FinancialHealthAnalysis transactions={filteredTransactions} periodLabel={periodLabel} />
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {isFormOpen && (
        <TransactionForm 
          onAddTransaction={handleAddTransaction} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {isQuickAddOpen && (
        <QuickAddModal
          onAddTransaction={handleAddTransaction}
          onClose={() => setIsQuickAddOpen(false)}
        />
      )}

      {/* AI Insights always uses FULL history for better context, or we could pass filtered if preferred. 
          Passing filtered makes the AI context aware of the current view. */}
      <AIInsights transactions={filteredTransactions.length > 0 ? filteredTransactions : transactions} />
    </div>
  );
};

export default App;