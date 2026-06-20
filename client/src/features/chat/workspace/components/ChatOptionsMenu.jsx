import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// ── Inline SVG icons ───────────────────────────────────────────────

const ShareIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const GroupIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const RenameIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="17" x2="12" y2="22"/>
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17z"/>
  </svg>
);
const ArchiveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);
const DeleteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

// ── MenuItem ───────────────────────────────────────────────────────

const MenuItem = ({ icon, label, onClick, danger = false, dividerAfter = false }) => (
  <>
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 text-left
        ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-text-primary/85 hover:bg-white/5'}`}
    >
      <span className={danger ? 'text-red-400' : 'text-text-muted'}>{icon}</span>
      {label}
    </button>
    {dividerAfter && <div className='h-px bg-white/10 my-1 mx-1' />}
  </>
);

// ── ChatOptionsMenu ────────────────────────────────────────────────

/**
 * ChatOptionsMenu
 *
 * Uses ReactDOM.createPortal to escape overflow-hidden / overflow-auto
 * parent containers. Renders into document.body with position: fixed
 * so it's never clipped by the sidebar's scroll container.
 *
 * Props:
 *   chatId    – id of the owning chat
 *   anchorEl  – the DOM element to position relative to (the ⋮ button)
 *   onClose   – dismiss callback
 *   onDelete  – called with chatId
 *   onRename  – called with chatId
 */
const ChatOptionsMenu = ({ chatId, anchorEl, onClose, onDelete, onRename }) => {
  const menuRef = useRef(null);

  // ── Click-outside to close ────────────────────────────────────────
  useEffect(() => {
    const handleMouseDown = (e) => {
      // Close if click is outside both the menu AND the anchor button
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        anchorEl &&
        !anchorEl.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onClose, anchorEl]);

  // ── Calculate fixed position from the anchor button's rect ───────
  const rect = anchorEl?.getBoundingClientRect() ?? { bottom: 0, left: 0, right: 0 };
  const menuWidth = 208; // w-52 = 13rem = 208px

  // Prefer opening to the right; fall back to left if close to screen edge
  const spaceRight = window.innerWidth - rect.right;
  const left = spaceRight >= menuWidth + 8
    ? rect.right + 4          // open to the right of the button
    : rect.left - menuWidth - 4; // open to the left if not enough space

  // Prefer opening below; flip upward if near bottom of viewport
  const spaceBelow = window.innerHeight - rect.bottom;
  const estimatedMenuHeight = 260;
  const top = spaceBelow >= estimatedMenuHeight
    ? rect.bottom + 4
    : rect.top - estimatedMenuHeight - 4;

  const handle = (action) => { action?.(); onClose(); };

  const menu = (
    <div
      ref={menuRef}
      style={{ position: 'fixed', top, left, zIndex: 9999, width: menuWidth }}
      className='py-1.5 px-1.5 bg-[#1c1d2b] border border-white/10 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-sm'
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem icon={<ShareIcon />}   label='Share'              onClick={() => handle()} />
      <MenuItem icon={<GroupIcon />}   label='Start a group chat' onClick={() => handle()} />
      <MenuItem icon={<RenameIcon />}  label='Rename'             onClick={() => handle(() => onRename?.(chatId))} dividerAfter />
      <MenuItem icon={<PinIcon />}     label='Pin chat'           onClick={() => handle()} />
      <MenuItem icon={<ArchiveIcon />} label='Archive'            onClick={() => handle()} />
      <MenuItem icon={<DeleteIcon />}  label='Delete'             onClick={() => handle(() => onDelete?.(chatId))} danger />

      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(-4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        [data-menu="chat-options"] {
          animation: dropdownFadeIn 0.15s ease-out both;
          transform-origin: top left;
        }
      `}</style>
    </div>
  );

  // Portal: render menu into document.body — escapes all overflow clipping
  return ReactDOM.createPortal(menu, document.body);
};

export default ChatOptionsMenu;
