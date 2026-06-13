import React from 'react';

const LogoutModal = ({ user, onConfirm, onCancel }) => {
    return (

        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in px-4'>


            <div className='w-full max-w-[400px] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-scale-in select-none'>


                <h2 className='text-[var(--color-text-primary)] text-[20px] font-bold tracking-wide mb-2'>
                    Are you sure you want to log out?
                </h2>


                <p className='text-[var(--color-text-muted)] text-[15px] leading-relaxed px-2 mb-6 break-all w-full'>
                    Log out of OmniMind AI as <span className='text-[var(--color-text-primary)] font-medium'>{user?.email || "nileshnehe212@gmail.com"}</span>?
                </p>


                <div className='flex flex-col gap-2.5 w-full'>


                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                        }}
                        className='w-full py-3 bg-white hover:bg-neutral-200 text-black font-semibold text-[15px] rounded-full border border-[var(--color-border)]   transition-all duration-200 transform active:scale-[0.98] cursor-pointer'
                    >
                        Log out
                    </button>


                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCancel();
                        }}
                        className='w-full py-3 bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] font-semibold text-[15px] rounded-full border border-[var(--color-border)] transition-all duration-200 transform active:scale-[0.98] cursor-pointer'
                    >
                        Cancel
                    </button>

                </div>

            </div>
        </div>
    );
};

export default LogoutModal;