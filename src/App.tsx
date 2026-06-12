import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { useAuth } from './hooks/useAuth';
import { useExpenses } from './hooks/useExpenses';
import { useSettings } from './hooks/useSettings';
import { Dashboard } from './components/Dashboard';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import { SettingsModal } from './components/SettingsModal';
import { AuthForm } from './components/AuthForm';
import { ReportsView } from './components/ReportsView';
import { RecurringExpensesView } from './components/RecurringExpensesView';
import { useRecurringExpenses } from './hooks/useRecurringExpenses';
import { processRecurringExpenses } from './utils/recurringProcessor';
import { exportToCSV } from './utils/csv';
import { Moon, Sun, LogOut, Wallet, Download, Plus, Settings, BarChart3, Repeat, LayoutDashboard } from 'lucide-react';

function AppContent() {
  const { user, logout, loading: authLoading } = useAuth();
  const { expenses, addExpense, deleteExpense, loading: expensesLoading } = useExpenses();
  const { recurringExpenses, addRecurringExpense, deleteRecurringExpense, updateRecurringExpense, loading: recurringLoading } = useRecurringExpenses();
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'recurring'>('dashboard');

  React.useEffect(() => {
    if (user && !expensesLoading && !recurringLoading && recurringExpenses.length > 0) {
      processRecurringExpenses(recurringExpenses, addExpense, updateRecurringExpense);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, expensesLoading, recurringLoading, recurringExpenses.length]);

  // Default currency fallback
  const defaultCurrency = settings?.defaultCurrency || 'INR';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 text-zinc-950 rounded-lg flex items-center justify-center">
                  <Wallet size={20} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold tracking-tight">SENTINEL</span>
              </div>
              
              <div className="hidden md:flex items-center gap-1">
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                >
                  <LayoutDashboard size={16}/> Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('reports')} 
                  className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'reports' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                >
                  <BarChart3 size={16}/> Reports
                </button>
                <button 
                  onClick={() => setActiveTab('recurring')} 
                  className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'recurring' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                >
                  <Repeat size={16}/> Recurring
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent dark:hover:border-zinc-700 transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent dark:hover:border-zinc-700 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-700">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="User" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-600" />
                <button
                  onClick={logout}
                  className="p-2 text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-zinc-800 border border-transparent dark:hover:border-zinc-700 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <nav className="sm:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 text-zinc-950 rounded-lg flex items-center justify-center">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold tracking-tight">SENTINEL</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-zinc-500 dark:text-zinc-400">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={logout} className="p-2 text-zinc-500 dark:text-zinc-400 mb-0"><LogOut size={20}/></button>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-2 pb-1">
             <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 shrink-0 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}><LayoutDashboard size={16}/> Dashboard</button>
             <button onClick={() => setActiveTab('reports')} className={`px-3 py-2 shrink-0 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'reports' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}><BarChart3 size={16}/> Reports</button>
             <button onClick={() => setActiveTab('recurring')} className={`px-3 py-2 shrink-0 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'recurring' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}><Repeat size={16}/> Recurring</button>
          </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Top actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Overview</h1>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl font-bold transition-colors text-sm shadow-sm dark:shadow-white/5"
                >
                  {showForm ? 'Cancel' : <><Plus size={18} strokeWidth={3}/> Quick Entry</>}
                </button>
              </div>
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
                   <ExpenseForm
                      defaultCurrency={defaultCurrency}
                      onSubmit={(data) => {
                        addExpense(data);
                        setShowForm(false);
                      }}
                      onCancel={() => setShowForm(false)}
                   />
                 </div>
              </motion.div>
            )}
            </AnimatePresence>

            <Dashboard expenses={expenses} defaultCurrency={defaultCurrency} monthlyBudget={settings?.monthlyBudget} />

            <div>
              <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Recent Transactions</h2>
              {expensesLoading ? (
                 <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                 </div>
              ) : (
                <ExpenseList expenses={expenses} onDelete={deleteExpense} />
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ReportsView expenses={expenses} defaultCurrency={defaultCurrency} />
          </motion.div>
        )}

        {activeTab === 'recurring' && (
          <motion.div
            key="recurring"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <RecurringExpensesView 
              recurringExpenses={recurringExpenses}
              addRecurringExpense={addRecurringExpense}
              deleteRecurringExpense={deleteRecurringExpense}
              defaultCurrency={defaultCurrency}
            />
          </motion.div>
        )}
        </AnimatePresence>

        {showSettings && (
           <SettingsModal
              settings={settings}
              onClose={() => setShowSettings(false)}
              onSave={(budget, cur) => {
                 updateSettings(budget, cur);
                 setShowSettings(false);
              }}
           />
        )}

      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

