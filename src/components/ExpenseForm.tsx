import React, { useState } from 'react';
import { CURRENCIES, CATEGORIES, PAYMENT_METHODS, ExpenseInput } from '../types';

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseInput) => void;
  defaultCurrency?: string;
  onCancel?: () => void;
}

export function ExpenseForm({ onSubmit, defaultCurrency = 'INR', onCancel }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [category, setCategory] = useState(CATEGORIES[0] as string);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    onSubmit({
      amount: parseFloat(amount),
      currency,
      category,
      description,
      date,
      paymentMethod,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setAmount('');
    setDescription('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Add New Expense</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Amount</label>
          <div className="flex">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-zinc-100 border border-zinc-200 border-r-0 text-zinc-900 rounded-l-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-400 dark:text-white outline-none font-medium"
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-r-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white outline-none"
          >
            <option value="">None</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white outline-none"
            placeholder="Optional details"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white outline-none"
            placeholder="business, food, personal..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-bold text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 dark:bg-zinc-800 focus:ring-4 focus:ring-zinc-200 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/50 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}
