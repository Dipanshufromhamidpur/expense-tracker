import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Wallet } from 'lucide-react';

export function AuthForm() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, authError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      await loginWithEmail(email, password);
    } else {
      await signupWithEmail(email, password);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
           <Wallet size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
           {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
           {isLogin ? 'Sign in to access your finances' : 'Start tracking your spending today'}
        </p>

        {authError && (
          <div className="bg-rose-500/10 text-rose-500 dark:text-rose-400 p-3 rounded-lg text-sm border border-rose-500/20">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="flex items-center gap-4 py-2">
           <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
           <span className="text-xs text-zinc-500 font-medium">OR CONTINUE WITH</span>
           <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-2">
          <button
              onClick={loginWithGoogle}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 text-sm font-bold rounded-xl text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Google
          </button>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-500 font-bold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  );
}
