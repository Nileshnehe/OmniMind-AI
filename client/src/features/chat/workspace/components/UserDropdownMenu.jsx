import React from 'react';
import { 
  Sparkles, 
  Smile, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';

const UserDropdownMenu = ({ user, onLogout }) => {
  return (
    //  THEMED CONTAINER DROPDOWN: Follows your custom theme system design token guidelines
    <div className='absolute bottom-16 left-2 w-72 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-2 flex flex-col gap-0.5 z-50 animate-fade-in text-[var(--color-text-primary)] select-none'>
      
      {/* PROFILE ROW HEADER */}
      <div className='flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-surface-hover)] cursor-pointer group transition-colors duration-150 mb-1'>
        <div className='flex items-center gap-3 min-w-0'>
          {/* Avatar Circle using your specific brand colors configuration */}
          <div className='w-9 h-9 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center font-semibold text-sm uppercase flex-shrink-0'>
            {user?.username ? user.username.substring(0, 2) : 'AW'}
          </div>
          <div className='flex flex-col min-w-0 leading-tight text-left'>
            <span className='font-semibold text-[14px] truncate capitalize text-[var(--color-text-primary)]'>
              {user?.username || "Ajay Withcoder"}
            </span>
            <span className='text-[12px] text-[var(--color-text-muted)] mt-0.5 capitalize'>
              Free
            </span>
          </div>
        </div>
        <ChevronRight className='w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors' />
      </div>

      <div className='h-[1px] bg-[var(--color-border)] opacity-60 my-1 px-1' />

      {/* CORE MENU NAVIGATION MATRIX LIST */}
      <button className='flex items-center gap-3 w-full p-2.5 text-[14px] font-medium rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-left text-[var(--color-text-primary)] group cursor-pointer'>
        <Sparkles className='w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]' />
        <span className='flex-1'>Try Plus free</span>
      </button>

      <button className='flex items-center gap-3 w-full p-2.5 text-[14px] font-medium rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-left text-[var(--color-text-primary)] group cursor-pointer'>
        <Smile className='w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]' />
        <span className='flex-1'>Personalization</span>
      </button>

      <button className='flex items-center gap-3 w-full p-2.5 text-[14px] font-medium rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-left text-[var(--color-text-primary)] group cursor-pointer'>
        <User className='w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]' />
        <span className='flex-1'>Profile</span>
      </button>

      <button className='flex items-center gap-3 w-full p-2.5 text-[14px] font-medium rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-left text-[var(--color-text-primary)] group cursor-pointer'>
        <Settings className='w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]' />
        <span className='flex-1'>Settings</span>
      </button>

      <div className='h-[1px] bg-[var(--color-border)] opacity-60 my-1 px-1' />

      <button className='flex items-center justify-between w-full p-2.5 text-[14px] font-medium rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-left text-[var(--color-text-primary)] group cursor-pointer'>
        <div className='flex items-center gap-3'>
          <HelpCircle className='w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]' />
          <span>Help</span>
        </div>
        <ChevronRight className='w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]' />
      </button>

      {/* Logout Row action utilizing dynamic hover feedback logic */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onLogout();
        }}
        className='flex items-center gap-3 w-full p-2.5 text-[14px] font-medium rounded-xl hover:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 transition-colors text-left group cursor-pointer'
      >
        <LogOut className='w-4 h-4 text-red-500/80 group-hover:text-red-500' />
        <span className='flex-1 font-semibold'>Log out</span>
      </button>

    </div>
  );
};

export default UserDropdownMenu;