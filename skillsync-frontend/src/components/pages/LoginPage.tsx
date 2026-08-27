import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/AuthService';
import { Validator } from '../../validators/Validation';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    const emailErr = Validator.validateEmail(form.email);
    const passErr = Validator.validatePassword(form.password);
    if (emailErr) e.email = emailErr;
    if (passErr) e.password = passErr;
    return e;
  };

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
    setApiError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    AuthService.login({ email: form.email, password: form.password })
      .then(data => { login(data); navigate('/dashboard'); })
      .catch(() => { setApiError('Invalid email or password. Please try again.'); setLoading(false); });
  };

  return (
    <div className="min-h-screen flex">

      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-900 via-rose-800 to-purple-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-400/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl relative z-10">
          <span className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center font-black">S</span>
          SkillSync
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Build your<br />
            <span className="text-yellow-300">dream team</span>
          </h2>
          <p className="text-pink-200 text-lg leading-relaxed mb-8">
            Connect with skilled developers, match on expertise, and ship together.
          </p>
          <div className="flex flex-col gap-3">
            {['Skill-based team matching', 'Real-time availability status', 'Project application flow'].map(f => (
              <div key={f} className="flex items-center gap-3 text-pink-100">
                <span className="w-5 h-5 rounded-full bg-emerald-400/30 flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </span>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-pink-400 text-xs relative z-10">© 2026 SkillSync</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 font-extrabold text-xl text-pink-700 mb-8">
            <span className="bg-pink-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black">S</span>
            SkillSync
          </Link>

          <div className="card p-8 shadow-xl border-0 bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Welcome back</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Log in to your SkillSync account</p>
            </div>

            {apiError && (
              <div className="alert-error mb-5">
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="label" htmlFor="email">
                  <FiMail className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Email address
                </label>
                <input id="email" type="email"
                  className={`input h-11 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="label" htmlFor="password">
                  <FiLock className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Password
                </label>
                <input id="password" type="password"
                  className={`input h-11 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password" />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button type="submit"
                className={`btn-primary btn-lg mt-1 w-full ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logging in…</span>
                ) : (
                  <span className="flex items-center gap-2">Log In <FiArrowRight className="w-4 h-4" /></span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-pink-600 font-semibold hover:underline">Sign up free</Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Demo: <span className="font-medium">alex@skillsync.com</span> / <span className="font-medium">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
