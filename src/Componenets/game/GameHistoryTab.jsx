import React, { useState } from 'react';
import { sound } from '../../utils/audio.js';

export const GameHistoryTab = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(history.length / pageSize));

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = history.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100">
      {/* Table Header */}
      <div className="bg-[#008f53] text-white text-xs font-bold py-2.5 px-4 grid grid-cols-12 text-center items-center">
        <div className="col-span-4 text-left">Period</div>
        <div className="col-span-2">Number</div>
        <div className="col-span-3">Big Small</div>
        <div className="col-span-3">Color</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-100">
        {currentItems.map((item, idx) => {
          const num = item.number;
          const is0 = num === 0;
          const is5 = num === 5;
          const isGreen = [1, 3, 7, 9].includes(num);

          let numColor = 'text-[#fe4949]';
          if (isGreen) numColor = 'text-[#00b977]';
          if (is0) numColor = 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-[#fe4949]';
          if (is5) numColor = 'text-transparent bg-clip-text bg-gradient-to-r from-[#00b977] to-violet-600';

          return (
            <div
              key={`${item.period}-${idx}`}
              className="py-3 px-4 grid grid-cols-12 text-center items-center text-xs font-medium hover:bg-gray-50/80 transition-colors"
            >
              <div className="col-span-4 text-left font-mono text-gray-600 font-semibold tracking-tight">
                {item.period}
              </div>

              <div className="col-span-2">
                <span className={`text-xl font-black ${numColor}`}>
                  {num}
                </span>
              </div>

              <div className="col-span-3 text-gray-700 font-medium">
                {item.bigSmall}
              </div>

              <div className="col-span-3 flex items-center justify-center gap-1.5">
                {item.colors.map((c, colorIdx) => {
                  let dotColor = 'bg-[#fe4949]';
                  if (c === 'green') dotColor = 'bg-[#00b977]';
                  if (c === 'violet') dotColor = 'bg-[#b55fe6]';

                  return (
                    <span
                      key={colorIdx}
                      className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-xs`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="py-3.5 flex items-center justify-center gap-4 bg-white border-t border-gray-100">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            sound.playClick();
            setCurrentPage((p) => Math.max(1, p - 1));
          }}
          className="w-9 h-9 rounded-md bg-[#e0e0e0] hover:bg-[#d4d4d4] flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:hover:bg-[#e0e0e0] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15 18 9 12 15 6" />
          </svg>
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
          <svg className="w-5 h-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
