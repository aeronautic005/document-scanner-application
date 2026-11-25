import React from 'react';
import { Home, Clock, Settings, Camera } from 'lucide-react';
import { NavigationTab } from '../../types';

interface MobileNavBarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onScanClick?: () => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeTab,
  onTabChange,
  onScanClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none px-5 pb-4">
      <nav className="max-w-[380px] mx-auto bg-[#033236] rounded-full p-1.5 shadow-pill-nav pointer-events-auto flex items-center justify-between gap-1">
        {/* Dashboard Tab */}
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-semibold transition-all duration-200 touch-press ${
            activeTab === 'dashboard'
              ? 'bg-white text-[#033236] shadow-sm'
              : 'text-white/75 hover:text-white'
          }`}
          aria-label="Dashboard"
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          {activeTab === 'dashboard' && <span>Home</span>}
        </button>

        {/* Quick Camera Capture Button */}
        <button
          type="button"
          onClick={onScanClick}
          className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center flex-shrink-0 transition-all touch-press border border-white/15"
          title="Take Photo"
          aria-label="Take Photo"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* History Tab */}
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-semibold transition-all duration-200 touch-press ${
            activeTab === 'history'
              ? 'bg-white text-[#033236] shadow-sm'
              : 'text-white/75 hover:text-white'
          }`}
          aria-label="History"
        >
          <Clock className="w-4 h-4 flex-shrink-0" />
          {activeTab === 'history' && <span>History</span>}
        </button>

        {/* Settings Tab */}
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-semibold transition-all duration-200 touch-press ${
            activeTab === 'settings'
              ? 'bg-white text-[#033236] shadow-sm'
              : 'text-white/75 hover:text-white'
          }`}
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {activeTab === 'settings' && <span>Settings</span>}
        </button>
      </nav>
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </div>
  );
};
