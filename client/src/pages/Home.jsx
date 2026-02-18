import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, logout, clearError } from '../store/authSlice';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      dispatch(register(formData));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    dispatch(clearError());
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
        <div className="card-glass max-w-2xl w-full text-center animate-slide-up">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{user.name}</span>!
            </h1>
            <p className="text-lg text-gray-600">You're successfully logged in to KnowHowTech</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold text-lg mb-1">AI Chat Assistant</h3>
              <p className="text-sm text-gray-600">Get personalized product recommendations</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🛍️</div>
              <h3 className="font-semibold text-lg mb-1">Browse Products</h3>
              <p className="text-sm text-gray-600">Explore electronics tailored for Kenya</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-primary mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isLogin
              ? 'Sign in to access your AI shopping assistant'
              : 'Create an account to get started'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="card-glass">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slide-up">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner-sm"></div>
                  Processing...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-up">
              <p className="text-red-700 text-sm font-medium">
                {error.message || 'An error occurred. Please try again.'}
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="text-2xl mb-1">🤖</div>
            <p className="text-xs text-gray-600 font-medium">AI Powered</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="text-2xl mb-1">🇰🇪</div>
            <p className="text-xs text-gray-600 font-medium">Kenya Focused</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs text-gray-600 font-medium">Fast & Easy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
