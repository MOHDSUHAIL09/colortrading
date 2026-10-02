import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';   // 👈 add
import { sound } from '../../utils/audio.js';

export const TopNavbar = ({
  soundEnabled,
  onToggleSound,
  onBack,                                          // optional rakho
}) => {
  const navigate = useNavigate();                  // 👈 add

  const handleBack = () => {
    sound.playClick();

    if (onBack) {
      onBack();                                    // agar parent ne diya to wahi chalao
    } else {
      navigate('/dashboard');                      // warna default /dashboard
    }
  };

  return (
    <div className="w-full bg-[#0c7844] flex items-center justify-between px-3 py-2 text-white shadow-xs select-none">
      {/* Back Button */}
      <button
        onClick={handleBack}                       // 👈 ab ye function call hoga
        className="p-1 -ml-1 text-white hover:opacity-80 cursor-pointer shrink-0"
        title="Back"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.8]" />
      </button>

      {/* Center Brand Logo */}
      <div className="flex items-center justify-center relative">
        <svg className="h-7 w-28 overflow-visible" viewBox="0 0 120 36" fill="none">
          <path
            d="M 22,20 C 18,7 40,3 60,3 C 80,3 102,7 98,20"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 38,30 C 48,35 72,35 82,30"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <text
            x="60"
            y="25"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="21"
            fontWeight="900"
            fontFamily="Arial, Helvetica, sans-serif"
            letterSpacing="-0.5"
          >
            AD689
          </text>
        </svg>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Customer Support Icon */}
        <button
          onClick={() => sound.playClick()}
          className="p-1 text-white hover:opacity-80 transition cursor-pointer"
          title="Customer Support"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M4 12v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
            <rect x="2" y="11" width="4" height="6" rx="2" strokeWidth="1.8" />
            <rect x="18" y="11" width="4" height="6" rx="2" strokeWidth="1.8" />
            <path d="M6 17v1a2 2 0 0 0 2 2h3" strokeLinecap="round" />
            <circle cx="12" cy="11" r="3.5" strokeWidth="1.5" />
          </svg>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          className="p-1 transition cursor-pointer hover:opacity-85 text-white flex items-center justify-center"
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M10 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor" />
              <path d="M12 14V8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5H12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="12" cy="12" r="9.5" />
              <circle cx="10" cy="14.5" r="1.7" fill="currentColor" stroke="none" />
              <path d="M11.7 14.5V8.5a.5.5 0 0 1 .5-.5h2.2a.5.5 0 0 1 .5.5v1.2a.5.5 0 0 1-.5.5H12" strokeLinecap="round" />
              <line x1="3.5" y1="3.5" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};