import React from 'react';
import { ScanText, Sparkles, Loader2 } from 'lucide-react';
import { ScanProgress } from '../../types';

interface ScanningOverlayProps {
  progress: ScanProgress;
  imagePreviewUrl: string;
}

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({
  progress,
  imagePreviewUrl,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-surface-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm flex flex-col items-center space-y-5">
        {/* Document Scanner Hologram / Laser Frame */}
        <div className="relative w-64 h-80 rounded-2xl overflow-hidden border-2 border-brand-500/50 shadow-2xl bg-surface-900 ring-4 ring-brand-500/20">
          <img
            src={imagePreviewUrl}
            alt="Scanning target"
            className="w-full h-full object-cover opacity-60 filter contrast-125"
          />

          {/* Animated Cyan/Indigo Laser Scanner Beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scanLaser_2.2s_ease-in-out_infinite]" />

          {/* Hologram Corner Brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

          {/* Floating AI Engine Badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-surface-900/90 border border-brand-500/40 text-[10px] font-semibold text-brand-300 flex items-center space-x-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>AI OCR Engine Active</span>
          </div>
        </div>

        {/* Progress Text & Meter */}
        <div className="w-full text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-slate-100 font-semibold text-sm">
            <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
            <span>{progress.message || 'Scanning document...'}</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 rounded-full bg-surface-800 overflow-hidden p-0.5 border border-surface-700">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${Math.max(5, progress.progress)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>OCR Analysis</span>
              <span>{progress.progress}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Detecting typography, extracting raw text, and structuring document key-values.
          </p>
        </div>
      </div>
    </div>
  );
};
