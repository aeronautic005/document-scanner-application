import React from 'react';
import { Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xs flex flex-col items-center space-y-6">
        {/* Clean Minimal Document Scan Frame */}
        <div className="relative w-60 h-76 rounded-3xl overflow-hidden border border-neutral-200 shadow-card bg-[#f6f6f6]">
          <img
            src={imagePreviewUrl}
            alt="Scanning target"
            className="w-full h-full object-cover opacity-80"
          />

          {/* Subtle Deep Teal Scanning Beam */}
          <div className="absolute inset-x-0 h-0.5 bg-[#033236] shadow-[0_0_12px_rgba(3,50,54,0.6)] animate-[scanLaser_2.2s_ease-in-out_infinite]" />

          {/* Corner Frame Guides */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#033236] rounded-tl" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#033236] rounded-tr" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#033236] rounded-bl" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#033236] rounded-br" />
        </div>

        {/* Progress Indicator */}
        <div className="w-full text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-[#033236] font-semibold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{progress.message || 'Scanning document...'}</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-[#f6f6f6] overflow-hidden border border-neutral-200">
              <div
                className="h-full bg-[#033236] rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, progress.progress)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-neutral-500 px-0.5">
              <span>Processing</span>
              <span>{progress.progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
