import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Cpu,
  LayoutGrid,
  FileText,
  Contrast,
  SlidersHorizontal,
  Crop,
  Upload,
  Download,
  RotateCcw,
  ChevronRight,
  LogOut,
  Info,
} from 'lucide-react';
import { UserAccount } from '../../types';
import {
  getGeminiApiKey,
  getSavedDocuments,
  saveGeminiApiKey,
} from '../../services/storageService';

interface SettingsViewProps {
  user: UserAccount | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onReplayIntro: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onOpenAuth,
  onSignOut,
  onReplayIntro,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyPanel, setShowApiKeyPanel] = useState(false);
  const [savedKeyNotice, setSavedKeyNotice] = useState(false);

  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Legal'>('A4');
  const [scanQuality, setScanQuality] = useState<'150 DPI' | '300 DPI' | '600 DPI'>('300 DPI');
  const [colorFilter, setColorFilter] = useState<'Magic B&W' | 'Original' | 'Grayscale'>('Magic B&W');
  const [autoEdge, setAutoEdge] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setApiKey(getGeminiApiKey());
  }, []);

  const flashStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 2600);
  };

  const handleSaveApiKey = () => {
    saveGeminiApiKey(apiKey);
    setSavedKeyNotice(true);
    setTimeout(() => {
      setSavedKeyNotice(false);
      setShowApiKeyPanel(false);
    }, 1000);
  };

  const cyclePageSize = () => {
    const order: Array<'A4' | 'Letter' | 'Legal'> = ['A4', 'Letter', 'Legal'];
    setPageSize(order[(order.indexOf(pageSize) + 1) % order.length]);
  };

  const cycleQuality = () => {
    const order: Array<'150 DPI' | '300 DPI' | '600 DPI'> = ['150 DPI', '300 DPI', '600 DPI'];
    setScanQuality(order[(order.indexOf(scanQuality) + 1) % order.length]);
  };

  const cycleFilter = () => {
    const order: Array<'Magic B&W' | 'Original' | 'Grayscale'> = [
      'Magic B&W',
      'Original',
      'Grayscale',
    ];
    setColorFilter(order[(order.indexOf(colorFilter) + 1) % order.length]);
  };

  const handleExportAllData = () => {
    const docs = getSavedDocuments();
    const payload = {
      app: 'Scanny',
      exportedAt: new Date().toISOString(),
      documentCount: docs.length,
      documents: docs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scanny_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    flashStatus(`Exported ${docs.length} documents to JSON backup.`);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const importedDocs = Array.isArray(parsed) ? parsed : parsed.documents;
        if (Array.isArray(importedDocs)) {
          localStorage.setItem('doc_scanner_documents_v1', JSON.stringify(importedDocs));
          flashStatus(`Imported ${importedDocs.length} documents successfully.`);
        } else {
          flashStatus('Invalid backup file format.');
        }
      } catch {
        flashStatus('Could not read backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetBackup = () => {
    if (window.confirm('Reset all local Scanny documents back to defaults?')) {
      localStorage.removeItem('doc_scanner_documents_v1');
      window.location.reload();
    }
  };

  const isSignedIn = Boolean(user && !user.isGuest);

  return (
    <div className="space-y-6 pb-8">
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        onChange={handleImportData}
        className="hidden"
      />

      {statusMessage && (
        <div className="p-3 rounded-2xl bg-[#f0f5f5] border border-[#033236]/15 text-[#033236] text-xs font-medium">
          {statusMessage}
        </div>
      )}

      {/* Account Section */}
      <section className="space-y-2.5">
        <h2 className="text-[15px] font-bold text-[#033236] px-1">
          Account
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-neutral-100">
          {/* Sign in / Signed-in User Row */}
          <button
            type="button"
            onClick={isSignedIn ? onSignOut : onOpenAuth}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              {isSignedIn ? (
                <LogOut className="w-4 h-4 text-[#033236] flex-shrink-0" />
              ) : (
                <User className="w-4 h-4 text-[#033236] flex-shrink-0" />
              )}
              <div className="min-w-0">
                <span className="text-[13px] font-medium text-[#033236] block truncate">
                  {isSignedIn ? user?.name : 'Sign in'}
                </span>
                {isSignedIn && user?.email && (
                  <span className="text-[11px] text-neutral-400 block truncate">
                    {user.email}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              {isSignedIn && (
                <span className="text-xs text-neutral-500">Sign out</span>
              )}
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>

          {/* AI Vision Engine Row */}
          <div>
            <button
              type="button"
              onClick={() => setShowApiKeyPanel(!showApiKeyPanel)}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
            >
              <div className="flex items-center space-x-3.5">
                <Cpu className="w-4 h-4 text-[#033236] flex-shrink-0" />
                <span className="text-[13px] font-medium text-[#033236]">
                  AI Vision Engine
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-neutral-500">
                  {apiKey ? 'Gemini AI' : 'Local OCR'}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-neutral-400 transition-transform ${
                    showApiKeyPanel ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </button>

            {showApiKeyPanel && (
              <div className="px-4 pb-4 pt-1 bg-[#f6f6f6]/70 space-y-2.5 border-t border-neutral-100">
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Optional Google Gemini API key for cloud AI vision transcription. Leave blank to use built-in offline OCR.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste Gemini API key (AIzaSy...)"
                    className="flex-1 bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 rounded-xl bg-[#033236] hover:bg-[#05454a] text-white text-xs font-semibold transition touch-press"
                  >
                    {savedKeyNotice ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Categories Row */}
          <div className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition">
            <div className="flex items-center space-x-3.5">
              <LayoutGrid className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                Categories
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-neutral-500">6</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </div>

          {/* Default Page Size Row (Subtle highlight like reference) */}
          <button
            type="button"
            onClick={cyclePageSize}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-[#f0f5f5]/60 hover:bg-[#f0f5f5] transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5">
              <FileText className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                Default Page Size
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-neutral-500">{pageSize}</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-2.5">
        <h2 className="text-[15px] font-bold text-[#033236] px-1">
          Preferences
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-neutral-100">
          <button
            type="button"
            onClick={cycleFilter}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5">
              <Contrast className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                Color Filter
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-neutral-500">{colorFilter}</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>

          <button
            type="button"
            onClick={cycleQuality}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5">
              <SlidersHorizontal className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                Scan Quality
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-neutral-500">{scanQuality}</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAutoEdge(!autoEdge)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5">
              <Crop className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                Auto Edge Detection
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-neutral-500">
                {autoEdge ? 'On' : 'Off'}
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="space-y-2.5">
        <h2 className="text-[15px] font-bold text-[#033236] px-1">
          Data Management
        </h2>
        <div className="bg-white rounded-2xl border border-neutral-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-neutral-100">
          <button
            type="button"
            onClick={handleExportAllData}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5">
              <Upload className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                Export Data
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5">
              <Download className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                Import Data
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            type="button"
            onClick={handleResetBackup}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5">
              <RotateCcw className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                Backup & Restore
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            type="button"
            onClick={onReplayIntro}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#f0f5f5]/70 transition text-left touch-press"
          >
            <div className="flex items-center space-x-3.5">
              <Info className="w-4 h-4 text-[#033236] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#033236]">
                About Scanny
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-neutral-500">v1.0</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
