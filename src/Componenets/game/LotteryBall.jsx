import React from 'react';

export const LotteryBall = ({
  number,
  size = 52,
  className = '',
}) => {
  const is0 = number === 0;
  const is5 = number === 5;
  const isGreen = [1, 3, 7, 9].includes(number);

  const idSuffix = `${number}-${size}`;

  let digitColor = '#ef4444';
  if (is0) {
    digitColor = '#9333ea';
  } else if (isGreen || is5) {
    digitColor = '#16a34a';
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xs overflow-visible"
      >
        <defs>
          <clipPath id={`ball-clip-${idSuffix}`}>
            <circle cx="50" cy="50" r="48" />
          </clipPath>

          <linearGradient id={`outer-green-${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2dd27b" />
            <stop offset="50%" stopColor="#1eb965" />
            <stop offset="100%" stopColor="#12954c" />
          </linearGradient>

          <linearGradient id={`outer-red-${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5252" />
            <stop offset="50%" stopColor="#f03838" />
            <stop offset="100%" stopColor="#d41f1f" />
          </linearGradient>

          <linearGradient id={`outer-split-0-${idSuffix}`} x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="48%" stopColor="#ef3636" />
            <stop offset="50%" stopColor="#9a3ee8" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

          <linearGradient id={`outer-split-5-${idSuffix}`} x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#2cd67e" />
            <stop offset="48%" stopColor="#1eb965" />
            <stop offset="50%" stopColor="#9a3ee8" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

          <radialGradient id={`inner-green-${idSuffix}`} cx="45%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f4fbf7" />
            <stop offset="78%" stopColor="#c3f3d7" />
            <stop offset="100%" stopColor="#a3eec0" />
          </radialGradient>

          <radialGradient id={`inner-red-${idSuffix}`} cx="45%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fff6f6" />
            <stop offset="78%" stopColor="#fecaca" />
            <stop offset="100%" stopColor="#fba9a9" />
          </radialGradient>

          <radialGradient id={`inner-0-${idSuffix}`} cx="45%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#faf6fe" />
            <stop offset="80%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#d8b4fe" />
          </radialGradient>

          <radialGradient id={`inner-5-${idSuffix}`} cx="45%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f4faf8" />
            <stop offset="80%" stopColor="#d5f2e3" />
            <stop offset="100%" stopColor="#c0ebd4" />
          </radialGradient>

          <linearGradient id={`top-gloss-${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g clipPath={`url(#ball-clip-${idSuffix})`}>
          {is0 ? (
            <circle cx="50" cy="50" r="48" fill={`url(#outer-split-0-${idSuffix})`} />
          ) : is5 ? (
            <circle cx="50" cy="50" r="48" fill={`url(#outer-split-5-${idSuffix})`} />
          ) : isGreen ? (
            <circle cx="50" cy="50" r="48" fill={`url(#outer-green-${idSuffix})`} />
          ) : (
            <circle cx="50" cy="50" r="48" fill={`url(#outer-red-${idSuffix})`} />
          )}

          <circle cx="50" cy="0" r="13" fill="#ffffff" opacity="0.8" />
          <circle cx="100" cy="50" r="13" fill="#ffffff" opacity="0.8" />
          <circle cx="50" cy="100" r="13" fill="#ffffff" opacity="0.8" />
          <circle cx="0" cy="50" r="13" fill="#ffffff" opacity="0.8" />

          <circle
            cx="50"
            cy="50"
            r="37"
            fill={
              is0
                ? `url(#inner-0-${idSuffix})`
                : is5
                ? `url(#inner-5-${idSuffix})`
                : isGreen
                ? `url(#inner-green-${idSuffix})`
                : `url(#inner-red-${idSuffix})`
            }
          />

          <circle
            cx="50"
            cy="50"
            r="37"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.8"
            opacity="0.85"
          />

          <path
            d="M 22,40 C 22,23 35,16 50,16 C 65,16 78,23 78,40 C 65,30 35,30 22,40 Z"
            fill={`url(#top-gloss-${idSuffix})`}
          />
        </g>

        <text
          x="50"
          y="62.5"
          textAnchor="middle"
          fill={digitColor}
          fontSize="37"
          fontWeight="800"
          fontFamily="Arial, Helvetica, -apple-system, sans-serif"
          letterSpacing="-0.5"
          style={{
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
          }}
        >
          {number}
        </text>
      </svg>
    </div>
  );
};
