import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopNavbar } from './TopNavbar.jsx';
import { WalletHeader } from './WalletHeader.jsx';
import { TicketBanner } from './TicketBanner.jsx';
import { BettingBoard } from './BettingBoard.jsx';
import { BetSlipModal } from './BetSlipModal.jsx';
import { GameHistoryTab } from './GameHistoryTab.jsx';
import { TrendChartTab } from './TrendChartTab.jsx';
import { MyHistoryTab } from './MyHistoryTab.jsx';
import { AllBetsTab } from './AllBetsTab.jsx';
import { HowToPlayModal } from './HowToPlayModal.jsx';
import { WinResultModal } from './WinResultModal.jsx';
import { DepositModal } from './DepositModal.jsx';
import { WithdrawModal } from './WithdrawModal.jsx';
import { sound } from '../../utils/audio.js';

// ==========================================
// CONSTANTS
// ==========================================
const ROUND_DURATION_SECONDS = 30;
const GAME_NAME = 'WinGo 30 second';

// ==========================================
// HELPERS
// ==========================================
function getNumberColors(num) {
  if (num === 0) return ['red', 'violet'];
  if (num === 5) return ['green', 'violet'];
  if ([1, 3, 7, 9].includes(num)) return ['green'];
  return ['red'];
}

function getNumberBigSmall(num) {
  return num >= 5 ? 'Big' : 'Small';
}

function getRandomStartSeq() {
  return Math.floor(100000 + Math.random() * 800000);
}

function formatPeriodId(seq, date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const seqStr = String(seq).padStart(6, '0');
  return `${yyyy}${mm}${dd}${seqStr}`;
}

function generateRandomResult(period, timestamp = Date.now()) {
  const number = Math.floor(Math.random() * 10);
  return {
    period,
    number,
    bigSmall: getNumberBigSmall(number),
    colors: getNumberColors(number),
    timestamp,
  };
}

function generateInitialHistory(startSeq = 961, count = 30) {
  const now = Date.now();
  const results = [];
  const seedNumbers = [
    5, 6, 3, 9, 8, 2, 0, 7, 1, 4,
    3, 8, 5, 2, 9, 6, 0, 7, 1, 4,
    8, 2, 5, 7, 0, 3, 6, 9, 1, 4,
  ];

  for (let i = 0; i < count; i++) {
    const seq = startSeq - i;
    const period = formatPeriodId(seq);
    const num = i < seedNumbers.length ? seedNumbers[i] : Math.floor(Math.random() * 10);
    results.push({
      period,
      number: num,
      bigSmall: getNumberBigSmall(num),
      colors: getNumberColors(num),
      timestamp: now - (i + 1) * 30000,
    });
  }
  return results;
}

function calculateBetOutcome(bet, resultNumber) {
  const { betType, betValue, amount } = bet;
  const resultBigSmall = getNumberBigSmall(resultNumber);

  if (betType === 'number') {
    if (parseInt(betValue, 10) === resultNumber) {
      return { status: 'won', winAmount: amount * 9 };
    }
    return { status: 'lost', winAmount: 0 };
  }

  if (betType === 'color') {
    if (betValue === 'violet') {
      if (resultNumber === 0 || resultNumber === 5) {
        return { status: 'won', winAmount: amount * 4.5 };
      }
      return { status: 'lost', winAmount: 0 };
    }
    if (betValue === 'green') {
      if ([1, 3, 7, 9].includes(resultNumber)) return { status: 'won', winAmount: amount * 2 };
      if (resultNumber === 5) return { status: 'won', winAmount: amount * 1.5 };
      return { status: 'lost', winAmount: 0 };
    }
    if (betValue === 'red') {
      if ([2, 4, 6, 8].includes(resultNumber)) return { status: 'won', winAmount: amount * 2 };
      if (resultNumber === 0) return { status: 'won', winAmount: amount * 1.5 };
      return { status: 'lost', winAmount: 0 };
    }
  }

  if (betType === 'size') {
    if (betValue.toLowerCase() === resultBigSmall.toLowerCase()) {
      return { status: 'won', winAmount: amount * 2 };
    }
    return { status: 'lost', winAmount: 0 };
  }

  return { status: 'lost', winAmount: 0 };
}

// ==========================================
// SIMULATED COMMUNITY BETS
// ==========================================
const RANDOM_PHONE_SUFFIXES = [
  '784', '912', '453', '671', '230', '889', '341', '519', '126', '993',
  '402', '625', '738', '194', '852', '316', '547', '263', '901', '444',
];
const BET_AMOUNTS = [50, 100, 200, 500, 1000, 2000, 5000, 10000];

function randomChoice() {
  const roll = Math.random();
  if (roll < 0.5) {
    const num = Math.floor(Math.random() * 10);
    return { type: 'number', value: String(num), label: `Number ${num}` };
  }
  if (roll < 0.75) {
    const col = ['green', 'violet', 'red'][Math.floor(Math.random() * 3)];
    return { type: 'color', value: col, label: col.charAt(0).toUpperCase() + col.slice(1) };
  }
  const sz = Math.random() > 0.5 ? 'big' : 'small';
  return { type: 'size', value: sz, label: sz === 'big' ? 'Big' : 'Small' };
}

function generateInitialRoundBets(period) {
  const bets = [];
  const now = Date.now();
  const count = Math.floor(Math.random() * 5) + 8;

  for (let i = 0; i < count; i++) {
    const userSuffix = RANDOM_PHONE_SUFFIXES[Math.floor(Math.random() * RANDOM_PHONE_SUFFIXES.length)];
    const choice = randomChoice();
    const amount = BET_AMOUNTS[Math.floor(Math.random() * BET_AMOUNTS.length)];

    bets.push({
      id: `${period}-init-${i}-${Math.random().toString(36).substr(2, 5)}`,
      period,
      userName: `User***${userSuffix}`,
      isUser: false,
      choiceType: choice.type,
      choiceValue: choice.value,
      choiceLabel: choice.label,
      amount,
      timestamp: now - (count - i) * 1200,
    });
  }

  bets.sort((a, b) => b.amount - a.amount);
  return bets;
}

function generateSingleIncomingBet(period) {
  const userSuffix = RANDOM_PHONE_SUFFIXES[Math.floor(Math.random() * RANDOM_PHONE_SUFFIXES.length)];
  const choice = randomChoice();
  const amount = BET_AMOUNTS[Math.floor(Math.random() * BET_AMOUNTS.length)];

  return {
    id: `${period}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    period,
    userName: `User***${userSuffix}`,
    isUser: false,
    choiceType: choice.type,
    choiceValue: choice.value,
    choiceLabel: choice.label,
    amount,
    timestamp: Date.now(),
  };
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Game() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  // Modals
  const [selectedBetChoice, setSelectedBetChoice] = useState(null);
  const [presetMultiplier, setPresetMultiplier] = useState(1);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [winModalData, setWinModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Balance
  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('wingo_balance');
      return saved ? parseFloat(saved) : 1000;
    } catch { return 1000; }
  });

  // Period sequence
  const [periodSeq, setPeriodSeq] = useState(() => {
    try {
      const saved = localStorage.getItem('wingo_period_seq');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'number') return parsed;
        if (parsed && typeof parsed['30s'] === 'number') return parsed['30s'];
      }
    } catch {}
    return getRandomStartSeq() + 1;
  });

  // Game history
  const [gameHistory, setGameHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('wingo_histories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && Array.isArray(parsed['30s'])) return parsed['30s'];
      }
    } catch {}
    return generateInitialHistory(getRandomStartSeq(), 30);
  });

  const [secondsRemaining, setSecondsRemaining] = useState(ROUND_DURATION_SECONDS);

  // User bets
  const [userBets, setUserBets] = useState(() => {
    try {
      const saved = localStorage.getItem('wingo_bets');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Live community bets
  const [liveRoundBets, setLiveRoundBets] = useState(() =>
    generateInitialRoundBets(formatPeriodId(periodSeq))
  );

  // Refs
  const periodSeqRef = useRef(periodSeq);
  const secondsRef = useRef(ROUND_DURATION_SECONDS);
  const toastTimerRef = useRef(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => { periodSeqRef.current = periodSeq; }, [periodSeq]);

  const currentPeriod = formatPeriodId(periodSeq);
  const isLocked = secondsRemaining <= 5;

  // ---- Persist side-effects ----
  useEffect(() => {
    try { localStorage.setItem('wingo_balance', balance.toString()); } catch {}
  }, [balance]);

  useEffect(() => {
    try { localStorage.setItem('wingo_bets', JSON.stringify(userBets)); } catch {}
  }, [userBets]);

  useEffect(() => {
    try { localStorage.setItem('wingo_period_seq', JSON.stringify(periodSeq)); } catch {}
  }, [periodSeq]);

  useEffect(() => {
    try { localStorage.setItem('wingo_histories', JSON.stringify(gameHistory)); } catch {}
  }, [gameHistory]);

  // Cleanup toast timer
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ---- Toast ----
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  const handleAddChips = () => {
    setBalance((prev) => prev + 500);
    showToast('₹500.00 Demo Chips added to your wallet!');
  };

  // ---- Bet submission ----
  const handleConfirmBet = (choice, totalAmount, multiplier) => {
    if (balance < totalAmount) {
      alert('Insufficient funds!');
      return;
    }

    setBalance((prev) => prev - totalAmount);

    const newBet = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      period: currentPeriod,
      mode: '30s',
      betType: choice.type,
      betValue: choice.value,
      betLabel: choice.label,
      amount: totalAmount,
      multiplier,
      timestamp: Date.now(),
      status: 'pending',
    };

    setUserBets((prev) => [newBet, ...prev]);

    const userLiveBet = {
      id: newBet.id,
      period: currentPeriod,
      userName: 'You (Player)',
      isUser: true,
      choiceType: choice.type,
      choiceValue: choice.value,
      choiceLabel: choice.label,
      amount: totalAmount,
      timestamp: Date.now(),
    };
    setLiveRoundBets((prev) => [userLiveBet, ...prev]);

    showToast(`Bet placed: ${choice.label} (₹${totalAmount})`);
  };

  // ---- Round completion ----
  const handleRoundComplete = useCallback(() => {
    const endingSeq = periodSeqRef.current;
    const periodEnding = formatPeriodId(endingSeq);
    const outcome = generateRandomResult(periodEnding);

    const nextSeq = endingSeq + 1;
    const nextPeriod = formatPeriodId(nextSeq);
    setPeriodSeq(nextSeq);
    periodSeqRef.current = nextSeq;

    setLiveRoundBets(generateInitialRoundBets(nextPeriod));

    setGameHistory((prev) => {
      if (prev.length > 0 && prev[0].period === periodEnding) return prev;
      return [outcome, ...prev.slice(0, 99)];
    });

    const betsToEvaluate = userBets.filter(
      (b) => b.status === 'pending' && b.period === periodEnding
    );

    if (betsToEvaluate.length === 0) return;

    let netWinPayout = 0;
    const evaluatedList = betsToEvaluate.map((b) => {
      const res = calculateBetOutcome(b, outcome.number);
      if (res.status === 'won') netWinPayout += res.winAmount;
      return {
        ...b,
        status: res.status,
        winAmount: res.winAmount,
        resultNumber: outcome.number,
      };
    });

    const evaluatedMap = new Map(evaluatedList.map((b) => [b.id, b]));

    setUserBets((prev) => prev.map((b) => evaluatedMap.get(b.id) || b));

    if (netWinPayout > 0) {
      setBalance((prev) => prev + netWinPayout);
      sound.playWin();
    } else {
      sound.playLoss();
    }

    setWinModalData({ bets: evaluatedList, result: outcome });
  }, [userBets, showToast]);

  // ---- Main 30s tick loop ----
  useEffect(() => {
    const timer = setInterval(() => {
      const currentSec = secondsRef.current;

      if (currentSec <= 5 && currentSec >= 1) {
        sound.playCountdown(currentSec);
      }

      if (currentSec > 5 && (currentSec % 2 === 0 || currentSec % 3 === 0)) {
        const incoming = generateSingleIncomingBet(formatPeriodId(periodSeqRef.current));
        setLiveRoundBets((prev) => [incoming, ...prev]);
      }

      if (currentSec <= 1) {
        secondsRef.current = ROUND_DURATION_SECONDS;
        setSecondsRemaining(ROUND_DURATION_SECONDS);
        sound.playCountdown(0);
        handleRoundComplete();
      } else {
        const nextSec = currentSec - 1;
        secondsRef.current = nextSec;
        setSecondsRemaining(nextSec);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [handleRoundComplete]);

  // ---- Render ----
  return (
    <div
      className="game-page-root"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        overscrollBehavior: 'none',
      }}
    >
      <div
        className="game-page-inner"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#f4f7f6',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* TOP NAVBAR */}
        <div
          style={{
            flexShrink: 0,
            zIndex: 50,
            width: '100%',
            backgroundColor: '#0c7844',
          }}
        >
          <TopNavbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />
        </div>

        {/* SCROLLABLE GAME CONTENT */}
        <div
          ref={scrollAreaRef}
          className="game-scroll-area no-scrollbar"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'contain',
            touchAction: 'pan-y',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <WalletHeader
              balance={balance}
              onAddChips={handleAddChips}
              onOpenWithdraw={() => setShowWithdrawModal(true)}
              onOpenDeposit={() => setShowDepositModal(true)}
            />

            <TicketBanner
              modeName={GAME_NAME}
              period={currentPeriod}
              secondsRemaining={secondsRemaining}
              recentResults={gameHistory}
              onOpenRules={() => setShowRulesModal(true)}
            />

            <BettingBoard
              onSelectBet={(choice) => {
                setSelectedBetChoice(choice);
                setPresetMultiplier(1);
              }}
              isLocked={isLocked}
              secondsRemaining={secondsRemaining}
            />

            {/* Tabs */}
            <div style={{ padding: '0 0.75rem' }}>
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '1rem',
                  padding: '0.375rem',
                  border: '1px solid #f3f4f6',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.25rem',
                }}
              >
                {[
                  { key: 'history', label: 'Game history' },
                  { key: 'chart', label: 'Chart' },
                  { key: 'myHistory', label: 'My history' },
                  { key: 'allBets', label: 'All bets' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(tab.key);
                    }}
                    style={{
                      padding: '0.5rem 0.25rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.6875rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: 'none',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      backgroundColor: activeTab === tab.key ? '#008f53' : '#f1f5f9',
                      color: activeTab === tab.key ? '#fff' : '#4b5563',
                      transition: 'all 0.15s',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '0 0.75rem 1.5rem' }}>
              {activeTab === 'history' && <GameHistoryTab history={gameHistory} />}
              {activeTab === 'chart' && <TrendChartTab history={gameHistory} />}
              {activeTab === 'myHistory' && <MyHistoryTab bets={userBets} />}
              {activeTab === 'allBets' && (
                <AllBetsTab
                  currentPeriod={currentPeriod}
                  secondsRemaining={secondsRemaining}
                  liveBets={liveRoundBets}
                />
              )}
            </div>
          </div>
        </div>

        {/* ============ MODALS (all inside game-page-inner) ============ */}
        {selectedBetChoice && (
          <BetSlipModal
            key={`${selectedBetChoice.type}-${selectedBetChoice.value}`}
            choice={selectedBetChoice}
            balance={balance}
            initialMultiplier={presetMultiplier}
            modeName={GAME_NAME}
            onClose={() => setSelectedBetChoice(null)}
            onConfirmBet={handleConfirmBet}
          />
        )}

        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onDepositSuccess={(amt) => {
            setBalance((b) => b + amt);
            showToast(`Recharged ₹${amt.toLocaleString()} successfully!`);
          }}
        />

        <WithdrawModal
          isOpen={showWithdrawModal}
          balance={balance}
          onClose={() => setShowWithdrawModal(false)}
          onWithdrawSuccess={(amt) => {
            setBalance((b) => b - amt);
            showToast(`Withdrawal of ₹${amt.toLocaleString()} submitted!`);
          }}
        />

        <HowToPlayModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />

        {/* WIN / LOSS RESULT MODAL — game ke andar hi */}
        {winModalData && (
          <WinResultModal
            evaluatedBets={winModalData.bets}
            latestResult={winModalData.result}
            onClose={() => setWinModalData(null)}
          />
        )}

        {/* ============ TOAST — game ke center me ============ */}
        {toastMessage && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 60,
              backgroundColor: 'rgba(17, 24, 39, 0.92)',
              color: '#fff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              boxShadow:
                '0 20px 25px -5px rgba(0,0,0,0.25), 0 10px 10px -5px rgba(0,0,0,0.15)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              maxWidth: '88%',
              textAlign: 'center',
              animation: 'toastPop 0.2s ease-out',
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>

      {/* Toast pop animation */}
      <style>{`
        @keyframes toastPop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}