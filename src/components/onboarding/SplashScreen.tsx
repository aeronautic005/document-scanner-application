import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 1800,
}) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, Math.max(400, durationMs - 350));

    const finishTimer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-[70] bg-white flex flex-col items-center justify-center select-none cursor-pointer transition-opacity duration-350 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-4 animate-splash-pop">
        <img
          src="/scanny-logo.jpg"
          alt="Scanny logo"
          className="w-28 h-28 rounded-[28px] object-cover shadow-card border border-neutral-100"
        />
        <h1 className="font-brand font-semibold text-[34px] text-[#033236] tracking-[0.04em] lowercase leading-none">
          scanny
        </h1>
      </div>
    </div>
  );
};
