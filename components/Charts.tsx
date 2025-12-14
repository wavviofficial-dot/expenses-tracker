import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType, Category } from '../types';

interface ChartsProps {
  transactions: Transaction[];
}

export const FinancialPieChart: React.FC<ChartsProps> = ({ transactions }) => {
  
  const data = useMemo(() => {
    let earnings = 0;
    let spends = 0;
    let savings = 0;
    let investing = 0;

    transactions.forEach(t => {
      // Check for INCOME
      if (t.type === TransactionType.INCOME) {
        earnings += t.amount;
      } 
      // Check for SAVINGS (New type OR Old category mapping)
      else if (t.type === TransactionType.SAVINGS || t.category === Category.GENERAL_SAVINGS || t.category === Category.EMERGENCY_FUND || t.category === Category.RETIREMENT) {
        savings += t.amount;
      } 
      // Check for INVESTMENT (New type OR Old category mapping)
      else if (t.type === TransactionType.INVESTMENT || t.category === Category.GENERAL_INVESTING || t.category === Category.STOCKS || t.category === Category.REAL_ESTATE || t.category === Category.CRYPTO) {
        investing += t.amount;
      } 
      // Default to SPENDS for other Expenses
      else {
        spends += t.amount;
      }
    });

    // Total volume for percentage calculation (Sum of all magnitudes)
    const totalVolume = earnings + spends + savings + investing;

    return [
      { name: 'Earnings', value: earnings, color: '#10b981' }, // Emerald-500
      { name: 'Spends', value: spends, color: '#f43f5e' },   // Rose-500
      { name: 'Savings', value: savings, color: '#3b82f6' },  // Blue-500
      { name: 'Investments', value: investing, color: '#8b5cf6' }, // Violet-500
    ]
    .filter(item => item.value > 0)
    .map(item => ({
      ...item,
      percentage: totalVolume > 0 ? (item.value / totalVolume) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col items-center justify-center text-slate-400">
        <p>No transaction data available for this period</p>
      </div>
    );
  }

  // Custom label to show percentage on the pie slices
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Financial Overview</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string, props: any) => [
                `LKR ${value.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${props.payload.percentage.toFixed(1)}%)`,
                name
              ]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};