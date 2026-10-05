import { useState } from 'react';
import { RotateCw, Flame } from 'lucide-react';
import { sound } from '../../utils/audio.js';
import { useColor } from '../../context/ColorContext.jsx';


export const WalletHeader = () => {
  const [isRotating, setIsRotating] = useState(false);
    const { dashboard } = useColor();

  const handleRefresh = () => {
    sound.playClick();
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <div className="w-full select-none bg-[#0c7844] rounded-b-[28px] pt-1 pb-3.5 px-3 shadow-md">
      {/* White Wallet Balance Card */}
      <div className="bg-white rounded-2xl pt-4 pb-4 px-4 shadow-sm flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 max-w-full">
          <span className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight font-sans truncate">
            ₹{dashboard?.currentamt}
          </span>
          <button
            onClick={handleRefresh}
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 cursor-pointer"
            title="Refresh balance"
          >
            <RotateCw
              className={`w-4 h-4 stroke-[2.2] transition-transform duration-500 ${
                isRotating ? 'rotate-180 text-[#0c7844]' : ''
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          <svg className="w-5 h-4 shrink-0" viewBox="0 0 20 16" fill="none">
            <rect x="0" y="2" width="20" height="14" rx="2.5" fill="#359266" />
            <path d="M13 6h7v6h-7a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" fill="#297753" />
            <circle cx="16.5" cy="9" r="1.2" fill="#86efac" />
            <path d="M2 2C2 1 3 0 5 0h10c2 0 3 1 3 2H2z" fill="#2d7e58" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Wallet balance</span>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mt-4">
          <button
            className=" w-full py-2.5 px-4 rounded-full  border-2 border-[#097b42] text-[#097b42] text-sm font-bold transition cursor-pointer text-center" style={{background: "#e6eae1"}}
          >
            Withdraw
          </button>

          <button
            className="w-full py-2.5 px-4 rounded-full bg-[#0c7844] hover:bg-[#0a673a] active:bg-[#085630] text-white text-sm font-bold shadow-xs transition cursor-pointer text-center"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* Notice Speaker Bar - Continuous Marquee */}
      <div className="mt-3 bg-white rounded-full py-2 px-3.5 flex items-center justify-between shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2 relative min-w-0">
          <span className="text-[#4ade80] shrink-0  bg-white pr-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </span>

          <div className="overflow-hidden whitespace-nowrap flex-1 flex items-center">
            <span className="text-xs text-gray-700 font-normal inline-block animate-marquee">
              Say Goodbye to Bank Delays – Try UPI &amp; Crypto Quick Withdrawals! ⚡ 24/7 Fast Payouts &amp; Highest Multipliers on AD689!
            </span>
          </div>
        </div>

        <button
          className="shrink-0  flex items-center gap-1 bg-[#137841] hover:bg-[#0f6436] text-white text-xs font-semibold px-3 py-1 rounded-full cursor-pointer shadow-xs transition"
        >
          <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>Detail</span>
        </button>
      </div>
    </div>
  );
};
