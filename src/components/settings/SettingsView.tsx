import React from 'react';
import {
  Cloud,
  HardDrive,
  Camera,
  FileCheck,
  Shield,
  Palette,
  Info,
  ChevronRight,
  Sparkles,
  Trash2,
  Lock,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-5 pb-6">
      {/* Storage & Cloud Card */}
      <section className="bg-gradient-to-br from-surface-850 to-surface-900 border border-surface-800 rounded-2xl p-4.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Cloud Storage</h3>
              <p className="text-xs text-slate-400">Sync scans across devices</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        </div>

        {/* Storage Bar Indicator */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>28.4 MB used</span>
            <span>5.0 GB Cloud Plan</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-indigo-400 rounded-full w-[4.5%]" />
          </div>
        </div>
      </section>

      {/* Scanner Preferences Group */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Scan Engine Preferences
        </h4>
        <div className="bg-surface-850 border border-surface-800 rounded-2xl divide-y divide-surface-800">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="w-4 h-4 text-brand-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Default Scan Quality</p>
                <p className="text-[11px] text-slate-400">High Resolution (300 DPI)</p>
              </div>
            </div>
            <span className="text-xs text-brand-400 font-medium flex items-center">
              300 DPI <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Auto Edge Detection</p>
                <p className="text-[11px] text-slate-400">Automatic document boundary crop</p>
              </div>
            </div>
            {/* Visual toggle switch placeholder */}
            <div className="w-11 h-6 rounded-full bg-brand-600 p-0.5 flex items-center justify-end cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Default Color Filter</p>
                <p className="text-[11px] text-slate-400">Magic Clean & High Contrast</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium flex items-center">
              Magic B&W <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
        </div>
      </section>

      {/* PDF & Export Defaults */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Export & Format
        </h4>
        <div className="bg-surface-850 border border-surface-800 rounded-2xl divide-y divide-surface-800">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Default Page Format</p>
                <p className="text-[11px] text-slate-400">Standard ISO A4 sizing</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium flex items-center">
              A4 <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">PDF Password Protection</p>
                <p className="text-[11px] text-slate-400">Encrypt exported files</p>
              </div>
            </div>
            <div className="w-11 h-6 rounded-full bg-surface-700 p-0.5 flex items-center justify-start cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* App Info & Maintenance */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          System & Storage
        </h4>
        <div className="bg-surface-850 border border-surface-800 rounded-2xl divide-y divide-surface-800">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Local Cache</p>
                <p className="text-[11px] text-slate-400">12.2 MB temporary thumbnails</p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Privacy & Security</p>
                <p className="text-[11px] text-slate-400">On-device OCR & data policy</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Document Scanner</p>
                <p className="text-[11px] text-slate-400">Version 1.0.0 (Build 2026.11)</p>
              </div>
            </div>
            <span className="text-[10px] bg-surface-800 px-2 py-0.5 rounded text-slate-400 font-mono">
              Stable
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
