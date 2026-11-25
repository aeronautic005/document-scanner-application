import { useState } from 'react';
import { NavigationTab, UploadedDocument, UserAccount } from './types';
import { AppHeader } from './components/layout/AppHeader';
import { MobileNavBar } from './components/layout/MobileNavBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { IntroModal } from './components/onboarding/IntroModal';
import { AuthView } from './components/auth/AuthView';
import {
  getCurrentUser,
  hasSeenIntro,
  markIntroSeen,
  signOutAccount,
} from './services/authService';

export function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => !hasSeenIntro());
  const [user, setUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentDocument, setCurrentDocument] = useState<UploadedDocument | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleIntroComplete = () => {
    markIntroSeen();
    setShowIntro(false);
  };

  const handleAuthenticated = (authenticatedUser: UserAccount) => {
    setUser(authenticatedUser);
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    signOutAccount();
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleScanActionClick = () => {
    setActiveTab('dashboard');
    setIsCameraOpen(true);
  };

  // Step 1: Scanny Intro Popup on first launch (or when replayed)
  if (showIntro) {
    return <IntroModal onComplete={handleIntroComplete} />;
  }

  // Step 2: Login / Sign In screen if no active session (or triggered from Settings)
  if (!user || showAuthModal) {
    return (
      <AuthView
        onAuthenticated={handleAuthenticated}
        onReplayIntro={() => setShowIntro(true)}
        allowCancel={Boolean(user)}
        onCancel={() => setShowAuthModal(false)}
      />
    );
  }

  // Step 3: Main Scanny Application
  return (
    <div className="min-h-screen bg-[#f2f3f5] text-[#033236] flex justify-center selection:bg-[#033236] selection:text-white">
      <div className="w-full max-w-md min-h-screen flex flex-col bg-white sm:border-x sm:border-neutral-200/80 sm:shadow-xl relative">
        <AppHeader
          activeTab={activeTab}
          onSearchClick={() => setActiveTab('history')}
        />

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
          {activeTab === 'settings' && (
            <SettingsView
              user={user}
              onOpenAuth={() => setShowAuthModal(true)}
              onSignOut={handleSignOut}
              onReplayIntro={() => setShowIntro(true)}
            />
          )}
        </main>

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
