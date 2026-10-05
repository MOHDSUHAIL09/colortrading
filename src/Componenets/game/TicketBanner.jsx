// File: src/components/TicketBanner.jsx

import React from 'react';
import { BookOpen } from 'lucide-react';
import { sound } from '../../utils/audio.js';
import { LotteryBall } from './LotteryBall.jsx';
import { useColor } from '../../context/ColorContext.jsx';

export const TicketBanner = ({
  modeName,
  secondsRemaining,   // ✅ Context se aa raha hai (Game.jsx se prop)
  onOpenRules,
}) => {
  // ✅ Context se dashboard + gameResults
  const { dashboard, gameResults } = useColor();

  // ===================== TIME CALCULATION =====================
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  // ===================== 5 RECENT RESULTS =====================
  const displayBalls = (gameResults || []).slice(0, 5);

  // ===================== CHAMFER STYLE =====================
  const chamferStyle = {
    clipPath:
      'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)',
  };

  return (
    <div className="px-3 pt-2">
      <div className="relative overflow-hidden rounded-2xl bg-[#0c7844] text-white shadow-md p-3.5">
        {/* Ticket Perforated Cutouts */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full bg-[#f4f7f6] -mt-2 shrink-0 shadow-inner" />
          <div className="w-[1px] h-full border-l border-dashed border-white/35 my-0.5" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#f4f7f6] -mb-2 shrink-0 shadow-inner" />
        </div>

        {/* 2-Column Content Layout */}
        <div className="flex items-center justify-between relative w-full">
          {/* ===================== LEFT SECTION ===================== */}
          <div className="w-1/2 pr-3 flex flex-col items-start justify-center min-w-0">
            <button
              onClick={() => {
                sound.playClick();
                onOpenRules();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-white/50 bg-black/15 hover:bg-black/25 text-[11px] font-semibold text-white tracking-wide transition cursor-pointer shrink-0"
            >
              <BookOpen className="w-3 h-3" />
              <span>How to play</span>
            </button>

            <div className="text-[12px] sm:text-[13px] font-bold text-white mt-1.5 truncate w-full">
              {modeName || 'WinGo 30 second'}
            </div>

            {/* ✅ 5 Recent Results — Number Balls */}
            <div className="flex items-center gap-1 mt-2 overflow-x-hidden">
              {displayBalls.length === 0 ? (
                <span className="text-[10px] text-white/60">No results</span>
              ) : (
                displayBalls.map((item, idx) => (
                  <div
                    key={item.gameid || item.id || idx}
                    className="shrink-0"
                    title={`Period ${item.gameid} • Number ${item.betnumber}`}
                  >
                    <LotteryBall number={Number(item.betnumber)} size={23} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ===================== RIGHT SECTION — TIMER ===================== */}
          <div className="w-1/2 pl-3 flex flex-col items-end justify-center min-w-0">
            <span className="text-[11px] font-semibold text-[#a7f3d0] mb-1">
              Time remaining
            </span>

            <div className="flex items-center gap-1 mb-1.5 shrink-0">
              {/* Minutes tens digit */}
              <div
                style={chamferStyle}
                className="w-4.5 h-6.5 bg-white flex items-center justify-center text-base font-black text-[#0c7844] shadow-xs"
              >
                {mStr[0]}
              </div>
              {/* Minutes ones digit */}
              <div
                style={chamferStyle}
                className="w-4.5 h-6.5 bg-white flex items-center justify-center text-base font-black text-[#0c7844] shadow-xs"
              >
                {mStr[1]}
              </div>
              {/* Colon dots */}
              <div className="flex flex-col gap-1 px-0.5 justify-center">
                <span className="w-1 h-1 bg-[#a7f3d0] rounded-xs" />
                <span className="w-1 h-1 bg-[#a7f3d0] rounded-xs" />
              </div>
              {/* Seconds tens digit */}
              <div
                style={chamferStyle}
                className="w-4.5 h-6.5 bg-white flex items-center justify-center text-base font-black text-[#0c7844] shadow-xs"
              >
                {sStr[0]}
              </div>
              {/* Seconds ones digit */}
              <div
                style={chamferStyle}
                className="w-4.5 h-6.5 bg-white flex items-center justify-center text-base font-black text-[#0c7844] shadow-xs"
              >
                {sStr[1]}
              </div>
            </div>

            {/* Game ID */}
            <div className="text-[12px] sm:text-[13px] font-bold tracking-tight text-white select-all">
              {dashboard?.gameid || '------------'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};