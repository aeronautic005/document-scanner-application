import React from 'react';
import { ScanLine, User } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 pt-8 pb-3.5 pt-safe transition-all">
      <div className="flex items-center justify-between">
        {/* Highlighted App Name / Section Title (No description below) */}
        {activeTab === 'dashboard' ? (
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#033236] text-white flex items-center justify-center shadow-soft flex-shrink-0">
              <ScanLine className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h1 className="font-extrabold text-[26px] text-[#033236] tracking-tight leading-none">
              Scanny
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
          className="w-10 h-10 rounded-full bg-[#f6f6f6] border border-neutral-200/80 flex items-center justify-center text-[#033236] hover:bg-neutral-200/70 transition touch-press flex-shrink-0"
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
