import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, ScanLine } from 'lucide-react';

interface IntroModalProps {
  onGetStarted: () => void;
  onAlreadyHaveAccount: () => void;
}

const INTRO_SLIDES = [
  {
    id: 'capture',
    eyebrow: 'Welcome to scanny',
    title: 'Scan paper into clean digital files',
    description:
      'Use your device camera or upload photos of receipts, contracts, and notes to capture clear documents in seconds.',
    icon: ScanLine,
  },
  {
    id: 'convert',
    eyebrow: 'Smart Conversion',
    title: 'Convert to text, format, and sign',
    description:
      'Extract editable text automatically with AI, style pages like a dedicated document editor, and apply your handwritten digital signature.',
    icon: FileText,
  },
  {
    id: 'export',
    eyebrow: 'Save & Share',
    title: 'Export in any format you need',
    description:
      'Keep everything organized in your personal history and download print-ready PDF, Word, Markdown, or plain text files anytime.',
    icon: Download,
  },
];

export const IntroModal: React.FC<IntroModalProps> = ({
  onGetStarted,
  onAlreadyHaveAccount,
}) => {
  const [stage, setStage] = useState<'welcome' | 'slides'>('welcome');
  const [slideIndex, setSlideIndex] = useState(0);

  if (stage === 'welcome') {
    return (
      <div className="fixed inset-0 z-50 bg-[#022225] flex items-center justify-center sm:p-6 select-none animate-in fade-in duration-300">
        <div className="w-full max-w-md min-h-screen sm:min-h-[680px] bg-[#033236] sm:rounded-[32px] sm:border sm:border-white/10 sm:shadow-2xl px-6 py-10 flex flex-col justify-between">
          <div className="h-6" />

          {/* Centerpiece: Logo + scanny wordmark + tagline */}
          <div className="flex flex-col items-center text-center space-y-5 my-auto">
            <img
              src="/scanny-logo.jpg"
              alt="Scanny logo"
              className="w-28 h-28 rounded-[28px] object-cover shadow-2xl ring-1 ring-white/15"
            />

            <div className="space-y-2.5">
              <h1 className="font-brand font-semibold text-[40px] text-white tracking-[0.04em] lowercase leading-none">
                scanny
              </h1>
              <p className="text-[14px] font-medium text-white/75 max-w-[240px] mx-auto leading-relaxed">
                Scan smart. Stay organized.
              </p>
            </div>
          </div>

          {/* Bottom Stacked Tactile Buttons */}
          <div className="space-y-3 pt-8 pb-safe">
            <button
              type="button"
              onClick={() => {
                setSlideIndex(0);
                setStage('slides');
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-[#033236] border-b-[4px] border-neutral-300 active:border-b-0 active:translate-y-[2px] font-extrabold text-[13px] tracking-[0.06em] uppercase transition-all"
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={onAlreadyHaveAccount}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#033236] hover:bg-white/10 text-white border-2 border-white/25 border-b-[4px] border-b-white/20 active:border-b-2 active:translate-y-[1px] font-extrabold text-[13px] tracking-[0.05em] uppercase transition-all"
            >
              I Already Have an Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLastSlide = slideIndex === INTRO_SLIDES.length - 1;
  const slide = INTRO_SLIDES[slideIndex];
  const Icon = slide.icon;

  const handleBack = () => {
    if (slideIndex === 0) {
      setStage('welcome');
    } else {
      setSlideIndex((prev) => prev - 1);
    }
  };

  const handleContinue = () => {
    if (isLastSlide) {
      onGetStarted();
    } else {
      setSlideIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f2f3f5] flex items-center justify-center sm:p-6 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md min-h-screen sm:min-h-[680px] bg-white sm:rounded-[32px] sm:border sm:border-neutral-200/80 sm:shadow-xl px-6 py-8 flex flex-col justify-between">
        {/* Top Bar: Back Arrow + Progress Bar + Skip */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-[#f6f6f6] hover:bg-neutral-200/70 flex items-center justify-center text-[#033236] transition touch-press flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Top Progress Bar */}
          <div className="flex-1 h-2 bg-[#f6f6f6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#033236] rounded-full transition-all duration-300"
              style={{
                width: `${((slideIndex + 1) / INTRO_SLIDES.length) * 100}%`,
              }}
            />
          </div>

          <button
            type="button"
            onClick={onGetStarted}
            className="text-xs font-bold text-neutral-500 hover:text-[#033236] transition touch-press flex-shrink-0"
          >
            Skip
          </button>
        </div>

        {/* Center Visual & Introduction Copy */}
        <div className="my-8 flex flex-col items-center text-center space-y-6">
          <div className="w-40 h-40 rounded-[32px] bg-[#f6f6f6] border border-neutral-200/70 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#033236] text-white flex items-center justify-center shadow-soft">
              <Icon className="w-9 h-9 stroke-[1.75]" />
            </div>
          </div>

          <div className="space-y-2.5 max-w-xs">
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              {slide.eyebrow}
            </p>
            <h2 className="text-2xl font-extrabold text-[#033236] tracking-tight leading-snug">
              {slide.title}
            </h2>
            <p className="text-[14px] font-medium text-neutral-600 leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Bottom Progress Dots + Continue CTA */}
        <div className="space-y-5 pb-safe">
          <div className="flex items-center justify-center space-x-2">
            {INTRO_SLIDES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === slideIndex
                    ? 'w-7 bg-[#033236]'
                    : 'w-1.5 bg-neutral-200 hover:bg-neutral-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#033236] hover:bg-[#05454a] text-white border-b-[4px] border-[#022225] active:border-b-0 active:translate-y-[2px] font-extrabold text-[13px] tracking-[0.06em] uppercase transition-all"
          >
            {isLastSlide ? 'Create Account' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
