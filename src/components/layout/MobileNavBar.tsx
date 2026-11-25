import React, { useState } from 'react';
import { Home, Clock, Settings, Plus, FilePlus2, Camera, ImageUp } from 'lucide-react';
import { NavigationTab } from '../../types';

interface MobileNavBarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onScanClick?: () => void;
  onUploadClick?: () => void;
  onNewBlankDocClick?: () => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeTab,
  onTabChange,
  onScanClick,
  onUploadClick,
  onNewBlankDocClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs: Array<{
    id: NavigationTab;
    label: string;
    icon: typeof Home;
  }> = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleAction = (cb?: () => void) => {
    setMenuOpen(false);
    if (cb) cb();
  };

  return (
    <>
      {/* Backdrop when Quick Create (+) menu is open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-150"
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none px-5 pb-4">
        <div className="max-w-[400px] mx-auto relative">
          {/* Floating Quick Create Menu above the '+' button */}
          {menuOpen && (
            <div className="absolute bottom-[68px] right-0 w-60 bg-white rounded-2xl border border-neutral-200/80 shadow-xl p-1.5 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 origin-bottom-right">
              <button
                type="button"
                onClick={() => handleAction(onNewBlankDocClick)}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-[#f6f6f6] flex items-center space-x-3 text-left transition touch-press"
              >
                <div className="w-8 h-8 rounded-full bg-[#f0f5f5] text-[#033236] flex items-center justify-center flex-shrink-0">
                  <FilePlus2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#033236] block">
                    New Blank Document
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    Write, format & sign
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onScanClick)}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-[#f6f6f6] flex items-center space-x-3 text-left transition touch-press"
              >
                <div className="w-8 h-8 rounded-full bg-[#f0f5f5] text-[#033236] flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#033236] block">
                    Scan with Camera
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    Capture a live photo
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onUploadClick)}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-[#f6f6f6] flex items-center space-x-3 text-left transition touch-press"
              >
                <div className="w-8 h-8 rounded-full bg-[#f0f5f5] text-[#033236] flex items-center justify-center flex-shrink-0">
                  <ImageUp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#033236] block">
                    Upload Image
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    Import from device
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Bottom Bar Row: Pill Nav with Icons + Labels + Detached Circular '+' Button */}
          <div className="flex items-center gap-2.5 pointer-events-auto">
            {/* Dark Pill Navigation Bar */}
            <nav className="flex-1 bg-[#033236] rounded-full p-1.5 shadow-pill-nav flex items-center justify-between gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onTabChange(tab.id);
                    }}
                    aria-label={tab.label}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-full transition-all duration-200 touch-press ${
                      isActive
                        ? 'bg-white/15 text-white font-bold'
                        : 'text-white/70 hover:text-white font-semibold'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'stroke-[2.25]' : 'stroke-[1.9]'
                      }`}
                    />
                    <span className="text-[11px] sm:text-xs tracking-tight whitespace-nowrap">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Detached Circular '+' Action Button on the Side */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Quick create menu"
              title="Create or Capture"
              className="w-13 h-13 p-3.5 rounded-full bg-[#033236] hover:bg-[#05454a] text-white shadow-pill-nav flex items-center justify-center flex-shrink-0 transition-all duration-200 touch-press"
            >
              <Plus
                className={`w-5 h-5 stroke-[2.2] transition-transform duration-200 ${
                  menuOpen ? 'rotate-45' : 'rotate-0'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </>
  );
};
