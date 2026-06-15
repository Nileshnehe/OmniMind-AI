import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/useAuth'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState('');

    
    const { loading, error, login, isAuthenticated, clearErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        clearErrors();
        setValidationError('');
    }, [clearErrors]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); 
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        setValidationError('');
        clearErrors();

        if (!email.trim() || !password.trim()) {
            setValidationError('Please enter both email and password!');
            return;
        }

        
        login(email, password);
    };

    return (
        <div className='min-h-screen w-full flex flex-col lg:flex-row bg-bg-page dark:bg-[#0D0E15] transition-colors duration-200'>

            {/* LEFT FRAMEPANEL */}
            <div className='flex-1 flex flex-col justify-center items-center p-8 bg-surface-hover/20 dark:bg-bg-card/30 border-b lg:border-b-0 lg:border-r border-border dark:border-[#2D3042] text-center'>
                <div className='max-w-md select-none animate-fade-in'>
                    <h1 className='text-display font-bold text-brand dark:text-[#7B6AFF] mb-4 tracking-tight'>OmniMind AI</h1>
                    <p className='text-body-lg text-text-muted font-medium px-4 max-w-sm mx-auto'>
                        Your personal AI workspace. Ask questions, optimize code, and manage knowledge graph interactions in real-time just like ChatGPT.
                    </p>
                </div>
            </div>

            {/* RIGHT FRAMEPANEL */}
            <div className='flex-1 flex justify-center items-center p-6 md:p-12'>
                <div className='w-full max-w-md bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] rounded-2xl p-6 md:p-8 shadow-xl transition-all duration-300'>
                    <form onSubmit={handleLogin} className='flex flex-col gap-5'>
                        <div>
                            <h2 className='text-h2 font-bold text-text-primary tracking-wide text-left'>Welcome Back</h2>
                            <p className='text-ui-sm text-text-muted mt-1 text-left'>Welcome back! Please enter your credentials to log in.</p>
                        </div>

                        {/* Combined errors check matching both validator metrics or response code hooks */}
                        {(validationError || error) && (
                            <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-ui-sm font-medium text-left animate-fade-in'>
                                {validationError || error}
                            </div>
                        )}

                        <div className='flex flex-col gap-1.5 text-left'>
                            <label className='text-overline text-text-muted uppercase font-semibold'>Email Address</label>
                            <div className='flex items-center gap-3 bg-bg-page dark:bg-[#0D0E15] border border-border dark:border-[#2D3042] focus-within:border-brand rounded-xl px-4 py-3.5 transition-all duration-200'>
                                <svg className='w-5 h-5 text-text-muted opacity-70 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap="round" strokeLinejoin="round" strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' /></svg>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nilesh@example.com" disabled={loading} className='flex-1 bg-transparent text-text-primary text-[15px] outline-none placeholder:text-text-muted/40 font-medium disabled:opacity-60' />
                            </div>
                        </div>

                        <div className='flex flex-col gap-1.5 text-left'>
                            <div className='flex justify-between items-center w-full'>
                                <label className='text-overline text-text-muted uppercase font-semibold'>Password</label>
                                <Link to="/forgot-password" className='text-ui-sm text-brand dark:text-[#7B6AFF] font-medium hover:underline mb-0.5'>Forgot password?</Link>
                            </div>
                            <div className='flex items-center gap-3 bg-bg-page dark:bg-[#0D0E15] border border-border dark:border-[#2D3042] focus-within:border-brand rounded-xl px-4 py-3.5 transition-all duration-200 relative'>
                                <svg className='w-5 h-5 text-text-muted opacity-70 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap="round" strokeLinejoin="round" strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' /></svg>
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={loading} className='flex-1 bg-transparent text-text-primary text-[15px] outline-none placeholder:text-text-muted/40 font-medium tracking-wide disabled:opacity-60' />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} className='text-ui-sm text-brand font-semibold hover:text-brand/80 active:scale-95 transition-all outline-none pr-1 cursor-pointer disabled:opacity-50'>{showPassword ? 'Hide' : 'Show'}</button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-2 bg-brand dark:bg-[#7B6AFF] text-white font-semibold text-[15px] h-12 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer active:scale-[0.99]'}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Logging in...</span>
                                </>
                            ) : "Sign In"}
                        </button>

                        <p className='text-ui-sm text-text-muted text-left mt-2 select-none font-medium'>
                            Don't have an account? <Link to="/register" className='text-brand dark:text-[#7B6AFF] font-bold hover:underline transition-all duration-200 ml-1'>Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;