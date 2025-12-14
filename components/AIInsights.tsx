import React, { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { Transaction } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface AIInsightsProps {
  transactions: Transaction[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setInsight(null);
    const result = await getFinancialInsights(transactions);
    setInsight(result);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); handleGenerate(); }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse group-hover:animate-none" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Get AI Insights
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-indigo-100">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-xl font-bold">Gemini Advisor</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 min-h-[200px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-indigo-600 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-sm font-medium animate-pulse">Analyzing your finances...</p>
            </div>
          ) : (
            <div className="prose prose-indigo text-slate-700">
               {insight ? (
                 <ul className="list-disc pl-5 space-y-2">
                   {insight.split('\n').map((line, idx) => {
                      const trimmed = line.replace(/^[\-\*]\s*/, '').trim();
                      if(!trimmed) return null;
                      return <li key={idx} className="leading-relaxed">{trimmed}</li>
                   })}
                 </ul>
               ) : (
                 <p>No insights available.</p>
               )}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
             <button 
               onClick={handleGenerate}
               disabled={loading}
               className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 disabled:opacity-50"
             >
               Refresh Analysis
             </button>
        </div>
      </div>
    </div>
  );
};