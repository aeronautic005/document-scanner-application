import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Zap,
  ZapOff,
  AlertCircle,
} from 'lucide-react';
import { UploadedDocument } from '../../types';
import { formatFileSize } from '../../utils/fileUtils';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (doc: UploadedDocument) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);

  // Stop camera tracks cleanly
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreamReady(false);
  }, []);

  // Start live camera stream
  const startCamera = useCallback(async () => {
    stopStream();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your current browser.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreamReady(true);
      }

      // Check if torch/flashlight is supported
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? (track.getCapabilities() as { torch?: boolean }) : {};
      setHasTorch(Boolean(capabilities.torch));
    } catch (err: unknown) {
      console.warn('getUserMedia error, providing fallback:', err);
      const errorMsg =
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser or use the file picker below.'
          : 'Unable to start camera stream. You can use your device camera via native file capture.';
      setCameraError(errorMsg);
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, startCamera, stopStream]);

  if (!isOpen) return null;

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && hasTorch) {
      try {
        const newTorch = !torchOn;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (track as any).applyConstraints({
          advanced: [{ torch: newTorch }],
        });
        setTorchOn(newTorch);
      } catch (err) {
        console.warn('Failed to toggle torch', err);
      }
    }
  };

  // Toggle front/back camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture Photo from live video stream
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !isStreamReady) return;

    setIsCapturing(true);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsCapturing(false);
      return;
    }

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        setIsCapturing(false);
        if (!blob) return;

        const filename = `DocScan_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}.jpg`;
        const file = new File([blob], filename, { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);

        const doc: UploadedDocument = {
          id: `capture-${Date.now()}`,
          file,
          name: filename,
          rawSize: blob.size,
          sizeFormatted: formatFileSize(blob.size),
          type: 'image/jpeg',
          previewUrl,
          uploadedAt: 'Just now',
          dimensions: {
            width: canvas.width,
            height: canvas.height,
          },
          selectedCategory: 'Invoice',
        };

        stopStream();
        onPhotoCaptured(doc);
        onClose();
      },
      'image/jpeg',
      0.95
    );
  };

  // Fallback native mobile camera capture
  const handleFallbackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const doc: UploadedDocument = {
          id: `capture-${Date.now()}`,
          file,
          name: file.name || `Camera_Scan_${Date.now()}.jpg`,
          rawSize: file.size,
          sizeFormatted: formatFileSize(file.size),
          type: file.type,
          previewUrl,
          uploadedAt: 'Just now',
          dimensions: { width: img.naturalWidth, height: img.naturalHeight },
          selectedCategory: 'Invoice',
        };
        stopStream();
        onPhotoCaptured(doc);
        onClose();
      };
      img.src = previewUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col justify-between select-none animate-in fade-in duration-200">
      {/* Hidden fallback mobile capture input */}
      <input
        ref={fallbackInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFallbackFileChange}
        className="hidden"
      />

      {/* Camera Top Bar */}
      <div className="relative z-20 px-4 py-3 pt-safe flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={() => {
            stopStream();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition touch-press"
          title="Close Camera"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs text-white font-semibold tracking-wide">
          Document Camera
        </div>

        <div className="flex items-center space-x-2">
          {hasTorch && (
            <button
              type="button"
              onClick={toggleTorch}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition touch-press ${
                torchOn
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-black/40 backdrop-blur-md text-white border-white/20'
              }`}
              title="Toggle Flash"
            >
              {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </button>
          )}

          <button
            type="button"
            onClick={toggleFacingMode}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition touch-press"
            title="Switch Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Section */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {cameraError ? (
          /* Error & Permission Fallback State */
          <div className="p-6 max-w-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Camera Ready</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{cameraError}</p>
            </div>
            <button
              type="button"
              onClick={() => fallbackInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-full bg-white text-[#033236] hover:bg-neutral-100 text-xs font-semibold transition touch-press"
            >
              Open Device Camera
            </button>
          </div>
        ) : (
          /* Live Camera View */
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />

            {/* Document Guide Frame Overlay */}
            <div className="absolute inset-8 sm:inset-16 pointer-events-none flex flex-col justify-between">
              {/* Corner brackets */}
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg shadow-[0_0_8px_#22d3ee]" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg shadow-[0_0_8px_#22d3ee]" />
              </div>

              {/* Center Guidance Prompt */}
              <div className="text-center px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-slate-200 self-center">
                Align document inside frame
              </div>

              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg shadow-[0_0_8px_#22d3ee]" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg shadow-[0_0_8px_#22d3ee]" />
              </div>
            </div>

            {/* Shutter flash animation overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-white animate-out fade-out duration-150 pointer-events-none" />
            )}
          </>
        )}
      </div>

      {/* Camera Bottom Shutter Bar */}
      <div className="relative z-20 px-6 py-6 pb-safe bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-around">
        {/* Native Camera Shortcut */}
        <button
          type="button"
          onClick={() => fallbackInputRef.current?.click()}
          className="text-white text-xs opacity-70 hover:opacity-100 flex flex-col items-center space-y-1 transition touch-press"
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px]">System App</span>
        </button>

        {/* Big Tactile Shutter Button */}
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            disabled={!isStreamReady || isCapturing}
            onClick={capturePhoto}
            className={`w-20 h-20 rounded-full p-1.5 border-4 border-white flex items-center justify-center transition-transform active:scale-90 touch-press ${
              isStreamReady ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Take Photo"
          >
            <div className="w-full h-full rounded-full bg-white active:bg-cyan-200 transition shadow-lg" />
          </button>
        </div>

        {/* Cancel button */}
        <button
          type="button"
          onClick={() => {
            stopStream();
            onClose();
          }}
          className="text-white text-xs opacity-70 hover:opacity-100 flex flex-col items-center space-y-1 transition touch-press"
        >
          <X className="w-5 h-5" />
          <span className="text-[10px]">Cancel</span>
        </button>
      </div>
    </div>
  );
};
