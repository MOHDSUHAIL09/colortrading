import React from 'react';
import { X, HelpCircle, ShieldAlert } from 'lucide-react';
import { sound } from '../../utils/audio.js';

export const HowToPlayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#0c7844] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">Game Rules &amp; Payouts</h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-gray-600">
          <section className="space-y-1">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0c7844]"></span>
              Timing &amp; Draw Mechanics
            </h4>
            <p>
              In WinGo, each round runs on a set timer (e.g. 30 seconds, 1 minute). When the countdown reaches 5 seconds, betting is locked and the last 5 seconds count down to reveal the winning result.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0c7844]"></span>
              Colors &amp; Numbers
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="font-bold text-emerald-700 block">Green (1, 3, 7, 9)</span>
                <span>2X multiplier. If 5 appears, payout is 1.5X.</span>
              </div>
              <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                <span className="font-bold text-red-700 block">Red (2, 4, 6, 8)</span>
                <span>2X multiplier. If 0 appears, payout is 1.5X.</span>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                <span className="font-bold text-purple-700 block">Violet (0, 5)</span>
                <span>4.5X multiplier for zero or five.</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                <span className="font-bold text-amber-700 block">Numbers (0 - 9)</span>
                <span>Exact number match gives 9X payout!</span>
              </div>
            </div>
          </section>

          <section className="space-y-1">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0c7844]"></span>
              Big / Small Rules
            </h4>
            <p>
              <strong className="text-gray-800">Big:</strong> Numbers 5, 6, 7, 8, 9 (2X payout).<br />
              <strong className="text-gray-800">Small:</strong> Numbers 0, 1, 2, 3, 4 (2X payout).
            </p>
          </section>

          <section className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[11px] flex gap-2 items-start">
            <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-800 block">Service Fee</span>
              <span>A 2% platform handling fee is deducted on contract entry.</span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-right">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-[#0c7844] hover:bg-[#0a673a] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
