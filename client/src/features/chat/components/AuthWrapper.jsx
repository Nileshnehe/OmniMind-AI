import React, { useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const AuthWrapper = ({ children }) => {
    const { checkSession, isCheckingSession } = useAuth();


    useEffect(() => {
        checkSession();
    }, [checkSession]);


    
if (isCheckingSession) {
  return (
    <div className="flex h-screen w-full bg-bg-page dark:bg-[#0D0E15]">
       
       <div className="w-64 h-full border-r border-border/40 p-4 hidden md:flex flex-col gap-4 animate-pulse">
          <div className="h-10 w-full bg-surface-hover/60 rounded-xl"></div>
          <div className="h-6 w-3/4 bg-surface-hover/60 rounded-md mt-6"></div>
          <div className="h-6 w-1/2 bg-surface-hover/60 rounded-md mt-2"></div>
       </div>

       
       <div className="flex-1 h-full flex flex-col p-6 animate-pulse">
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
             
             <div className="h-10 w-64 bg-surface-hover/60 rounded-lg"></div>
             <div className="h-6 w-48 bg-surface-hover/40 rounded-md"></div>
          </div>
          
          <div className="h-14 w-full max-w-3xl mx-auto bg-surface-hover/60 rounded-2xl mb-4"></div>
       </div>
    </div>
  );
}


    return children;
};

export default AuthWrapper;