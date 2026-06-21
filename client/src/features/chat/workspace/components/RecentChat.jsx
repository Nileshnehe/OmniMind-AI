import React, { useRef } from 'react';
import { formatChatDate } from '../../../../utils/dateUtils.js';
import ChatOptionsMenu from './ChatOptionsMenu';


const RecentChat = ({
  chatId,
  title,
  createdAt,
  onClick,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onDelete,
  onRename,
  showDate = false

}) => {
  // Ref on the ⋮ button — passed to ChatOptionsMenu as anchorEl
  // so the portal can calculate its fixed position from the button's rect
  const dotsButtonRef = useRef(null);

  return (
    <div className='relative w-full'>
      <div
        onClick={onClick}
        className='flex items-center justify-between h-9 pl-3 pr-1.5 rounded-lg text-text-primary hover:bg-surface-hover/50 cursor-pointer group transition-all duration-150 w-full'
      >
        {/* Chat title */}
        <span className='text-[14px] font-medium tracking-wide truncate opacity-85 group-hover:opacity-100 transition-opacity flex-1 min-w-0 pr-2'>
          {title}
        </span>

        {/* Right-aligned Date */}
        {showDate && (
          <span className="text-[12px] text-text-muted mr-2 whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity">
            {formatChatDate(createdAt)}
          </span>
        )}

        {/* Three-dots button — ref captured for portal positioning */}
        <button
          ref={dotsButtonRef}
          onClick={(e) => {
            e.stopPropagation(); // Don't trigger the "open chat" row click
            onMenuToggle();
          }}
          className={`flex items-center justify-center w-6 h-6 rounded-md transition-all duration-150 flex-shrink-0
            ${isMenuOpen
              ? 'opacity-100 bg-white/10'
              : 'opacity-0 group-hover:opacity-100 hover:bg-white/10'
            }`}
          title='Options'
        >
          {/* Vertical dots ⋮ */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className='opacity-60'>
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Portal menu — rendered into document.body, never clipped by sidebar overflow */}
      {isMenuOpen && (
        <ChatOptionsMenu
          chatId={chatId}
          anchorEl={dotsButtonRef.current}
          onClose={onMenuClose}
          onDelete={onDelete}
          onRename={onRename}
        />
      )}
    </div>
  );
};

export default RecentChat;