import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RecurringExpense, RecurringExpenseInput, CATEGORIES, CURRENCIES, PAYMENT_METHODS } from '../types';
import { Trash2, Plus } from 'lucide-react';

interface RecurringExpensesViewProps {
  recurringExpenses: RecurringExpense[];
  addRecurringExpense: (param: RecurringExpenseInput) => void;
  deleteRecurringExpense: (id: string) => void;
  defaultCurrency: string;
}

export function RecurringExpensesView({ recurringExpenses, addRecurringExpense, deleteRecurringExpense, defaultCurrency }: RecurringExpensesViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [category, setCategory] = useState(CATEGORIES[0] as string);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !name) return;
    addRecurringExpense({
      name,
      amount: parseFloat(amount),
      currency,
      category,
      frequency,
      startDate
    });
    setShowForm(false);
    setName('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h3 className="font-bold">Manage Subscriptions</h3>
         <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-lg text-sm transition-colors">
            {showForm ? 'Cancel' : <><Plus size={16}/> Add Recurring</>}
         </button>
      </div>

      <AnimatePresence>
      {showForm && (
        <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           exit={{ opacity: 0, height: 0 }}
           transition={{ duration: 0.2 }}
           className="overflow-hidden"
        >
          <div className="pt-2 pb-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Name / Title</label>
                   <input required type="text" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm"/>
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Amount</label>
                   <div className="flex">
                     <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-zinc-100 border border-zinc-200 border-r-0 text-zinc-900 rounded-l-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm">
                       {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-r-lg block w-full p-2 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white outline-none text-sm"/>
                   </div>
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
                   <select value={category} onChange={e => setCategory(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm">
                     {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Frequency</label>
                   <select value={frequency} onChange={e => setFrequency(e.target.value as any)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm">
                     <option value="daily">Daily</option>
                     <option value="weekly">Weekly</option>
                     <option value="monthly">Monthly</option>
                     <option value="yearly">Yearly</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Start Date</label>
                   <input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg block w-full p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none text-sm"/>
                 </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors">Save Recurring</button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
          <thead className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-50 border-b border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800">
             <tr>
               <th className="px-6 py-4">Name</th>
               <th className="px-6 py-4">Amount</th>
               <th className="px-6 py-4">Frequency</th>
               <th className="px-6 py-4 text-center">Actions</th>
             </tr>
          </thead>
          <tbody>
            {recurringExpenses.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-6">No recurring expenses set up.</td></tr>
            ) : (
               recurringExpenses.map(r => (
                  <tr key={r.id} className="bg-white border-b border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
                     <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{r.name}</td>
                     <td className="px-6 py-4">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: r.currency }).format(r.amount)}</td>
                     <td className="px-6 py-4 capitalize">{r.frequency}</td>
                     <td className="px-6 py-4 text-center">
                        <button onClick={() => r.id && deleteRecurringExpense(r.id)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors">
                           <Trash2 size={16}/>
                        </button>
                     </td>
                  </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
