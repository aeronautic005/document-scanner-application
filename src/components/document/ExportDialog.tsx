import React, { useState } from 'react';
import {
  X,
  FileText,
  FileCheck2,
  FileCode,
  Hash,
  Code2,
  Download,
  Check,
  Sparkles,
} from 'lucide-react';
import { DocumentItem, FormattedDocumentData } from '../../types';
import {
  exportAsPDF,
  exportAsWordDoc,
  exportAsPlainText,
  exportAsMarkdown,
  exportAsJSON,
} from '../../utils/exportUtils';

export type ExportFormat = 'pdf' | 'doc' | 'txt' | 'md' | 'json';

interface ExportDialogProps {
  document: DocumentItem | FormattedDocumentData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [customTitle, setCustomTitle] = useState(
    document ? document.title.replace(/\.(pdf|docx|txt)$/i, '') : ''
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    if (document) {
      setCustomTitle(document.title.replace(/\.(pdf|docx|txt)$/i, ''));
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const formats: {
    id: ExportFormat;
    name: string;
    extension: string;
    badge: string;
    description: string;
    icon: typeof FileText;
    iconColor: string;
    badgeColor: string;
  }[] = [
    {
      id: 'pdf',
      name: 'Portable Document Format',
      extension: '.pdf',
      badge: 'Recommended',
      description: 'Standard vector PDF with page numbers, layout, and signature',
      icon: FileText,
      iconColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    },
    {
      id: 'doc',
      name: 'Microsoft Word Document',
      extension: '.doc',
      badge: 'Editable',
      description: 'Compatible with MS Word, Google Docs, and LibreOffice',
      icon: FileCheck2,
      iconColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    },
    {
      id: 'txt',
      name: 'Plain Text File',
      extension: '.txt',
      badge: 'Lightweight',
      description: 'Clean ASCII/UTF-8 transcription without styling',
      icon: FileCode,
      iconColor: 'text-slate-300 bg-surface-800 border-surface-700',
      badgeColor: 'bg-surface-800 text-slate-400 border-surface-700',
    },
    {
      id: 'md',
      name: 'Markdown Document',
      extension: '.md',
      badge: 'Notes / Wikis',
      description: 'Formatted markdown for Notion, Obsidian, and GitHub',
      icon: Hash,
      iconColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'json',
      name: 'Structured JSON Payload',
      extension: '.json',
      badge: 'Developer',
      description: 'Complete data structure with metadata, categories & dates',
      icon: Code2,
      iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
  ];

  const handleExecuteExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setExportedSuccess(null);

    try {
      switch (format) {
        case 'pdf':
          await exportAsPDF(document, { customTitle });
          break;
        case 'doc':
          exportAsWordDoc(document, customTitle);
          break;
        case 'txt':
          exportAsPlainText(document, customTitle);
          break;
        case 'md':
          exportAsMarkdown(document, customTitle);
          break;
        case 'json':
          exportAsJSON(document, customTitle);
          break;
      }

      setExportedSuccess(`Saved as ${format.toUpperCase()} successfully!`);
      setTimeout(() => {
        setExportedSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-surface-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-surface-900 border border-surface-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-surface-850 px-5 py-3.5 border-b border-surface-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Export Document</h3>
              <p className="text-[11px] text-slate-400">Save and download in your preferred format</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* File Name Configuration */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Download File Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter filename..."
                className="w-full bg-surface-950 border border-surface-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                .{selectedFormat}
              </span>
            </div>
          </div>

          {/* Quick Primary "Save as PDF" Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-surface-850 to-surface-850 border border-rose-500/30 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                  <span>Save as PDF</span>
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono">
                    .PDF
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Universal print-ready format with signature
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExecuteExport('pdf')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-semibold text-xs shadow-md shadow-rose-600/30 transition touch-press flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Other Format Selection Options */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Other File Formats
            </label>
            <div className="space-y-2">
              {formats
                .filter((f) => f.id !== 'pdf')
                .map((f) => {
                  const Icon = f.icon;
                  const isSelected = selectedFormat === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFormat(f.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between touch-press ${
                        isSelected
                          ? 'bg-surface-850 border-brand-500 shadow-md ring-1 ring-brand-500/30'
                          : 'bg-surface-850/60 border-surface-800 hover:border-surface-700 hover:bg-surface-850'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${f.iconColor}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-xs font-semibold text-slate-100 truncate">
                              {f.name}
                            </h4>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${f.badgeColor}`}
                            >
                              {f.extension}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {f.description}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecuteExport(f.id);
                        }}
                        className="p-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-300 hover:text-white transition touch-press"
                        title={`Download as ${f.extension}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Success Banner */}
          {exportedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 text-xs flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{exportedSuccess}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface-850 px-5 py-3 border-t border-surface-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Files are saved directly to your device downloads</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 text-slate-300 text-xs font-medium transition touch-press"
            >
              Done
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExecuteExport(selectedFormat)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition touch-press flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .{selectedFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
