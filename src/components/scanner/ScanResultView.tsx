import React, { useState } from 'react';
import { FormattedDocumentData, ScanResult } from '../../types';
import { DocumentEditorModal } from '../document/DocumentEditorModal';
import { saveFormattedDocument } from '../../services/storageService';
import { exportAsPDF } from '../../utils/exportUtils';

interface ScanResultViewProps {
  result: ScanResult;
  onConfirmSave: (updatedResult: ScanResult) => void;
  onDiscard: () => void;
  onFormattedDocSaved?: (doc: FormattedDocumentData) => void;
}

export const ScanResultView: React.FC<ScanResultViewProps> = ({
  result,
  onConfirmSave,
  onDiscard,
  onFormattedDocSaved,
}) => {
  const [title, setTitle] = useState(result.title);
  const [category, setCategory] = useState(result.category);
  const [text, setText] = useState(result.extractedText);
  const [copied, setCopied] = useState(false);
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

  const categories: Array<ScanResult['category']> = [
    'Receipt',
    'Invoice',
    'Contract',
    'ID Card',
    'Note',
    'Other',
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'scanned-document'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onConfirmSave({
      ...result,
      title: title.trim() || 'Scanned Document',
      category,
      extractedText: text,
      wordCount: text.trim().split(/\s+/).filter(Boolean).length,
      charCount: text.length,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-6">
      {/* Clean Header Card */}
      <div className="p-4 rounded-2xl bg-[#f6f6f6] border border-neutral-200/70 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-[#033236] text-base">
              Scan Complete
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#033236] border border-neutral-200">
              {result.confidence}% accuracy
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Review or edit the converted text below
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowOriginalImage(!showOriginalImage)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition touch-press ${
            showOriginalImage
              ? 'bg-[#033236] text-white'
              : 'bg-white text-[#033236] border border-neutral-200 hover:bg-neutral-100'
          }`}
        >
          {showOriginalImage ? 'Hide Image' : 'Original'}
        </button>
      </div>

      {/* Optional Original Image Preview */}
      {showOriginalImage && (
        <div className="rounded-2xl overflow-hidden bg-[#f6f6f6] border border-neutral-200 p-3 flex flex-col items-center justify-center">
          <img
            src={result.previewUrl}
            alt="Original scanned document"
            className="max-h-60 object-contain rounded-xl shadow-soft"
          />
          <span className="text-[11px] text-neutral-500 mt-2">
            Original Source Image
          </span>
        </div>
      )}

      {/* Document Title & Category */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-3.5 shadow-card">
        <div>
          <label className="text-xs font-semibold text-neutral-500 block mb-1.5">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title..."
            className="w-full bg-[#f6f6f6] border border-neutral-200/80 rounded-xl px-3.5 py-2.5 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236] transition"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-500 block mb-1.5">
            Category
          </label>
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition touch-press ${
                  category === cat
                    ? 'bg-[#033236] text-white'
                    : 'bg-[#f6f6f6] text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#f6f6f6] p-3 rounded-2xl">
          <span className="text-[10px] text-neutral-500 block">Words</span>
          <span className="text-sm font-bold text-[#033236]">
            {text.trim().split(/\s+/).filter(Boolean).length}
          </span>
        </div>
        <div className="bg-[#f6f6f6] p-3 rounded-2xl">
          <span className="text-[10px] text-neutral-500 block">Time</span>
          <span className="text-sm font-bold text-[#033236]">
            {(result.processingTimeMs / 1000).toFixed(1)}s
          </span>
        </div>
        <div className="bg-[#f6f6f6] p-3 rounded-2xl">
          <span className="text-[10px] text-neutral-500 block">Accuracy</span>
          <span className="text-sm font-bold text-[#033236]">
            {result.confidence}%
          </span>
        </div>
      </div>

      {/* Detected Structured Entities */}
      {result.detectedFields && result.detectedFields.length > 0 && (
        <div className="p-3.5 bg-[#f6f6f6] rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-neutral-500 block">
            Detected Fields
          </span>
          <div className="flex flex-wrap gap-2">
            {result.detectedFields.map((field, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs"
              >
                <span className="text-neutral-500">{field.label}:</span>
                <span className="font-semibold text-[#033236]">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Text Editor */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 space-y-3 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-[#033236]">
            Converted Text
          </h3>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() =>
                exportAsPDF({
                  id: result.id,
                  title: title.trim() || result.title,
                  category,
                  date: result.date,
                  extractedText: text,
                  pages: 1,
                  size: result.size,
                  thumbnailColor: '',
                  status: 'Ready',
                })
              }
              className="px-2.5 py-1 rounded-full bg-[#033236] text-white text-[11px] font-semibold transition touch-press"
            >
              Save as PDF
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] text-[11px] font-medium transition touch-press"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-2.5 py-1 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] text-[11px] font-medium transition touch-press"
            >
              TXT
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
          className="w-full bg-[#f6f6f6] border border-neutral-200/70 rounded-xl p-3.5 text-xs text-[#033236] leading-relaxed focus:outline-none focus:border-[#033236] resize-y"
          placeholder="Extracted text will appear here..."
        />
        <div className="flex justify-between items-center text-[11px] text-neutral-400">
          <span>Tap to edit text</span>
          <span>{text.length} characters</span>
        </div>
      </div>

      {/* Confirmation & Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={() => setIsEditorModalOpen(true)}
          className="w-full py-3.5 px-5 rounded-full bg-[#033236] hover:bg-[#05454a] text-white font-semibold text-sm shadow-soft active:scale-[0.99] transition-all touch-press"
        >
          Format & Save as Document
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 px-5 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 border border-neutral-200/80 text-[#033236] font-semibold text-xs transition touch-press"
        >
          Save Raw Scan to History
        </button>

        <button
          type="button"
          onClick={onDiscard}
          className="w-full py-2.5 px-4 rounded-full text-neutral-500 hover:text-[#033236] font-medium text-xs transition touch-press"
        >
          Discard & Scan Another
        </button>
      </div>

      <DocumentEditorModal
        initialScan={{
          ...result,
          title: title.trim() || result.title,
          category,
          extractedText: text,
        }}
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        onSaveDocument={(doc) => {
          saveFormattedDocument(doc);
          if (onFormattedDocSaved) {
            onFormattedDocSaved(doc);
          }
        }}
      />
    </div>
  );
};
