import React, { useState, useMemo } from 'react';
import { Expense, CATEGORIES, PAYMENT_METHODS } from '../types';
import { Download } from 'lucide-react';
import { exportToCSV, exportToSheet } from '../utils/csv';
import { ExpenseList } from './ExpenseList';

interface ReportsViewProps {
  expenses: Expense[];
  defaultCurrency: string;
}

export function ReportsView({ expenses, defaultCurrency }: ReportsViewProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tagStr, setTagStr] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      let valid = true;
      if (startDate && e.date < startDate) valid = false;
      if (endDate && e.date > endDate) valid = false;
      if (category && e.category !== category) valid = false;
      if (paymentMethod && e.paymentMethod !== paymentMethod) valid = false;
      
      const searchTags = tagStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      if (searchTags.length > 0) {
        if (!e.tags || e.tags.length === 0) valid = false;
        else {
           const eTags = e.tags.map(t => t.toLowerCase());
           const hasTag = searchTags.some(st => eTags.includes(st));
           if (!hasTag) valid = false;
        }
      }
      return valid;
    });
  }, [expenses, startDate, endDate, category, paymentMethod, tagStr]);

  const handleExportCSV = () => exportToCSV(filteredExpenses, 'Custom_Report');
  const handleExportSheet = () => exportToSheet(filteredExpenses, 'Custom_Report');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold mb-4 text-zinc-900 dark:text-zinc-100">Filter Reports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm"/>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm"/>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Payment Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm">
              <option value="">All Methods</option>
              {PAYMENT_METHODS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Tags (comma seq)</label>
            <input type="text" placeholder="tech, food..." value={tagStr} onChange={e => setTagStr(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm"/>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
           <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold rounded-lg text-sm transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20">
             <Download size={16}/> Export CSV
           </button>
           <button onClick={handleExportSheet} className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold rounded-lg text-sm transition-colors hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20">
             <Download size={16}/> Export Sheet
           </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-4">
           <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Results ({filteredExpenses.length})</h4>
           <div className="font-bold text-lg text-zinc-900 dark:text-white">
              Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: defaultCurrency }).format(filteredExpenses.reduce((a,b)=>a+b.amount, 0))}
           </div>
        </div>
        <ExpenseList expenses={filteredExpenses} onDelete={() => {}} /> {/* Pass dummy delete for reports view to avoid accidental deletes, or show different view */}
      </div>
    </div>
  );
}
