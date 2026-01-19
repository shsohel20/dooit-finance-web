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
    }, 300);
  };

  return (
    <button
      onClick={handleToggle}
      className="group fixed bottom-20 -right-[110px] z-40 flex h-10 w-40 items-center gap-3 rounded-l-full bg-primary px-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 hover:-right-2"
      aria-label={isEncrypted ? 'Decrypt data' : 'Encrypt data'}
    >
      <div
        className={`transition-transform duration-300 ${isAnimating ? 'rotate-180 scale-90' : ''}`}
      >
        {isEncrypted ? (
          <Unlock className="h-5 w-5 text-white" />
        ) : (
          <Lock className="h-5 w-5 text-white" />
        )}
      </div>
      <span className="text-sm font-semibold text-white">
        {isEncrypted ? 'Decrypt' : 'Encrypt'}
      </span>
      <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
    </button>
  );
}
