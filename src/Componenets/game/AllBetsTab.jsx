import React, { useState } from 'react';
import { User, Filter, ShieldCheck } from 'lucide-react';
import { sound } from '../../utils/audio.js';

export const AllBetsTab = ({
  currentPeriod,
  liveBets = [],
}) => {
  const [filter, setFilter] = useState('all');

  const totalRoundPool = liveBets.reduce((acc, b) => acc + b.amount, 0);

  let list = [...liveBets];
  if (filter === 'numbers') {
    list = list.filter((b) => b.choiceType === 'number');
  } else if (filter === 'colors') {
    list = list.filter((b) => b.choiceType === 'color');
  } else if (filter === 'sizes') {
    list = list.filter((b) => b.choiceType === 'size');
  }

  const userBets = list.filter((b) => b.isUser);
  const otherBets = list.filter((b) => !b.isUser);

  userBets.sort((a, b) => b.amount - a.amount || b.timestamp - a.timestamp);
  otherBets.sort((a, b) => b.amount - a.amount);

  const sortedAndFilteredBets = [...userBets, ...otherBets];
  const firstOtherIndex = sortedAndFilteredBets.findIndex((b) => !b.isUser);

  const renderBadge = (bet) => {
    if (bet.choiceType === 'number') {
      const n = parseInt(bet.choiceValue, 10);
      let bg = 'bg-[#fe4949]';
      if ([1, 3, 7, 9].includes(n)) bg = 'bg-[#00b977]';
      if (n === 0) bg = 'bg-gradient-to-r from-violet-600 to-[#fe4949]';
      if (n === 5) bg = 'bg-gradient-to-r from-[#00b977] to-violet-600';

      return (
        <span
          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-white text-[11px] font-bold shadow-2xs ${bg}`}
        >
          No. {n}
        </span>
      );
    }

    if (bet.choiceType === 'color') {
      const v = bet.choiceValue.toLowerCase();
      if (v === 'green') {
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-[#00b977] text-white text-[11px] font-bold shadow-2xs">
            Green
          </span>
        );
      }
      if (v === 'red') {
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-[#fe4949] text-white text-[11px] font-bold shadow-2xs">
            Red
          </span>
        );
      }
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-[#b245f7] text-white text-[11px] font-bold shadow-2xs">
          Violet
        </span>
      );
    }

    if (bet.choiceType === 'size') {
      const isBig = bet.choiceValue.toLowerCase() === 'big';
      return (
        <span
          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-white text-[11px] font-bold shadow-2xs ${
            isBig
              ? 'bg-gradient-to-r from-[#ff9900] to-[#ffa826]'
              : 'bg-gradient-to-r from-[#59a7ff] to-[#4596fa]'
          }`}
        >
          {isBig ? 'Big' : 'Small'}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gray-600 text-white text-[11px] font-bold">
        {bet.choiceLabel}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {/* Active Game ID & Pool Header */}
      <div className="bg-gradient-to-r from-[#008f53] to-[#0c7844] rounded-2xl p-3.5 text-white shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-100 uppercase font-semibold tracking-wider block">
              Active Game ID
            </span>
            <span className="text-xs sm:text-sm font-bold font-mono tracking-tight">
              {currentPeriod}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-100 block">Total Round Bets</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-yellow-300">
              ₹{totalRoundPool.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: 'All Bets' },
          { id: 'numbers', label: 'Number' },
          { id: 'colors', label: 'Colors' },
          { id: 'sizes', label: 'Big / Small' },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilter(tab.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#008f53] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Real-time All Bets Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100">
        <div className="bg-[#008f53] text-white text-xs font-bold py-2.5 px-3.5 grid grid-cols-12 items-center text-center select-none">
          <div className="col-span-5 text-left font-semibold pl-1">User</div>
          <div className="col-span-3 text-center font-semibold">Select</div>
          <div className="col-span-4 text-right font-semibold pr-1">Amount (₹)</div>
        </div>

        {sortedAndFilteredBets.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
              <Filter className="w-6 h-6" />
            </div>
            <p className="text-xs text-gray-500 font-medium">No bets placed in this category yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto no-scrollbar">
            {sortedAndFilteredBets.map((bet, index) => {
              const isTopOtherBet = !bet.isUser && index === firstOtherIndex;

              return (
                <div
                  key={bet.id}
                  className={`py-3 px-3.5 grid grid-cols-12 items-center text-xs transition-colors ${
                    bet.isUser
                      ? 'bg-amber-50/95 border-b border-amber-200/60 shadow-2xs'
                      : isTopOtherBet
                      ? 'bg-emerald-50/40 hover:bg-emerald-50'
                      : 'hover:bg-gray-50/80'
                  }`}
                >
                  <div className="col-span-5 flex items-center gap-2 min-w-0 pr-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                        bet.isUser
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-xs'
                          : isTopOtherBet
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {bet.isUser ? <ShieldCheck className="w-4 h-4" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex items-center gap-1 min-w-0">
                      <span
                        className={`font-semibold truncate text-xs ${
                          bet.isUser ? 'text-amber-900 font-black' : 'text-gray-800'
                        }`}
                      >
                        {bet.userName}
                      </span>
                      {isTopOtherBet && (
                        <span className="text-[9px] bg-emerald-600 text-white font-bold px-1 rounded shrink-0">
                          #1
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center justify-center">
                    {renderBadge(bet)}
                  </div>

                  <div className="col-span-4 flex items-center justify-end pl-1">
                    <span
                      className={`font-mono font-black text-xs sm:text-sm ${
                        bet.isUser
                          ? 'text-amber-800'
                          : isTopOtherBet
                          ? 'text-emerald-700'
                          : 'text-gray-900'
                      }`}
                    >
                      ₹{bet.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
