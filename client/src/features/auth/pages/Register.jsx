// src/features/auth/pages/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { authServices } from '../services/auth.service'
import RegisterSuccessModal from './RegisterSuccessModal' // 🟢 FIX: Yeh line miss ho gayi thi bhei!

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
      e.preventDefault();
      setError('');

      // Client-side quick empty fields validator check
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('All fields are compulsory!');
        return;
      }

      try {
        const data = await authServices.registerUser(name, email, password);
        
        if (data.success) {
          // ❌ Ganda Browser alert gayab. Ab seedhe custom component trigger hoga
          setShowSuccessModal(true); 
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong during signup.');
      }
    };

    return (
        <div className='min-h-screen w-full flex flex-col lg:flex-row bg-bg-page dark:bg-[#0D0E15] transition-colors duration-200 relative'>

            {/* Success popup modal rendered globally inside parent element wrapper layout */}
            {showSuccessModal && (
                <RegisterSuccessModal
                    email={email}
                    onConfirm={() => {
                        setShowSuccessModal(false);
                        navigate('/login'); // Redirect safely to login page panel boundary context
                    }}
                />
            )}

            {/* LEFT FRAME PANEL: Brand Pitch */}
            <div className='flex-1 flex flex-col justify-center items-center p-8 bg-surface-hover/20 dark:bg-bg-card/30 border-b lg:border-b-0 lg:border-r border-border dark:border-[#2D3042] text-center'>
                <div className='max-w-md select-none animate-fade-in'>
                    <h1 className='text-display font-bold text-brand dark:text-[#7B6AFF] mb-4 tracking-tight'>
                        OmniMind AI
                    </h1>
                    <p className='text-body-lg text-text-muted font-medium px-4 max-w-sm mx-auto'>
                        Your personal AI workspace. Ask questions, optimize code, and manage knowledge graph interactions in real-time just like ChatGPT.
                    </p>
                </div>
            </div>

            {/* RIGHT FRAME PANEL: Sign-up Interactive Content Block Wrapper Form Layout */}
            <div className='flex-1 flex justify-center items-center p-6 md:p-12'>
                <div className='w-full max-w-md bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] rounded-2xl p-6 md:p-8 shadow-xl transition-all duration-300'>

                    <form onSubmit={handleRegister} className='flex flex-col gap-5'>
                        <div>
                            <h2 className='text-h2 font-bold text-text-primary tracking-wide text-left'>
                                Create Account
                            </h2>
                            <p className='text-ui-sm text-text-muted mt-1 text-left'>
                                Join OmniMind to build your semantic knowledge graph.
                            </p>
                        </div>

                        {error && (
                            <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-ui-sm font-medium text-left'>
                                {error}
                            </div>
                        )}

                        {/* Input Field Area: Full Name */}
                        <div className='flex flex-col gap-1.5 text-left'>
                            <label className='text-overline text-text-muted uppercase font-semibold'>Full Name</label>
                            <div className='flex items-center gap-3 bg-bg-page dark:bg-[#0D0E15] border border-border dark:border-[#2D3042] focus-within:border-brand rounded-xl px-3.5 py-3 transition-all duration-200'>
                                <svg className='w-5 h-5 text-text-muted opacity-70 flex-shrink-0' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nilesh Nehe"
                                    className='flex-1 bg-transparent text-text-primary text-[15px] outline-none placeholder:text-text-muted/40 font-medium'
                                />
                            </div>
                        </div>

                        {/* Input Field Area: Email */}
                        <div className='flex flex-col gap-1.5 text-left'>
                            <label className='text-overline text-text-muted uppercase font-semibold'>Email Address</label>
                            <div className='flex items-center gap-3 bg-bg-page dark:bg-[#0D0E15] border border-border dark:border-[#2D3042] focus-within:border-brand rounded-xl px-4 py-3.5 transition-all duration-200'>
                                <svg className='w-5 h-5 text-text-muted opacity-70 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nilesh@example.com"
                                    className='flex-1 bg-transparent text-text-primary text-[15px] outline-none placeholder:text-text-muted/40 font-medium'
                                />
                            </div>
                        </div>

                        {/* Input Field Area: Password */}
                        <div className='flex flex-col gap-1.5 text-left'>
                            <label className='text-overline text-text-muted uppercase font-semibold'>Password</label>
                            <div className='flex items-center gap-3 bg-bg-page dark:bg-[#0D0E15] border border-border dark:border-[#2D3042] focus-within:border-brand rounded-xl px-4 py-3.5 transition-all duration-200 relative'>
                                <svg className='w-5 h-5 text-text-muted opacity-70 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                </svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className='flex-1 bg-transparent text-text-primary text-[15px] outline-none placeholder:text-text-muted/40 font-medium tracking-wide'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='text-ui-sm text-brand font-semibold hover:text-brand/80 active:scale-95 transition-all outline-none focus:underline pr-1 cursor-pointer'
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        {/* Form Submit Button Container */}
                        <button
                            type="submit"
                            className='w-full mt-2 bg-brand dark:bg-[#7B6AFF] hover:opacity-95 text-white font-semibold text-[15px] h-12 rounded-xl cursor-pointer transition-all active:scale-[0.99] shadow-md flex items-center justify-center'
                        >
                            Get Started
                        </button>
                        
                        <p className='text-ui-sm text-text-muted text-left mt-2 select-none font-medium'>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className='text-brand dark:text-[#7B6AFF] font-bold hover:underline transition-all duration-200 ml-1'
                            >
                                Log in
                            </Link>
                        </p>
                    </form>

                </div>
            </div>

        </div>
    )
}

export default Register