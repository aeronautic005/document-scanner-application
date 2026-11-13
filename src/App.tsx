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

  const handleScanActionClick = () => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 flex justify-center selection:bg-brand-500 selection:text-white">
      {/* Mobile Shell Container (Full width on mobile, centered app preview container on larger screens) */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-surface-900 border-x border-surface-800/60 shadow-2xl relative">
        {/* Top App Header */}
        <AppHeader activeTab={activeTab} />

        {/* Scrollable Main Content Area with bottom safe padding for Mobile Nav */}
        <main className="flex-1 px-4 py-4 overflow-y-auto pb-28">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentDocument={currentDocument}
              onDocumentChange={setCurrentDocument}
            />
          )}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Mobile Navigation Bar with Dashboard, History, Settings and Scan Trigger */}
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
