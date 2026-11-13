import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Layers,
  ImageUp,
  FileText,
  FileCheck2,
  HardDrive,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { DocumentItem, ScanProgress, ScanResult, UploadedDocument } from '../../types';
import { DocumentUploader } from '../scanner/DocumentUploader';
import { DocumentPreviewArea } from '../scanner/DocumentPreviewArea';
import { ScanningOverlay } from '../scanner/ScanningOverlay';
import { ScanResultView } from '../scanner/ScanResultView';
import { CameraScannerModal } from '../scanner/CameraScannerModal';
import { scanDocumentWithAI } from '../../services/aiScannerService';
import { getSavedDocuments, saveScannedDocument } from '../../services/storageService';

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

  // Camera state
  const [localCameraOpen, setLocalCameraOpen] = useState(false);
  const isCameraActive = externalCameraOpen !== undefined ? externalCameraOpen : localCameraOpen;
  const setCameraActive = (open: boolean) => {
    if (externalSetCameraOpen) {
      externalSetCameraOpen(open);
    } else {
      setLocalCameraOpen(open);
    }
  };

  // Scanning flow state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Dynamic saved documents
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

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
          sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
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
    setSaveSuccessNotice(`"${saved.title}" has been saved to your History.`);
  };

  const handleDiscardScan = () => {
    setScanResult(null);
    onDocumentChange(null);
  };

  const quickStats = [
    { label: 'Scanned Docs', value: `${documents.length}`, change: '+8 this week', icon: FileCheck2 },
    { label: 'Storage Used', value: '28.4 MB', change: 'Cloud synced', icon: HardDrive },
    { label: 'OCR Ready', value: `${documents.length}`, change: '100% indexed', icon: Sparkles },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Hidden file input for header/quick action buttons */}
      <input
        ref={fileInputHiddenRef}
        type="file"
        accept="image/*"
        onChange={handleHiddenFileInput}
        className="hidden"
      />

      {/* Holographic Scanning Overlay */}
      {isScanning && currentDocument && (
        <ScanningOverlay
          progress={scanProgress}
          imagePreviewUrl={currentDocument.previewUrl}
        />
      )}

      {/* Save Success Alert Banner */}
      {saveSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[11px] transition touch-press"
            >
              View in History →
            </button>
          )}
        </div>
      )}

      {/* Main Content: If scanResult exists, show ScanResultView; otherwise show Upload/Preview */}
      {scanResult ? (
        <ScanResultView
          result={scanResult}
          onConfirmSave={handleConfirmSave}
          onDiscard={handleDiscardScan}
          onFormattedDocSaved={(doc) => {
            setDocuments(getSavedDocuments());
            setScanResult(null);
            onDocumentChange(null);
            setSaveSuccessNotice(`Document "${doc.title}" has been saved to your History.`);
          }}
        />
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                {currentDocument ? 'Document Preview' : 'Document Capture'}
              </h2>
            </div>
            {currentDocument && (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Ready to Scan
              </span>
            )}
          </div>

          {currentDocument ? (
            <DocumentPreviewArea
              document={currentDocument}
              onRemove={() => onDocumentChange(null)}
              onReplace={handleQuickUpload}
              onStartScan={handleStartScan}
            />
          ) : (
            <div className="space-y-4">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900/60 via-surface-850 to-surface-900 p-4 sm:p-5 border border-brand-500/20 shadow-xl">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                      AI OCR Engine Ready
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Text Conversion</span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Scan & Convert Documents to Text
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                    Upload any receipt, invoice, contract, or note to instantly extract structured text with AI.
                  </p>

                  {/* Quick Action Trigger Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-3.5">
                    <button
                      type="button"
                      onClick={() => setCameraActive(true)}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-md shadow-brand-600/30 transition touch-press"
                    >
                      <Camera className="w-4 h-4 mb-1" />
                      <span>Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickUpload}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-200 font-medium text-xs transition touch-press"
                    >
                      <Layers className="w-4 h-4 mb-1 text-brand-400" />
                      <span>Batch</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickUpload}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-200 font-medium text-xs transition touch-press"
                    >
                      <ImageUp className="w-4 h-4 mb-1 text-slate-300" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Intuitive Drag & Drop Uploader */}
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

      {/* Productivity Stats Grid */}
      <section className="grid grid-cols-3 gap-2.5">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-surface-850/80 border border-surface-800 p-3 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <Icon className="w-4 h-4 text-brand-400" />
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-100 block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block truncate">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick Category Filter Pills */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Quick Categories
          </h3>
          {onViewHistory && (
            <span
              onClick={onViewHistory}
              className="text-xs text-brand-400 hover:underline cursor-pointer"
            >
              View all
            </span>
          )}
        </div>
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['All Documents', 'Invoices', 'Receipts', 'Contracts', 'IDs', 'Certificates'].map((cat, i) => (
            <span
              key={cat}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer transition ${
                i === 0
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-850 text-slate-300 hover:bg-surface-800 border border-surface-800'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Recent Scans Section */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Recent Scans
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{documents.length} items</span>
        </div>

        <div className="space-y-2">
          {documents.slice(0, 5).map((doc) => (
            <div
              key={doc.id}
              className="group bg-surface-850/80 border border-surface-800 hover:border-surface-700 rounded-xl p-3 flex items-center justify-between transition touch-press"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`w-10 h-12 rounded-lg bg-gradient-to-br ${doc.thumbnailColor} flex items-center justify-center shadow-inner flex-shrink-0 relative overflow-hidden`}
                >
                  <FileText className="w-5 h-5 text-white/90" />
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold text-white/80 bg-black/40 px-1 rounded">
                    {doc.pages}p
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-brand-300 transition">
                    {doc.title}
                  </h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-800 text-slate-300 border border-surface-700">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{doc.date}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400">{doc.size}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onViewHistory}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-800 transition"
                title="View document text"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
