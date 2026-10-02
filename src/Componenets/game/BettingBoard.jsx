import React from 'react';
import { sound } from '../../utils/audio.js';
import { LotteryBall } from './LotteryBall.jsx';

export const BettingBoard = ({
  onSelectBet,
  isLocked,
  secondsRemaining,
}) => {
  const handlePick = (choice) => {
    if (isLocked) return;
    sound.playClick();
    onSelectBet(choice);
  };

  const showCountdownCards = secondsRemaining <= 5 && secondsRemaining > 0;

  return (
    <div className="px-3 mt-3">
      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-3.5 space-y-4 overflow-hidden">
        {/* Giant Green In-Board Countdown Cards */}
        {showCountdownCards && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center p-3 animate-in fade-in duration-100">
            <div className="flex items-center justify-center gap-3.5 select-none">
              <div className="w-24 sm:w-28 h-40 sm:h-44 bg-[#198a54] rounded-2xl flex items-center justify-center text-white text-8xl sm:text-9xl font-black font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif] shadow-xl tracking-tight leading-none">
                0
              </div>

              <div className="w-24 sm:w-28 h-40 sm:h-44 bg-[#198a54] rounded-2xl flex items-center justify-center text-white text-8xl sm:text-9xl font-black font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif] shadow-xl tracking-tight leading-none transition-transform">
                {secondsRemaining}
              </div>
            </div>
          </div>
        )}

        {/* Colors Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            disabled={isLocked}
            onClick={() =>
              handlePick({
                type: 'color',
                value: 'green',
                label: 'Green',
                multiplier: 2,
              })
            }
            className={`py-2 px-3 rounded-lg bg-[#00b977] hover:bg-[#00a86b] active:scale-95 text-white font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer ${
              isLocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-sm">Green</span>
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-sm">2X</span>
          </button>

          <button
            disabled={isLocked}
            onClick={() =>
              handlePick({
                type: 'color',
                value: 'violet',
                label: 'Violet',
                multiplier: 4.5,
              })
            }
            className={`py-2 px-3 rounded-lg bg-[#b245f7] hover:bg-[#a232ea] active:scale-95 text-white font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer ${
              isLocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-sm">Violet</span>
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-sm">4.5X</span>
          </button>

          <button
            disabled={isLocked}
            onClick={() =>
              handlePick({
                type: 'color',
                value: 'red',
                label: 'Red',
                multiplier: 2,
              })
            }
            className={`py-2 px-3 rounded-lg bg-[#fe4949] hover:bg-[#e83b3b] active:scale-95 text-white font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer ${
              isLocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-sm">Red</span>
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-sm">2X</span>
          </button>
        </div>

        {/* Number Balls Grid (0 to 9) */}
        <div className="bg-[#f6f7f9] p-3 rounded-2xl grid grid-cols-5 gap-y-3 gap-x-1.5 border border-gray-100/70">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            return (
              <div key={num} className="flex flex-col items-center">
                <button
                  disabled={isLocked}
                  onClick={() =>
                    handlePick({
                      type: 'number',
                      value: String(num),
                      label: `Number ${num}`,
                      multiplier: 9,
                    })
                  }
                  className={`transition-transform active:scale-95 cursor-pointer p-0.5 rounded-full ${
                    isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  title={`Bet on Number ${num} (9X)`}
                >
                  <LotteryBall number={num} size={54} />
                </button>
                <span className="text-[12px] text-gray-500 font-normal tracking-tight mt-0.5">
                  9X
                </span>
              </div>
            );
          })}
        </div>

        {/* Big / Small Dual Button */}
        <div className="grid grid-cols-2 rounded-full overflow-hidden shadow-xs">
          <button
            disabled={isLocked}
            onClick={() =>
              handlePick({
                type: 'size',
                value: 'big',
                label: 'Big (5-9)',
                multiplier: 2,
              })
            }
            className={`py-2.5 px-4 bg-gradient-to-r from-[#ff9900] to-[#ffa826] hover:from-[#f08f00] hover:to-[#f09f20] active:scale-98 text-white font-extrabold flex items-center justify-between transition cursor-pointer ${
              isLocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-sm tracking-wide">Big</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">2X</span>
          </button>

          <button
            disabled={isLocked}
            onClick={() =>
              handlePick({
                type: 'size',
                value: 'small',
                label: 'Small (0-4)',
                multiplier: 2,
              })
            }
            className={`py-2.5 px-4 bg-gradient-to-r from-[#59a7ff] to-[#4596fa] hover:from-[#479bf2] hover:to-[#3688ed] active:scale-98 text-white font-extrabold flex items-center justify-between transition cursor-pointer ${
              isLocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-sm tracking-wide">Small</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">2X</span>
          </button>
        </div>
      </div>
    </div>
  );
};
