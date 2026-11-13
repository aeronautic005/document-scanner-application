import React, { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  X,
  FileCheck2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { getSavedDocuments, deleteSavedDocument } from '../../services/storageService';

export const HistoryView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Docs' | 'Receipt' | 'Invoice' | 'Contract' | 'ID Card' | 'Note'>('All');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDocuments(getSavedDocuments());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document from history?')) {
      const updated = deleteSavedDocument(id);
      setDocuments(updated);
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
    }
  };

  const handleCopyText = async (text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = (doc: DocumentItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const content = doc.extractedText || `Document: ${doc.title}\nCategory: ${doc.category}\nDate: ${doc.date}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/\.(pdf|docx)$/i, '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDoc = (doc: DocumentItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const fmt = doc.formatting;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${doc.title}</title>
        <style>
          body {
            font-family: ${fmt?.fontFamily === 'serif' ? 'Georgia, serif' : fmt?.fontFamily === 'mono' ? 'Courier, monospace' : 'Arial, sans-serif'};
            font-size: ${fmt?.fontSize || 14}pt;
            line-height: ${fmt?.lineSpacing === 'loose' ? '2.0' : fmt?.lineSpacing === 'relaxed' ? '1.6' : '1.3'};
            text-align: ${fmt?.alignment || 'left'};
            color: #111827;
            padding: 40px;
            max-width: 800px;
            margin: auto;
          }
          .doc-header { border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 24px; }
          .doc-title { font-size: 20pt; font-weight: bold; margin: 0; }
          .doc-meta { font-size: 10pt; color: #6b7280; margin-top: 4px; }
          .doc-content { white-space: pre-wrap; font-weight: ${fmt?.isBold ? 'bold' : 'normal'}; font-style: ${fmt?.isItalic ? 'italic' : 'normal'}; text-decoration: ${fmt?.isUnderline ? 'underline' : 'none'}; }
          .doc-footer { border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 12px; font-size: 9pt; color: #9ca3af; text-align: center; }
        </style>
      </head>
      <body>
        <div class="doc-header">
          <h1 class="doc-title">${doc.title}</h1>
          <div class="doc-meta">${fmt?.authorOrOrg || 'Document Scanner'} • ${doc.date} • ${doc.category}</div>
        </div>
        <div class="doc-content">${doc.extractedText || ''}</div>
        <div class="doc-footer">Generated with Document Scanner • Page 1 of 1</div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.extractedText && doc.extractedText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'All' ||
      (selectedFilter === 'Docs' ? doc.isFormattedDocument : doc.category === selectedFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 pb-6 animate-in fade-in">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, OCR text, or category..."
            className="w-full bg-surface-850 border border-surface-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Docs', 'Invoice', 'Receipt', 'Contract', 'ID Card', 'Note'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition touch-press ${
                selectedFilter === filter
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-850 text-slate-400 border border-surface-800 hover:text-slate-200'
              }`}
            >
              {filter === 'Docs' ? 'Formatted (.DOCX)' : filter} {filter === 'All' ? `(${documents.length})` : ''}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
          {filteredDocuments.length} found
        </span>
      </div>

      {/* Document Archive List */}
      {filteredDocuments.length === 0 ? (
        <div className="p-8 rounded-2xl bg-surface-850 border border-surface-800 text-center space-y-2">
          <FileText className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs font-semibold text-slate-300">No documents found</p>
          <p className="text-[11px] text-slate-500">
            {searchQuery ? 'Try clearing your search query or filter.' : 'Scan and save your first document from the Dashboard!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-surface-850/80 border border-surface-800 hover:border-surface-700/80 rounded-2xl p-3.5 transition touch-press cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 min-w-0">
                  {/* Visual Thumbnail */}
                  <div
                    className={`w-12 h-15 rounded-xl bg-gradient-to-br ${
                      doc.isFormattedDocument
                        ? 'from-blue-600 via-indigo-600 to-brand-600'
                        : doc.thumbnailColor
                    } flex flex-col items-center justify-center shadow-md flex-shrink-0 relative`}
                  >
                    <FileText className="w-6 h-6 text-white/95" />
                    <span className="text-[9px] font-bold text-white/90 mt-0.5">
                      {doc.pages} PGS
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                        {doc.status}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-surface-800 px-2 py-0.5 rounded">
                        {doc.category}
                      </span>
                      {doc.isFormattedDocument ? (
                        <span className="text-[10px] text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/30 font-semibold flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                          <span>DOCS Format</span>
                        </span>
                      ) : (
                        doc.confidence && (
                          <span className="text-[10px] text-brand-300 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20 font-mono">
                            {doc.confidence}% OCR
                          </span>
                        )
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 truncate mt-1 group-hover:text-brand-300 transition">
                      {doc.title}
                    </h3>

                    {/* Extracted text snippet */}
                    {doc.extractedText && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-mono">
                        {doc.extractedText.slice(0, 80)}...
                      </p>
                    )}

                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1.5">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                        {doc.date}
                      </span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(doc.id, e)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Action Ribbon */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-800/80 text-xs">
                <span className="text-[10px] text-slate-500 font-mono">ID: {doc.id}</span>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyText(doc.extractedText);
                    }}
                    className="flex items-center space-x-1 text-slate-300 hover:text-white transition"
                    title="Copy text"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px]">Copy Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => doc.isFormattedDocument ? handleDownloadDoc(doc, e) : handleDownloadTxt(doc, e)}
                    className="flex items-center space-x-1 text-slate-300 hover:text-white transition"
                    title={doc.isFormattedDocument ? 'Download as .DOC' : 'Download as .TXT'}
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px]">{doc.isFormattedDocument ? 'Word .DOC' : 'Export'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document View Modal (Dedicated Document Viewer) */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-surface-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
          <div className="bg-surface-900 border border-surface-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-surface-800 flex items-center justify-between bg-surface-850">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-100 truncate">
                      {selectedDoc.title}
                    </h3>
                    {selectedDoc.isFormattedDocument && (
                      <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono">
                        DOCX
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{selectedDoc.category}</span>
                    <span>•</span>
                    <span>{selectedDoc.date}</span>
                    <span>•</span>
                    <span>{selectedDoc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-surface-800 hover:bg-surface-750 text-slate-300 transition"
                  title="Print Document"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded-lg bg-surface-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-surface-950 flex justify-center">
              {selectedDoc.isFormattedDocument ? (
                /* Authentic Document Paper Presentation */
                <div
                  className={`w-full max-w-xl min-h-[480px] rounded-xl shadow-xl p-6 sm:p-8 flex flex-col justify-between transition-all border ${
                    selectedDoc.formatting?.paperTheme === 'warm'
                      ? 'bg-[#faf8f5] text-stone-900 border-stone-200'
                      : selectedDoc.formatting?.paperTheme === 'dark'
                      ? 'bg-slate-900 text-slate-100 border-slate-800'
                      : 'bg-white text-slate-900 border-slate-200'
                  }`}
                  style={{
                    fontFamily:
                      selectedDoc.formatting?.fontFamily === 'serif'
                        ? 'Georgia, serif'
                        : selectedDoc.formatting?.fontFamily === 'mono'
                        ? 'Courier New, monospace'
                        : '"Plus Jakarta Sans", sans-serif',
                    fontSize: `${selectedDoc.formatting?.fontSize || 14}px`,
                  }}
                >
                  {/* Document Header */}
                  <div className="pb-3 mb-4 border-b border-current opacity-80">
                    <h2 className="text-xl font-bold">{selectedDoc.title}</h2>
                    <div className="flex items-center space-x-2 text-xs opacity-70 mt-1">
                      <span>{selectedDoc.formatting?.authorOrOrg || 'Document Scanner'}</span>
                      <span>•</span>
                      <span>{selectedDoc.date}</span>
                    </div>
                  </div>

                  {/* Document Formatted Content */}
                  <div
                    className={`flex-1 whitespace-pre-wrap select-text leading-relaxed ${
                      selectedDoc.formatting?.alignment === 'center'
                        ? 'text-center'
                        : selectedDoc.formatting?.alignment === 'right'
                        ? 'text-right'
                        : selectedDoc.formatting?.alignment === 'justify'
                        ? 'text-justify'
                        : 'text-left'
                    } ${selectedDoc.formatting?.isBold ? 'font-bold' : ''} ${
                      selectedDoc.formatting?.isItalic ? 'italic' : ''
                    } ${selectedDoc.formatting?.isUnderline ? 'underline' : ''}`}
                  >
                    {selectedDoc.extractedText}
                  </div>

                  {/* Document Footer */}
                  <div className="pt-3 mt-6 border-t border-current opacity-60 flex items-center justify-between text-[10px]">
                    <span>Official Document • Saved from Document Scanner</span>
                    <span className="font-mono">Page 1 of 1</span>
                  </div>
                </div>
              ) : (
                /* Standard OCR Scan Inspector */
                <div className="w-full max-w-xl space-y-3">
                  {selectedDoc.previewUrl && (
                    <div className="rounded-xl overflow-hidden bg-surface-900 border border-surface-800 p-2 flex justify-center">
                      <img
                        src={selectedDoc.previewUrl}
                        alt="Document preview"
                        className="max-h-48 object-contain rounded-lg"
                      />
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-surface-900 border border-surface-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Extracted Text Content
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(selectedDoc.extractedText)}
                        className="text-xs text-brand-400 hover:underline flex items-center space-x-1"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy All</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-950 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text max-h-60 overflow-y-auto">
                      {selectedDoc.extractedText || 'No text content available.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-surface-800 flex items-center justify-between bg-surface-850">
              <button
                type="button"
                onClick={(e) => handleDelete(selectedDoc.id, e)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(selectedDoc.extractedText)}
                  className="px-3 py-1.5 rounded-xl bg-surface-800 hover:bg-surface-750 text-slate-200 text-xs font-medium flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                {selectedDoc.isFormattedDocument ? (
                  <button
                    type="button"
                    onClick={(e) => handleDownloadDoc(selectedDoc, e)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition touch-press"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Word .DOC</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleDownloadTxt(selectedDoc, e)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition touch-press"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export TXT</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
