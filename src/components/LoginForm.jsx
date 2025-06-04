import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { login,google_login } from '../api/api';

function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        login,
        { email, password, rememberMe },
        { withCredentials: true }
      );

      setUser(res.data.user);
      const { role } = res.data;

      if (role === 'buyer_admin') {
        navigate('/buyer-dashboard');
      } else if (role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.message === 'User not found') {
        setError('Account not found. Please sign up instead.');
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
       google_login,
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );

      const { user } = res.data;
      setUser(user);

      if (user.role === 'buyer_admin') {
        navigate('/buyer-dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google login failed:', err);
      setError('Google login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} autoComplete="off" className="space-y-6 w-full">
      <h2 className="text-center text-2xl font-bold mb-2">Sign In</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div>
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          required
          className="w-full border rounded-md px-3 py-2"
          placeholder="john@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-1 font-medium">Password</label>
        <input
          id="password"
          type="password"
          required
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2 mb-2 mt-7">
        <input
          id="remember"
          type="checkbox"
          className="accent-[#1A6262]"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="remember" className="text-sm">Remember me</label>
      </div>

      <button
        type="submit"
        className="w-full bg-[#0F766E] text-white font-semibold py-2 rounded-md hover:bg-[#15514b] transition"
      >
        Sign In
      </button>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-3 text-gray-500 font-semibold">or</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <div className="w-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google login failed')}
          width="100%" // force full width
        />
      </div>

     
    </form>
  );
}

export default LoginForm;
