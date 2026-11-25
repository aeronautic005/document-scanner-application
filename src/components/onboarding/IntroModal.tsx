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
    <div className="fixed inset-0 z-50 bg-[#022225] flex items-center justify-center sm:p-6 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md min-h-screen sm:min-h-[680px] bg-[#033236] sm:rounded-[32px] sm:border sm:border-white/10 sm:shadow-2xl px-6 py-10 flex flex-col justify-between">
        {/* Top spacer for vertical centering */}
        <div className="h-6" />

        {/* Centerpiece: Logo + scanny wordmark + short tagline */}
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

        {/* Bottom Stacked Tactile Buttons (matching Duolingo reference) */}
        <div className="space-y-3 pt-8 pb-safe">
          <button
            type="button"
            onClick={onGetStarted}
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
};
