import React, { useEffect, useState } from "react";

const Marquee = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCoinLogo = (symbol) => {
    const logos = {
      BTC: "https://assets.coincap.io/assets/icons/btc@2x.png",
      ETH: "https://assets.coincap.io/assets/icons/eth@2x.png",
      BNB: "https://assets.coincap.io/assets/icons/bnb@2x.png",
      SOL: "https://assets.coincap.io/assets/icons/sol@2x.png",
      XRP: "https://assets.coincap.io/assets/icons/xrp@2x.png",
      DOGE: "https://assets.coincap.io/assets/icons/doge@2x.png",
      ADA: "https://assets.coincap.io/assets/icons/ada@2x.png",
      DOT: "https://assets.coincap.io/assets/icons/dot@2x.png",
      AVAX: "https://assets.coincap.io/assets/icons/avax@2x.png",
    };
    return logos[symbol] || "";
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCoins = async () => {
      try {
        const symbols = [
          "BTCUSDT",
          "ETHUSDT",
          "BNBUSDT",
          "SOLUSDT",
          "XRPUSDT",
          "DOGEUSDT",
          "ADAUSDT",
          "DOTUSDT",
          "AVAXUSDT",
        ];

        const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(
          JSON.stringify(symbols)
        )}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!isMounted) return;

        if (Array.isArray(data)) {
          const formatted = data.map((c) => {
            const symbol = c.symbol.replace("USDT", "");
            return {
              id: c.symbol,
              symbol: symbol,
              current_price: parseFloat(c.lastPrice),
              price_change_percentage_24h: parseFloat(c.priceChangePercent),
              high: parseFloat(c.highPrice),
              low: parseFloat(c.lowPrice),
              volume: parseFloat(c.quoteVolume),
              image: getCoinLogo(symbol),
            };
          });
          setCoins(formatted);
        }
      } catch (error) {
        console.error("Marquee api error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading || coins.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          background: "linear-gradient(90deg, #0f0f1e 0%, #1a1a2e 50%, #0f0f1e 100%)",
          padding: "14px 0",
          textAlign: "center",
          fontSize: "13px",
          color: "#8b8ba7",
          fontWeight: "500",
          letterSpacing: "1px",
        }}
      >
        <span className="marquee-loading-dot">●</span> LOADING MARKET DATA...
      </div>
    );
  }

  const repeatedCoins = [...coins, ...coins, ...coins];

  return (
    <div className="premium-marquee-wrapper">
      {/* Left fade */}
      <div className="marquee-fade marquee-fade-left"></div>
      {/* Right fade */}
      <div className="marquee-fade marquee-fade-right"></div>

      <div className="premium-marquee-track">
        {repeatedCoins.map((coin, index) => {
          const change = coin.price_change_percentage_24h || 0;
          const isPositive = change >= 0;

          return (
            <div
              key={`${coin.id}-${index}`}
              className="premium-coin-item"
            >
              {/* Logo with glow */}
              <div className="coin-logo-wrapper">
                {coin.image && (
                  <img
                    src={coin.image}
                    alt={coin.symbol}
                    className="coin-logo"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </div>

              {/* Symbol */}
              <span className="coin-symbol">
                {coin.symbol.toUpperCase()}
              </span>

              {/* Price */}
              <span className="coin-price">
                $
                {coin.current_price?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>

              {/* Change badge */}
              <span
                className={`coin-change ${
                  isPositive ? "coin-change-up" : "coin-change-down"
                }`}
              >
                <span className="change-arrow">
                  {isPositive ? "▲" : "▼"}
                </span>
                {Math.abs(change).toFixed(2)}%
              </span>

              {/* Divider */}
              <span className="coin-divider"></span>
            </div>
          );
        })}
      </div>

      <style>{`
        .premium-marquee-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(90deg, #0a0a1a 0%, #14142b 50%, #0a0a1a 100%);
          padding: 14px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* Left & Right Fade gradients */
        .marquee-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 10;
          pointer-events: none;
        }
        .marquee-fade-left {
          left: 0;
          background: linear-gradient(90deg, #0a0a1a 0%, transparent 100%);
        }
        .marquee-fade-right {
          right: 0;
          background: linear-gradient(270deg, #0a0a1a 0%, transparent 100%);
        }

        .premium-marquee-track {
          display: flex;
          width: max-content;
          animation: premium-scroll 40s linear infinite;
          will-change: transform;
        }

        .premium-marquee-wrapper:hover .premium-marquee-track {
          animation-play-state: paused;
        }

        @keyframes premium-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        .premium-coin-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          transition: transform 0.3s ease;
        }

        .coin-logo-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coin-logo {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
          transition: transform 0.3s ease;
        }

        .premium-coin-item:hover .coin-logo {
          transform: scale(1.15) rotate(5deg);
        }

        .coin-symbol {
          font-weight: 700;
          color: #ffffff;
          font-size: 14px;
          letter-spacing: 0.5px;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
        }

        .coin-price {
          color: #b8b8d4;
          font-weight: 600;
          font-size: 14px;
          font-variant-numeric: tabular-nums;
        }

        .coin-change {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-weight: 700;
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.3px;
          font-variant-numeric: tabular-nums;
        }

        .change-arrow {
          font-size: 9px;
        }

        .coin-change-up {
          color: #00ffa3;
          background: rgba(0, 255, 163, 0.1);
          box-shadow: 
            0 0 12px rgba(0, 255, 163, 0.2),
            inset 0 0 8px rgba(0, 255, 163, 0.05);
          border: 1px solid rgba(0, 255, 163, 0.2);
        }

        .coin-change-down {
          color: #ff4757;
          background: rgba(255, 71, 87, 0.1);
          box-shadow: 
            0 0 12px rgba(255, 71, 87, 0.2),
            inset 0 0 8px rgba(255, 71, 87, 0.05);
          border: 1px solid rgba(255, 71, 87, 0.2);
        }

        .coin-divider {
          display: inline-block;
          width: 1px;
          height: 20px;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 100%
          );
          margin-left: 14px;
        }

        .marquee-loading-dot {
          color: #00ffa3;
          animation: pulse-dot 1.5s ease-in-out infinite;
          margin-right: 6px;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .premium-coin-item {
            padding: 0 16px;
            gap: 8px;
          }
          .coin-logo {
            width: 20px;
            height: 20px;
          }
          .coin-symbol {
            font-size: 13px;
          }
          .coin-price {
            font-size: 13px;
          }
          .coin-change {
            font-size: 11px;
            padding: 3px 8px;
          }
          .marquee-fade {
            width: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;