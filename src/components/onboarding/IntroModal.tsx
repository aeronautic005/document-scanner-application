import React from 'react';

interface IntroModalProps {
  onGetStarted: () => void;
  onAlreadyHaveAccount: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({
  onGetStarted,
  onAlreadyHaveAccount,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#f2f3f5] flex items-center justify-center sm:p-6 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md min-h-screen sm:min-h-[640px] bg-white sm:rounded-[32px] sm:border sm:border-neutral-200/80 sm:shadow-xl px-7 py-10 flex flex-col justify-between">
        {/* Top spacer for balanced vertical centering */}
        <div className="h-4" />

        {/* Centerpiece: Logo + scanny wordmark + short tagline */}
        <div className="flex flex-col items-center text-center space-y-5 my-auto">
          <img
            src="/scanny-logo.jpg"
            alt="Scanny logo"
            className="w-28 h-28 rounded-[28px] object-cover shadow-card border border-neutral-200/70"
          />

          <div className="space-y-2">
            <h1 className="font-brand font-semibold text-[38px] text-[#033236] tracking-[0.04em] lowercase leading-none">
              scanny
            </h1>
            <p className="text-[14px] font-medium text-neutral-500 max-w-[240px] mx-auto leading-relaxed">
              Scan, convert, and organize. Effortlessly.
            </p>
          </div>
        </div>

        {/* Bottom Stacked Action Buttons */}
        <div className="space-y-3 pt-8 pb-safe">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#033236] hover:bg-[#05454a] text-white font-extrabold text-[13px] tracking-[0.06em] uppercase shadow-soft active:scale-[0.99] transition-all touch-press"
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={onAlreadyHaveAccount}
            className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-[#f6f6f6] text-[#033236] border-2 border-neutral-200 font-extrabold text-[13px] tracking-[0.05em] uppercase active:scale-[0.99] transition-all touch-press"
          >
            I Already Have an Account
          </button>
        </div>
      </div>
    </div>
  );
};
