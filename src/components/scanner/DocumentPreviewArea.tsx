import React, { useState } from 'react';
import { Trash2, RefreshCw, RotateCw } from 'lucide-react';
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
      <div className="flex items-center justify-between bg-[#f6f6f6] p-3.5 rounded-2xl border border-neutral-200/70">
        <div className="min-w-0 pr-2">
          <h4 className="text-xs font-semibold text-[#033236] truncate">
            {document.name}
          </h4>
          <div className="flex items-center space-x-2 text-[11px] text-neutral-500 mt-0.5">
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

        {/* Clean Icon Toolbar */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleRotate}
            className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-[#033236] transition touch-press"
            title="Rotate preview 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onReplace}
            className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-[#033236] transition touch-press"
            title="Replace file"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-red-600 transition touch-press"
            title="Remove document"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative rounded-2xl overflow-hidden bg-[#f6f6f6] border border-neutral-200 flex items-center justify-center min-h-[280px] max-h-[400px] p-4">
        <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden">
          <img
            src={document.previewUrl}
            alt="Uploaded document preview"
            style={{ transform: `rotate(${rotation}deg)` }}
            className="max-h-[340px] w-auto max-w-full object-contain rounded-xl shadow-card transition-transform duration-300 select-none"
          />
        </div>

        {document.dimensions && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 text-[10px] font-medium text-neutral-600">
            {document.dimensions.width} × {document.dimensions.height}
          </div>
        )}
      </div>

      {/* Category Selection Pills */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-500 block">
          Document Type
        </label>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition touch-press ${
                selectedCategory === cat
                  ? 'bg-[#033236] text-white'
                  : 'bg-[#f6f6f6] text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prominent "Scan Now" Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleScanNowClick}
          className="w-full py-3.5 px-5 rounded-full bg-[#033236] hover:bg-[#05454a] text-white font-semibold text-sm shadow-soft active:scale-[0.99] transition-all duration-200 touch-press"
        >
          Scan Now
        </button>

        <p className="text-center text-[11px] text-neutral-400 mt-2">
          Extracts and converts document text using AI
        </p>
      </div>
    </div>
  );
};
