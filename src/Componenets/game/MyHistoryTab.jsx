import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audio.js';

export const MyHistoryTab = ({ bets }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const displayBets =
    bets && bets.length > 0
      ? bets
      : [
          {
            id: 'mock-1',
            period: '2026092300970',
            mode: '30s',
            betType: 'number',
            betValue: '9',
            betLabel: '9',
            amount: 100.0,
            multiplier: 1,
            timestamp: 1727099059000,
            status: 'pending',
          },
          {
            id: 'mock-2',
            period: '2026092300968',
            mode: '30s',
            betType: 'number',
            betValue: '7',
            betLabel: '7',
            amount: 300.0,
            multiplier: 3,
            timestamp: 1727093276000,
            status: 'lost',
            resultNumber: 2,
          },
          {
            id: 'mock-3',
            period: '2026092300968',
            mode: '30s',
            betType: 'number',
            betValue: '4',
            betLabel: '4',
            amount: 300.0,
            multiplier: 3,
            timestamp: 1727093271000,
            status: 'lost',
            resultNumber: 2,
          },
        ];

  const totalPages = Math.max(1, Math.ceil(displayBets.length / pageSize));
  const currentItems = displayBets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDateTime = (ts) => {
    const d = new Date(ts);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const getBadgeStyle = (bet) => {
    if (bet.betType === 'number') {
      const n = parseInt(bet.betValue, 10);
      if (n === 0) return { bg: 'bg-[#fe4949]', text: `${n}` };
      if (n === 5) return { bg: 'bg-[#00b977]', text: `${n}` };
      if ([1, 3, 7, 9].includes(n)) return { bg: 'bg-[#48c057]', text: `${n}` };
      return { bg: 'bg-[#fb4e4e]', text: `${n}` };
    }
    if (bet.betType === 'color') {
      if (bet.betValue === 'green') return { bg: 'bg-[#48c057]', text: 'G' };
      if (bet.betValue === 'red') return { bg: 'bg-[#fb4e4e]', text: 'R' };
      return { bg: 'bg-[#b245f7]', text: 'V' };
    }
    if (bet.betType === 'size') {
      if (bet.betValue.toLowerCase() === 'big') return { bg: 'bg-[#f5a623]', text: 'B' };
      return { bg: 'bg-[#4a90e2]', text: 'S' };
    }
    return { bg: 'bg-[#48c057]', text: bet.betValue };
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100/80">
      <div className="divide-y divide-gray-100">
        {currentItems.map((bet) => {
          const badge = getBadgeStyle(bet);
          const isWon = bet.status === 'won';
          const isLost = bet.status === 'lost';
          const isPending = bet.status === 'pending';

          return (
            <div
              key={bet.id}
              className="py-3.5 px-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-xs shrink-0 ${badge.bg}`}
                >
                  {badge.text}
                </div>

                <div className="flex flex-col">
                  <span className="text-[14px] text-gray-800 font-normal tracking-tight">
                    {bet.period}
                  </span>
                  <span className="text-[12px] text-gray-400 font-normal mt-0.5">
                    {formatDateTime(bet.timestamp)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                {isLost && (
                  <>
                    <span className="border border-[#ff4d4f] text-[#ff4d4f] bg-white text-[11px] px-3.5 py-0.5 rounded-md font-normal text-center min-w-[62px]">
                      Lose
                    </span>
                    <span className="text-[#ff4d4f] text-sm font-normal mt-1">
                      -₹{bet.amount.toFixed(2)}
                    </span>
                  </>
                )}

                {isWon && (
                  <>
                    <span className="border border-[#52c41a] text-[#52c41a] bg-white text-[11px] px-3.5 py-0.5 rounded-md font-normal text-center min-w-[62px]">
                      Win
                    </span>
                    <span className="text-[#52c41a] text-sm font-normal mt-1">
                      +₹{(bet.winAmount || bet.amount * 2).toFixed(2)}
                    </span>
                  </>
                )}

                {isPending && (
                  <>
                    <span className="border border-[#faad14] text-[#faad14] bg-white text-[11px] px-3.5 py-0.5 rounded-md font-normal text-center min-w-[62px]">
                      Pending
                    </span>
                    <span className="text-gray-500 text-sm font-normal mt-1">
                      ₹{bet.amount.toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="py-4 flex items-center justify-center gap-4 bg-white border-t border-gray-100">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            sound.playClick();
            setCurrentPage((p) => Math.max(1, p - 1));
          }}
          className="w-9 h-9 rounded-md bg-[#e0e0e0] hover:bg-[#d4d4d4] flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:hover:bg-[#e0e0e0] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <span className="text-xs text-gray-700 font-normal">
          {currentPage}/{totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => {
            sound.playClick();
            setCurrentPage((p) => Math.min(totalPages, p + 1));
          }}
          className="w-9 h-9 rounded-md bg-[#e0e0e0] hover:bg-[#d4d4d4] flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:hover:bg-[#e0e0e0] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
