import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AuthImage from '../assets/Auth.png';
import { AuthContext } from '../contexts/AuthContext';

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      switch (user.role) {
        case 'buyer_admin':
          navigate('/buyer-dashboard', { replace: true });
          break;
        case 'employee':
          navigate('/employee-dashboard', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center mt-10">Checking authentication...</div>;

  return (
    <div className="flex w-screen min-h-screen h-screen overflow-hidden p-5 relative">
      {/* Left side image */}
   <div
  className="hidden md:block flex-shrink-0 w-1/2 h-full bg-no-repeat bg-center rounded-md"
  style={{ backgroundImage: `url(${AuthImage})`, backgroundSize: 'contain' }}
></div>


      <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-full bg-white">
        <div className="w-full max-w-md px-8">
          {isSignup ? <SignupForm /> : <LoginForm />}

          <div className="text-center mt-6">
            {isSignup ? (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignup(false)}
                  className="text-[#0F766E] font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                New to SniperThink?{' '}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-[#0F766E] font-medium hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
