// src/features/auth/pages/RegisterSuccessModal.jsx
import React from 'react';
import './RegisterSuccessModal.css'; // 🟢 Styling file separation import

const RegisterSuccessModal = ({ email, onConfirm }) => {
  return (
    <div className='reg-modal-backdrop'>
      <div className='reg-modal-box'>
        
        {/* Email Envelope SVG Icon */}
        <div className='reg-modal-icon-wrapper'>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 19V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2zm0 0l8.72-5.693a2 2 0 012.56 0L21 19M12 13V3" />
          </svg>
        </div>

        <h2 className='reg-modal-title'>Registration Complete!</h2>
        
        <p className='reg-modal-text'>
          We have sent a verification link. Please check your inbox at <span className='text-[var(--color-text-primary)] font-semibold break-all'>{email}</span> and verify your email before logging in.
        </p>

        <button onClick={onConfirm} className='reg-modal-btn'>
          Go to Login
        </button>
        
      </div>
    </div>
  );
};

export default RegisterSuccessModal;