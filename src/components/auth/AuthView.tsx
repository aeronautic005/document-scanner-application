import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { UserAccount } from '../../types';
import {
  continueAsGuest,
  registerAccount,
  signInAccount,
} from '../../services/authService';

interface AuthViewProps {
  initialMode?: 'signin' | 'signup';
  onAuthenticated: (user: UserAccount) => void;
  onReplayIntro?: () => void;
  allowCancel?: boolean;
  onCancel?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'signin',
  onAuthenticated,
  onReplayIntro,
  allowCancel,
  onCancel,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      const res = registerAccount(name, email, password);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.user) onAuthenticated(res.user);
    } else {
      const res = signInAccount(email, password);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.user) onAuthenticated(res.user);
    }
  };

  const handleGuest = () => {
    const guest = continueAsGuest();
    onAuthenticated(guest);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-neutral-200/80 shadow-xl p-6 sm:p-8 flex flex-col justify-between min-h-[580px]">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/scanny-logo.jpg"
                alt="Scanny logo"
                className="w-8 h-8 rounded-lg object-cover shadow-soft"
              />
              <span className="font-brand font-semibold text-xl text-[#033236] tracking-[0.03em] lowercase leading-none">
                scanny
              </span>
            </div>
            {allowCancel && onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-medium text-neutral-500 hover:text-[#033236] transition"
              >
                Close
              </button>
            ) : (
              onReplayIntro && (
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="text-xs font-semibold text-neutral-500 hover:text-[#033236] transition"
                >
                  Back
                </button>
              )
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#033236] tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {mode === 'signin'
                ? 'Sign in to access your Scanny documents and preferences.'
                : 'Set up your Scanny profile to organize and export your scans.'}
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div className="grid grid-cols-2 bg-[#f6f6f6] p-1 rounded-full border border-neutral-200/70">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`py-2 rounded-full text-xs font-semibold transition ${
                mode === 'signin'
                  ? 'bg-[#033236] text-white shadow-sm'
                  : 'text-neutral-500 hover:text-[#033236]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`py-2 rounded-full text-xs font-semibold transition ${
                mode === 'signup'
                  ? 'bg-[#033236] text-white shadow-sm'
                  : 'text-neutral-500 hover:text-[#033236]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#f6f6f6] border border-neutral-200/80 rounded-xl px-4 py-3 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236] transition"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-600 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                className="w-full bg-[#f6f6f6] border border-neutral-200/80 rounded-xl px-4 py-3 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236] transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-600 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full bg-[#f6f6f6] border border-neutral-200/80 rounded-xl pl-4 pr-11 py-3 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#033236] transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-full bg-[#033236] hover:bg-[#05454a] text-white font-semibold text-sm shadow-soft active:scale-[0.99] transition-all touch-press mt-2"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer Guest Access */}
        <div className="pt-6 text-center space-y-2">
          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <div className="flex-1 h-px bg-neutral-200" />
            <span>or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
          <button
            type="button"
            onClick={handleGuest}
            className="w-full py-2.5 px-4 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] font-semibold text-xs transition touch-press"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
