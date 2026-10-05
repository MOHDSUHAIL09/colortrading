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
  // ✅ Context se real data
  const { dashboard, gameResults, clientSeconds, placeBet, fetchDashboard } = useColor();


  // ✅ Real balance from server
  const balance = Number(dashboard?.currentamt);

  // ✅ Sound state (rakha)
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [activeTab, setActiveTab] = useState('history');

  // Modals
  const [selectedBetChoice, setSelectedBetChoice] = useState(null);
  const [presetMultiplier, setPresetMultiplier] = useState(1);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [winModalData, setWinModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // ✅ User bets — API se aayenge (filhal empty)
  const [userBets ] = useState([]);

  // ✅ Live community bets — API se aayenge (filhal empty)
  const [liveRoundBets] = useState([]);

  const toastTimerRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // ✅ Real values from context
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

  // ✅ Sound toggle (rakha)
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    sound.playClick();   // feedback
  };

  // ✅ Bet submission — API call
  const handleConfirmBet = async (choice, totalAmount) => {
    const Regno = sessionStorage.getItem('Regno');

    // ✅ gameName + betValue — bet type ke hisaab se
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

    // ✅ API call
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

    // ✅ Success — sound + toast + fresh dashboard
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

      <style>{`
        @keyframes toastPop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}