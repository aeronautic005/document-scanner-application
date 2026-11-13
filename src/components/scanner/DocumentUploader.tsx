import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, AlertCircle } from 'lucide-react';
import { UploadedDocument } from '../../types';
import { formatFileSize, getImageDimensions } from '../../utils/fileUtils';

interface DocumentUploaderProps {
  onImageSelected: (doc: UploadedDocument) => void;
  onOpenCamera?: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onImageSelected,
  onOpenCamera,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);

    // Validate that it's an image file
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP, or HEIC).');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const dimensions = await getImageDimensions(previewUrl);

    const doc: UploadedDocument = {
      id: `upload-${Date.now()}`,
      file,
      name: file.name,
      rawSize: file.size,
      sizeFormatted: formatFileSize(file.size),
      type: file.type,
      previewUrl,
      uploadedAt: 'Just now',
      dimensions,
      selectedCategory: 'Invoice',
    };

    onImageSelected(doc);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so same file can be re-uploaded if replaced
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center select-none ${
          isDragging
            ? 'border-brand-400 bg-brand-500/10 scale-[1.01]'
            : 'border-surface-700/80 bg-surface-850/60 hover:border-brand-500/50 hover:bg-surface-850'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center mb-3.5 group-hover:scale-105 group-hover:border-brand-500/40 group-hover:text-brand-400 text-slate-300 transition-all shadow-md">
          <UploadCloud className="w-7 h-7 text-brand-400" />
        </div>

        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-brand-300 transition">
          Upload Document Image
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Drag & drop your document here, or{' '}
          <span className="text-brand-400 font-medium underline underline-offset-2">browse files</span>
        </p>

        {/* Format Badges */}
        <div className="flex items-center space-x-1.5 mt-3.5">
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-surface-800 text-slate-400 border border-surface-700">
            JPG
          </span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-surface-800 text-slate-400 border border-surface-700">
            PNG
          </span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-surface-800 text-slate-400 border border-surface-700">
            WEBP
          </span>
          <span className="text-[10px] text-slate-500">• Up to 25MB</span>
        </div>
      </div>

      {/* Quick Mobile Action Shortcuts */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            if (onOpenCamera) {
              onOpenCamera();
            } else {
              cameraInputRef.current?.click();
            }
          }}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-200 text-xs font-medium transition touch-press"
        >
          <Camera className="w-4 h-4 text-brand-400" />
          <span>Take Photo</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-200 text-xs font-medium transition touch-press"
        >
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span>Photo Library</span>
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
