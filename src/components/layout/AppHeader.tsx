import React from 'react';
import { Search } from 'lucide-react';
import { NavigationTab } from '../../types';

interface AppHeaderProps {
  activeTab: NavigationTab;
  onSearchClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ activeTab, onSearchClick }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Scanny';
      case 'history':
        return 'History';
      case 'settings':
        return 'Settings';
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Capture, convert, and organize files';
      case 'history':
        return 'Your saved scans and formatted documents';
      case 'settings':
        return 'Manage preferences and storage';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 pt-5 pb-3 pt-safe transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-[22px] text-[#033236] tracking-tight leading-tight">
            {getTitle()}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {getSubtitle()}
          </p>
        </div>

        {activeTab !== 'history' && (
          <button
            type="button"
            onClick={onSearchClick}
            className="w-10 h-10 rounded-full bg-[#f6f6f6] border border-neutral-200/70 flex items-center justify-center text-[#033236] hover:bg-neutral-200/70 transition touch-press"
            aria-label="Search documents"
            title="Search documents"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
