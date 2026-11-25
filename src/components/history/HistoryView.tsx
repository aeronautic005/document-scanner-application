import React, { useState, useEffect } from 'react';
import { Search, Trash2, X, Printer } from 'lucide-react';
import { DocumentItem } from '../../types';
import { getSavedDocuments, deleteSavedDocument } from '../../services/storageService';
import { exportAsPDF } from '../../utils/exportUtils';
import { ExportDialog } from '../document/ExportDialog';

export const HistoryView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Docs' | 'Receipt' | 'Invoice' | 'Contract' | 'ID Card' | 'Note'>('All');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [exportingDoc, setExportingDoc] = useState<DocumentItem | null>(null);
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
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickSavePdf = async (doc: DocumentItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await exportAsPDF(doc);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
  };

  const handleOpenExportDialog = (doc: DocumentItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExportingDoc(doc);
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
      {/* Clean Pill Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents or text..."
          className="w-full bg-[#f6f6f6] border border-neutral-200/70 rounded-full pl-10 pr-9 py-2.5 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#033236]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {(['All', 'Docs', 'Invoice', 'Receipt', 'Contract', 'ID Card', 'Note'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition touch-press ${
              selectedFilter === filter
                ? 'bg-[#033236] text-white'
                : 'bg-[#f6f6f6] text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            {filter === 'Docs' ? 'Formatted' : filter}
            {filter === 'All' ? ` (${documents.length})` : ''}
          </button>
        ))}
      </div>

      {/* Document Archive List */}
      {filteredDocuments.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#f6f6f6] text-center space-y-1.5">
          <p className="text-xs font-semibold text-[#033236]">No documents found</p>
          <p className="text-[11px] text-neutral-500">
            {searchQuery
              ? 'Try clearing your search query or filter.'
              : 'Scan and save your first document from Home.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-2xl p-4 shadow-card transition touch-press cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-3 min-w-0">
                  {/* Minimal Monochrome Format Tile */}
                  <div
                    className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border ${
                      doc.isFormattedDocument
                        ? 'bg-[#033236] text-white border-[#033236]'
                        : 'bg-[#f6f6f6] text-[#033236] border-neutral-200/80'
                    }`}
                  >
                    <span className="text-[10px] font-bold leading-none">
                      {doc.isFormattedDocument ? 'DOC' : 'PDF'}
                    </span>
                    <span className="text-[9px] opacity-70 mt-1">
                      {doc.pages}p
                    </span>
                  </div>

                  {/* Document Details */}
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-1.5 text-[10px] text-neutral-500">
                      <span className="px-2 py-0.5 rounded-full bg-[#f6f6f6] text-[#033236] font-medium">
                        {doc.category}
                      </span>
                      {doc.isFormattedDocument && (
                        <span className="px-2 py-0.5 rounded-full bg-[#f0f5f5] text-[#033236] font-medium">
                          Formatted
                        </span>
                      )}
                      {doc.signatureDataUrl && (
                        <span className="px-2 py-0.5 rounded-full bg-[#f0f5f5] text-[#033236] font-medium">
                          Signed
                        </span>
                      )}
                    </div>

                    <h3 className="text-[14px] font-bold text-[#033236] truncate mt-1">
                      {doc.title}
                    </h3>

                    {doc.extractedText && (
                      <p className="text-xs font-medium text-neutral-600 line-clamp-1 mt-0.5">
                        {doc.extractedText.slice(0, 80)}
                      </p>
                    )}

                    <div className="flex items-center space-x-2 text-xs font-medium text-neutral-500 mt-1.5">
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(doc.id, e)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition flex-shrink-0"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clean Action Row */}
              <div className="flex items-center justify-end space-x-2 pt-3 mt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={(e) => handleOpenExportDialog(doc, e)}
                  className="px-3 py-1.5 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] font-medium text-[11px] transition touch-press"
                >
                  Export
                </button>
                <button
                  type="button"
                  onClick={(e) => handleQuickSavePdf(doc, e)}
                  className="px-3.5 py-1.5 rounded-full bg-[#033236] hover:bg-[#05454a] text-white font-semibold text-[11px] transition touch-press"
                >
                  Save as PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-200/80 flex items-center justify-between bg-white">
              <div className="min-w-0 pr-3">
                <h3 className="text-sm font-bold text-[#033236] truncate">
                  {selectedDoc.title}
                </h3>
                <div className="flex items-center space-x-2 text-[11px] text-neutral-500 mt-0.5">
                  <span>{selectedDoc.category}</span>
                  <span>•</span>
                  <span>{selectedDoc.date}</span>
                  <span>•</span>
                  <span>{selectedDoc.size}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-8 h-8 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] flex items-center justify-center transition"
                  title="Print Document"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="w-8 h-8 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-neutral-600 flex items-center justify-center transition"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#f6f6f6] flex justify-center">
              {selectedDoc.isFormattedDocument ? (
                <div
                  className={`w-full max-w-xl min-h-[460px] rounded-2xl shadow-card p-6 sm:p-8 flex flex-col justify-between transition-all border ${
                    selectedDoc.formatting?.paperTheme === 'warm'
                      ? 'bg-[#faf8f5] text-stone-900 border-stone-200'
                      : selectedDoc.formatting?.paperTheme === 'dark'
                      ? 'bg-[#033236] text-white border-[#033236]'
                      : 'bg-white text-neutral-900 border-neutral-200'
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
                  <div className="pb-3 mb-4 border-b border-current/15">
                    <h2 className="text-xl font-bold">{selectedDoc.title}</h2>
                    <div className="flex items-center space-x-2 text-xs opacity-70 mt-1">
                      <span>{selectedDoc.formatting?.authorOrOrg || 'Document Scanner'}</span>
                      <span>•</span>
                      <span>{selectedDoc.date}</span>
                    </div>
                  </div>

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

                  {selectedDoc.signatureDataUrl && (
                    <div className="pt-6 mt-8 border-t border-dashed border-current/20 flex items-end justify-between">
                      <div className="text-[11px] opacity-70 space-y-0.5">
                        <span className="font-semibold block text-xs">Digitally Signed</span>
                        <span>Verified document</span>
                      </div>
                      <div className="w-52 flex flex-col items-center">
                        <div className="h-16 w-full flex items-center justify-center relative">
                          <img
                            src={selectedDoc.signatureDataUrl}
                            alt="Digital Signature"
                            className="max-h-14 max-w-full object-contain"
                          />
                        </div>
                        <div className="w-full border-t border-current/60 pt-1 flex justify-between text-[10px] opacity-80">
                          <span>Authorized Signer</span>
                          <span>{selectedDoc.signedDate || selectedDoc.date}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 mt-6 border-t border-current/15 flex items-center justify-between text-[10px] opacity-60">
                    <span>Document Scanner</span>
                    <span>Page 1 of 1</span>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-xl space-y-3">
                  {selectedDoc.previewUrl && (
                    <div className="rounded-2xl overflow-hidden bg-white border border-neutral-200 p-2 flex justify-center">
                      <img
                        src={selectedDoc.previewUrl}
                        alt="Document preview"
                        className="max-h-48 object-contain rounded-xl"
                      />
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2.5 shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#033236]">
                        Extracted Text
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(selectedDoc.extractedText)}
                        className="text-xs font-semibold text-[#033236] hover:underline"
                      >
                        {copied ? 'Copied' : 'Copy All'}
                      </button>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#f6f6f6] text-xs text-neutral-800 leading-relaxed whitespace-pre-wrap select-text max-h-60 overflow-y-auto">
                      {selectedDoc.extractedText || 'No text content available.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-neutral-200/80 flex items-center justify-between bg-white">
              <button
                type="button"
                onClick={(e) => handleDelete(selectedDoc.id, e)}
                className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
              >
                Delete
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setExportingDoc(selectedDoc)}
                  className="px-3.5 py-2 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] text-xs font-semibold transition touch-press"
                >
                  Other Formats
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSavePdf(selectedDoc)}
                  className="px-4 py-2 rounded-full bg-[#033236] hover:bg-[#05454a] text-white text-xs font-semibold transition touch-press"
                >
                  Save as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Format Export Dialog */}
      <ExportDialog
        document={exportingDoc}
        isOpen={Boolean(exportingDoc)}
        onClose={() => setExportingDoc(null)}
      />
    </div>
  );
};
