import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
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
    description: string;
  }[] = [
    {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      description: 'Print-ready vector PDF with page numbers and signature',
    },
    {
      id: 'doc',
      name: 'Microsoft Word',
      extension: '.doc',
      description: 'Editable document for Word, Google Docs, and LibreOffice',
    },
    {
      id: 'txt',
      name: 'Plain Text',
      extension: '.txt',
      description: 'Clean raw text transcription without styling',
    },
    {
      id: 'md',
      name: 'Markdown',
      extension: '.md',
      description: 'Structured markdown for Notion, Obsidian, and GitHub',
    },
    {
      id: 'json',
      name: 'JSON Data',
      extension: '.json',
      description: 'Structured payload with metadata, category, and dates',
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

      setExportedSuccess(`Saved as .${format} successfully.`);
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
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200/80 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-[#033236]">Export Document</h3>
            <p className="text-[11px] text-neutral-500">Choose a file format to download</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f6f6] flex items-center justify-center text-neutral-600 hover:text-[#033236] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* File Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500 block">
              File Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter filename..."
                className="w-full bg-[#f6f6f6] border border-neutral-200/80 rounded-xl pl-3.5 pr-12 py-2.5 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236] font-medium"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                .{selectedFormat}
              </span>
            </div>
          </div>

          {/* Primary Save as PDF Card */}
          <div className="p-4 rounded-2xl bg-[#033236] text-white flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold">Save as PDF</h4>
              <p className="text-[11px] text-white/75 mt-0.5">
                Universal print-ready format with signature
              </p>
            </div>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExecuteExport('pdf')}
              className="px-4 py-2 rounded-full bg-white text-[#033236] hover:bg-neutral-100 font-semibold text-xs flex-shrink-0 transition touch-press"
            >
              Download PDF
            </button>
          </div>

          {/* Other Formats List */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-500 block">
              Other Formats
            </label>
            <div className="bg-white border border-neutral-200/80 rounded-2xl divide-y divide-neutral-100 overflow-hidden">
              {formats
                .filter((f) => f.id !== 'pdf')
                .map((f) => {
                  const isSelected = selectedFormat === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFormat(f.id)}
                      className={`p-3.5 cursor-pointer flex items-center justify-between transition ${
                        isSelected ? 'bg-[#f0f5f5]' : 'hover:bg-[#f6f6f6]/70'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-semibold text-[#033236]">
                            {f.name}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {f.extension}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {f.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecuteExport(f.id);
                        }}
                        className="w-8 h-8 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] flex items-center justify-center flex-shrink-0 transition touch-press"
                        title={`Download as ${f.extension}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {exportedSuccess && (
            <div className="p-3 rounded-xl bg-[#f0f5f5] border border-[#033236]/15 text-[#033236] text-xs font-medium">
              {exportedSuccess}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-5 py-3.5 border-t border-neutral-200/80 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] text-xs font-semibold transition touch-press"
          >
            Done
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExecuteExport(selectedFormat)}
            className="px-5 py-2 rounded-full bg-[#033236] hover:bg-[#05454a] text-white font-semibold text-xs transition touch-press"
          >
            Export .{selectedFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};
