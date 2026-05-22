import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Mail, Lock, Building, Utensils } from 'lucide-react';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brandId, setBrandId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && brandId) {
      const user = { email, brandId };
      localStorage.setItem('surveyUser', JSON.stringify(user));
      setUser(user);
      navigate('/dashboard');
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">SurveyDash</h2>
          <p className="text-gray-600 mt-2">Customer Feedback Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Admin Login</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
                 <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand ID
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="input-field pl-10"
                  placeholder="BRAND-12345"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="admin@restaurant.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

       

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full bg-orange-600 hover:bg-orange-700">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;