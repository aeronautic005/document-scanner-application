import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { DocumentItem, ScanProgress, ScanResult, UploadedDocument } from '../../types';
import { DocumentUploader } from '../scanner/DocumentUploader';
import { DocumentPreviewArea } from '../scanner/DocumentPreviewArea';
import { ScanningOverlay } from '../scanner/ScanningOverlay';
import { ScanResultView } from '../scanner/ScanResultView';
import { CameraScannerModal } from '../scanner/CameraScannerModal';
import { scanDocumentWithAI } from '../../services/aiScannerService';
import { getSavedDocuments, saveScannedDocument } from '../../services/storageService';
import { formatFileSize } from '../../utils/fileUtils';

interface DashboardViewProps {
  currentDocument: UploadedDocument | null;
  onDocumentChange: (doc: UploadedDocument | null) => void;
  onViewHistory?: () => void;
  isCameraOpen?: boolean;
  onSetCameraOpen?: (open: boolean) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentDocument,
  onDocumentChange,
  onViewHistory,
  isCameraOpen: externalCameraOpen,
  onSetCameraOpen: externalSetCameraOpen,
}) => {
  const fileInputHiddenRef = useRef<HTMLInputElement>(null);

  const [localCameraOpen, setLocalCameraOpen] = useState(false);
  const isCameraActive = externalCameraOpen !== undefined ? externalCameraOpen : localCameraOpen;
  const setCameraActive = (open: boolean) => {
    if (externalSetCameraOpen) {
      externalSetCameraOpen(open);
    } else {
      setLocalCameraOpen(open);
    }
  };

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDocuments(getSavedDocuments());
  }, []);

  const handleQuickUpload = () => {
    fileInputHiddenRef.current?.click();
  };

  const handleHiddenFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        onDocumentChange({
          id: `upload-${Date.now()}`,
          file,
          name: file.name,
          rawSize: file.size,
          sizeFormatted: formatFileSize(file.size),
          type: file.type,
          previewUrl,
          uploadedAt: 'Just now',
          dimensions: { width: img.naturalWidth, height: img.naturalHeight },
          selectedCategory: 'Invoice',
        });
        setScanResult(null);
        setSaveSuccessNotice(null);
      };
      img.src = previewUrl;
    }
    e.target.value = '';
  };

  const handleStartScan = async (category: string) => {
    if (!currentDocument) return;

    const docToScan: UploadedDocument = {
      ...currentDocument,
      selectedCategory: category as UploadedDocument['selectedCategory'],
    };

    setIsScanning(true);
    setSaveSuccessNotice(null);

    try {
      const result = await scanDocumentWithAI(docToScan, (progress) => {
        setScanProgress(progress);
      });
      setScanResult(result);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmSave = (finalResult: ScanResult) => {
    const saved = saveScannedDocument(finalResult);
    setDocuments(getSavedDocuments());
    setScanResult(null);
    onDocumentChange(null);
    setSaveSuccessNotice(`"${saved.title}" saved to History.`);
  };

  const handleDiscardScan = () => {
    setScanResult(null);
    onDocumentChange(null);
  };

  const filteredRecentDocs = documents.filter((d) => {
    const matchesCat = activeCategoryFilter === 'All' || d.category === activeCategoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      (d.extractedText && d.extractedText.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Brought-down Search Bar + Filter Button Row */}
      {!scanResult && !currentDocument && (
        <div className="flex items-center gap-2.5 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full bg-[#f6f6f6] border border-neutral-200/70 rounded-full pl-10 pr-9 py-3 text-xs text-[#033236] placeholder:text-neutral-400 focus:outline-none focus:border-[#033236] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#033236]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (categoriesRef.current) {
                categoriesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else if (onViewHistory) {
                onViewHistory();
              }
            }}
            className="w-11 h-11 rounded-full bg-[#033236] hover:bg-[#05454a] text-white flex items-center justify-center flex-shrink-0 shadow-soft transition touch-press"
            aria-label="Filter documents"
            title="Filter by category"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      )}
      <input
        ref={fileInputHiddenRef}
        type="file"
        accept="image/*"
        onChange={handleHiddenFileInput}
        className="hidden"
      />

      {isScanning && currentDocument && (
        <ScanningOverlay
          progress={scanProgress}
          imagePreviewUrl={currentDocument.previewUrl}
        />
      )}

      {saveSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-[#f0f5f5] border border-[#033236]/15 text-[#033236] text-xs flex items-center justify-between gap-2">
          <span className="font-medium">{saveSuccessNotice}</span>
          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="px-3 py-1 rounded-full bg-[#033236] text-white font-semibold text-[11px] flex-shrink-0 transition touch-press"
            >
              View
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {scanResult ? (
        <ScanResultView
          result={scanResult}
          onConfirmSave={handleConfirmSave}
          onDiscard={handleDiscardScan}
          onFormattedDocSaved={(doc) => {
            setDocuments(getSavedDocuments());
            setScanResult(null);
            onDocumentChange(null);
            setSaveSuccessNotice(`Document "${doc.title}" saved to History.`);
          }}
        />
      ) : (
        <section className="space-y-4">
          {currentDocument ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#033236]">
                  Document Preview
                </h2>
                <span className="text-[11px] font-medium text-neutral-500">
                  Ready to scan
                </span>
              </div>
              <DocumentPreviewArea
                document={currentDocument}
                onRemove={() => onDocumentChange(null)}
                onReplace={handleQuickUpload}
                onStartScan={handleStartScan}
              />
            </>
          ) : (
            <div className="space-y-4">
              {/* Calm Deep-Teal Primary Hero Card */}
              <div className="rounded-3xl bg-[#033236] p-5 text-white shadow-soft">
                <p className="text-[11px] font-bold text-white/75 uppercase tracking-wider">
                  Quick Capture
                </p>
                <h2 className="text-xl font-extrabold tracking-tight mt-1">
                  Scan & Convert to Text
                </h2>
                <p className="text-[13px] font-medium text-white/85 mt-1.5 leading-relaxed">
                  Take a photo or upload an image to extract text, format as a document, and export.
                </p>

                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  <button
                    type="button"
                    onClick={() => setCameraActive(true)}
                    className="py-3 px-4 rounded-full bg-white text-[#033236] font-bold text-[13px] hover:bg-neutral-100 transition touch-press"
                  >
                    Open Camera
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickUpload}
                    className="py-3 px-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-[13px] border border-white/20 transition touch-press"
                  >
                    Upload Image
                  </button>
                </div>
              </div>

              {/* Clean Drag & Drop Uploader */}
              <DocumentUploader
                onImageSelected={(doc) => onDocumentChange(doc)}
                onOpenCamera={() => setCameraActive(true)}
              />
            </div>
          )}
        </section>
      )}

      {/* Live Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={isCameraActive}
        onClose={() => setCameraActive(false)}
        onPhotoCaptured={(doc) => {
          onDocumentChange(doc);
          setScanResult(null);
          setSaveSuccessNotice(null);
        }}
      />

      {/* Minimalist Overview Stats */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#f6f6f6] p-3.5 rounded-2xl">
          <span className="text-xs text-neutral-600 font-semibold block">
            Documents
          </span>
          <span className="text-xl font-extrabold text-[#033236] block mt-0.5">
            {documents.length}
          </span>
        </div>
        <div className="bg-[#f6f6f6] p-3.5 rounded-2xl">
          <span className="text-xs text-neutral-600 font-semibold block">
            Storage
          </span>
          <span className="text-xl font-extrabold text-[#033236] block mt-0.5">
            28.4 MB
          </span>
        </div>
        <div className="bg-[#f6f6f6] p-3.5 rounded-2xl">
          <span className="text-xs text-neutral-600 font-semibold block">
            Indexed
          </span>
          <span className="text-xl font-extrabold text-[#033236] block mt-0.5">
            100%
          </span>
        </div>
      </section>

      {/* Clean Horizontal Category Pills */}
      <section ref={categoriesRef} className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-extrabold text-[#033236]">Categories</h3>
          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="text-xs font-bold text-neutral-600 hover:text-[#033236] underline underline-offset-2"
            >
              See all
            </button>
          )}
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none text-[13px]">
          {[
            { label: 'All', value: 'All' },
            { label: 'Invoices', value: 'Invoice' },
            { label: 'Receipts', value: 'Receipt' },
            { label: 'Contracts', value: 'Contract' },
            { label: 'ID Cards', value: 'ID Card' },
            { label: 'Notes', value: 'Note' },
          ].map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition touch-press ${
                activeCategoryFilter === cat.value
                  ? 'bg-[#033236] text-white'
                  : 'bg-[#f6f6f6] text-neutral-700 hover:bg-neutral-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Scans Section */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-extrabold text-[#033236]">Recent Scans</h3>
          <span className="text-xs font-semibold text-neutral-500">
            {filteredRecentDocs.length} items
          </span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl divide-y divide-neutral-100 shadow-card overflow-hidden">
          {filteredRecentDocs.length === 0 ? (
            <div className="p-6 text-center text-xs font-semibold text-neutral-500">
              No documents in this category yet.
            </div>
          ) : (
            filteredRecentDocs.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                onClick={onViewHistory}
                className="p-3.5 flex items-center justify-between hover:bg-[#f6f6f6]/70 transition cursor-pointer touch-press"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Minimal monochrome page count tile */}
                  <div className="w-10 h-11 rounded-xl bg-[#f6f6f6] border border-neutral-200/80 flex flex-col items-center justify-center flex-shrink-0 text-[#033236]">
                    <span className="text-[11px] font-extrabold leading-none">
                      {doc.isFormattedDocument ? 'DOC' : 'PDF'}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-600 mt-0.5">
                      {doc.pages}p
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-[#033236] truncate">
                      {doc.title}
                    </h4>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-xs font-medium text-neutral-600">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0 ml-2" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
