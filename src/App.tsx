import { useState } from 'react';
import { NavigationTab, UploadedDocument } from './types';
import { AppHeader } from './components/layout/AppHeader';
import { MobileNavBar } from './components/layout/MobileNavBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentDocument, setCurrentDocument] = useState<UploadedDocument | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleScanActionClick = () => {
    setActiveTab('dashboard');
    setIsCameraOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-[#033236] flex justify-center selection:bg-[#033236] selection:text-white">
      {/* Mobile Shell Container: crisp white main background */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-white sm:border-x sm:border-neutral-200/80 sm:shadow-xl relative">
        {/* Minimalist Top Header */}
        <AppHeader
          activeTab={activeTab}
          onSearchClick={() => setActiveTab('history')}
        />

        {/* Scrollable Main Content Area with bottom clearance for floating pill nav */}
        <main className="flex-1 px-5 py-3 overflow-y-auto pb-28">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentDocument={currentDocument}
              onDocumentChange={setCurrentDocument}
              onViewHistory={() => setActiveTab('history')}
              isCameraOpen={isCameraOpen}
              onSetCameraOpen={setIsCameraOpen}
            />
          )}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Floating Pill Mobile Navigation Bar */}
        <MobileNavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onScanClick={handleScanActionClick}
        />
      </div>
    </div>
  );
}

export default App;
