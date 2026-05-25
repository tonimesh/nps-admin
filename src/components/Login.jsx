import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

import api from '../services/apiService';

import { useBrand } from '../context/BrandContext';

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const { setBrandsFromLogin } = useBrand();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const texts = [
    'Customer Intelligence Platform .',
    'Smarter NPS Starts Here .',
    'Turn Feedback Into Growth .',
  ];

  const [displayText, setDisplayText] =
    useState('');

  const [textIndex, setTextIndex] =
    useState(0);

  const [charIndex, setCharIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');


  useEffect(() => {
    const currentText = texts[textIndex];

    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) =>
          prev + currentText[charIndex]
        );

        setCharIndex((prev) => prev + 1);
      }, 70);

      return () => clearTimeout(timeout);
    } else {
      const pauseTimeout = setTimeout(() => {
        setDisplayText('');
        setCharIndex(0);

        setTextIndex((prev) =>
          prev === texts.length - 1
            ? 0
            : prev + 1
        );
      }, 2200);

      return () =>
        clearTimeout(pauseTimeout);
    }
  }, [charIndex, textIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        '/v1/auth/login',
        {
          email,
          password,
        }
      );

      const responseData =
        response.data.data;

      const userDetails =
        responseData.user_details;

      localStorage.setItem(
        'accessToken',
        responseData.access_token
      );

      localStorage.setItem(
        'refreshToken',
        responseData.refresh_token
      );

      localStorage.setItem(
        'tokenDuration',
        responseData.duration
      );

      const formattedBrands =
        userDetails.brand_details.map(
          (brand) => ({
            id: brand.id,
            name: brand.brandName,
            logo: brand.logoPath,
            code: brand.brandCode,
            email: brand.contactEmail,
            phone: brand.contactNumber,
            address: brand.address,
            industry:
              brand.industryType,
            status: brand.status,
          })
        );

      setBrandsFromLogin(
        formattedBrands
      );

      const userData = {
        email: userDetails.email,
        fullName:
          userDetails.full_name,
      };

      setUser(userData);

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-black">
            <span>Net</span>

            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              ly.
            </span>
          </h1>

          <div className="h-7 flex items-center justify-center">
            <p className="text-gray-500 font-medium text-sm tracking-wide">
              {displayText}

              {/* <span className="animate-pulse text-orange-500">
                .
              </span> */}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100">
          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome Back
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full h-14 rounded-2xl border border-orange-100 bg-orange-50/40 pl-12 pr-4 outline-none"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full h-14 rounded-2xl border border-orange-100 bg-orange-50/40 pl-12 pr-12 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
                  placeholder="Enter Password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold"
            >
              {loading
                ? 'Signing In...'
                : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;