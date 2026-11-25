import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getGeminiApiKey, saveGeminiApiKey } from '../../services/storageService';

export const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoEdgeDetection, setAutoEdgeDetection] = useState(true);
  const [pdfPasswordProtection, setPdfPasswordProtection] = useState(false);

  useEffect(() => {
    setApiKey(getGeminiApiKey());
  }, []);

  const handleSaveKey = () => {
    saveGeminiApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* AI Vision Engine Section */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-neutral-500 px-1">
          AI Vision Engine
        </h2>
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-3 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#033236]">
                Google Gemini API Key
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Optional for enhanced AI vision transcription
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f6f6f6] text-[#033236] border border-neutral-200/80">
              {apiKey ? 'Gemini Active' : 'Local OCR'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key (AIzaSy...)"
              className="flex-1 bg-[#f6f6f6] border border-neutral-200/80 rounded-xl px-3.5 py-2.5 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236] font-mono"
            />
            <button
              type="button"
              onClick={handleSaveKey}
              className="px-4 py-2.5 rounded-xl bg-[#033236] hover:bg-[#05454a] text-white text-xs font-semibold transition touch-press flex-shrink-0"
            >
              {savedSuccess ? 'Saved' : 'Save'}
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed">
            When provided, scans use Google Gemini Vision. If left blank, built-in client-side OCR runs automatically offline.
          </p>
        </div>
      </section>

      {/* Storage Section */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-neutral-500 px-1">
          Storage
        </h2>
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-3 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#033236]">
                Local Document Storage
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Offline document history cache
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f6f6f6] text-[#033236] border border-neutral-200/80">
              Active
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            <div className="flex justify-between text-xs text-neutral-500 font-medium">
              <span>28.4 MB used</span>
              <span>Local Storage</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f6f6f6] overflow-hidden">
              <div className="h-full bg-[#033236] rounded-full w-[12%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Scan Engine Preferences Group */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-neutral-500 px-1">
          Scan Preferences
        </h2>
        <div className="bg-white border border-neutral-200/80 rounded-2xl divide-y divide-neutral-100 shadow-card overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#033236]">Default Scan Quality</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">High Resolution</p>
            </div>
            <span className="text-xs text-neutral-500 font-medium flex items-center">
              300 DPI <ChevronRight className="w-4 h-4 ml-1 text-neutral-400" />
            </span>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#033236]">Auto Edge Detection</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Automatic document boundary crop</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoEdgeDetection(!autoEdgeDetection)}
              aria-label="Toggle auto edge detection"
              className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                autoEdgeDetection ? 'bg-[#033236] justify-end' : 'bg-neutral-200 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#033236]">Default Color Filter</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Clean high-contrast output</p>
            </div>
            <span className="text-xs text-neutral-500 font-medium flex items-center">
              Magic B&W <ChevronRight className="w-4 h-4 ml-1 text-neutral-400" />
            </span>
          </div>
        </div>
      </section>

      {/* Export & Format Group */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-neutral-500 px-1">
          Export & Format
        </h2>
        <div className="bg-white border border-neutral-200/80 rounded-2xl divide-y divide-neutral-100 shadow-card overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#033236]">Default Page Format</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Standard ISO sizing</p>
            </div>
            <span className="text-xs text-neutral-500 font-medium flex items-center">
              A4 <ChevronRight className="w-4 h-4 ml-1 text-neutral-400" />
            </span>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#033236]">PDF Password Protection</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Encrypt exported files</p>
            </div>
            <button
              type="button"
              onClick={() => setPdfPasswordProtection(!pdfPasswordProtection)}
              aria-label="Toggle PDF password protection"
              className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                pdfPasswordProtection ? 'bg-[#033236] justify-end' : 'bg-neutral-200 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </section>

      {/* System & Support Group */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-neutral-500 px-1">
          System
        </h2>
        <div className="bg-white border border-neutral-200/80 rounded-2xl divide-y divide-neutral-100 shadow-card overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#033236]">Clear Saved Documents</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Reset local history database</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all saved documents to defaults?')) {
                  localStorage.removeItem('doc_scanner_documents_v1');
                  window.location.reload();
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold transition"
            >
              Reset
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#033236]">Privacy & Security</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">On-device OCR and data policy</p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#033236]">Document Scanner</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Version 1.0.0</p>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              Up to date
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
