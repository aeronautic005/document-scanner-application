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
    <header className="sticky top-0 z-30 bg-[#f6f8f8]/95 backdrop-blur-md border-t-[3px] border-t-[#033236] border-b border-neutral-200/90 shadow-[0_2px_10px_rgba(3,50,54,0.04)] px-5 pt-7 pb-3.5 pt-safe transition-all">
      <div className="flex items-center justify-between">
        {/* Highlighted Scanny Logo + Brand Wordmark */}
        {activeTab === 'dashboard' ? (
          <div className="flex items-center space-x-2.5">
            <img
              src="/scanny-logo.jpg"
              alt="Scanny logo"
              className="w-10 h-10 rounded-xl object-cover shadow-soft flex-shrink-0"
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
          className="w-10 h-10 rounded-full bg-white border border-neutral-200/90 shadow-sm flex items-center justify-center text-[#033236] hover:bg-[#f0f5f5] transition touch-press flex-shrink-0"
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
