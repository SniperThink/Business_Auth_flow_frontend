import React, { useState, useRef, useEffect } from 'react';

export default function OtpInput({ length = 6, onChange }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  // Focus first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = otp.findIndex(val => val === '');
    if (firstEmptyIndex !== -1) {
      inputsRef.current[firstEmptyIndex].focus();
    }
  }, []);

  function handleChange(e, index) {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) return; // only allow digits

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // take only last digit typed

    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus next input if val entered
    if (val && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index] === '') {
        // Move focus back if current empty
        if (index > 0) {
          inputsRef.current[index - 1].focus();
          newOtp[index - 1] = '';
          setOtp(newOtp);
          onChange(newOtp.join(''));
        }
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      {otp.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          ref={el => inputsRef.current[idx] = el}
          style={{
            width: '3rem',
            height: '3rem',
            fontSize: '2rem',
            textAlign: 'center',
            border: '1.5px solid #ccc',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.select()}
        />
      ))}
    </div>
  );
}
