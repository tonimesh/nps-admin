import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  BarChart3,
  BarChartBig,
  AlignVerticalJustifyStartIcon,
} from 'lucide-react';
import { BarStack } from 'recharts';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      const user = { email };

      localStorage.setItem('surveyUser', JSON.stringify(user));

      setUser(user);

      navigate('/dashboard');
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f2] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-120px] right-[-120px] w-[320px] h-[320px] bg-orange-200 rounded-full blur-3xl opacity-40" />

      <div className="absolute bottom-[-120px] left-[-120px] w-[320px] h-[320px] bg-orange-200 rounded-full blur-3xl opacity-40" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          {/* <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-xl shadow-orange-200 mb-5">
            <AlignVerticalJustifyStartIcon className="w-10 h-10 text-white" />
          </div> */}

          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-gray-900">Loyal</span>

            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              ytics
            </span>
          </h1>

          <p className="text-sm text-gray-500 mt-2 font-medium">
            Customer Intelligence Platform
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-xl border border-orange-100 shadow-2xl rounded-3xl p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Welcome Back
            </h2>

            {/* <p className="text-sm text-gray-500 mt-1">
              Sign in to access your dashboard
            </p> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@loyalytics.com"
                  className="w-full h-14 rounded-2xl border border-orange-100 bg-orange-50/40 pl-12 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 rounded-2xl border border-orange-100 bg-orange-50/40 pl-12 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl p-4">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold shadow-lg shadow-orange-200 hover:opacity-90 transition-all"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;