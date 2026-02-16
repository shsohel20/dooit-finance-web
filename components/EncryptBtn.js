'use client';

import { Lock, Unlock } from 'lucide-react';
import { useState } from 'react';

export function EncryptDecryptFAB() {
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsEncrypted(!isEncrypted);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        group fixed bottom-18 right-0 z-40 flex items-center  size-13
        rounded-md justify-center transition-all duration-300 ease-out
        ${
          isEncrypted
            ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-500'
            : 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-500'
        }
        hover:scale-110 active:scale-95 text-white border border-white/20
      `}
      aria-label={isEncrypted ? 'Decrypt data' : 'Encrypt data'}
    >
      {/* Background Shimmer Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Icon Container */}
      <div
        className={`transition-all duration-300 ${isAnimating ? 'scale-50 opacity-0 rotate-12' : 'scale-100 opacity-100'}`}
      >
        {isEncrypted ? (
          <Lock className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <Unlock className="h-5 w-5" strokeWidth={2.5} />
        )}
      </div>

      {/* Label Text */}
      {/* <span className="text-sm font-bold tracking-wide uppercase">
        {isEncrypted ? 'Secure' : 'Unlock'}
      </span> */}

      {/* Subtle Bottom Glow Ring */}
      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/30 group-hover:ring-white/50" />
    </button>
  );
}
