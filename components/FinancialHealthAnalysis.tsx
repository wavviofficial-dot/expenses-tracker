import React, { useMemo } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { FIXED_EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../constants';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target, Scissors, PiggyBank } from 'lucide-react';

interface FinancialHealthAnalysisProps {
  transactions: Transaction[];
  periodLabel: string;
}

export const FinancialHealthAnalysis: React.FC<FinancialHealthAnalysisProps> = ({ transactions, periodLabel }) => {
  const analysis = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let explicitSavings = 0;
    let investments = 0;
    const variableExpenses: Transaction[] = [];

    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        income += t.amount;
      } else if (t.type === TransactionType.SAVINGS || t.category === Category.GENERAL_SAVINGS || t.category === Category.EMERGENCY_FUND || t.category === Category.RETIREMENT) {
        explicitSavings += t.amount;
      } else if (t.type === TransactionType.INVESTMENT || t.category === Category.GENERAL_INVESTING || t.category === Category.STOCKS || t.category === Category.REAL_ESTATE || t.category === Category.CRYPTO) {
        investments += t.amount;
      } else {
        expenses += t.amount;
        if (!FIXED_EXPENSE_CATEGORIES.includes(t.category)) {
          variableExpenses.push(t);
        }
      }
    });

    // Avoid division by zero
    const safeIncome = income || 1; 

    // Auto-allocate remaining balance to savings
    // Savings = Explicit Savings Transactions + (Income - Expenses - Investments - Explicit Savings)
    // Simplified: Savings = Income - Expenses - Investments
    const totalSavings = income - expenses - investments;

    // 50/30/20 Targets
    const targetExpense = income * 0.50;
    
    const expensePct = (expenses / safeIncome) * 100;
    const investPct = (investments / safeIncome) * 100;
    const savingsPct = (totalSavings / safeIncome) * 100;

    // Strategies
    const expenseOverflow = expenses - targetExpense;
    
    // Strategy 1: Increase Earnings
    const neededIncomeForCurrentExpenses = expenses / 0.50;
    const incomeIncreaseNeeded = neededIncomeForCurrentExpenses - income;

    // Strategy 2: Reduce Expenses
    const potentialCuts = variableExpenses
      .sort((a, b) => b.amount - a.amount)
      .filter(t => t.amount > 0);

    return {
      income,
      expenses,
      savings: totalSavings,
      investments,
      expensePct,
      investPct,
      savingsPct,
      expenseOverflow,
      incomeIncreaseNeeded,
      potentialCuts,
      hasIncome: income > 0
    };
  }, [transactions]);

  if (!analysis.hasIncome) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
        <p className="text-slate-500">Add some income transactions to see your Financial Health Score.</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => 
    `LKR ${Math.abs(val).toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      
      {/* The 50/30/20 Scorecard */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-lg">50/30/20 Rule Analysis</h3>
        </div>

        <div className="space-y-6">
          {/* Needs / Expenses (Target 50%) */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">
                Expenses (Needs) <span className="text-slate-500 font-normal ml-1">• {formatCurrency(analysis.expenses)}</span>
              </span>
              <span className={`font-bold ${analysis.expensePct > 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                {analysis.expensePct.toFixed(1)}% <span className="text-slate-400 font-normal">/ 50%</span>
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${analysis.expensePct > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                style={{ width: `${Math.min(Math.max(analysis.expensePct, 0), 100)}%` }}
              />
            </div>
            {analysis.expensePct > 50 && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Overspending by {formatCurrency(analysis.expenseOverflow)}
              </p>
            )}
          </div>

          {/* Investments (Target 30%) */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">
                Investments (Growth) <span className="text-slate-500 font-normal ml-1">• {formatCurrency(analysis.investments)}</span>
              </span>
              <span className={`font-bold ${analysis.investPct < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {analysis.investPct.toFixed(1)}% <span className="text-slate-400 font-normal">/ 30%</span>
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${analysis.investPct < 30 ? 'bg-amber-500' : 'bg-violet-500'}`} 
                style={{ width: `${Math.min(Math.max(analysis.investPct, 0), 100)}%` }}
              />
            </div>
          </div>

          {/* Savings (Target 20%) */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center space-x-1">
                <span className="font-medium text-slate-700">
                  Savings (Security) <span className="text-slate-500 font-normal ml-1">• {analysis.savings < 0 ? '-' : ''}{formatCurrency(analysis.savings)}</span>
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full hidden sm:inline-block">Includes Balance</span>
              </div>
              <span className={`font-bold ${analysis.savingsPct < 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {analysis.savingsPct.toFixed(1)}% <span className="text-slate-400 font-normal">/ 20%</span>
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${analysis.savingsPct < 20 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                style={{ width: `${Math.min(Math.max(analysis.savingsPct, 0), 100)}%` }}
              />
            </div>
            {analysis.savings < 0 && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Negative savings! Expenses exceed income.
                </p>
            )}
          </div>
        </div>
      </div>

      {/* Strategies */}
      {analysis.expenseOverflow > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strategy A: Increase Income */}
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-3 text-indigo-800">
               <TrendingUp className="w-5 h-5" />
               <h4 className="font-bold">Option A: Increase Earnings</h4>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              To maintain your current lifestyle while adhering to the 50% rule, you need to increase your total income.
            </p>
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Target Income Increase</div>
                <div className="text-2xl font-bold text-indigo-700">+{formatCurrency(analysis.incomeIncreaseNeeded)}</div>
                <p className="text-xs text-indigo-500/80 mt-1">per {periodLabel}</p>
            </div>
          </div>

          {/* Strategy B: Reduce Expenses */}
          <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-xl border border-rose-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-3 text-rose-800">
               <TrendingDown className="w-5 h-5" />
               <h4 className="font-bold">Option B: Reduce Expenses</h4>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Cut down on discretionary spending to bring expenses within 50% of your current income.
            </p>
             <div className="bg-white p-4 rounded-lg border border-rose-100">
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Target Reduction</div>
                <div className="text-2xl font-bold text-rose-600">-{formatCurrency(analysis.expenseOverflow)}</div>
                <p className="text-xs text-rose-500/80 mt-1">per {periodLabel}</p>
            </div>
          </div>
        </div>
      )}

      {/* Practical Reduction Advice */}
      {analysis.expenseOverflow > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
           <div className="flex items-center space-x-2 mb-4">
               <Scissors className="w-5 h-5 text-slate-700" />
               <h3 className="font-bold text-slate-800">Suggested Cuts (Practical)</h3>
           </div>
           <p className="text-sm text-slate-500 mb-4">
              We've excluded fixed costs like <strong>Loans, Rent, and Education</strong>. 
              Review the following discretionary expenses to find the <strong>{formatCurrency(analysis.expenseOverflow)}</strong> savings you need.
           </p>

           <div className="space-y-3">
              {analysis.potentialCuts.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[t.category] }}></div>
                          <div>
                             <div className="font-semibold text-slate-700 text-sm">{t.description}</div>
                             <div className="text-xs text-slate-400 uppercase">{t.category}</div>
                          </div>
                      </div>
                      <div className="font-bold text-slate-700">
                          {formatCurrency(t.amount)}
                      </div>
                  </div>
              ))}
              {analysis.potentialCuts.length === 0 && (
                  <div className="text-center py-4 text-slate-400 text-sm">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Good news or bad news: You don't have many variable expenses recorded. 
                      It seems your high expenses are mostly fixed costs, which are harder to cut.
                  </div>
              )}
           </div>
           
           {analysis.potentialCuts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400">
                      Showing top {Math.min(5, analysis.potentialCuts.length)} variable expenses
                  </p>
              </div>
           )}
        </div>
      )}

    </div>
  );
};