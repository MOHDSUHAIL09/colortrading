import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { X, Check } from 'lucide-react';
import { sound } from '../../utils/audio.js';

export const WinResultModal = ({
  evaluatedBets = [],
  latestResult,
  onClose,
}) => {
  const [autoCloseSec, setAutoCloseSec] = useState(3);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const totalWon = evaluatedBets
    .filter((b) => b.status === 'won')
    .reduce((acc, curr) => acc + (curr.winAmount || 0), 0);

  const isWinner = totalWon > 0;
  const betMode = evaluatedBets[0]?.mode || '30s';
  const modeLabel = betMode === '1m' ? 'WinGo 1 minute' : 'WinGo 30sec';

  useEffect(() => {
    const timeout = setTimeout(() => {
      onCloseRef.current();
    }, 3000);

    const interval = setInterval(() => {
      setAutoCloseSec((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isWinner) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ffb703', '#ff5a43', '#00b977', '#b55fe6', '#ffffff'],
        });
      } catch {}
    }
  }, [isWinner]);

  if (evaluatedBets.length === 0 || !latestResult) return null;

  const num = latestResult.number;
  const primaryColor = latestResult.colors[0] || 'red';
  const colorCapitalized = primaryColor.charAt(0).toUpperCase() + primaryColor.slice(1);

  return (
    // ✅ absolute inset-0 — game-page-inner ke andar center
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="relative w-full max-w-[315px] flex flex-col items-center">
        {/* Top Winged Rocket Badge */}
        <div className="relative z-20 w-52 h-28 -mb-14 select-none flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 240 140" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              {isWinner ? (
                <>
                  <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff2a3" />
                    <stop offset="35%" stopColor="#f59e0b" />
                    <stop offset="75%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#92400e" />
                  </linearGradient>
                  <linearGradient id="wingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="45%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="wingGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <linearGradient id="ribbonMain" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="25%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="75%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="ribbonBack" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </>
              ) : (
                <>
                  <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#e3f0fc" />
                    <stop offset="65%" stopColor="#9fc3e6" />
                    <stop offset="100%" stopColor="#6797c5" />
                  </linearGradient>
                  <linearGradient id="wingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#d5e8fb" />
                    <stop offset="100%" stopColor="#9ec4e8" />
                  </linearGradient>
                  <linearGradient id="wingGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#eaf4ff" />
                    <stop offset="55%" stopColor="#b9d8f5" />
                    <stop offset="100%" stopColor="#7ca7d2" />
                  </linearGradient>
                  <linearGradient id="ribbonMain" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#90b8df" />
                    <stop offset="25%" stopColor="#e7f3ff" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="75%" stopColor="#e7f3ff" />
                    <stop offset="100%" stopColor="#90b8df" />
                  </linearGradient>
                  <linearGradient id="ribbonBack" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#608ab5" />
                    <stop offset="100%" stopColor="#436c97" />
                  </linearGradient>
                </>
              )}
            </defs>

            <path d="M 85 65 C 55 50, 32 40, 16 48 C 12 58, 38 74, 76 75 Z" fill="url(#wingGrad2)" />
            <path d="M 80 52 C 55 35, 26 22, 6 34 C 8 46, 35 60, 72 62 Z" fill="url(#wingGrad1)" />
            <path d="M 78 38 C 58 20, 32 10, 18 20 C 22 30, 48 44, 70 47 Z" fill="url(#wingGrad2)" />
            <path d="M 75 25 C 60 12, 42 4, 30 14 C 36 22, 58 32, 68 35 Z" fill="url(#wingGrad1)" />

            <path d="M 155 65 C 185 50, 208 40, 224 48 C 228 58, 202 74, 164 75 Z" fill="url(#wingGrad2)" />
            <path d="M 160 52 C 185 35, 214 22, 234 34 C 232 46, 205 60, 168 62 Z" fill="url(#wingGrad1)" />
            <path d="M 162 38 C 182 20, 208 10, 222 20 C 218 30, 192 44, 170 47 Z" fill="url(#wingGrad2)" />
            <path d="M 165 25 C 180 12, 198 4, 210 14 C 204 22, 182 32, 172 35 Z" fill="url(#wingGrad1)" />

            <polygon points="45,95 25,115 48,110" fill="url(#ribbonBack)" />
            <polygon points="195,95 215,115 192,110" fill="url(#ribbonBack)" />

            <path
              d="M 68 85 C 45 88, 28 94, 20 102 L 35 110 L 22 120 C 35 118, 52 108, 70 98 Z"
              fill="url(#ribbonMain)"
              filter="drop-shadow(0 2px 2px rgba(0,0,0,0.15))"
            />
            <path
              d="M 172 85 C 195 88, 212 94, 220 102 L 205 110 L 218 120 C 205 118, 188 108, 170 98 Z"
              fill="url(#ribbonMain)"
              filter="drop-shadow(0 2px 2px rgba(0,0,0,0.15))"
            />
            <path
              d="M 38 88 C 65 78, 100 76, 120 76 C 140 76, 175 78, 202 88 C 185 99, 155 104, 120 104 C 85 104, 55 99, 38 88 Z"
              fill="url(#ribbonMain)"
              filter="drop-shadow(0 2px 3px rgba(0,0,0,0.18))"
            />

            <circle cx="120" cy="55" r="37" fill="url(#crestGrad)" />
            <circle cx="120" cy="55" r="33" fill={isWinner ? '#f59e0b' : '#99bfdf'} stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="120" cy="55" r="28" fill={isWinner ? '#fbbf24' : '#b2d2ed'} stroke={isWinner ? '#d97706' : '#7fa6ce'} strokeWidth="1.2" />

            <g transform="translate(104, 37) scale(1.35)">
              <path d="M 12 2 C 12 2 17 6 17 14 C 17 17.5 16 20.5 16 20.5 L 8 20.5 C 8 20.5 7 17.5 7 14 C 7 6 12 2 12 2 Z" fill="#ffffff" />
              <path d="M 8 15 L 3.5 19.5 L 7 20.5 Z" fill="#ffffff" />
              <path d="M 16 15 L 20.5 19.5 L 17 20.5 Z" fill="#ffffff" />
              <circle cx="12" cy="12" r="3.2" fill={isWinner ? '#f59e0b' : '#739fc8'} />
              <polygon points="12,10 13.2,12 11.8,12 12.8,14.5 10.8,12.5 12,12.5" fill="#ffffff" />
              <path d="M 10 21 C 10 21 12 24 12 24 C 12 24 14 21 14 21 Z" fill="#ffffff" />
            </g>
          </svg>
        </div>

        {/* Main Modal Card */}
        <div
          className={`w-full rounded-[30px] pt-14 pb-5 px-4 shadow-2xl relative text-center border-2 border-white/60 ${
            isWinner
              ? 'bg-gradient-to-b from-[#ff5e46] via-[#ff5037] to-[#ff422c]'
              : 'bg-gradient-to-b from-[#cae0f8] via-[#b6d4f4] to-[#a2c7ed]'
          }`}
        >
          <h2 className="text-3xl font-black text-white tracking-wide text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)] mt-1 mb-3">
            {isWinner ? 'Congratulations' : 'Sorry'}
          </h2>

          <div className="flex items-center justify-center gap-1.5 mb-4 select-none">
            <span className="text-[13px] font-semibold text-white drop-shadow-xs mr-1">
              Lottery results
            </span>
            <span className="px-3 py-0.5 rounded-lg bg-[#f84d43] text-white text-[12px] font-bold shadow-xs">
              {colorCapitalized}
            </span>
            <span className="w-6 h-6 rounded-md bg-[#f84d43] text-white text-[12px] font-black flex items-center justify-center shadow-xs">
              {num}
            </span>
            <span className="px-3 py-0.5 rounded-lg bg-[#f84d43] text-white text-[12px] font-bold shadow-xs">
              {latestResult.bigSmall}
            </span>
          </div>

          <div className="w-[88%] mx-auto bg-white/40 p-0.5 rounded-full shadow-inner border border-white/60">
            <div
              className={`h-4.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)] ${
                isWinner ? 'bg-[#871d10]' : 'bg-[#6d94be]'
              }`}
            />
          </div>

          <div className="relative -mt-2.5 mx-2.5 z-10">
            <div
              className="bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#eef5fc] pt-5 pb-4 px-3 text-center shadow-xl border-t border-white"
              style={{
                clipPath: 'polygon(2% 0%, 98% 0%, 100% 88%, 97% 100%, 3% 100%, 0% 88%)',
                borderRadius: '0 0 16px 16px',
              }}
            >
              {isWinner ? (
                <>
                  <div className="text-[12px] font-extrabold text-[#ff5b47] tracking-wider uppercase">
                    Bonus
                  </div>
                  <div className="text-3xl font-black text-[#f85243] my-1 font-sans tracking-tight">
                    ₹{totalWon.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] font-semibold text-gray-500 mt-1">
                    Period: {modeLabel}
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 font-semibold tracking-tight mt-0.5">
                    {latestResult.period}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-black text-[#3a5e88] my-1 font-sans tracking-tight">
                    Lose
                  </div>
                  <div className="text-[11px] text-[#718296] font-medium tracking-tight mt-1">
                    Period:{modeLabel} {latestResult.period}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5 text-white text-xs font-semibold select-none">
            {isWinner ? (
              <div className="w-4.5 h-4.5 rounded-full bg-white/25 border border-white/70 flex items-center justify-center text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-white/80 bg-white/10" />
            )}
            <span>{autoCloseSec} seconds auto close</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="mt-3.5 w-10 h-10 rounded-full border-2 border-white bg-black/25 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer transition active:scale-90 shadow-lg"
          title="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};