import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface SignaturePadProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (signatureDataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [inkColor, setInkColor] = useState<'#033236' | '#0f172a' | '#1e3a8a'>('#033236');
  const [penSize, setPenSize] = useState<number>(2.5);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penSize;
  }, [inkColor, penSize]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        initCanvas();
        setHasDrawn(false);
      }, 50);
    }
  }, [isOpen, initCanvas]);

  if (!isOpen) return null;

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if ('touches' in e) {
      e.stopPropagation();
    }
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penSize;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      e.stopPropagation();
    }
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;

    const signatureDataUrl = canvas.toDataURL('image/png');
    onApply(signatureDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-in fade-in duration-200">
      <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200/80 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-[#033236]">Digital Signature</h3>
            <p className="text-[11px] text-neutral-500">Sign with finger, stylus, or mouse</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f6f6] flex items-center justify-center text-neutral-600 hover:text-[#033236] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ink & Stroke Toolbar */}
        <div className="px-5 py-2.5 bg-[#f6f6f6] border-b border-neutral-200/70 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-neutral-500 font-medium">Ink</span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setInkColor('#033236')}
                className={`w-5 h-5 rounded-full bg-[#033236] border-2 transition ${
                  inkColor === '#033236' ? 'border-neutral-400 scale-110' : 'border-transparent'
                }`}
                title="Deep Teal Ink"
              />
              <button
                type="button"
                onClick={() => setInkColor('#0f172a')}
                className={`w-5 h-5 rounded-full bg-slate-900 border-2 transition ${
                  inkColor === '#0f172a' ? 'border-neutral-400 scale-110' : 'border-transparent'
                }`}
                title="Black Ink"
              />
              <button
                type="button"
                onClick={() => setInkColor('#1e3a8a')}
                className={`w-5 h-5 rounded-full bg-blue-900 border-2 transition ${
                  inkColor === '#1e3a8a' ? 'border-neutral-400 scale-110' : 'border-transparent'
                }`}
                title="Blue Ink"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {[
              { label: 'Fine', size: 1.5 },
              { label: 'Medium', size: 2.5 },
              { label: 'Bold', size: 4 },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setPenSize(opt.size)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                  penSize === opt.size
                    ? 'bg-[#033236] text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="p-5 bg-[#f6f6f6] flex flex-col items-center justify-center">
          <div className="relative w-full h-44 rounded-2xl bg-white border border-neutral-200 shadow-inner overflow-hidden flex items-center justify-center cursor-crosshair touch-none">
            <div className="absolute inset-x-8 bottom-8 border-b border-dashed border-neutral-300 pointer-events-none flex items-center justify-between text-neutral-400 text-[11px] select-none">
              <span className="italic">Sign here</span>
              <span>Authorized Signature</span>
            </div>

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full z-10"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-2">
            Draw your signature above the line, then tap Apply.
          </span>
        </div>

        {/* Actions: Clear & Apply */}
        <div className="bg-white px-5 py-3.5 border-t border-neutral-200/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 text-[#033236] text-xs font-semibold transition touch-press"
          >
            Clear
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-neutral-500 hover:text-[#033236] text-xs font-medium transition touch-press"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!hasDrawn}
              onClick={handleApply}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all touch-press ${
                hasDrawn
                  ? 'bg-[#033236] hover:bg-[#05454a] text-white cursor-pointer'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
