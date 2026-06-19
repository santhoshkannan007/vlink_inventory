import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          {/* Logo Brand */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-200">
              VL
            </div>
            <h2 className="mt-4 text-center text-2xl font-extrabold text-gray-900">
              VLink Inventory
            </h2>
            <p className="mt-1 text-center text-xs text-gray-500 font-semibold tracking-wider uppercase">
              Telecom Logistics Portal
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700 font-medium">
              {error}
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="name@vlink.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              id="submit-btn"
              type="submit"
              disabled={submitting}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        {/* <div className="mt-6 border-t border-gray-100 pt-6">
          <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center mb-3">
            Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center cursor-pointer hover:border-blue-500 transition-all" onClick={() => { setEmail('admin@vlink.com'); setPassword('admin123'); }}>
              <span className="block text-xs font-bold text-gray-800">Admin Role</span>
              <span className="block text-[10px] text-gray-500 mt-1">admin@vlink.com</span>
              <span className="block text-[10px] text-gray-500">pw: admin123</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center cursor-pointer hover:border-blue-500 transition-all" onClick={() => { setEmail('staff@vlink.com'); setPassword('staff123'); }}>
              <span className="block text-xs font-bold text-gray-800">Staff Role</span>
              <span className="block text-[10px] text-gray-500 mt-1">staff@vlink.com</span>
              <span className="block text-[10px] text-gray-500">pw: staff123</span>
            </div>
          </div>
        </div> */}
      </div>

      <p className="mt-6 text-center text-[11px] text-gray-400 font-medium tracking-wide">© 2026 Created by Santhosh Kannan</p>
    </div>
  );
};

export default Login;
