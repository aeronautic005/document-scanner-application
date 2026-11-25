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
  Printer,
  Download,
} from 'lucide-react';
import {
  DocumentAlign,
  DocumentFormattingOptions,
  DocumentSpacing,
  FormattedDocumentData,
  ScanResult,
} from '../../types';
import { SignaturePad } from './SignaturePad';
import { exportAsPDF } from '../../utils/exportUtils';

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
    authorOrOrg: 'Scanny',
    includeHeader: true,
    includeFooter: true,
    includeDate: true,
  });

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signedDate, setSignedDate] = useState<string | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>(
    initialScan.extractedText.trim() ? 'preview' : 'editor'
  );
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

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
      text: 'text-neutral-900',
      border: 'border-neutral-200',
      subtext: 'text-neutral-500',
      headerBg: 'border-b border-neutral-200',
    },
    warm: {
      bg: 'bg-[#faf8f5]',
      text: 'text-stone-900',
      border: 'border-stone-200',
      subtext: 'text-stone-500',
      headerBg: 'border-b border-stone-200',
    },
    dark: {
      bg: 'bg-[#033236]',
      text: 'text-white',
      border: 'border-[#033236]',
      subtext: 'text-white/70',
      headerBg: 'border-b border-white/15',
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
      signatureDataUrl: signatureDataUrl || undefined,
      signedDate: signedDate || undefined,
    };

    onSaveDocument(formattedDoc);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    const signatureHtml = signatureDataUrl
      ? `
        <div style="margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 20px; display: flex; justify-content: flex-end;">
          <div style="text-align: center; width: 220px;">
            <img src="${signatureDataUrl}" style="max-height: 60px; max-width: 200px;" alt="Digital Signature" />
            <div style="border-top: 1px solid #111827; margin-top: 4px; padding-top: 4px; font-size: 9pt; color: #4b5563;">
              Authorized Signer • ${signedDate || new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      `
      : '';

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
        ${signatureHtml}
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Clean Top Application Bar */}
        <div className="bg-white border-b border-neutral-200/80 px-4 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border border-transparent hover:border-neutral-200 focus:border-[#033236] focus:bg-[#f6f6f6] rounded-lg px-2 py-1 text-sm font-bold text-[#033236] w-full max-w-[220px] sm:max-w-xs truncate focus:outline-none"
              placeholder="Untitled Document"
            />
            <div className="flex items-center space-x-2 text-[11px] text-neutral-500 px-2">
              <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
              {signatureDataUrl && (
                <>
                  <span>•</span>
                  <span className="text-[#033236] font-medium">Signed</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsSignatureModalOpen(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition touch-press ${
                signatureDataUrl
                  ? 'bg-[#f0f5f5] text-[#033236] border border-[#033236]/20'
                  : 'bg-[#033236] hover:bg-[#05454a] text-white'
              }`}
            >
              {signatureDataUrl ? 'Edit Signature' : 'Add Signature'}
            </button>

            <button
              type="button"
              onClick={async () => {
                await exportAsPDF(
                  {
                    id: `doc-${Date.now()}`,
                    title,
                    category,
                    date: new Date().toLocaleDateString(),
                    content,
                    formatting,
                    signatureDataUrl: signatureDataUrl || undefined,
                    signedDate: signedDate || undefined,
                    wordCount: content.trim().split(/\s+/).filter(Boolean).length,
                  },
                  { customTitle: title }
                );
              }}
              className="px-3 py-1.5 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] text-xs font-semibold transition touch-press hidden sm:inline-flex"
            >
              Save as PDF
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-8 h-8 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] flex items-center justify-center transition touch-press"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownloadDoc}
              className="w-8 h-8 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] flex items-center justify-center transition touch-press"
              title="Download Word .DOC"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-neutral-600 flex items-center justify-center transition touch-press"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Formatting Ribbon */}
        <div className="bg-[#f6f6f6] border-b border-neutral-200/80 px-3 py-2 flex items-center justify-between overflow-x-auto scrollbar-none text-xs gap-2.5">
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            {/* Font Family */}
            <div className="flex bg-white border border-neutral-200/80 rounded-full p-0.5">
              {(['sans', 'serif', 'mono'] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setFormatting({ ...formatting, fontFamily: font })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                    formatting.fontFamily === font
                      ? 'bg-[#033236] text-white'
                      : 'text-neutral-600 hover:text-[#033236]'
                  }`}
                >
                  {font === 'sans' ? 'Sans' : font === 'serif' ? 'Serif' : 'Mono'}
                </button>
              ))}
            </div>

            {/* Font Size */}
            <div className="flex items-center bg-white border border-neutral-200/80 rounded-full px-2 py-0.5 space-x-1">
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, fontSize: Math.max(10, formatting.fontSize - 1) })}
                className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-[#033236]"
              >
                -
              </button>
              <span className="text-[11px] font-mono text-[#033236] px-1 font-semibold">
                {formatting.fontSize}pt
              </span>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, fontSize: Math.min(24, formatting.fontSize + 1) })}
                className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-[#033236]"
              >
                +
              </button>
            </div>

            {/* Bold, Italic, Underline */}
            <div className="flex bg-white border border-neutral-200/80 rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, isBold: !formatting.isBold })}
                className={`p-1.5 rounded-full transition ${
                  formatting.isBold ? 'bg-[#033236] text-white' : 'text-neutral-600 hover:text-[#033236]'
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, isItalic: !formatting.isItalic })}
                className={`p-1.5 rounded-full transition ${
                  formatting.isItalic ? 'bg-[#033236] text-white' : 'text-neutral-600 hover:text-[#033236]'
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, isUnderline: !formatting.isUnderline })}
                className={`p-1.5 rounded-full transition ${
                  formatting.isUnderline ? 'bg-[#033236] text-white' : 'text-neutral-600 hover:text-[#033236]'
                }`}
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex bg-white border border-neutral-200/80 rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, alignment: 'left' })}
                className={`p-1.5 rounded-full transition ${
                  formatting.alignment === 'left' ? 'bg-[#033236] text-white' : 'text-neutral-600'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, alignment: 'center' })}
                className={`p-1.5 rounded-full transition ${
                  formatting.alignment === 'center' ? 'bg-[#033236] text-white' : 'text-neutral-600'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, alignment: 'right' })}
                className={`p-1.5 rounded-full transition ${
                  formatting.alignment === 'right' ? 'bg-[#033236] text-white' : 'text-neutral-600'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFormatting({ ...formatting, alignment: 'justify' })}
                className={`p-1.5 rounded-full transition ${
                  formatting.alignment === 'justify' ? 'bg-[#033236] text-white' : 'text-neutral-600'
                }`}
                title="Justify"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Paper Theme */}
            <div className="flex bg-white border border-neutral-200/80 rounded-full p-0.5">
              {([
                { id: 'classic', label: 'White' },
                { id: 'warm', label: 'Warm' },
                { id: 'dark', label: 'Teal' },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormatting({ ...formatting, paperTheme: t.id })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                    formatting.paperTheme === t.id
                      ? 'bg-[#033236] text-white'
                      : 'text-neutral-600 hover:text-[#033236]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex bg-white border border-neutral-200/80 rounded-full p-0.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                activeTab === 'preview' ? 'bg-[#033236] text-white' : 'text-neutral-600'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                activeTab === 'editor' ? 'bg-[#033236] text-white' : 'text-neutral-600'
              }`}
            >
              Edit Text
            </button>
          </div>
        </div>

        {/* Document Canvas Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f6f6f6] flex justify-center items-start">
          {activeTab === 'preview' ? (
            <div
              className={`w-full max-w-2xl min-h-[560px] sm:min-h-[680px] rounded-2xl shadow-card p-6 sm:p-12 transition-all duration-200 border relative flex flex-col justify-between ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
              style={{
                fontFamily:
                  formatting.fontFamily === 'serif'
                    ? 'Georgia, serif'
                    : formatting.fontFamily === 'mono'
                    ? 'Courier New, monospace'
                    : '"Plus Jakarta Sans", sans-serif',
                fontSize: `${formatting.fontSize}px`,
              }}
            >
              {formatting.includeHeader && (
                <div className={`pb-4 mb-6 ${currentTheme.headerBg}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        {title}
                      </h2>
                      <div className={`flex items-center space-x-2 text-xs mt-1 ${currentTheme.subtext}`}>
                        <span>{formatting.authorOrOrg}</span>
                        <span>•</span>
                        <span>
                          {new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full border border-current/25 opacity-70">
                      {category}
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`flex-1 whitespace-pre-wrap select-text ${alignClasses[formatting.alignment]} ${lineSpacingClasses[formatting.lineSpacing]} ${formatting.isBold ? 'font-bold' : 'font-normal'} ${formatting.isItalic ? 'italic' : 'normal'} ${formatting.isUnderline ? 'underline' : ''}`}
              >
                {content}
              </div>

              {/* Digital Signature Section at Bottom of Document */}
              {signatureDataUrl ? (
                <div className="pt-6 mt-8 border-t border-dashed border-current/20 flex items-end justify-between">
                  <div className="text-[11px] opacity-70 space-y-0.5">
                    <span className="font-semibold block text-xs">Digitally Signed</span>
                    <span>Authenticated document</span>
                  </div>
                  <div className="w-52 flex flex-col items-center group relative">
                    <div className="h-16 w-full flex items-center justify-center relative">
                      <img
                        src={signatureDataUrl}
                        alt="Digital Signature"
                        className="max-h-14 max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSignatureDataUrl(null);
                          setSignedDate(null);
                        }}
                        className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-white text-red-600 border border-neutral-200 opacity-0 group-hover:opacity-100 transition text-[10px] shadow-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="w-full border-t border-current/60 pt-1 flex justify-between text-[10px] opacity-80">
                      <span>Authorized Signer</span>
                      <span>{signedDate || new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-6 mt-8 border-t border-dashed border-current/20 flex items-center justify-between">
                  <span className={`text-[11px] ${currentTheme.subtext}`}>
                    No signature attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSignatureModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-full border border-dashed border-current/40 hover:border-current text-xs font-semibold opacity-75 hover:opacity-100 transition touch-press"
                  >
                    Add Signature
                  </button>
                </div>
              )}

              {formatting.includeFooter && (
                <div className={`pt-4 mt-8 border-t ${currentTheme.headerBg} flex items-center justify-between text-[11px] ${currentTheme.subtext}`}>
                  <span>Scanny</span>
                  <span>Page 1 of 1</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col space-y-2.5 shadow-card">
              <label className="text-xs font-bold text-[#033236]">
                Edit Document Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="w-full bg-[#f6f6f6] border border-neutral-200/80 rounded-xl p-4 text-xs text-[#033236] focus:outline-none focus:border-[#033236] leading-relaxed resize-y"
                placeholder="Document text..."
              />
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white border-t border-neutral-200/80 px-5 py-3.5 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] text-xs font-semibold transition touch-press"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-[#033236] hover:bg-[#05454a] text-white text-xs font-semibold shadow-soft transition touch-press"
          >
            {savedNotice ? 'Saved to History' : 'Save as Document'}
          </button>
        </div>
      </div>

      <SignaturePad
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onApply={(signatureUrl) => {
          setSignatureDataUrl(signatureUrl);
          setSignedDate(
            new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          );
        }}
      />
    </div>
  );
};
