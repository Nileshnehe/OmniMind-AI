// src/features/auth/components/AuthWrapper.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const AuthWrapper = ({ children }) => {
    const { checkSession, isCheckingSession } = useAuth();

    //  1. App khulte hi hamesha ek baar backend se session verify karega
    useEffect(() => {
        checkSession();
    }, [checkSession]);

    //  2. Jab tak API ka response nahi aata, Global Loading Screen dikhao
    if (isCheckingSession) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg-page dark:bg-[#0D0E15]">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <svg className="animate-spin h-10 w-10 text-brand dark:text-[#7B6AFF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h2 className="text-text-primary text-xl font-bold tracking-wide">
                        OmniMind Workspace
                    </h2>
                    <p className="text-text-muted text-sm font-medium">
                        Waking up your AI agents...
                    </p>
                </div>
            </div>
        );
    }

    //  3. Agar checking complete ho gayi, toh normal website render kar do
    return children;
};

export default AuthWrapper;