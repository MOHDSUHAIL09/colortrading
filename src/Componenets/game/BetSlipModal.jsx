import React, { useState, useEffect } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { sound } from '../../utils/audio.js';

export const BetSlipModal = ({
  choice,
  balance,
  initialMultiplier = 1,
  modeName = 'Win Go 30S',
  onClose,
  onConfirmBet,
}) => {
  const [contractMoney, setContractMoney] = useState(1);
  const [multiplier, setMultiplier] = useState(initialMultiplier || 1);
  const [quantity, setQuantity] = useState(1);
  const [agreed, setAgreed] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsOpen(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const effectiveQty = quantity < 1 ? 1 : quantity;
  const totalAmount = contractMoney * multiplier * effectiveQty;
  const canAfford = balance >= totalAmount;

  let themeColor = '#f84d43';
  let headerBackground = '#f84d43';

  if (choice.type === 'color') {
    if (choice.value === 'green') {
      themeColor = '#00b977';
      headerBackground = '#00b977';
    } else if (choice.value === 'violet') {
      themeColor = '#b245f7';
      headerBackground = '#b245f7';
    } else if (choice.value === 'red') {
      themeColor = '#f84d43';
      headerBackground = '#f84d43';
    }
  } else if (choice.type === 'number') {
    const num = parseInt(choice.value, 10);
    if ([1, 3, 7, 9].includes(num)) {
      themeColor = '#00b977';
      headerBackground = '#00b977';
    } else if ([2, 4, 6, 8].includes(num)) {
      themeColor = '#f84d43';
      headerBackground = '#f84d43';
    } else if (num === 0) {
      themeColor = '#f84d43';
      headerBackground = 'linear-gradient(118deg, #ff4c4c 50%, #b245f7 50%)';
    } else if (num === 5) {
      themeColor = '#00b977';
      headerBackground = 'linear-gradient(118deg, #00b977 50%, #b245f7 50%)';
    }
  } else if (choice.type === 'size') {
    if (choice.value === 'big') {
      themeColor = '#ff9900';
      headerBackground = '#ff9900';
    } else if (choice.value === 'small') {
      themeColor = '#4a90e2';
      headerBackground = '#4a90e2';
    }
  }

  const contractOptions = [1, 10, 100, 1000];
  const multiplierOptions = [1, 5, 10, 20, 50, 100];

  const handleClose = () => {
    sound.playClick();
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 260);
  };

  const handleSubmit = () => {
    if (!agreed) {
      alert('Please agree to the pre-sale rules to place bet');
      return;
    }
    if (!canAfford) {
      alert('Insufficient wallet balance. Please add more chips!');
      return;
    }
    const finalQty = quantity < 1 ? 1 : quantity;
    if (quantity < 1) setQuantity(1);
    sound.playBetPlace();
    onConfirmBet(choice, contractMoney * multiplier * finalQty, multiplier);
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 260);
  };

  const selectionLabel =
    choice.type === 'number'
      ? `Select  ${choice.value}`
      : `Select  ${choice.label.split(' ')[0]}`;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end overflow-hidden transition-all duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative z-10 w-full bg-white shadow-2xl overflow-hidden flex flex-col select-none rounded-t-2xl transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="text-white pt-4 pb-7 px-4 relative flex flex-col items-center justify-center"
          style={{
            background: headerBackground,
            clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)',
          }}
        >
          <h2 className="text-xl font-bold tracking-tight text-white mb-2 text-center drop-shadow-xs">
            {modeName}
          </h2>

          <div className="w-[85%] max-w-[320px] bg-white text-gray-800 py-1.5 px-4 rounded-md shadow-sm text-center text-sm font-semibold tracking-wide">
            {selectionLabel}
          </div>
        </div>

        <div className="px-5 pt-2 pb-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 text-sm font-medium">Balance</span>

            <div className="flex items-center gap-1.5">
              {contractOptions.map((opt) => {
                const isSelected = contractMoney === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      sound.playClick();
                      setContractMoney(opt);
                    }}
                    style={{
                      backgroundColor: isSelected ? themeColor : '#f2f4f7',
                    }}
                    className={`min-w-[42px] px-2.5 py-1.5 rounded-xs text-xs font-bold transition cursor-pointer text-center ${
                      isSelected ? 'text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700 text-sm font-medium">Quantity</span>

            <div className="flex items-center">
              <button
                onClick={() => {
                  sound.playClick();
                  setQuantity((q) => Math.max(1, q - 1));
                }}
                style={{ backgroundColor: themeColor }}
                className="w-8 h-7 rounded-xs text-white flex items-center justify-center font-bold text-base active:scale-95 cursor-pointer shadow-xs transition-colors"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>

              <input
                type="number"
                min="1"
                max="99999"
                value={quantity === 0 ? '' : quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setQuantity(0);
                  } else {
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed)) {
                      setQuantity(Math.max(0, parsed));
                    }
                  }
                }}
                onBlur={() => {
                  if (quantity < 1) {
                    setQuantity(1);
                  }
                }}
                className="w-16 h-7 border border-gray-300 rounded-xs text-center font-bold text-gray-800 text-xs bg-white mx-1 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />

              <button
                onClick={() => {
                  sound.playClick();
                  setQuantity((q) => q + 1);
                }}
                style={{ backgroundColor: themeColor }}
                className="w-8 h-7 rounded-xs text-white flex items-center justify-center font-bold text-base active:scale-95 cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1 pt-0.5 overflow-x-auto no-scrollbar">
            {multiplierOptions.map((m) => {
              const isSelected = multiplier === m;
              return (
                <button
                  key={m}
                  onClick={() => {
                    sound.playClick();
                    setMultiplier(m);
                  }}
                  style={{
                    backgroundColor: isSelected ? themeColor : '#f2f4f7',
                  }}
                  className={`min-w-[38px] px-2 py-1.5 rounded-xs text-xs font-bold transition cursor-pointer text-center ${
                    isSelected ? 'text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  X{m}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => setAgreed(!agreed)}
              className="w-5 h-5 rounded-full bg-[#107c41] flex items-center justify-center text-white cursor-pointer shadow-xs transition active:scale-95"
            >
              {agreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <span
              onClick={() => setAgreed(!agreed)}
              className="text-gray-700 text-xs font-medium cursor-pointer select-none"
            >
              I agree
            </span>
            <span
              style={{ color: themeColor }}
              className="text-xs font-medium cursor-pointer hover:underline transition-colors"
            >
              《Pre-sale rules》
            </span>
          </div>
        </div>

        <div className="flex w-full items-stretch border-t border-gray-100">
          <button
            onClick={handleClose}
            className="w-[36%] py-3.5 bg-[#2b3244] hover:bg-[#232938] text-gray-300 font-bold text-sm tracking-wide transition cursor-pointer active:brightness-90 text-center"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canAfford}
            style={{ backgroundColor: canAfford ? themeColor : '#cbd5e1' }}
            className={`w-[64%] py-3.5 text-white font-bold text-sm tracking-wide transition cursor-pointer active:brightness-95 text-center ${
              !canAfford ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            Total amount ₹{totalAmount.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};