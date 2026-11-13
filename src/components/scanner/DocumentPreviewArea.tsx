import React, { useState } from 'react';
import {
  Sparkles,
  Trash2,
  RefreshCw,
  RotateCw,
  FileCheck2,
  ScanText,
  Eye,
} from 'lucide-react';
import { UploadedDocument } from '../../types';

interface DocumentPreviewAreaProps {
  document: UploadedDocument;
  onRemove: () => void;
  onReplace: () => void;
  onStartScan: (category: string) => void;
}

export const DocumentPreviewArea: React.FC<DocumentPreviewAreaProps> = ({
  document,
  onRemove,
  onReplace,
  onStartScan,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    document.selectedCategory || 'Invoice'
  );

  const categories = ['Receipt', 'Invoice', 'Contract', 'ID Card', 'Note', 'Other'];

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleScanNowClick = () => {
    onStartScan(selectedCategory);
  };

  return (
    <div className="space-y-4">
      {/* Document Overview Header */}
      <div className="flex items-center justify-between bg-surface-850 p-3 rounded-xl border border-surface-800">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center flex-shrink-0 text-brand-400">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-slate-100 truncate">
              {document.name}
            </h4>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
              <span>{document.sizeFormatted}</span>
              {document.dimensions && (
                <>
                  <span>•</span>
                  <span>
                    {document.dimensions.width} × {document.dimensions.height} px
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleRotate}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-800 transition touch-press"
            title="Rotate preview 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onReplace}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-800 transition touch-press"
            title="Replace with another file"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition touch-press"
            title="Remove document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative rounded-2xl overflow-hidden bg-surface-950 border border-surface-800 shadow-2xl flex items-center justify-center min-h-[300px] max-h-[420px] p-3 group">
        {/* Subtle grid pattern background to highlight document transparency/boundaries */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Uploaded Image Preview */}
        <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden">
          <img
            src={document.previewUrl}
            alt="Uploaded document preview"
            style={{ transform: `rotate(${rotation}deg)` }}
            className="max-h-[360px] w-auto max-w-full object-contain rounded-lg shadow-xl transition-transform duration-300 select-none"
          />
        </div>

        {/* Edge detection badge overlay */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-900/85 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-200">
          <ScanText className="w-3 h-3 text-brand-400" />
          <span>Ready for Detection</span>
        </div>

        {/* View dimensions badge */}
        {document.dimensions && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-surface-900/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
            {document.dimensions.width}×{document.dimensions.height}
          </div>
        )}
      </div>

      {/* Category Selection Pills */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Document Type Tag
        </label>
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition touch-press ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-850 text-slate-300 border border-surface-800 hover:bg-surface-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* "Scan Now" Button (Prominent Action trigger as required) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleScanNowClick}
          className="w-full relative group overflow-hidden py-3.5 px-5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 active:scale-[0.99] transition-all duration-200 touch-press flex items-center justify-center space-x-2"
        >
          <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <Sparkles className="w-4 h-4 text-brand-200" />
          <span className="tracking-wide">Scan Now</span>
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center space-x-1">
          <Eye className="w-3 h-3 text-slate-500" />
          <span>Tap to scan and convert document image to text</span>
        </p>
      </div>
    </div>
  );
};
