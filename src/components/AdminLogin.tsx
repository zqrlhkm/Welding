import { AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export function AdminLogin({ onLoginSuccess, onBackToSite }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'welding123') {
      setLoginError('');
      onLoginSuccess();
    } else {
      setLoginError('Nama pengguna atau kata laluan salah.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Laman Utama</span>
            </button>
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
              /
            </span>
            <BrandLogo size="sm" className="hidden sm:inline-flex" />
          </div>
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
            Portal Pengurusan CRM
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">
                Log Masuk Admin
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Akses terhad kepada pentadbir Akademi Kemahiran Kimpalan (GIS).
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Nama Pengguna
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="cth: admin"
                autoComplete="username"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/70 text-sm text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Kata Laluan
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/70 text-sm text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15"
              />
            </div>

            {loginError && (
              <p
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-rose-700"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Log Masuk
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
