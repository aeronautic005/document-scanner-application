import React, { useRef, useState } from 'react';
import { NavigationTab, ScanResult, UploadedDocument, UserAccount } from './types';
import { AppHeader } from './components/layout/AppHeader';
import { MobileNavBar } from './components/layout/MobileNavBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { IntroModal } from './components/onboarding/IntroModal';
import { SplashScreen } from './components/onboarding/SplashScreen';
import { AuthView } from './components/auth/AuthView';
import { DocumentEditorModal } from './components/document/DocumentEditorModal';
import {
  getCurrentUser,
  hasSeenIntro,
  markIntroSeen,
  signOutAccount,
} from './services/authService';
import { saveFormattedDocument } from './services/storageService';
import { formatFileSize, getImageDimensions } from './utils/fileUtils';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [user, setUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [showIntro, setShowIntro] = useState<boolean>(() => !getCurrentUser() || !hasSeenIntro());
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentDocument, setCurrentDocument] = useState<UploadedDocument | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBlankDocOpen, setIsBlankDocOpen] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const globalUploadRef = useRef<HTMLInputElement>(null);

  const handleGetStarted = () => {
    markIntroSeen();
    setAuthInitialMode('signup');
    setShowIntro(false);
    setShowAuthModal(true);
  };

  const handleAlreadyHaveAccount = () => {
    markIntroSeen();
    setAuthInitialMode('signin');
    setShowIntro(false);
    setShowAuthModal(true);
  };

  const handleAuthenticated = (authenticatedUser: UserAccount) => {
    setUser(authenticatedUser);
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    signOutAccount();
    setUser(null);
    setShowAuthModal(false);
    setShowIntro(true);
    setActiveTab('dashboard');
  };

  const handleScanActionClick = () => {
    setActiveTab('dashboard');
    setIsCameraOpen(true);
  };

  const handleGlobalUploadClick = () => {
    globalUploadRef.current?.click();
  };

  const handleGlobalFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      const dimensions = await getImageDimensions(previewUrl);
      setCurrentDocument({
        id: `upload-${Date.now()}`,
        file,
        name: file.name,
        rawSize: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type,
        previewUrl,
        uploadedAt: 'Just now',
        dimensions,
        selectedCategory: 'Invoice',
      });
      setActiveTab('dashboard');
    }
    e.target.value = '';
  };

  const blankScanTemplate: ScanResult = {
    id: `blank-${Date.now()}`,
    title: 'Untitled Document',
    category: 'Note',
    extractedText: '',
    confidence: 100,
    wordCount: 0,
    charCount: 0,
    processingTimeMs: 0,
    previewUrl: '',
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    size: '1 KB',
  };

  // Step 0: Minimal Splash Screen (Logo + scanny) on app launch
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Step 1: Scanny Welcome Screen ("GET STARTED" / "I ALREADY HAVE AN ACCOUNT")
  if (showIntro) {
    return (
      <IntroModal
        onGetStarted={handleGetStarted}
        onAlreadyHaveAccount={handleAlreadyHaveAccount}
      />
    );
  }

  // Step 2: Login / Sign Up screen if no active session (or triggered from Settings)
  if (!user || showAuthModal) {
    return (
      <AuthView
        initialMode={authInitialMode}
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
      <input
        ref={globalUploadRef}
        type="file"
        accept="image/*"
        onChange={handleGlobalFileSelected}
        className="hidden"
      />

      <div className="w-full max-w-md min-h-screen flex flex-col bg-white sm:border-x sm:border-neutral-200/80 sm:shadow-xl relative">
        <AppHeader
          activeTab={activeTab}
          user={user}
          onProfileClick={() => setActiveTab('settings')}
        />

        <main className="flex-1 px-5 py-3 pb-28">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentDocument={currentDocument}
              onDocumentChange={setCurrentDocument}
              onViewHistory={() => setActiveTab('history')}
              isCameraOpen={isCameraOpen}
              onSetCameraOpen={setIsCameraOpen}
            />
          )}
          {activeTab === 'history' && <HistoryView key={historyRefreshKey} />}
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
          onUploadClick={handleGlobalUploadClick}
          onNewBlankDocClick={() => setIsBlankDocOpen(true)}
        />
      </div>

      {/* New Blank Document Modal triggered from '+' Quick Create menu */}
      <DocumentEditorModal
        initialScan={blankScanTemplate}
        isOpen={isBlankDocOpen}
        onClose={() => setIsBlankDocOpen(false)}
        onSaveDocument={(doc) => {
          saveFormattedDocument(doc);
          setHistoryRefreshKey((k) => k + 1);
          setActiveTab('history');
        }}
      />
    </div>
  );
}

export default App;
