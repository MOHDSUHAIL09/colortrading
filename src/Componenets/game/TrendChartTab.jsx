import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audio.js';

export const TrendChartTab = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(history.length / pageSize));
  const currentRows = history.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const ROW_HEIGHT = 42;
  const SLOT_WIDTH = 20;

  const polylinePoints = currentRows
    .map((row, idx) => {
      const cx = row.number * SLOT_WIDTH + SLOT_WIDTH / 2;
      const cy = idx * ROW_HEIGHT + ROW_HEIGHT / 2;
      return `${cx},${cy}`;
    })
    .join(' ');

  const getWinningBadgeStyle = (num) => {
    if (num === 0) {
      return 'bg-gradient-to-br from-[#ef4444] 50% to-[#9333ea] 50% text-white';
    }
    if (num === 5) {
      return 'bg-gradient-to-br from-[#10b981] 50% to-[#9333ea] 50% text-white';
    }
    if ([1, 3, 7, 9].includes(num)) {
      return 'bg-[#00b977] text-white';
    }
    return 'bg-[#fe4949] text-white';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100/80 select-none">
      {/* Table Header Row */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500">
        <span className="w-[105px]">Period</span>
        <span style={{ width: `${SLOT_WIDTH * 10}px` }} className="text-center">
          Number
        </span>
        <span className="w-8 text-right">Result</span>
      </div>

      {/* Chart Rows Container */}
      <div className="relative overflow-x-auto no-scrollbar">
        <div className="min-w-[340px] relative divide-y divide-gray-100">
          {currentRows.map((row, idx) => {
            const winNum = row.number;
            const isBig = winNum >= 5;

            

            return (
              <div
                key={`${row.period}-${idx}`}
                className="flex items-center justify-between px-3 hover:bg-gray-50/50 transition-colors"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                <div className="w-[105px] text-[11.5px] text-gray-700 font-normal tracking-tight truncate select-all">
                  {row.period}
                </div>

                <div
                  className="relative flex items-center justify-between shrink-0"
                  style={{ width: `${SLOT_WIDTH * 10}px`, height: `${ROW_HEIGHT}px` }}
                >
                  {idx === 0 && (
                    <div
                      className="absolute left-0 top-0 pointer-events-none z-10"
                      style={{
                        width: `${SLOT_WIDTH * 10}px`,
                        height: `${currentRows.length * ROW_HEIGHT}px`,
                      }}
                    >
                      <svg
                        width={SLOT_WIDTH * 10}
                        height={currentRows.length * ROW_HEIGHT}
                        className="overflow-visible"
                      >
                        {currentRows.length > 1 && (
                          <polyline
                            points={polylinePoints}
                            fill="none"
                            stroke="#ff2d2d"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </svg>
                    </div>
                  )}

                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                    const isWinner = n === winNum;

                    return (
                      <div
                        key={n}
                        className="flex items-center justify-center shrink-0 relative z-20"
                        style={{ width: `${SLOT_WIDTH}px`, height: `${ROW_HEIGHT}px` }}
                      >
                        {isWinner ? (
                          <div
                            className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10.5px] font-black shadow-xs ${getWinningBadgeStyle(
                              n
                            )}`}
                          >
                            {n}
                          </div>
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full border border-gray-200 text-gray-400 flex items-center justify-center text-[10px] font-normal leading-none">
                            {n}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="w-8 flex items-center justify-end shrink-0">
                  {isBig ? (
                    <div className="w-[19px] h-[19px] rounded-md bg-[#f39800] text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                      B
                    </div>
                  ) : (
                    <div className="w-[19px] h-[19px] rounded-md bg-[#2083fc] text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                      S
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="py-3 flex items-center justify-center gap-3 bg-white border-t border-gray-100">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            sound.playClick();
            setCurrentPage((p) => Math.max(1, p - 1));
          }}
          className="w-8 h-8 rounded-md bg-[#f0f2f5] hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:hover:bg-[#f0f2f5] transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <span className="text-xs text-gray-700 font-medium px-2">
          {currentPage}/{totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => {
            sound.playClick();
            setCurrentPage((p) => Math.min(totalPages, p + 1));
          }}
          className="w-8 h-8 rounded-md bg-[#f0f2f5] hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:hover:bg-[#f0f2f5] transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
