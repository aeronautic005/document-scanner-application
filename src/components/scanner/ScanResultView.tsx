import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  FileText,
  Clock,
  Layers,
  Tag,
  Download,
  Eye,
  FileEdit,
} from 'lucide-react';
import { FormattedDocumentData, ScanResult } from '../../types';
import { DocumentEditorModal } from '../document/DocumentEditorModal';
import { saveFormattedDocument } from '../../services/storageService';

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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
    <div className="space-y-4 animate-in fade-in duration-300 pb-8">
      {/* Success Completion Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-surface-850 to-surface-900 border border-emerald-500/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-100 text-sm sm:text-base">
                Scan Complete
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                {result.confidence}% Confidence
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Text converted & structured by AI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowOriginalImage(!showOriginalImage)}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition touch-press ${
            showOriginalImage
              ? 'bg-brand-600 text-white border-brand-500'
              : 'bg-surface-800 text-slate-300 border-surface-700 hover:text-white'
          }`}
          title="Toggle image preview"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Image</span>
        </button>
      </div>

      {/* Optional Original Image Side Panel */}
      {showOriginalImage && (
        <div className="rounded-2xl overflow-hidden bg-surface-950 border border-surface-800 p-3 flex flex-col items-center justify-center animate-in fade-in">
          <img
            src={result.previewUrl}
            alt="Original scanned document"
            className="max-h-64 object-contain rounded-lg shadow-md"
          />
          <span className="text-[10px] text-slate-400 mt-2 font-mono">
            Original Source Image
          </span>
        </div>
      )}

      {/* Document Title & Category Editor */}
      <div className="bg-surface-850 border border-surface-800 rounded-2xl p-4 space-y-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Document Title
          </label>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              className="flex-1 bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-1 mb-1.5 text-slate-400">
            <Tag className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Category
            </span>
          </div>
          <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition touch-press ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-surface-800 text-slate-300 border border-surface-700 hover:bg-surface-750'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OCR Performance Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-surface-850 border border-surface-800 p-2.5 rounded-xl flex items-center space-x-2.5">
          <Layers className="w-4 h-4 text-brand-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block">Words Extracted</span>
            <span className="font-bold text-slate-200">
              {text.trim().split(/\s+/).filter(Boolean).length}
            </span>
          </div>
        </div>
        <div className="bg-surface-850 border border-surface-800 p-2.5 rounded-xl flex items-center space-x-2.5">
          <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block">Processing Time</span>
            <span className="font-bold text-slate-200">
              {(result.processingTimeMs / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
        <div className="bg-surface-850 border border-surface-800 p-2.5 rounded-xl flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block">Accuracy</span>
            <span className="font-bold text-slate-200">{result.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Detected Structured Entities (if any) */}
      {result.detectedFields && result.detectedFields.length > 0 && (
        <div className="p-3 bg-surface-850/80 border border-surface-800 rounded-xl space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Detected Key Fields
          </span>
          <div className="flex flex-wrap gap-2">
            {result.detectedFields.map((field, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-surface-800 border border-surface-700 text-xs"
              >
                <span className="text-slate-400 text-[11px]">{field.label}:</span>
                <span className="font-semibold text-brand-300">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Text Area */}
      <div className="bg-surface-850 border border-surface-800 rounded-2xl p-4 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Converted Document Text
            </h3>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-300 text-xs flex items-center space-x-1 transition touch-press"
              title="Copy text to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="p-1 rounded-lg bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-300 transition touch-press"
              title="Download as .TXT file"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Editable Extracted Text Content */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full bg-surface-900 border border-surface-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-brand-500/60 resize-y"
          placeholder="Extracted text will appear here..."
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
          <span>Click inside to edit or format transcription</span>
          <span>{text.length} characters</span>
        </div>
      </div>

      {/* Confirmation & Action Buttons */}
      <div className="space-y-2.5 pt-2">
        {/* Format as Document (Google Docs / Word Style) Button */}
        <button
          type="button"
          onClick={() => setIsEditorModalOpen(true)}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-brand-600 hover:from-blue-500 hover:to-brand-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 active:scale-[0.99] transition-all touch-press flex items-center justify-center space-x-2 border border-blue-400/20"
        >
          <FileEdit className="w-4 h-4 text-blue-200" />
          <span>Save as Formatted Document (Docs / Word)</span>
        </button>

        {/* Quick Save to History Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 px-5 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-200 font-medium text-xs shadow-sm active:scale-[0.99] transition-all touch-press flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4 text-emerald-400" />
          <span>Save as Raw Scan to History</span>
        </button>

        {/* Discard / Re-scan Button */}
        <button
          type="button"
          onClick={onDiscard}
          className="w-full py-2.5 px-4 rounded-xl bg-surface-850 hover:bg-surface-800 border border-surface-750 text-slate-400 hover:text-slate-200 font-medium text-xs transition touch-press flex items-center justify-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Discard & Scan Another</span>
        </button>
      </div>

      {/* Word / Google Docs Style Document Formatter & Preview Modal */}
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
