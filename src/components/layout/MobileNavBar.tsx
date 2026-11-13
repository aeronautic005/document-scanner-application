import React from 'react';
import { LayoutDashboard, History, Settings, Camera } from 'lucide-react';
import { NavigationTab } from '../../types';

interface MobileNavBarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'history' as NavigationTab,
      label: 'History',
      icon: History,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-900/90 backdrop-blur-xl border-t border-surface-800 shadow-nav">
      <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-between relative">
        {/* Dashboard Tab */}
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 touch-press ${
            activeTab === 'dashboard'
              ? 'text-brand-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5 mb-1 transition-transform group-hover:scale-110" />
            {activeTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-400 shadow-glow" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">{tabs[0].label}</span>
        </button>

        {/* Center Quick Scan Action Trigger (Visual placeholder for camera scanner) */}
        <div className="px-2 -mt-5">
          <button
            type="button"
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-3.5 text-white shadow-lg shadow-brand-500/40 ring-4 ring-surface-900 hover:brightness-110 active:scale-95 transition-all touch-press flex items-center justify-center group"
            title="Scan Document (Ready for Camera Engine)"
            aria-label="Scan Document"
          >
            <Camera className="w-6 h-6 transition-transform group-hover:scale-110" />
          </button>
        </div>

        {/* History Tab */}
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 touch-press ${
            activeTab === 'history'
              ? 'text-brand-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <History className="w-5 h-5 mb-1 transition-transform group-hover:scale-110" />
            {activeTab === 'history' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-400 shadow-glow" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">{tabs[1].label}</span>
        </button>

        {/* Settings Tab */}
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 touch-press ${
            activeTab === 'settings'
              ? 'text-brand-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Settings className="w-5 h-5 mb-1 transition-transform group-hover:scale-110" />
            {activeTab === 'settings' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-400 shadow-glow" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">{tabs[2].label}</span>
        </button>
      </div>
      {/* Safe bottom area spacer for notch devices */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
};
