import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';

interface IntroModalProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 'capture',
    eyebrow: 'Welcome to scanny',
    title: 'Scan paper into clean digital files',
    description:
      'Use your device camera or upload photos of receipts, contracts, and notes to capture clear documents in seconds.',
    useLogo: true,
    icon: null,
  },
  {
    id: 'convert',
    eyebrow: 'Smart Conversion',
    title: 'Convert to text, format, and sign',
    description:
      'Extract editable text automatically with AI, style pages like a dedicated document editor, and apply your handwritten digital signature.',
    useLogo: false,
    icon: FileText,
  },
  {
    id: 'export',
    eyebrow: 'Save & Share',
    title: 'Export in any format you need',
    description:
      'Keep everything organized in your personal history and download print-ready PDF, Word, Markdown, or plain text files anytime.',
    useLogo: false,
    icon: Download,
  },
];

export const IntroModal: React.FC<IntroModalProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === SLIDES.length - 1;
  const slide = SLIDES[currentIndex];
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f2f3f5] flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-neutral-200/80 shadow-xl p-6 sm:p-8 flex flex-col justify-between min-h-[560px] animate-in zoom-in-95 duration-300">
        {/* Top Bar: Brand Logo + Wordmark + Skip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/scanny-logo.jpg"
              alt="Scanny logo"
              className="w-8 h-8 rounded-lg object-cover shadow-soft"
            />
            <span className="font-brand font-semibold text-xl text-[#033236] tracking-[0.03em] lowercase leading-none">
              scanny
            </span>
          </div>
          {!isLastSlide && (
            <button
              type="button"
              onClick={onComplete}
              className="text-xs font-semibold text-neutral-500 hover:text-[#033236] transition touch-press"
            >
              Skip
            </button>
          )}
        </div>

        {/* Center Visual & Copy */}
        <div className="my-8 flex flex-col items-center text-center space-y-6">
          {slide.useLogo ? (
            <div className="w-44 h-44 rounded-[36px] overflow-hidden shadow-card border border-neutral-200/60 bg-white flex items-center justify-center">
              <img
                src="/scanny-logo.jpg"
                alt="Scanny App Logo"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-40 h-40 rounded-[32px] bg-[#f6f6f6] border border-neutral-200/70 flex items-center justify-center relative">
              <div className="w-20 h-20 rounded-2xl bg-[#033236] text-white flex items-center justify-center shadow-soft">
                {Icon && <Icon className="w-9 h-9 stroke-[1.75]" />}
              </div>
            </div>
          )}

          <div className="space-y-2.5 max-w-xs">
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              {slide.eyebrow}
            </p>
            <h2 className="text-2xl font-extrabold text-[#033236] tracking-tight leading-snug">
              {slide.title}
            </h2>
            <p className="text-[13px] font-medium text-neutral-600 leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Bottom Progress Dots + CTA */}
        <div className="space-y-5">
          <div className="flex items-center justify-center space-x-2">
            {SLIDES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-7 bg-[#033236]'
                    : 'w-1.5 bg-neutral-200 hover:bg-neutral-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-5 rounded-full bg-[#033236] hover:bg-[#05454a] text-white font-bold text-sm shadow-soft active:scale-[0.99] transition-all touch-press"
          >
            {isLastSlide ? 'Get Started' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
