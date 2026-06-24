import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { curveMonotoneX } from "@visx/curve";
import apiClient from '../../api/apiClient';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';


const BotTrading = () => {
    // -------------------- STATE ENGINE --------------------
    const [botStatus, setBotStatus] = useState({ isRunning: false, progress: 0 });
    const [selectedCurrency, setSelectedCurrency] = useState('BTC'); // Default BTC
    const [, setBalance] = useState(12500.75);
    const [, setHistory] = useState([]);
    const [isRoundActive, setIsRoundActive] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(12);
    const { userData } = useUser();
    const [, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countdown, setCountdown] = useState(" ");
    const [apiBotStatus, setApiBotStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const regno = localStorage.getItem('Regno') || 1;
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // ── 🔴 DYNAMIC COIN WISE REAL MARKET PRICE CONFIGS ──
    // ── 🔴 UPDATE ONLY THIS FUNCTION IN YOUR CODE ──
    const getCryptoConfig = (coin) => {
        switch (coin) {
            case 'BTC': return { min: 63800, max: 64200, symbol: '$', name: 'Bitcoin' };
            case 'ETH': return { min: 1710, max: 1740, symbol: '$', name: 'Ethereum' };
            case 'BNB': return { min: 585, max: 595, symbol: '$', name: 'Binance Coin' };
            case 'SOL': return { min: 70, max: 73, symbol: '$', name: 'Solana' };
            case 'XRP': return { min: 1.11, max: 1.14, symbol: '$', name: 'Ripple' };
            default: return { min: 63800, max: 64200, symbol: '$', name: 'Bitcoin' };
        }
    };
    const currentConfig = getCryptoConfig(selectedCurrency);

    // -------------------- TRADE CHART STATE --------------------
    const containerRef = useRef(null);
    const [chartSize, setChartSize] = useState({ w: 800, h: 400 });
    const [chartData, setChartData] = useState([]);
    const [tooltip, setTooltip] = useState({ x: 0, y: 0, value: "0.00" });
    const [roundStartIndex, setRoundStartIndex] = useState(null);
    const [roundStartPrice, setRoundStartPrice] = useState(null);

    const INTERVAL_MS = 400;
    const GAME_DURATION_SEC = 30;
    const POINTS_IN_ROUND = Math.ceil((GAME_DURATION_SEC * 1000) / INTERVAL_MS);

    // ── 🔴 SYNC RESET CHART DATA WHEN CRYPTO PAIR SWITCHES ──
    useEffect(() => {
        const conf = getCryptoConfig(selectedCurrency);
        const initialPoints = Array.from({ length: 65 }, () =>
            conf.min + Math.random() * (conf.max - conf.min)
        );
        setChartData(initialPoints);
        setIsRoundActive(false);
        setRoundStartIndex(null);
        setRoundStartPrice(null);
    }, [selectedCurrency]);

    // Timer Effect
    useEffect(() => {
        const seconds = parseInt(userData?.status, 10);
        if (!isNaN(seconds)) setTimeLeft(seconds);
    }, [userData?.status]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Countdown Timer logic
    useEffect(() => {
        if (!userData?.status) return;
        const targetTime = new Date(userData.status.replace(" ", "T") + "+04:00").getTime();
        const timer = setInterval(() => {
            const diff = targetTime - Date.now();
            if (diff <= 0) {
                setCountdown("00H : 00M : 00S");
                clearInterval(timer);
                return;
            }
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setCountdown(`${String(hours).padStart(2, "0")}H : ${String(minutes).padStart(2, "0")}M : ${String(seconds).padStart(2, "0")}S`);
        }, 1000);
        return () => clearInterval(timer);
    }, [userData?.status]);

    // Fetch Bot Status
    const fetchBotStatus = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/Trading/BotStatus?regno=${regno}`);
            if (response.data?.result === "true") {
                const status = response.data?.response?.status;
                setApiBotStatus(status);
                setBotStatus(prev => ({ ...prev, isRunning: status === 0 }));
            } else {
                setApiBotStatus(1);
            }
        } catch (error) {
            setApiBotStatus(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBotStatus(); }, []);

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setShowDropdown(false);
        toast.info(`⏱️ ${slot} Hours selected!`);
    };

    const handleStartBot = async () => {
        if (apiBotStatus === 0 || botStatus.isRunning) {
            toast.warning(' Bot is already running!');
            return;
        }
        if (!selectedSlot) {
            toast.warning(' Please select a slot first!');
            return;
        }

        const betAmount = parseFloat(userData?.Invest) || 100;
        const liveRateFromChart = chartData.length > 0 ? chartData[chartData.length - 1] : currentConfig.min;

        const dynamicCurrencyRate = parseFloat(liveRateFromChart.toFixed(4));
        const payload = {
            regno: parseInt(regno),
            betAmount: betAmount,
            currency: selectedCurrency.toLowerCase(),
            currencyRate: dynamicCurrencyRate,
            slot: selectedSlot
        };


        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/Trading/BotTrading', payload);
            if (response.data?.result === "true") {
                toast.success(`✅ Bot started successfully for ${selectedSlot} hours!`);
                setBotStatus({ isRunning: true, progress: 0 });
                setApiBotStatus(0);
                setIsRoundActive(true);
                setRoundStartIndex(chartData.length - 1);
                setRoundStartPrice(chartData[chartData.length - 1]);
                fetchBotStatus();
            } else {
                toast.error(response.data?.message || '❌ Failed to start bot');
            }
        } catch (error) {
            toast.error('❌ Failed to start bot');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Resize Chart Observer
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setChartSize({ w: width || 800, h: height || 400 });
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // ── 🔴 LIVE DRIFT MATRIX FEED GENERATOR WITH MARGIN LIMITS ──
    useEffect(() => {
        const interval = setInterval(() => {
            setChartData((prev) => {
                if (prev.length === 0) return prev;
                const lastVal = prev[prev.length - 1];

                // Adjust volatility dynamically based on token price scale depth
                const factor = lastVal > 1000 ? 5 : lastVal > 100 ? 0.4 : 0.002;
                const change = (Math.random() * factor * 2) - factor;

                let next = lastVal + change;
                if (next < currentConfig.min) next = currentConfig.min + (factor * 2);
                if (next > currentConfig.max) next = currentConfig.max - (factor * 2);

                const newData = [...prev, next];

                if (isRoundActive && roundStartIndex !== null) {
                    const finishIndex = roundStartIndex + POINTS_IN_ROUND;
                    if (newData.length - 1 >= finishIndex) {
                        setIsRoundActive(false);
                        toast.success('🎉 Round completed!');
                    }
                }

                if (newData.length > 140) return newData.slice(newData.length - 90);
                return newData;
            });
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, [isRoundActive, roundStartIndex, POINTS_IN_ROUND, selectedCurrency]);

    // CHART SCALES
    const currentDataIndex = chartData.length - 1;
    const xMin = currentDataIndex - 60;
    const xMax = currentDataIndex + 15;

    const sliceRange = chartData.slice(Math.max(0, chartData.length - 80));
    const minPrice = sliceRange.length > 0 ? Math.min(...sliceRange) : currentConfig.min;
    const maxPrice = sliceRange.length > 0 ? Math.max(...sliceRange) : currentConfig.max;
    const pricePadding = (maxPrice - minPrice) * 0.12 || 1;

    const xScale = scaleLinear({ domain: [xMin, xMax], range: [0, chartSize.w] });
    const yScale = scaleLinear({ domain: [minPrice - pricePadding, maxPrice + pricePadding], range: [chartSize.h - 40, 20] });
    // Live tooltip positioning sync
    useEffect(() => {
        if (chartData.length === 0) return;
        const lastValue = chartData[chartData.length - 1];
        const yPos = yScale(lastValue);

        const fractionDigits = lastValue < 10 ? 4 : 3;

        setTooltip({
            x: chartSize.w,
            y: yPos,
            value: `${currentConfig.symbol} ${lastValue.toLocaleString(undefined, {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits
            })} ${selectedCurrency}`,
        });

        // ✅ Sahi kiya: setBgSplit wali line ko yahan se poori tarah hata diya hai
    }, [chartData, chartSize.h, chartSize.w, selectedCurrency]);

    const startFlagX = roundStartIndex !== null ? xScale(roundStartIndex) : -999;
    const finishFlagX = roundStartIndex !== null ? xScale(roundStartIndex + POINTS_IN_ROUND) : -999;
    const startPriceY = roundStartPrice !== null ? yScale(roundStartPrice) : 0;

    return (
        <div className="row ">
            <div className="col-12">
                <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
                    <div className="card-body" style={{
                        background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                        borderRadius: '16px'
                    }}>
                        <div className="d-flex justify-content-between align-items-center gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
                            <div style={{ flexShrink: 0 }}>
                                <h4>Total Balance</h4>
                                <Link to="/dashboard/BotTradingHistory">
                                    <h3 className="mb-0 fw-bold text-success" style={{ fontSize: 'clamp(1rem, 4vw, 1.75rem)' }}>
                                        ${userData?.Invest || "0.00"}
                                    </h3>
                                </Link>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                {/* ── 🔴 CRYPTO COIN SELECTOR (DYNAMIC) ── */}
                                <select
                                    className="form-select text-uppercase fw-bold"
                                    value={selectedCurrency}
                                    onChange={(e) => setSelectedCurrency(e.target.value)}
                                    style={{
                                        width: '120px',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                        padding: '6px 10px',
                                        backgroundColor: '#ffffff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="BTC">₿ BTC</option>
                                    <option value="ETH">Ξ ETH</option>
                                    <option value="BNB">🔶 BNB</option>
                                    <option value="SOL">◎ SOL</option>
                                    <option value="XRP">✕ XRP</option>
                                </select>

                                {/* Slot Dropdown */}
                                <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            background: '#ffffff',
                                            color: '#475569',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span>{selectedSlot ? `${selectedSlot} Hrs` : 'Slot'}</span>
                                        <FaChevronDown size={12} style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                                    </button>

                                    {showDropdown && (
                                        <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', background: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', padding: '8px', minWidth: '100px', zIndex: 1000 }}>
                                            {[12].map((slot) => (
                                                <button key={slot} onClick={() => handleSlotSelect(slot)} style={{ display: 'block', width: '100%', padding: '8px 14px', border: 'none', background: selectedSlot === slot ? '#10b981' : 'transparent', color: selectedSlot === slot ? '#ffffff' : '#475569', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}>
                                                    {slot} Hrs
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!loading && (
                            <div className="d-flex justify-content-center my-3">
                                {apiBotStatus === 0 ? (
                                    <button className="btn px-5 py-2 rounded-pill border-0" style={{ backgroundColor: '#dc3545', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'not-allowed', minWidth: '140px', boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)', opacity: 0.8 }} disabled>
                                        <div>Bot Running</div>
                                        <small style={{ fontSize: '12px', opacity: 0.8 }}>{countdown}</small>
                                    </button>
                                ) : (
                                    <button className="btn px-5 py-2 rounded-pill border-0" style={{ backgroundColor: isSubmitting ? '#94a3b8' : '#10b981', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', minWidth: '140px', boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)' }} onClick={handleStartBot} disabled={isSubmitting}>
                                        {isSubmitting ? "Starting..." : "Start Bot"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CHART DISPLAY WITH RED LIVE TICK DOT */}
            <div className="col-12">
                <div className="card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div className="card-body p-0">
                        <div ref={containerRef} style={{ width: "100%", height: "420px", position: "relative", overflow: "hidden", background: "#0f111a" }}>
                            <svg width={chartSize.w} height={chartSize.h} style={{ position: "absolute", top: 0, left: 0 }}>
                                <Group top={0} left={0}>
                                    <GridRows scale={yScale} width={chartSize.w} stroke="#fff" strokeOpacity={0.05} numTicks={6} />

                                    {yScale.ticks(6).map((tick, i) => {
                                        const axisFractionDigits = tick < 10 ? 4 : 3;

                                        return (
                                            <text
                                                key={i}
                                                x={chartSize.w - 12}
                                                y={yScale(tick) - 5}
                                                fill="#6b7280"
                                                fontSize="11"
                                                textAnchor="end"
                                                style={{ fontFamily: 'monospace', fontWeight: '500' }}
                                            >
                                                {currentConfig.symbol}{tick.toLocaleString(undefined, {
                                                    minimumFractionDigits: axisFractionDigits,
                                                    maximumFractionDigits: axisFractionDigits
                                                })}
                                            </text>
                                        );
                                    })}

                                    {isRoundActive && roundStartIndex !== null && (
                                        <>
                                            <line x1={0} x2={chartSize.w} y1={startPriceY} y2={startPriceY} stroke="#fbbf24" strokeWidth={1} strokeDasharray="6 4" opacity={0.6} />
                                            <Group left={startFlagX} top={0}>
                                                <line x1={0} x2={0} y1={20} y2={chartSize.h - 20} stroke="#fbbf24" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
                                                <text x={-8} y={24} style={{ fontSize: "1.4em" }}>🏁</text>
                                                <circle cx={0} cy={startPriceY} r={4} fill="#fbbf24" />
                                            </Group>
                                            <Group left={finishFlagX} top={0}>
                                                <line x1={0} x2={0} y1={20} y2={chartSize.h - 20} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
                                                <text x={-8} y={24} style={{ fontSize: "1.4em" }}>🏁</text>
                                            </Group>
                                        </>
                                    )}

                                    {chartData.length > 0 && (
                                        <LinePath
                                            data={chartData}
                                            x={(d, i) => xScale(i)}
                                            y={(d) => yScale(d)}
                                            stroke="#3b82f6"
                                            strokeWidth={1.5}
                                            curve={curveMonotoneX}
                                        />
                                    )}

                                    {chartData.length > 0 && (
                                        <g>
                                            {/* Outer breathing pulse circle animation effect */}
                                            <circle
                                                cx={xScale(chartData.length - 1)}
                                                cy={yScale(chartData[chartData.length - 1])}
                                                r={10}
                                                fill="#3b82f6"
                                                opacity={0.3}
                                            >
                                                <animate attributeName="r" values="6;14;6" dur="1.5s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
                                            </circle>
                                            {/* Solid inner center core red dot */}
                                            <circle
                                                cx={xScale(chartData.length - 1)}
                                                cy={yScale(chartData[chartData.length - 1])}
                                                r={4}
                                                fill="#3b82f6"
                                            />
                                        </g>
                                    )}
                                </Group>
                            </svg>

                            {/* Horizontal tracking target line */}
                            <div style={{ position: "absolute", top: tooltip.y, left: 0, height: "1.5px", width: "85%", background: "linear-gradient(to right, transparent, rgba(93, 47, 221, 0.4), transparent)", opacity: 0.8, zIndex: 1, transition: "top 0.1s linear" }} />

                            {/* Floating Live Badge Container Box */}
                            <div style={{ position: "absolute", top: tooltip.y, right: 12, padding: "5px 13px", background: "#5006c0", color: "#fefbfb", borderRadius: "30px", border: "1px solid #5006c0", fontSize: "1em", fontWeight: "700", transform: "translateY(-50%)", zIndex: 20, fontFamily: "monospace", transition: "top 0.1s linear", boxShadow: "0 0 15px rgba(122, 68, 239, 0.2)" }}>
                                {tooltip.value}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BotTrading;