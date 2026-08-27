import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiMapPin, FiGithub, FiLinkedin, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/AuthService';
import { Validator } from '../../validators/Validation';

const ICONS: Record<string, React.ReactNode> = {
  fullName: <FiUser className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />,
  email: <FiMail className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />,
  password: <FiLock className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />,
  location: <FiMapPin className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />,
  githubUrl: <FiGithub className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />,
  linkedinUrl: <FiLinkedin className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />,
};

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', bio: '', location: '', githubUrl: '', linkedinUrl: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    const nameErr = Validator.validateFullName(form.fullName);
    const emailErr = Validator.validateEmail(form.email);
    const passErr = Validator.validatePassword(form.password);
    if (nameErr) e.fullName = nameErr;
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
    AuthService.register(form)
      .then(data => { login(data); navigate('/dashboard'); })
      .catch(err => {
        setApiError(err.response?.data?.errorMessage || 'Registration failed. Please try again.');
        setLoading(false);
      });
  };

  const field = (id: keyof typeof form, label: string, type = 'text', placeholder = '', required = false) => (
    <div key={id}>
      <label className="label" htmlFor={id}>
        {ICONS[id]}{label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input id={id} type={type}
        className={`input h-10 ${errors[id] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
        value={form[id]}
        onChange={e => handleChange(id, e.target.value)}
        placeholder={placeholder} />
      {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-4 py-10">
      <div className="w-full max-w-lg">

        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-pink-700 mb-8">
          <span className="bg-pink-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black">S</span>
          SkillSync
        </Link>

        <div className="card p-8 shadow-xl border-0 bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1">Join SkillSync and start building great teams</p>
          </div>

          {apiError && <div className="alert-error mb-5"><span>{apiError}</span></div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('fullName', 'Full Name', 'text', 'Jane Doe', true)}
              {field('location', 'Location', 'text', 'City, Country')}
            </div>
            {field('email', 'Email address', 'email', 'you@example.com', true)}
            {field('password', 'Password', 'password', '•••••••• (min 6 chars)', true)}

            <div>
              <label className="label" htmlFor="bio">Bio <span className="text-slate-400 font-normal">(optional)</span></label>
              <textarea id="bio" rows={2}
                className="input resize-none py-2.5 leading-relaxed"
                value={form.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="A short intro about yourself and your skills…" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('githubUrl', 'GitHub URL', 'url', 'https://github.com/…')}
              {field('linkedinUrl', 'LinkedIn URL', 'url', 'https://linkedin.com/in/…')}
            </div>

            <button type="submit"
              className={`btn-primary btn-lg mt-2 w-full ${loading ? 'btn-disabled' : ''}`}
              disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</span>
              ) : (
                <span className="flex items-center gap-2">Create Account <FiArrowRight className="w-4 h-4" /></span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-600 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
