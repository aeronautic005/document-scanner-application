import React from 'react';
import { User } from 'lucide-react';
import { NavigationTab, UserAccount } from '../../types';

interface AppHeaderProps {
  activeTab: NavigationTab;
  user: UserAccount | null;
  onProfileClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  user,
  onProfileClick,
}) => {
  const getInitials = () => {
    if (!user || user.isGuest || !user.name) return null;
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const initials = getInitials();

  return (
    <header
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2.25rem)' }}
      className="sticky top-0 z-30 bg-[#f1f2f4]/95 backdrop-blur-md border-b border-neutral-200/90 rounded-b-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] px-5 pb-4 transition-all"
    >
      <div className="flex items-center justify-between">
        {/* Highlighted Scanny Logo + Brand Wordmark */}
        {activeTab === 'dashboard' ? (
          <div className="flex items-center space-x-2.5">
            <img
              src="/scanny-logo.jpg"
              alt="Scanny logo"
              className="w-10 h-10 rounded-xl object-cover bg-white border border-neutral-200/80 shadow-sm flex-shrink-0"
            />
            <h1 className="font-brand font-semibold text-[28px] text-[#033236] tracking-[0.03em] lowercase leading-none">
              scanny
            </h1>
          </div>
        ) : (
          <h1 className="font-extrabold text-[26px] text-[#033236] tracking-tight leading-none">
            {activeTab === 'history' ? 'History' : 'Settings'}
          </h1>
        )}

        {/* Minimal Account Avatar Button */}
        <button
          type="button"
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 shadow-sm flex items-center justify-center text-[#033236] hover:bg-neutral-50 transition touch-press flex-shrink-0"
          aria-label="Account & Settings"
          title={user && !user.isGuest ? user.name : 'Account & Settings'}
        >
          {initials ? (
            <span className="text-xs font-bold tracking-tight">{initials}</span>
          ) : (
            <User className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
