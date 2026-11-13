import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, X, PenTool, Palette } from 'lucide-react';

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
  const [inkColor, setInkColor] = useState<'#1e3a8a' | '#0f172a' | '#047857'>('#1e3a8a');
  const [penSize, setPenSize] = useState<number>(2.5);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use sharp rendering for high-DPI displays
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

  // Coordinate helper that handles both mouse and touch offsets correctly
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
      // Prevent screen scroll while drawing on mobile
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

  // Clear button handler
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
  };

  // Apply button handler
  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;

    // Convert canvas to transparent PNG data URL
    const signatureDataUrl = canvas.toDataURL('image/png');
    onApply(signatureDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-in fade-in duration-200">
      <div className="bg-surface-900 border border-surface-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-surface-850 px-4 py-3 border-b border-surface-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Draw Digital Signature</h3>
              <p className="text-[11px] text-slate-400">Sign with finger, stylus, or mouse</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Ink Color and Width */}
        <div className="px-4 py-2 bg-surface-850/60 border-b border-surface-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 font-medium flex items-center">
              <Palette className="w-3 h-3 mr-1" />
              Ink Color:
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setInkColor('#1e3a8a')}
                className={`w-5 h-5 rounded-full bg-blue-900 border-2 transition ${
                  inkColor === '#1e3a8a' ? 'border-brand-400 scale-110 shadow-glow' : 'border-surface-700'
                }`}
                title="Royal Blue Ink"
              />
              <button
                type="button"
                onClick={() => setInkColor('#0f172a')}
                className={`w-5 h-5 rounded-full bg-slate-900 border-2 transition ${
                  inkColor === '#0f172a' ? 'border-brand-400 scale-110 shadow-glow' : 'border-surface-700'
                }`}
                title="Black Ink"
              />
              <button
                type="button"
                onClick={() => setInkColor('#047857')}
                className={`w-5 h-5 rounded-full bg-emerald-800 border-2 transition ${
                  inkColor === '#047857' ? 'border-brand-400 scale-110 shadow-glow' : 'border-surface-700'
                }`}
                title="Emerald Green Ink"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setPenSize(1.5)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                penSize === 1.5 ? 'bg-brand-600 text-white' : 'bg-surface-800 text-slate-400 hover:text-white'
              }`}
            >
              Fine
            </button>
            <button
              type="button"
              onClick={() => setPenSize(2.5)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                penSize === 2.5 ? 'bg-brand-600 text-white' : 'bg-surface-800 text-slate-400 hover:text-white'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setPenSize(4)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                penSize === 4 ? 'bg-brand-600 text-white' : 'bg-surface-800 text-slate-400 hover:text-white'
              }`}
            >
              Bold
            </button>
          </div>
        </div>

        {/* Signature Drawing Canvas Area */}
        <div className="p-4 bg-surface-950 flex flex-col items-center justify-center">
          <div className="relative w-full h-44 rounded-2xl bg-white border border-slate-300 shadow-inner overflow-hidden flex items-center justify-center cursor-crosshair touch-none">
            {/* Visual signature baseline guideline */}
            <div className="absolute inset-x-8 bottom-8 border-b-2 border-dashed border-slate-300 pointer-events-none flex items-center justify-between text-slate-400 text-xs select-none">
              <span className="font-serif italic font-bold">✕ Sign Here</span>
              <span className="text-[10px] font-mono opacity-60">Authorized Signature</span>
            </div>

            {/* Drawing Canvas */}
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
          <span className="text-[11px] text-slate-500 mt-2">
            Draw your signature above the line. Click Apply when done.
          </span>
        </div>

        {/* Bottom Actions: Clear and Apply Buttons */}
        <div className="bg-surface-850 px-4 py-3 border-t border-surface-800 flex items-center justify-between">
          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition touch-press"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition touch-press"
            >
              Cancel
            </button>
            {/* Apply Button */}
            <button
              type="button"
              disabled={!hasDrawn}
              onClick={handleApply}
              className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg transition-all touch-press ${
                hasDrawn
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 active:scale-95 cursor-pointer'
                  : 'bg-surface-800 text-slate-500 border border-surface-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
