import React from 'react';
import { ScanText, Bell, Search, Sparkles } from 'lucide-react';
import { NavigationTab } from '../../types';

interface AppHeaderProps {
  activeTab: NavigationTab;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ activeTab }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Document Scanner';
      case 'history':
        return 'Scan History';
      case 'settings':
        return 'Settings';
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Capture, organize & export documents';
      case 'history':
        return 'Archive of all scanned files';
      case 'settings':
        return 'Preferences & storage configurations';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-900/85 backdrop-blur-md border-b border-surface-800 px-4 py-3.5 pt-safe transition-all">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
            <ScanText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight leading-none">
                {getTitle()}
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-brand-400" />
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              {getSubtitle()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-surface-800/80 border border-surface-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-surface-700 transition touch-press"
            aria-label="Search documents placeholder"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="relative w-9 h-9 rounded-full bg-surface-800/80 border border-surface-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-surface-700 transition touch-press"
            aria-label="Notifications placeholder"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface-900"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
