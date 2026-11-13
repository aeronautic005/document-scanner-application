import React, { useState } from 'react';
import {
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  FileText,
  Printer,
  Download,
  Check,
  Sparkles,
  Save,
  Type,
  Maximize2,
  Calendar,
  Building,
} from 'lucide-react';
import {
  DocumentAlign,
  DocumentFont,
  DocumentFormattingOptions,
  DocumentPaperSize,
  DocumentSpacing,
  FormattedDocumentData,
  ScanResult,
} from '../../types';

interface DocumentEditorModalProps {
  initialScan: ScanResult;
  isOpen: boolean;
  onClose: () => void;
  onSaveDocument: (doc: FormattedDocumentData) => void;
}

export const DocumentEditorModal: React.FC<DocumentEditorModalProps> = ({
  initialScan,
  isOpen,
  onClose,
  onSaveDocument,
}) => {
  const [title, setTitle] = useState(initialScan.title || 'Untitled Document');
  const [content, setContent] = useState(initialScan.extractedText);
  const [category] = useState(initialScan.category);

  // Formatting state
  const [formatting, setFormatting] = useState<DocumentFormattingOptions>({
    fontFamily: 'sans',
    fontSize: 14,
    lineSpacing: 'normal',
    alignment: 'left',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    paperSize: 'a4',
    paperTheme: 'classic',
    headerTitle: initialScan.title || 'Official Document',
    authorOrOrg: 'Document Scanner Pro',
    includeHeader: true,
    includeFooter: true,
    includeDate: true,
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const fontClasses: Record<DocumentFont, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  const alignClasses: Record<DocumentAlign, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const lineSpacingClasses: Record<DocumentSpacing, string> = {
    normal: 'leading-relaxed',
    relaxed: 'leading-loose',
    loose: 'leading-[2.2]',
  };

  const paperThemeStyles = {
    classic: {
      bg: 'bg-white',
      text: 'text-slate-900',
      border: 'border-slate-200',
      subtext: 'text-slate-500',
      headerBg: 'border-b border-slate-200',
    },
    warm: {
      bg: 'bg-[#faf8f5]',
      text: 'text-stone-900',
      border: 'border-stone-200',
      subtext: 'text-stone-500',
      headerBg: 'border-b border-stone-200',
    },
    dark: {
      bg: 'bg-slate-900',
      text: 'text-slate-100',
      border: 'border-slate-800',
      subtext: 'text-slate-400',
      headerBg: 'border-b border-surface-800',
    },
  };

  const currentTheme = paperThemeStyles[formatting.paperTheme];

  const handleSave = () => {
    const formattedDoc: FormattedDocumentData = {
      id: `doc-formatted-${Date.now()}`,
      title: title.trim() || 'Untitled Document',
      category,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      content,
      formatting,
      previewUrl: initialScan.previewUrl,
      sourceScanId: initialScan.id,
      wordCount: content.trim().split(/\s+/).filter(Boolean).length,
    };

    onSaveDocument(formattedDoc);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    // Generate clean HTML document blob that Microsoft Word and Google Docs can open directly
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            font-family: ${formatting.fontFamily === 'serif' ? 'Georgia, serif' : formatting.fontFamily === 'mono' ? 'Courier, monospace' : 'Arial, sans-serif'};
            font-size: ${formatting.fontSize}pt;
            line-height: ${formatting.lineSpacing === 'loose' ? '2.0' : formatting.lineSpacing === 'relaxed' ? '1.6' : '1.3'};
            text-align: ${formatting.alignment};
            color: #111827;
            padding: 40px;
            max-width: 800px;
            margin: auto;
          }
          .doc-header { border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 24px; }
          .doc-title { font-size: 20pt; font-weight: bold; margin: 0; }
          .doc-meta { font-size: 10pt; color: #6b7280; margin-top: 4px; }
          .doc-content { white-space: pre-wrap; font-weight: ${formatting.isBold ? 'bold' : 'normal'}; font-style: ${formatting.isItalic ? 'italic' : 'normal'}; text-decoration: ${formatting.isUnderline ? 'underline' : 'none'}; }
          .doc-footer { border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 12px; font-size: 9pt; color: #9ca3af; text-align: center; }
        </style>
      </head>
      <body>
        <div class="doc-header">
          <h1 class="doc-title">${title}</h1>
          <div class="doc-meta">${formatting.authorOrOrg} • ${new Date().toLocaleDateString()} • ${category}</div>
        </div>
        <div class="doc-content">${content}</div>
        <div class="doc-footer">Generated with Document Scanner • Page 1 of 1</div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-surface-900 border border-surface-800 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Word / Google Docs Style Application Top Bar */}
        <div className="bg-surface-850 border-b border-surface-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent border border-transparent hover:border-surface-700 focus:border-brand-500 focus:bg-surface-900 rounded px-1.5 py-0.5 text-xs font-bold text-slate-100 max-w-[220px] sm:max-w-xs truncate focus:outline-none"
                  placeholder="Untitled Document"
                />
                <span className="text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 px-1.5 py-0.2 rounded font-mono hidden sm:inline">
                  .DOCX Preview
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 px-1.5">
                <span>Word / Docs Formatter</span>
                <span>•</span>
                <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-300 hover:text-white transition touch-press"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownloadDoc}
              className="p-1.5 rounded-lg bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-300 hover:text-white transition touch-press"
              title="Download as Word .DOC"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-surface-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition touch-press"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formatting Ribbon Toolbar (Like Google Docs & Microsoft Word) */}
        <div className="bg-surface-850/80 border-b border-surface-800 px-3 py-2 flex items-center justify-between overflow-x-auto scrollbar-none text-xs gap-3">
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            {/* Font Family Selector */}
            <div className="flex bg-surface-900 border border-surface-700/80 rounded-xl p-0.5">
              {(['sans', 'serif', 'mono'] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setFormatting({ ...formatting, fontFamily: font })}
                  className={`px-2 py-1 rounded-lg text-[11px] capitalize transition ${
                    formatting.fontFamily === font
                      ? 'bg-brand-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {font === 'sans' ? 'Modern Sans' : font === 'serif' ? 'Book Serif' : 'Monospace'}
                </button>
              ))}
            </div>

            {/* Font Size Increment / Decrement */}
            <div className="flex items-center bg-surface-900 border border-surface-700/80 rounded-xl px-1.5 py-0.5 space-x-1">
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, fontSize: Math.max(10, formatting.fontSize - 1) })}
                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                title="Decrease font size"
              >
                -
              </button>
              <span className="text-[11px] font-mono text-slate-200 px-1 font-semibold">
                {formatting.fontSize}pt
              </span>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, fontSize: Math.min(24, formatting.fontSize + 1) })}
                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                title="Increase font size"
              >
                +
              </button>
            </div>

            <div className="h-4 w-[1px] bg-surface-700" />

            {/* Bold, Italic, Underline */}
            <div className="flex bg-surface-900 border border-surface-700/80 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, isBold: !formatting.isBold })}
                className={`p-1.5 rounded-lg transition ${
                  formatting.isBold
                    ? 'bg-brand-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, isItalic: !formatting.isItalic })}
                className={`p-1.5 rounded-lg transition ${
                  formatting.isItalic
                    ? 'bg-brand-600 text-white italic'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, isUnderline: !formatting.isUnderline })}
                className={`p-1.5 rounded-lg transition ${
                  formatting.isUnderline
                    ? 'bg-brand-600 text-white underline'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-[1px] bg-surface-700" />

            {/* Text Alignment */}
            <div className="flex bg-surface-900 border border-surface-700/80 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, alignment: 'left' })}
                className={`p-1.5 rounded-lg transition ${
                  formatting.alignment === 'left' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, alignment: 'center' })}
                className={`p-1.5 rounded-lg transition ${
                  formatting.alignment === 'center' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, alignment: 'right' })}
                className={`p-1.5 rounded-lg transition ${
                  formatting.alignment === 'right' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, alignment: 'justify' })}
                className={`p-1.5 rounded-lg transition ${
                  formatting.alignment === 'justify' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Justify"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-[1px] bg-surface-700" />

            {/* Paper Theme */}
            <div className="flex bg-surface-900 border border-surface-700/80 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, paperTheme: 'classic' })}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition ${
                  formatting.paperTheme === 'classic'
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Clean White
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, paperTheme: 'warm' })}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition ${
                  formatting.paperTheme === 'warm'
                    ? 'bg-[#f0ece1] text-stone-900 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Warm Paper
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, paperTheme: 'dark' })}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition ${
                  formatting.paperTheme === 'dark'
                    ? 'bg-slate-800 text-brand-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark Canvas
              </button>
            </div>
          </div>

          {/* Toggle between Edit text & Full Document Page preview */}
          <div className="flex bg-surface-900 border border-surface-700/80 rounded-xl p-0.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                activeTab === 'preview' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Document View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                activeTab === 'editor' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Text Editor
            </button>
          </div>
        </div>

        {/* Document Canvas Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface-950 flex justify-center items-start">
          {activeTab === 'preview' ? (
            /* Realistic A4 / Letter Paper Sheet Simulation */
            <div
              className={`w-full max-w-2xl min-h-[600px] sm:min-h-[720px] rounded-lg shadow-2xl p-6 sm:p-12 transition-all duration-200 border relative flex flex-col justify-between ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
              style={{
                fontFamily: formatting.fontFamily === 'serif' ? 'Georgia, serif' : formatting.fontFamily === 'mono' ? 'Courier New, monospace' : '"Plus Jakarta Sans", sans-serif',
                fontSize: `${formatting.fontSize}px`,
              }}
            >
              {/* Document Header Section */}
              {formatting.includeHeader && (
                <div className={`pb-4 mb-6 ${currentTheme.headerBg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        {title}
                      </h2>
                      <div className={`flex items-center space-x-2 text-xs mt-1 ${currentTheme.subtext}`}>
                        <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1 opacity-70" />
                          {formatting.authorOrOrg}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 opacity-70" />
                          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-current opacity-60">
                      {category}
                    </span>
                  </div>
                </div>
              )}

              {/* Document Formatted Text Content */}
              <div
                className={`flex-1 whitespace-pre-wrap select-text ${alignClasses[formatting.alignment]} ${lineSpacingClasses[formatting.lineSpacing]} ${formatting.isBold ? 'font-bold' : 'font-normal'} ${formatting.isItalic ? 'italic' : 'normal'} ${formatting.isUnderline ? 'underline' : ''}`}
              >
                {content}
              </div>

              {/* Document Footer Section */}
              {formatting.includeFooter && (
                <div className={`pt-4 mt-8 border-t ${currentTheme.headerBg} flex items-center justify-between text-[11px] ${currentTheme.subtext}`}>
                  <span>Official Document • Converted from Document Scanner</span>
                  <span className="font-mono">Page 1 of 1</span>
                </div>
              )}
            </div>
          ) : (
            /* Raw Text Editor Mode */
            <div className="w-full max-w-2xl bg-surface-900 border border-surface-800 rounded-2xl p-4 flex flex-col space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Edit Document Content</span>
                <span className="text-[11px] text-brand-400 font-mono">Live Sync</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500 leading-relaxed resize-y"
                placeholder="Document text..."
              />
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-surface-850 border-t border-surface-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="hidden sm:inline">Ready to save into your permanent History archive</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-300 text-xs font-medium transition touch-press"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 active:scale-95 transition-all touch-press flex items-center space-x-1.5"
            >
              {savedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved to History!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save as Document to History</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
