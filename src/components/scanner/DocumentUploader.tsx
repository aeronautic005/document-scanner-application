import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
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

      {/* Minimalist Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed transition-all duration-200 cursor-pointer text-center select-none ${
          isDragging
            ? 'border-[#033236] bg-[#033236]/5 scale-[1.01]'
            : 'border-neutral-300 bg-[#f6f6f6]/70 hover:border-[#033236]/60 hover:bg-[#f6f6f6]'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-3 text-[#033236] shadow-soft transition-transform group-hover:scale-105">
          <UploadCloud className="w-5 h-5" />
        </div>

        <h3 className="text-sm font-semibold text-[#033236]">
          Upload Document Image
        </h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
          Drag and drop your file here, or{' '}
          <span className="text-[#033236] font-semibold underline underline-offset-2">
            browse files
          </span>
        </p>

        <p className="text-[11px] text-neutral-400 mt-2.5">
          JPG, PNG, WEBP up to 25 MB
        </p>
      </div>

      {/* Clean Secondary Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => {
            if (onOpenCamera) {
              onOpenCamera();
            } else {
              cameraInputRef.current?.click();
            }
          }}
          className="py-2.5 px-3 rounded-xl bg-[#f6f6f6] hover:bg-neutral-200/70 border border-neutral-200/80 text-[#033236] text-xs font-semibold transition touch-press"
        >
          Take Photo
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="py-2.5 px-3 rounded-xl bg-[#f6f6f6] hover:bg-neutral-200/70 border border-neutral-200/80 text-[#033236] text-xs font-semibold transition touch-press"
        >
          Photo Library
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
