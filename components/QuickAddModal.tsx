import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Zap, Save, Check, Calendar, ArrowRight, RotateCcw } from 'lucide-react';
import { Transaction, TransactionType, Category, TransactionTemplate, Frequency } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, SAVINGS_CATEGORIES, INVESTMENT_CATEGORIES, TEMPLATES_STORAGE_KEY, CATEGORY_COLORS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface QuickAddModalProps {
  onAddTransaction: (transaction: Transaction) => void;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ onAddTransaction, onClose }) => {
  const [templates, setTemplates] = useState<TransactionTemplate[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Interaction State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [dateValue, setDateValue] = useState<string>('');

  // New Template Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [newCategory, setNewCategory] = useState<Category>(Category.FOOD);
  const [newFrequency, setNewFrequency] = useState<Frequency>('DAILY');

  // Load templates
  useEffect(() => {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse templates", e);
      }
    }
  }, []);

  // Save templates
  useEffect(() => {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const newTemplate: TransactionTemplate = {
      id: uuidv4(),
      name: newTitle,
      amount: parseFloat(newAmount),
      type: newType,
      category: newCategory,
      frequency: newFrequency
    };

    setTemplates([...templates, newTemplate]);
    
    // Reset Form
    setNewTitle('');
    setNewAmount('');
    setNewFrequency('DAILY');
    setShowAddForm(false);
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplates(templates.filter(t => t.id !== id));
    if (selectedTemplateId === id) {
      setSelectedTemplateId(null);
    }
  };

  const handleCardClick = (template: TransactionTemplate) => {
    if (selectedTemplateId === template.id) return;
    
    setSelectedTemplateId(template.id);
    const now = new Date();
    const freq = template.frequency || 'DAILY';

    if (freq === 'DAILY') {
      setDateValue(now.toISOString().split('T')[0]); // YYYY-MM-DD
    } else if (freq === 'MONTHLY') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      setDateValue(`${y}-${m}`); // YYYY-MM
    } else if (freq === 'YEARLY') {
      setDateValue(String(now.getFullYear())); // YYYY
    }
  };

  const handleConfirmAdd = (template: TransactionTemplate) => {
    let finalDate = dateValue;
    const freq = template.frequency || 'DAILY';

    // Normalize date to YYYY-MM-DD based on frequency
    if (freq === 'MONTHLY') {
      finalDate = `${dateValue}-01`;
    } else if (freq === 'YEARLY') {
      finalDate = `${dateValue}-01-01`;
    }

    const transaction: Transaction = {
      id: uuidv4(),
      date: finalDate,
      description: template.name,
      amount: template.amount,
      type: template.type,
      category: template.category
    };
    onAddTransaction(transaction);
    onClose();
  };

  const getCategoriesForType = (t: TransactionType) => {
    switch (t) {
      case TransactionType.INCOME: return INCOME_CATEGORIES;
      case TransactionType.SAVINGS: return SAVINGS_CATEGORIES;
      case TransactionType.INVESTMENT: return INVESTMENT_CATEGORIES;
      case TransactionType.EXPENSE: default: return EXPENSE_CATEGORIES;
    }
  };

  useEffect(() => {
    const valid = getCategoriesForType(newType);
    if (!valid.includes(newCategory)) {
        setNewCategory(valid[0]);
    }
  }, [newType]);

  const getTypeColor = (t: TransactionType) => {
     switch(t) {
       case TransactionType.INCOME: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
       case TransactionType.EXPENSE: return 'text-rose-600 bg-rose-50 border-rose-100';
       case TransactionType.SAVINGS: return 'text-blue-600 bg-blue-50 border-blue-100';
       case TransactionType.INVESTMENT: return 'text-violet-600 bg-violet-50 border-violet-100';
     }
  };

  const getFrequencyLabel = (f: Frequency) => {
    switch(f) {
      case 'DAILY': return 'Daily';
      case 'MONTHLY': return 'Monthly';
      case 'YEARLY': return 'Yearly';
      default: return 'Daily';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2 text-slate-800">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-bold">Quick Add</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {templates.length === 0 && !showAddForm ? (
            <div className="text-center py-8 text-slate-500">
              <p className="mb-4">No fixed expenses or presets saved yet.</p>
              <p className="text-sm text-slate-400">Add things like "Monthly Rent", "Gym Membership", or "Salary" to add them in one click.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {templates.map(template => {
                const isSelected = selectedTemplateId === template.id;
                const freq = template.frequency || 'DAILY';

                if (isSelected) {
                  // Active State Card
                  return (
                    <div 
                      key={template.id}
                      className="relative p-4 rounded-xl border-2 border-slate-800 bg-slate-50 flex flex-col justify-between min-h-[140px] animate-fade-in"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-800 truncate">{template.name}</span>
                          <button onClick={() => setSelectedTemplateId(null)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-slate-500 mb-3">Which {freq.toLowerCase()}?</div>
                        
                        {/* Date Input based on Frequency */}
                        <div className="mb-3">
                          {freq === 'DAILY' && (
                            <input 
                              type="date" 
                              value={dateValue}
                              onChange={(e) => setDateValue(e.target.value)}
                              className="w-full text-sm p-1.5 border border-slate-300 rounded bg-white"
                            />
                          )}
                          {freq === 'MONTHLY' && (
                            <input 
                              type="month" 
                              value={dateValue}
                              onChange={(e) => setDateValue(e.target.value)}
                              className="w-full text-sm p-1.5 border border-slate-300 rounded bg-white"
                            />
                          )}
                          {freq === 'YEARLY' && (
                            <input 
                              type="number"
                              min="2000"
                              max="2100"
                              value={dateValue}
                              onChange={(e) => setDateValue(e.target.value)}
                              className="w-full text-sm p-1.5 border border-slate-300 rounded bg-white"
                            />
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleConfirmAdd(template)}
                        className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center space-x-1 hover:bg-slate-800"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirm</span>
                      </button>
                    </div>
                  );
                }

                // Inactive State Card
                return (
                  <button
                    key={template.id}
                    onClick={() => handleCardClick(template)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-md group flex flex-col justify-between min-h-[140px] ${getTypeColor(template.type)} hover:border-current`}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start mb-2">
                        <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/80"
                            style={{ color: CATEGORY_COLORS[template.category] }}
                        >
                            {template.category}
                        </span>
                        <div 
                            onClick={(e) => handleDeleteTemplate(template.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/50 rounded-full transition-all cursor-pointer"
                            title="Delete Preset"
                        >
                            <Trash2 className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="font-bold text-lg truncate mb-0.5">{template.name}</div>
                      <div className="text-sm opacity-80 font-medium">
                        LKR {template.amount.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs opacity-60 mt-2">
                       <RotateCcw className="w-3 h-3 mr-1" />
                       <span className="capitalize">{getFrequencyLabel(freq)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Add New Section */}
          {showAddForm ? (
            <form onSubmit={handleCreateTemplate} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-700">New Preset</h3>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                    <input 
                        type="text" 
                        required
                        placeholder="e.g. Rent"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Amount</label>
                    <input 
                        type="number" 
                        required
                        placeholder="0.00"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                    <select 
                        value={newType}
                        onChange={e => setNewType(e.target.value as TransactionType)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value={TransactionType.EXPENSE}>Expense</option>
                        <option value={TransactionType.INCOME}>Income</option>
                        <option value={TransactionType.SAVINGS}>Savings</option>
                        <option value={TransactionType.INVESTMENT}>Investment</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                    <select 
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value as Category)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        {getCategoriesForType(newType).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                 </div>
              </div>

              <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['DAILY', 'MONTHLY', 'YEARLY'] as Frequency[]).map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setNewFrequency(f)}
                        className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all ${
                          newFrequency === f 
                            ? 'bg-slate-800 text-white border-slate-800' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {getFrequencyLabel(f)}
                      </button>
                    ))}
                  </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Preset</span>
              </button>
            </form>
          ) : (
            <button 
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-slate-400 hover:text-slate-600 transition-all flex items-center justify-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Create New Preset</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};