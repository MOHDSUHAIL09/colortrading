import React, { useState } from 'react';
import { X, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { sound } from '../../utils/audio.js';

export const WithdrawModal = ({
  isOpen,
  balance,
  onClose,
  onWithdrawSuccess,
}) => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const serviceFee = (numAmount * 0.03).toFixed(2);
  const receiveAmount = Math.max(0, numAmount - parseFloat(serviceFee)).toFixed(2);

  const handleWithdraw = () => {
    if (!upiId || !accountName) {
      alert('Please fill in UPI ID and account name');
      return;
    }
    if (numAmount < 100) {
      alert('Minimum withdrawal is ₹100');
      return;
    }
    if (numAmount > balance) {
      alert('Withdrawal amount cannot exceed current balance');
      return;
    }

    sound.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onWithdrawSuccess(numAmount);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#0c7844] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">Withdraw Funds</h3>
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
        <div className="p-4 space-y-3.5 text-xs">
          {/* Balance info */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
            <span className="text-gray-500 font-medium">Available Balance</span>
            <span className="text-base font-extrabold text-[#0c7844]">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Beneficiary Name</label>
            <input
              type="text"
              placeholder="Full Name as on Bank Account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#0c7844] focus:outline-hidden text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">UPI ID / VPA</label>
            <input
              type="text"
              placeholder="e.g. yourname@oksbi / paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#0c7844] focus:outline-hidden text-xs"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700">Withdrawal Amount</label>
              <button
                type="button"
                onClick={() => setAmount(balance.toFixed(0))}
                className="text-[11px] font-bold text-[#0c7844] hover:underline cursor-pointer"
              >
                All Balance
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="Min ₹100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:border-[#0c7844] focus:outline-hidden text-sm font-semibold"
              />
            </div>
          </div>

          {/* Fee preview */}
          {numAmount > 0 && (
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1 text-[11px] text-gray-600">
              <div className="flex justify-between">
                <span>Platform Handling (3%):</span>
                <span>₹{serviceFee}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-1">
                <span>Receiving Amount:</span>
                <span className="text-[#0c7844]">₹{receiveAmount}</span>
              </div>
            </div>
          )}

          <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-[10px] text-amber-700 flex gap-1.5 items-start">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Withdrawals are processed 24/7. Average payout time is 5-15 minutes.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleWithdraw}
            disabled={isSubmitting || numAmount <= 0}
            className="w-full py-2.5 bg-[#0c7844] hover:bg-[#0a673a] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isSubmitting ? 'Processing Payout...' : 'Confirm Withdrawal'}
          </button>
        </div>
      </div>
    </div>
  );
};
