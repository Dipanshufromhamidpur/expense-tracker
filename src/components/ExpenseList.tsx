import React from 'react';
import { Expense } from '../types';
import { Trash2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-500 font-medium">No expenses found. Start adding some!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
          <thead className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-50 border-b border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-500">
            <tr>
              <th scope="col" className="px-6 py-4">Date</th>
              <th scope="col" className="px-6 py-4">Category</th>
              <th scope="col" className="px-6 py-4">Description</th>
              <th scope="col" className="px-6 py-4 text-right">Amount</th>
              <th scope="col" className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="bg-white border-b border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-700 dark:text-zinc-300">{expense.date}</td>
                <td className="px-6 py-4">
                  <span className="bg-zinc-100 text-zinc-700 text-xs font-bold mr-2 px-2.5 py-1 rounded-md dark:bg-zinc-800 dark:text-zinc-300">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate text-zinc-600 dark:text-zinc-400">{expense.description}</td>
                <td className="px-6 py-4 text-right font-bold text-zinc-900 dark:text-white">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: expense.currency }).format(expense.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => expense.id && onDelete(expense.id)}
                    className="text-rose-500 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-400 p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline-block" />
                    <span className="sr-only">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
