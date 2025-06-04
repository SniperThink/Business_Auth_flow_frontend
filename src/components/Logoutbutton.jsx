import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; 
import {logout} from '../api/api'

function LogoutButton() {
  const navigate = useNavigate();
  const { logout: logoutContext } = useContext(AuthContext);  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
       logout,
         {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        logoutContext();  // <-- this clears user and tokens client-side

        // Now navigate to public route
        navigate('/');
      } else {
        setError('Logout failed, please try again.');
      }
    } catch (err) {
      setError('Logout error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1A6262',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '1rem',
          boxShadow: '0 2px 6px rgba(26, 98, 98, 0.5)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#145454')}
        onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#1A6262')}
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && (
        <p style={{ color: 'red', marginTop: '10px', fontWeight: '500' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default LogoutButton;
