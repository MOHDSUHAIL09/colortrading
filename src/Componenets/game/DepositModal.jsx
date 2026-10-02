import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';
import { sound } from '../../utils/audio.js';

export const DepositModal = ({
  isOpen,
  onClose,
  onDepositSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [channel, setChannel] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [100, 300, 500, 1000, 2000, 5000];

  const handleDeposit = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (isNaN(finalAmount) || finalAmount < 50) {
      alert('Minimum deposit is ₹50');
      return;
    }
    sound.playClick();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onDepositSuccess(finalAmount);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#0c7844] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base">Deposit / Recharge</h3>
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
        <div className="p-4 space-y-4 text-xs">
          {/* Channel selector */}
          <div>
            <label className="font-bold text-gray-700 block mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setChannel('upi');
                }}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition cursor-pointer ${
                  channel === 'upi'
                    ? 'border-[#0c7844] bg-emerald-50 text-[#0c7844]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${channel === 'upi' ? 'opacity-100' : 'opacity-0'}`} />
                UPI Express (0% fee)
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setChannel('usdt');
                }}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition cursor-pointer ${
                  channel === 'usdt'
                    ? 'border-[#0c7844] bg-emerald-50 text-[#0c7844]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${channel === 'usdt' ? 'opacity-100' : 'opacity-0'}`} />
                Crypto / USDT
              </button>
            </div>
          </div>

          {/* Quick Amounts */}
          <div>
            <label className="font-bold text-gray-700 block mb-2">Select Amount</label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => {
                const isSelected = selectedAmount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl font-bold border transition cursor-pointer ${
                      isSelected
                        ? 'border-[#0c7844] bg-[#0c7844] text-white shadow-xs'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">Or Enter Other Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="50 - 50,000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:border-[#0c7844] focus:outline-hidden text-sm font-semibold"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted payment. Instant balance credit.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleDeposit}
            disabled={isProcessing}
            className="w-full py-2.5 bg-[#0c7844] hover:bg-[#0a673a] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isProcessing ? 'Processing...' : `Confirm Deposit ₹${customAmount || selectedAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
};
