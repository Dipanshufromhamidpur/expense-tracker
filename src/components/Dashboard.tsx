import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Expense } from '../types';

interface DashboardProps {
  expenses: Expense[];
  defaultCurrency: string;
  monthlyBudget?: number;
}

const COLORS = ['#10B981', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#14b8a6', '#ec4899', '#3b82f6'];

export function Dashboard({ expenses, defaultCurrency, monthlyBudget }: DashboardProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => e.date.startsWith(currentMonth));
  }, [expenses, currentMonth]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    monthlyExpenses.forEach(e => {
      // Simplified: ignoring currency conversion for the chart. Ideally we'd convert.
      // But let's just group by category
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [monthlyExpenses]);

  const dailyData = useMemo(() => {
    const data: Record<string, number> = {};
    // Init all days of the month to 0
    const [year, month] = currentMonth.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        data[String(i).padStart(2, '0')] = 0;
    }

    monthlyExpenses.forEach(e => {
      const day = e.date.split('-')[2];
      data[day] = (data[day] || 0) + e.amount;
    });
    
    return Object.entries(data)
      .map(([day, value]) => ({ day, value }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [monthlyExpenses, currentMonth]);

  const totalSpent = useMemo(() => {
     return monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [monthlyExpenses]);

  // Generate last 12 months for selector
  const months = useMemo(() => {
     const arr = [];
     const d = new Date();
     for (let i = 0; i < 12; i++) {
       const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
       arr.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
     }
     return arr;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Monthly Overview</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
               {new Intl.NumberFormat('en-IN', { style: 'currency', currency: defaultCurrency }).format(totalSpent)}
            </h3>
            {monthlyBudget ? (
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                / {new Intl.NumberFormat('en-IN', { style: 'currency', currency: defaultCurrency }).format(monthlyBudget)}
              </span>
            ) : null}
          </div>
          {monthlyBudget ? (
             <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-4 max-w-xs overflow-hidden">
                <div 
                   className={`h-full rounded-full ${totalSpent > monthlyBudget ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                   style={{ width: `${Math.min((totalSpent / monthlyBudget) * 100, 100)}%` }}
                ></div>
             </div>
          ) : null}
        </div>
        <select
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-400 dark:text-white outline-none text-sm font-medium"
        >
          {months.map(m => (
            <option key={m} value={m}>{new Date(`${m}-01`).toLocaleString('default', { month: 'short', year: 'numeric' })}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-80 flex flex-col">
          <h4 className="font-bold mb-4 text-zinc-900 dark:text-zinc-100">Daily Expenses</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525B" strokeOpacity={0.2} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#71717A', fontSize: 10, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717A', fontSize: 10, fontWeight: 'bold'}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid #3F3F46', background: '#18181B', color: '#fff', fontSize: '12px' }} itemStyle={{color: '#fff'}} />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-80 flex flex-col">
          <h4 className="font-bold mb-4 text-zinc-900 dark:text-zinc-100">Expenses by Category</h4>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #3F3F46', background: '#18181B', color: '#fff', fontSize: '12px' }} itemStyle={{color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-zinc-500 font-medium text-sm">
                No data for this month
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
