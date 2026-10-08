// File: src/Componenets/game/Game.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
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
import { sound } from '../../utils/audio.js';
import { useColor } from '../../context/ColorContext.jsx';

const GAME_NAME = 'WinGo 30 second';

export default function Game() {
  // ✅ Context se latestResult bhi lo
  const {
    dashboard,
    gameResults,
    latestResult,
    clientSeconds,
    placeBet,
    fetchDashboard,
  } = useColor();

  // ✅ Real balance from server
  const balance = Number(dashboard?.currentamt || 0);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  // Modals
  const [selectedBetChoice, setSelectedBetChoice] = useState(null);
  const [presetMultiplier, setPresetMultiplier] = useState(1);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [winModalData, setWinModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // ✅ User bets — memory me (session level)
  const userBetsRef = useRef([]);

  // ✅ Processed periods — duplicate modal na khule
  const processedPeriodsRef = useRef(new Set());

  const toastTimerRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const currentPeriod = dashboard?.gameid || '------------';
  const secondsRemaining = clientSeconds;
  const isLocked = secondsRemaining <= 5;

  // Cleanup toast
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Toast helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  }, []);

  // ✅ Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    sound.playClick();
  };

  // ✅ Bet evaluate 
  const evaluateBet = (bet, result) => {
    let status = 'lost';
    let winAmount = 0;

    const resultNum = result.number;
    const resultSize = (result.bigSmall || '').toLowerCase();

    if (bet.type === 'number') {
      if (String(bet.value) === String(resultNum)) {
        status = 'won';
        winAmount = bet.amount * 9;
      }
    } else if (bet.type === 'color') {
      const betColor = bet.value.toLowerCase();
      if (betColor === 'violet' && (resultNum === 0 || resultNum === 5)) {
        status = 'won';
        winAmount = bet.amount * 4.5;
      } else if (betColor === 'green' && [1, 3, 7, 9].includes(resultNum)) {
        status = 'won';
        winAmount = bet.amount * 2;
      } else if (betColor === 'red' && [2, 4, 6, 8].includes(resultNum)) {
        status = 'won';
        winAmount = bet.amount * 2;
      }
    } else if (bet.type === 'size') {
      const betSize = bet.value.toLowerCase();
      if (betSize === resultSize) {
        status = 'won';
        winAmount = bet.amount * 2;
      }
    }

    return { status, winAmount };
  };

  // ✅ Latest result  — evaluate + modal
  useEffect(() => {
    if (!latestResult?.period) return;

    // Already process kiya?
    if (processedPeriodsRef.current.has(latestResult.period)) return;

    // Current round me user ki bets dhundho
    const periodBets = userBetsRef.current.filter(
      (b) => b.period === latestResult.period
    );

    // Koi bet nahi thi → skip
    if (periodBets.length === 0) {
      processedPeriodsRef.current.add(latestResult.period);
      return;
    }

    console.log('🎯 [Eval] Evaluating', periodBets.length, 'bets for', latestResult.period);

    const evaluated = periodBets.map((b) => {
      const res = evaluateBet(b, latestResult);
      return {
        ...b,
        status: res.status,
        winAmount: res.winAmount,
        resultNumber: latestResult.number,
      };
    });

    console.log('🎯 [Eval] Result:', evaluated);

    const hasWon = evaluated.some((b) => b.status === 'won');
    if (hasWon) {
      sound.playWin();
    } else {
      sound.playLoss();
    }

    setWinModalData({
      bets: evaluated,
      result: latestResult,
    });

    processedPeriodsRef.current.add(latestResult.period);
  }, [latestResult]);

  // ✅ Bet submission
  const handleConfirmBet = async (choice, totalAmount) => {
    const Regno = sessionStorage.getItem('Regno');

    if (!Regno) {
      alert('Session expired. Please login again.');
      return;
    }

    if (!dashboard?.gameid) {
      alert('Game ID not available. Please wait...');
      return;
    }

    let gameName = '';
    let betValue = '';

    if (choice.type === 'color') {
      gameName = 'Color';
      betValue = choice.value.charAt(0).toUpperCase() + choice.value.slice(1);
    } else if (choice.type === 'number') {
      gameName = 'Number';
      betValue = String(choice.value);
    } else if (choice.type === 'size') {
      gameName = 'BigSmall';
      betValue = choice.value.charAt(0).toUpperCase() + choice.value.slice(1);
    }

    console.log('🎯 Bet details:', {
      gameId: dashboard.gameid,
      gameName,
      regNo: Number(Regno),
      amount: totalAmount,
      bet: betValue,
    });

    const result = await placeBet({
      gameId: dashboard.gameid,
      gameName,
      regNo: Number(Regno),
      amount: totalAmount,
      bet: betValue,
    });

    if (!result.success) {
      sound.playLoss();
      alert(`Bet failed: ${result.error}`);
      return;
    }

    // ✅ Memory me save karo (evaluation ke liye)
    userBetsRef.current.push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      period: dashboard.gameid,
      type: choice.type,
      value: choice.value,
      label: choice.label,
      amount: totalAmount,
      mode: '30s',
      timestamp: Date.now(),
    });

    console.log('💾 [Bet Saved] Total in memory:', userBetsRef.current.length);

    sound.playBetPlace();
    showToast(`Bet placed: ${choice.label} (₹${totalAmount})`);
    fetchDashboard(Regno);
  };

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

        {/* SCROLLABLE CONTENT */}
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <WalletHeader />

            <TicketBanner
              modeName={GAME_NAME}
              secondsRemaining={secondsRemaining}
              onOpenRules={() => {
                sound.playClick();
                setShowRulesModal(true);
              }}
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
                      backgroundColor:
                        activeTab === tab.key ? '#008f53' : '#f1f5f9',
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
              {activeTab === 'history' && <GameHistoryTab />}
              {activeTab === 'chart' && (
                <TrendChartTab history={gameResults} />
              )}
              {activeTab === 'myHistory' && (
                <MyHistoryTab bets={userBetsRef.current} />
              )}
              {activeTab === 'allBets' && (
                <AllBetsTab
                  currentPeriod={currentPeriod}
                  secondsRemaining={secondsRemaining}
                  liveBets={[]}
                />
              )}
            </div>
          </div>
        </div>

        {/* MODALS */}
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

        <HowToPlayModal
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
        />

        {/* ✅ WIN / LOSE MODAL */}
        {winModalData && (
          <WinResultModal
            evaluatedBets={winModalData.bets}
            latestResult={winModalData.result}
            onClose={() => setWinModalData(null)}
          />
        )}

        {/* TOAST */}
        {toastMessage && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 99999,
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

      <style>{`
        @keyframes toastPop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}