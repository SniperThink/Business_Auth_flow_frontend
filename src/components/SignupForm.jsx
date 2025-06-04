import React, { useState, useEffect, useContext } from 'react';
import OtpInput from './OtpInput';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { google_login, signup_initiate,signup_verify } from '@/api/api';

function SignupForm() {
  const { refreshUser, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { companyName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await axios.post(signup_initiate, {
        email,
        password,
        businessName: companyName  
      }, { withCredentials: true });

      setShowOtp(true);
      setResendCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setOtpError('Enter 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    try {
      const response = await axios.post(signup_verify, {
        email: formData.email,
        otp
      }, { withCredentials: true });

      const user = response.data.user;

      if (user) {
        setUser(user);
      } else {
        await refreshUser();
        return;
      }

      if (response.status === 200 || response.status === 201) {
        setTimeout(() => {
          navigate('/buyer-dashboard');
        }, 100);
      } else {
        setOtpError("Unexpected response from server.");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(signup_initiate, {
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName
      }, { withCredentials: true });
      setResendCooldown(30);
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  // Google Signup success handler
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
      setError('Google signup failed');
      console.error('Google signup error:', err);
    }
  };

  return (
    <form
      className="space-y-3 w-full max-w-md mx-auto px-4 py-6 bg-white rounded-lg shadow-md"
      onSubmit={showOtp ? handleOtpVerify : handleSignupSubmit}
      autoComplete="off"
    >
      <div className='mb-6 text-center'>
        <h2 className="text-2xl font-bold">Sign Up</h2>
        <p className="text-sm text-gray-600">Create your business account</p>
      </div>

      {!showOtp && (
        <>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              required
              placeholder="Acme Corp"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Create a password"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              placeholder="Repeat your password"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-start gap-2 text-sm mt-1">
            <input type="checkbox" id="terms" className="mt-1 accent-[#1A6262]" required />
            <label htmlFor="terms">
              By continuing, you agree to our{' '}
              <a href="/terms-of-service" className="text-[#1A6262] underline">Terms of Service</a> and{' '}
              <a href="/privacy-policy" className="text-[#1A6262] underline">Privacy Policy</a>.
            </label>
          </div>
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

      {showOtp && (
        <div className="space-y-4">
          <p className="text-sm text-center">Enter the 6-digit OTP sent to your email.</p>
          <OtpInput length={6} onChange={setOtp} />
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0}
            className="text-sm text-[#1A6262] underline"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || otpLoading}
        className="w-full bg-[#1A6262] text-white py-2 rounded-md text-sm font-medium hover:bg-[#155151] transition-colors"
      >
        {loading || otpLoading ? 'Please wait...' : showOtp ? 'Verify OTP' : 'Sign Up'}
      </button>

      {!showOtp && (
        <>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm select-none">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

      <div className="w-full google-login-button">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => setError('Google signup failed')}
  />
</div>
        </>
      )}
    </form>
  );
}

export default SignupForm;
