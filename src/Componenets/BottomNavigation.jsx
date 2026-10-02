import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { IoGameController } from 'react-icons/io5';
import { RiHandCoinFill, RiP2pFill, RiRobot2Line } from 'react-icons/ri';
import { FaWallet } from 'react-icons/fa';

/**
 * ============================================================================
 * 1. NAVY THEME STYLES
 * ============================================================================
 */
const BOTTOM_NAVIGATION_STYLES = `
:root {
  --bar-body-height: 56px;
  --bar-total-height: 74px;
  --nav-element-gap: 12px;
  --theme-primary: #7b5fff;
  --theme-primary-light: #0d1f5c;
  --theme-accent: #00d4ff;
  --theme-nav-bg: linear-gradient(135deg, #0d1f5c 0%, #081542 100%);
  --theme-nav-border: rgba(120, 90, 255, 0.5);
  --theme-icon-color: #b794ff;
  --theme-label-color: #c9d4ee;
}

/* ============================================================================
   FIXED BOTTOM WRAPPER
   ============================================================================ */
.bottom-navigation-container {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  padding: 0 12px 12px 12px;
  box-sizing: border-box;
  z-index: 999999 !important;
  pointer-events: none;
}

/* Overall Suite */
.bottom-nav-suite {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: var(--nav-element-gap);
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  box-sizing: border-box;
  pointer-events: auto;
}

/* ----------------------------------------------------------------------------
   MAIN 4-SLOT NAVIGATION BAR — NAVY THEME
   ---------------------------------------------------------------------------- */
.notch-nav-root {
  position: relative;
  flex: 1;
  min-width: 0;
  height: var(--bar-total-height);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.notch-nav-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.crater-moving-group {
  transition: transform 380ms cubic-bezier(0.34, 1.35, 0.64, 1);
  will-change: transform;
}

/* ----------------------------------------------------------------------------
   ELEVATED FLOATING CIRCULAR ACTIVE DISC — NAVY THEME
   ---------------------------------------------------------------------------- */
.active-floating-disc-holder {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: var(--bar-total-height);
  pointer-events: none;
   z-index: 12;
  transition: transform 380ms cubic-bezier(0.34, 1.35, 0.64, 1);
  will-change: transform;
}

.active-floating-disc {
  position: absolute;
  top: 26px;
  left: 0;
  transform: translate(-50%, -50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7b5fff, #a855f7);
  border: 2px solid rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(123, 95, 255, 0.6), 0 0 0 3px rgba(123, 95, 255, 0.25);
  transition: transform 200ms cubic-bezier(0.34, 1.3, 0.64, 1), box-shadow 200ms ease, border-color 200ms ease;
  will-change: transform;
}

.active-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease;
}

.phase-pressed .active-floating-disc { transform: translate(-50%, -50%) scale(0.92) translateY(3px); }
.phase-rising .active-floating-disc { transform: translate(-50%, -50%) scale(1.08) translateY(-4px); }
.phase-settling .active-floating-disc { transform: translate(-50%, -50%) scale(1.02) translateY(1px); }
.phase-idle .active-floating-disc { transform: translate(-50%, -50%) scale(1) translateY(0); }

/* ----------------------------------------------------------------------------
   CLICKABLE SLOTS ROW & LABELS
   ---------------------------------------------------------------------------- */
.nav-slots-row {
  position: absolute;
  top: 16px;
  left: 0;
  width: 100%;
  height: var(--bar-body-height);
  z-index: 10;
}

.notch-slot-btn {
  position: absolute;
  top: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.notch-slot-btn:focus-visible {
  outline: 2px solid #7b5fff;
  outline-offset: 2px;
  border-radius: 14px;
}

.slot-content-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  padding-bottom: 6px;
  box-sizing: border-box;
  pointer-events: none;
}

.slot-icon-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3px;
  transition: opacity 220ms ease, transform 220ms ease, filter 220ms ease;
  will-change: opacity, transform;
}

.slot-icon-holder.icon-hidden {
  opacity: 0;
  transform: scale(0.6) translateY(-4px);
  pointer-events: none;
}

.slot-icon-holder.icon-visible {
  opacity: 0.9;
  transform: scale(1) translateY(0);
}

.notch-slot-btn:hover .slot-icon-holder.icon-visible {
  opacity: 1;
  transform: scale(1.08) translateY(-1px);
}

.slot-label-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
  line-height: 12px;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  transition: color 220ms ease, opacity 220ms ease, text-shadow 220ms ease, transform 220ms ease;
}

.slot-label-text.label-inactive { color: #c9d4ee; opacity: 0.9; }
.slot-label-text.label-active { color: #b794ff; opacity: 1; }

/* ----------------------------------------------------------------------------
   STANDALONE PLUS CIRCULAR BUTTON
   ---------------------------------------------------------------------------- */
.standalone-red-plus-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: var(--bar-body-height);
  width: var(--bar-body-height);
  margin-bottom: 2px;
}

.standalone-red-plus-btn {
  height: var(--bar-body-height);
  width: var(--bar-body-height);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  border: none;
  outline: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  transition: transform 200ms cubic-bezier(0.34, 1.3, 0.64, 1), filter 200ms ease;
  will-change: transform;
}

.standalone-red-plus-btn:hover { transform: translateY(-2px) scale(1.05); }
.standalone-red-plus-btn:active { transform: scale(0.92); }
.standalone-red-plus-btn:focus-visible { outline: 2px solid #7b5fff; outline-offset: 3px; border-radius: 50%; }

.plus-btn-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.plus-btn-body-path,
.plus-btn-stroke-glow { transition: d 280ms cubic-bezier(0.34, 1.3, 0.64, 1); }

.plus-downlight-group {
  animation: downlightBurst 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: 28px 2px;
}

@keyframes downlightBurst {
  0% { opacity: 0; transform: scaleY(0.2); }
  60% { opacity: 1; transform: scaleY(1.1); }
  100% { opacity: 0.95; transform: scaleY(1); }
}

.plus-downlight-ray { animation: downlightRayPulse 1.6s ease-in-out infinite alternate; }
.plus-downlight-ray.dl-ray-1 { animation-delay: 0.1s; }
.plus-downlight-ray.dl-ray-2 { animation-delay: 0.25s; }
.plus-downlight-ray.dl-ray-3 { animation-delay: 0.4s; }

@keyframes downlightRayPulse {
  0% { stroke-opacity: 0.6; }
  100% { stroke-opacity: 1; }
}

.plus-downlight-floor-glow {
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%) scale(0.6);
  width: 52px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(123, 95, 255, 0.6), transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 280ms ease, transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.plus-downlight-floor-glow.is-active {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.plus-center-hotspot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #7b5fff;
  box-shadow: 0 0 20px #7b5fff;
  pointer-events: none;
  opacity: 0;
  z-index: 4;
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease, box-shadow 240ms ease;
}

.plus-center-hotspot.is-firing { opacity: 0.4; transform: translate(-50%, -50%) scale(1.15); }

.red-plus-icon-holder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 12;
  position: relative;
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), filter 240ms ease;
  will-change: transform;
}

.red-plus-icon-holder.is-rotated { transform: rotate(45deg); }

/* ----------------------------------------------------------------------------
   ELEVATOR MENU OVERLAY & TORCH LIGHT
   ---------------------------------------------------------------------------- */
.elevator-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(7, 15, 45, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9999999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: calc(var(--nav-height, 60px) + 32px + env(safe-area-inset-bottom, 16px));
  animation: overlayDimIn 200ms ease-out forwards;
}

@keyframes overlayDimIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.torch-fullscreen-layer {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 10000000;
  overflow: visible;
  transition: opacity 300ms ease;
}

.torch-beam-fullscreen-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.stage-ignite .torch-main-cone,
.stage-ignite .torch-inner-core {
  opacity: 0.1;
  animation: coneIgniteFlare 120ms ease-out forwards;
}

@keyframes coneIgniteFlare {
  0% { opacity: 0; }
  50% { opacity: 0.25; }
  100% { opacity: 0.15; }
}

.stage-beam-expanding .torch-main-cone { animation: beamShootingUp 340ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.stage-beam-expanding .torch-inner-core { animation: beamCoreShootingUp 340ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes beamShootingUp { 0% { opacity: 0.06; } 50% { opacity: 0.22; } 100% { opacity: 0.15; } }
@keyframes beamCoreShootingUp { 0% { opacity: 0.08; } 100% { opacity: 0.18; } }

.stage-full-view .torch-main-cone { opacity: 0.14; transition: opacity 380ms ease; }
.stage-full-view .torch-inner-core { opacity: 0.16; transition: opacity 380ms ease; }

.torch-center-bulb-flare { animation: flareBreathing 1.4s infinite alternate ease-in-out; }

@keyframes flareBreathing {
  0% { r: 40; opacity: 0.85; }
  100% { r: 50; opacity: 1; }
}

.torch-floating-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #b794ff;
  box-shadow: 0 0 8px #7b5fff;
  opacity: 0;
  pointer-events: none;
}

.stage-beam-expanding .torch-floating-particle,
.stage-full-view .torch-floating-particle {
  animation: floatUpInBeam 2.4s infinite linear;
}

.torch-floating-particle.p1 { animation-delay: 0.1s; }
.torch-floating-particle.p2 { width: 3px; height: 3px; animation-delay: 0.6s; }
.torch-floating-particle.p3 { animation-delay: 1.1s; }
.torch-floating-particle.p4 { width: 3px; height: 3px; animation-delay: 1.6s; }

@keyframes floatUpInBeam {
  0% { opacity: 0; transform: translateY(0) scale(0.6); }
  20% { opacity: 0.85; }
  80% { opacity: 0.85; }
  100% { opacity: 0; transform: translateY(-260px) scale(1.1); }
}

.torch-menu-wrapper {
  position: relative;
  z-index: 10000001;
  width: 100%;
  max-width: 400px;
  margin: 0 12px;
  pointer-events: auto;
}

.torch-menu-wrapper.stage-ignite { opacity: 0; transform: translateY(24px) scale(0.92); }

.torch-menu-wrapper.stage-beam-expanding {
  opacity: 0.9;
  transform: translateY(6px) scale(0.98);
  transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1), transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}

.torch-menu-wrapper.stage-full-view {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px) brightness(1);
  transition: opacity 380ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1), filter 380ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* ----------------------------------------------------------------------------
   ELEVATOR SHAFT CONTAINER
   ---------------------------------------------------------------------------- */
.elevator-shaft-container {
  background: linear-gradient(135deg, #0d1f5c 0%, #081542 100%);
  border: 1.5px solid rgba(120, 90, 255, 0.5);
  border-radius: 24px;
  padding: 18px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(84, 32, 245, 0.5), 0 0 40px rgba(123, 95, 255, 0.2), 0 0 0 1px rgba(123, 95, 255, 0.15) inset;
}

.torch-reveal-glow-edge {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #7b5fff 50%, transparent 100%);
  opacity: 0.8;
  filter: blur(0.5px);
}

.elevator-display-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(120, 160, 255, 0.15);
}

.elevator-status-left { display: flex; align-items: center; gap: 10px; }

.elevator-up-arrow {
  font-size: 12px;
  color: #00e5a0;
  animation: arrowBlink 1.2s infinite alternate;
}

@keyframes arrowBlink { 0% { opacity: 0.4; } 100% { opacity: 1; } }

.elevator-digital-text { display: flex; flex-direction: column; }

.elevator-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #ffffff;
}

.elevator-current-level {
  font-size: 10px;
  color: #a9b7d6;
  letter-spacing: 0.06em;
  margin-top: 2px;
}

.elevator-close-btn {
  color: #ff6b6b;
  font-size: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  background: rgba(255, 107, 107, 0.15);
  border: 1px solid rgba(255, 107, 107, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 180ms ease;
}

.elevator-close-btn:hover {
  background: #ff6b6b;
  color: #ffffff;
  transform: rotate(90deg);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.5);
}

.elevator-floors-list { display: flex; flex-direction: column; gap: 10px; }

.elevator-floor-item {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(120, 160, 255, 0.2);
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  outline: none;
  transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1);
  animation: floorEnter 340ms ease-out both;
  overflow: hidden;
}

@keyframes floorEnter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.elevator-floor-item:hover {
  transform: translateX(4px);
  border-color: rgba(123, 95, 255, 0.7);
  background: rgba(123, 95, 255, 0.12);
  box-shadow: 0 6px 20px rgba(123, 95, 255, 0.3);
}

.elevator-floor-item:active { transform: translateX(2px) scale(0.98); }

.floor-badge-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 20px;
  flex-shrink: 0;
  position: relative;
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.elevator-floor-item:hover .floor-badge-container { transform: scale(1.08) rotate(-4deg); }

.floor-icon { display: inline-flex; align-items: center; justify-content: center; line-height: 1; }
.floor-info-container { flex: 1; display: flex; align-items: center; min-width: 0; }

.floor-title {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.floor-action-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(123, 95, 255, 0.15);
  color: #b794ff;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid rgba(123, 95, 255, 0.35);
  transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.elevator-floor-item:hover .floor-action-arrow {
  background: linear-gradient(135deg, #7b5fff, #a855f7);
  color: #ffffff;
  border-color: transparent;
  transform: translateX(2px) rotate(-45deg);
  box-shadow: 0 0 12px rgba(123, 95, 255, 0.6);
}

.elevator-base-light {
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #7b5fff 50%, transparent 100%);
  opacity: 0.6;
}

/* ----------------------------------------------------------------------------
   RESPONSIVE QUERIES
   ---------------------------------------------------------------------------- */
@media (max-width: 640px) {
  :root { --nav-element-gap: 12px; }

  .bottom-navigation-container { padding: 0 10px 10px 10px; }
  .bottom-nav-suite { gap: var(--nav-element-gap); max-width: 100%; padding: 0; }
  .active-floating-disc { width: 42px; height: 42px; top: 25px; }
  .standalone-red-plus-wrapper { margin-bottom: 2px; }

  .elevator-overlay {
    padding-bottom: calc(var(--nav-height, 54px) + 24px + env(safe-area-inset-bottom, 12px));
  }

  .torch-menu-wrapper { max-width: 350px; margin: 0 10px; }
  .elevator-shaft-container { padding: 14px; border-radius: 20px; }
  .elevator-floor-item { padding: 10px 12px; gap: 10px; }
  .floor-badge-container { width: 38px; height: 38px; font-size: 18px; }
  .floor-title { font-size: 14px; }
}

@media (max-width: 380px) {
  :root { --nav-element-gap: 10px; }
  .bottom-nav-suite { gap: var(--nav-element-gap); padding: 0; }
  .active-floating-disc { width: 40px; height: 40px; top: 24px; }
}
`;

/**
 * ============================================================================
 * 2. NAVIGATION ICONS
 * ============================================================================
 */
export function IconHome({ size = 24, color = '#b794ff', className = '', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={`nav-svg-icon icon-home ${className}`}
      aria-label="Home" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M12 2.6L2 10.8H5.2V21H9.6V15.2C9.6 13.9 10.7 12.8 12 12.8C13.3 12.8 14.4 13.9 14.4 15.2V21H18.8V10.8H22L12 2.6Z" />
    </svg>
  );
}

export function IconPlus({ size = 26, color = '#ffffff', strokeWidth = 3.2, className = '', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={`nav-svg-icon icon-plus ${className}`}
      aria-label="Add" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/**
 * ============================================================================
 * 3. ELEVATOR MENU COMPONENT
 * ============================================================================
 */
const ELEVATOR_FLOORS = [
  { id: 'deposit', title: 'Deposit Fund', icon: <FaWallet />, color: '#4dabff', path: '/dashboard/DepositFund' },
  { id: 'bot', title: 'Bot Status', icon: <RiRobot2Line />, color: '#b794ff', path: '/dashboard/BotTreading' },
  { id: 'mining', title: 'Token Mining', icon: <RiHandCoinFill />, color: '#00e5a0', path: '/dashboard/InvestToken' },
];

export function ElevatorMenu({ isOpen, onClose, onSelect, plusCoords }) {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [torchStage, setTorchStage] = useState('idle');
  const [viewport, setViewport] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [menuRect, setMenuRect] = useState(null);

  const getLivePlusCenter = () => {
    if (typeof document !== 'undefined') {
      const plusBtn = document.getElementById('standalone-red-plus-button');
      if (plusBtn) {
        const iconHolder = plusBtn.querySelector('.red-plus-icon-holder') || plusBtn;
        const rect = iconHolder.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
      }
    }
    if (plusCoords && plusCoords.x > 0 && plusCoords.y > 0) return plusCoords;
    return {
      x: typeof window !== 'undefined' ? window.innerWidth * 0.75 : 400,
      y: typeof window !== 'undefined' ? window.innerHeight - 80 : 700,
    };
  };

  const [coords, setCoords] = useState(() => getLivePlusCenter());

  const updateMeasurements = () => {
    setViewport({ w: window.innerWidth, h: window.innerHeight });
    const live = getLivePlusCenter();
    setCoords(live);
    if (menuRef.current) {
      const r = menuRef.current.getBoundingClientRect();
      setMenuRect({
        left: r.left, right: r.right, top: r.top, bottom: r.bottom,
        width: r.width, height: r.height, centerX: r.left + r.width / 2,
      });
    }
  };

  useEffect(() => {
    let t1, t2;
    if (isOpen) {
      updateMeasurements();
      setTorchStage('ignite');
      t1 = setTimeout(() => { setTorchStage('beam-expanding'); updateMeasurements(); }, 70);
      t2 = setTimeout(() => { setTorchStage('full-view'); updateMeasurements(); }, 360);
    } else {
      setTorchStage('idle');
    }
    return () => { if (t1) clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => updateMeasurements();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const liveCenter = getLivePlusCenter();
  const originX = liveCenter.x;
  const originY = liveCenter.y;
  const targetLeft = menuRect ? menuRect.left - 15 : viewport.w * 0.5 - 180;
  const targetRight = menuRect ? menuRect.right + 15 : viewport.w * 0.5 + 180;
  const targetTop = menuRect ? menuRect.top - 10 : viewport.h * 0.15;

  return (
    <div className="elevator-overlay" onClick={onClose}>
      <div className={`torch-fullscreen-layer stage-${torchStage}`} aria-hidden="true">
        <svg className="torch-beam-fullscreen-svg"
          viewBox={`0 0 ${viewport.w} ${viewport.h}`}
          preserveAspectRatio="none">
          <defs>
            <linearGradient id="torchUserConeGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#7b5fff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7b5fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="torchUserCoreGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#b794ff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#b794ff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="torchBulbHotspot">
              <stop offset="0%" stopColor="#b794ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7b5fff" stopOpacity="0" />
            </radialGradient>
            <filter id="torchBeamSoftBlur">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <linearGradient id="plusDownlightConeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b794ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7b5fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="plusDownlightCoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon className="torch-main-cone"
            points={`${originX},${originY} ${targetLeft - 25},${targetTop} ${targetRight + 25},${targetTop}`}
            fill="url(#torchUserConeGrad)"
            filter="url(#torchBeamSoftBlur)" />
          <polygon className="torch-inner-core"
            points={`${originX},${originY} ${targetLeft + 20},${targetTop + 15} ${targetRight - 20},${targetTop + 15}`}
            fill="url(#torchUserCoreGrad)" />
          <circle cx={originX} cy={originY} r="28"
            fill="url(#torchBulbHotspot)" opacity="0.1"
            className="torch-center-bulb-flare" />
        </svg>

        <div className="torch-floating-particle p1" style={{ left: originX - 25, top: originY - 50 }} />
        <div className="torch-floating-particle p2" style={{ left: originX - 60, top: originY - 120 }} />
        <div className="torch-floating-particle p3" style={{ left: originX + 25, top: originY - 80 }} />
        <div className="torch-floating-particle p4" style={{ left: originX - 90, top: originY - 180 }} />
      </div>

      <div className={`torch-menu-wrapper stage-${torchStage}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Elevator Menu">
        <div ref={menuRef} className="elevator-shaft-container">
          <div className="torch-reveal-glow-edge" />

          <div className="elevator-display-panel">
            <div className="elevator-status-left">
              <span className="elevator-up-arrow" aria-hidden="true">▲</span>
              <div className="elevator-digital-text">
                <span className="elevator-label">QUICK ACTIONS</span>
              </div>
            </div>
            <button type="button" className="elevator-close-btn" onClick={onClose}
              aria-label="Close elevator menu">✕</button>
          </div>

          <div className="elevator-floors-list">
            {ELEVATOR_FLOORS.map((item, index) => {
              const animationDelay = `${(ELEVATOR_FLOORS.length - 1 - index) * 0.06 + 0.05}s`;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="elevator-floor-item"
                  style={{ animationDelay, '--accent': item.color }}
                  onClick={() => {
                    if (onSelect) onSelect(item);
                    onClose();
                    if (item.path) navigate(item.path);
                  }}
                >
                  <div
                    className="floor-badge-container"
                    style={{ background: `${item.color}22`, color: item.color }}
                  >
                    <span className="floor-icon">{item.icon}</span>
                  </div>

                  <div className="floor-info-container">
                    <span className="floor-title">{item.title}</span>
                  </div>

                  <div className="floor-action-arrow">
                    <span>↑</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="elevator-base-light" />
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * 4. MAIN BOTTOM NAVIGATION COMPONENT
 * ============================================================================
 */
const NAV_SLOTS = [
  { id: 'home', icon: 'home', label: 'Home', index: 0, path: '/dashboard' },
  { id: 'Game', icon: 'Game', label: 'Game', index: 1, path: '/dashboard/game' },
  { id: 'p2p', icon: 'p2p', label: 'Fund Transfer', index: 2, path: '/dashboard/Fundtransfer' },
  { id: 'invest', icon: 'invest', label: 'Invest', index: 3, path: '/dashboard/InvestFund' },
];

const getTabFromPath = (pathname) => {
  if (!pathname) return 'home';
  if (pathname.startsWith('/dashboard/game')) return 'Game';
  if (pathname.startsWith('/dashboard/Fundtransfer')) return 'p2p';
  if (pathname.startsWith('/dashboard/InvestFund')) return 'invest';
  return 'home';
};

export default function BottomNavigation({
  activeTab,
  onChange,
  className = '',
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const urlTab = getTabFromPath(location.pathname);
  const initialTab = activeTab || urlTab;

  const getIndexFromId = (id) => {
    const found = NAV_SLOTS.find((s) => s.id === id);
    return found ? found.index : 0;
  };

  const [currentTab, setCurrentTab] = useState(initialTab);
  const [activeIndex, setActiveIndex] = useState(() => getIndexFromId(initialTab));
  const [animPhase, setAnimPhase] = useState('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isElevatorOpen, setIsElevatorOpen] = useState(false);

  const barContainerRef = useRef(null);
  const [barWidth, setBarWidth] = useState(300);

  const plusBtnRef = useRef(null);
  const [plusCoords, setPlusCoords] = useState(null);

  const getExactPlusCoords = () => {
    if (plusBtnRef.current) {
      const rect = plusBtnRef.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: isElevatorOpen ? rect.top + 4 : rect.top + rect.height / 2,
      };
    }
    return null;
  };

  useEffect(() => {
    const updateSize = () => {
      if (barContainerRef.current) {
        const measured = barContainerRef.current.getBoundingClientRect().width;
        if (measured > 50) setBarWidth(Math.round(measured));
      }
      const coords = getExactPlusCoords();
      if (coords) setPlusCoords(coords);
    };

    updateSize();

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && barContainerRef.current) {
      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(barContainerRef.current);
    }

    window.addEventListener('resize', updateSize);
    window.addEventListener('scroll', updateSize);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('scroll', updateSize);
    };
  }, [isElevatorOpen]);

  const timersRef = useRef([]);
  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  useEffect(() => {
    if (activeTab && activeTab !== currentTab && !isAnimating) {
      const targetIdx = getIndexFromId(activeTab);
      triggerTransition(activeTab, targetIdx);
    }
  }, [activeTab]);

  useEffect(() => {
    const tabFromUrl = getTabFromPath(location.pathname);
    if (tabFromUrl !== currentTab && !isAnimating) {
      const targetIdx = getIndexFromId(tabFromUrl);
      triggerTransition(tabFromUrl, targetIdx);
    }
  }, [location.pathname]);

  const triggerTransition = (targetId, targetIndex) => {
    clearAllTimers();
    setIsAnimating(true);

    if (targetIndex === activeIndex) {
      setAnimPhase('pressed');
      const t1 = setTimeout(() => {
        setAnimPhase('settling');
        const t2 = setTimeout(() => {
          setAnimPhase('idle');
          setIsAnimating(false);
        }, 140);
        timersRef.current.push(t2);
      }, 80);
      timersRef.current.push(t1);
      return;
    }

    setAnimPhase('pressed');

    const t1 = setTimeout(() => {
      setAnimPhase('rising');
      setActiveIndex(targetIndex);
      setCurrentTab(targetId);

      const t2 = setTimeout(() => {
        setAnimPhase('settling');
        const t3 = setTimeout(() => {
          setAnimPhase('idle');
          setIsAnimating(false);
        }, 160);
        timersRef.current.push(t3);
      }, 230);
      timersRef.current.push(t2);
    }, 90);
    timersRef.current.push(t1);
  };

  const handleNavClick = (id, index) => {
    const slot = NAV_SLOTS.find((s) => s.id === id);
    const targetPath = slot?.path;
    const isSamePath = targetPath && location.pathname === targetPath;

    if (index === activeIndex && !isAnimating && isSamePath) {
      triggerTransition(id, index);
      return;
    }

    if (isAnimating) return;

    triggerTransition(id, index);
    if (onChange) onChange(id);

    if (targetPath && !isSamePath) {
      navigate(targetPath);
    }
  };

  const handlePlusClick = (e) => {
    e.stopPropagation();
    const coords = getExactPlusCoords();
    if (coords) setPlusCoords(coords);
    setIsElevatorOpen((prev) => !prev);
  };

  const handleSelectElevatorFloor = (floorItem) => {
    if (onChange) onChange(`elevator-${floorItem.id}`);
  };

  const renderIcon = (iconName, size = 22, color = '#ffffff') => {
    switch (iconName) {
      case 'home':
        return <IconHome size={size} color={color} />;
      case 'Game':
        return <IoGameController size={size} color={color} />;
      case 'p2p':
        return <RiP2pFill size={size} color={color} />;
      case 'invest':
        return <FaMoneyBillTrendUp size={size} color={color} />;
      default:
        return <IconHome size={size} color={color} />;
    }
  };

  const slotWidth = barWidth / NAV_SLOTS.length;
  const activeX = slotWidth * (activeIndex + 0.5);

  const craterCutoutPathD = `
    M -36 16
    C -27 16, -26 23, -22 28
    C -16 35,  -9 42,   0 42
    C   9 42,  16 35,  22 28
    C  26 23,  27 16,  36 16
    Z
  `;

  const craterBorderStrokeD = `
    M -35 16
    C -27 16, -26 23, -22 28
    C -16 35,  -9 42,   0 42
    C   9 42,  16 35,  22 28
    C  26 23,  27 16,  35 16
  `;

  return (
    <div className={`bottom-navigation-container ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: BOTTOM_NAVIGATION_STYLES }} />

      <div className="bottom-nav-suite">
        <div ref={barContainerRef} id="bottom-navigation-bar"
          className="notch-nav-root" role="navigation"
          aria-label="Bottom Navigation Bar">
          <svg className="notch-nav-svg"
            viewBox={`0 0 ${barWidth} 74`}
            preserveAspectRatio="none">
            <defs>
              <mask id="bar-crater-cutout-mask" maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width={barWidth} height="74" fill="#ffffff" />
                <g className="crater-moving-group"
                  style={{ transform: `translateX(${activeX}px)` }}>
                  <path d={craterCutoutPathD} fill="#0a1a55" />
                </g>
              </mask>

              <clipPath id="barBoundaryClip">
                <rect x="0" y="16" width={barWidth} height="56" rx="20" />
              </clipPath>

              <filter id="navBarGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="navBarGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0d1f5c" />
                <stop offset="100%" stopColor="#081542" />
              </linearGradient>
            </defs>

            <rect x="0" y="16" width={Math.max(barWidth, 0)} height="56" rx="20"
              fill="url(#navBarGrad)"
              mask="url(#bar-crater-cutout-mask)" />

            {barWidth > 2 && (
              <rect x="1" y="17" width={barWidth - 2} height="54" rx="19"
                fill="none" stroke="rgba(123, 95, 255, 0.55)" strokeWidth="2.5"
                filter="url(#navBarGlow)"
                mask="url(#bar-crater-cutout-mask)" />
            )}

            <rect x="1" y="17" width={barWidth - 2} height="54" rx="19"
              fill="none" stroke="rgba(183, 148, 255, 0.7)" strokeWidth="0.8"
              opacity="0.9"
              mask="url(#bar-crater-cutout-mask)" />

            <g clipPath="url(#barBoundaryClip)">
              <g className="crater-moving-group"
                style={{ transform: `translateX(${activeX}px)` }}>
                <path d={craterBorderStrokeD} fill="none"
                  stroke="#7b5fff" strokeWidth="2.5" strokeLinecap="round"
                  filter="url(#navBarGlow)" />
                <path d={craterBorderStrokeD} fill="none"
                  stroke="rgba(183, 148, 255, 0.9)" strokeWidth="0.8" strokeLinecap="round" />
              </g>
            </g>
          </svg>

          <div className={`active-floating-disc-holder phase-${animPhase}`}
            style={{ transform: `translateX(${activeX}px)` }}>
            <div className="active-floating-disc" role="presentation">
              <span className="active-icon-wrapper">
                {renderIcon(currentTab, 22, '#ffffff')}
              </span>
            </div>
          </div>

          <div className="nav-slots-row">
            {NAV_SLOTS.map((slot) => {
              const isActive = slot.index === activeIndex;
              return (
                <button key={slot.id} type="button"
                  className={`notch-slot-btn ${isActive ? 'is-active-slot' : ''}`}
                  onClick={() => handleNavClick(slot.id, slot.index)}
                  aria-label={slot.label}
                  aria-pressed={isActive}
                  style={{ left: `${slotWidth * slot.index}px`, width: `${slotWidth}px` }}>
                  <div className="slot-content-stack">
                    <span className={`slot-icon-holder ${isActive ? 'icon-hidden' : 'icon-visible'}`}>
                      {renderIcon(slot.icon, 20, '#b794ff')}
                    </span>
                    <span className={`slot-label-text ${isActive ? 'label-active' : 'label-inactive'}`}>
                      {slot.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="standalone-red-plus-wrapper">
          <div className={`plus-downlight-floor-glow ${isElevatorOpen ? 'is-active' : ''}`} />

          <button ref={plusBtnRef} id="standalone-red-plus-button"
            type="button" className="standalone-red-plus-btn"
            onClick={handlePlusClick}
            aria-label={isElevatorOpen ? "Close creation menu" : "Open creation menu"}
            aria-expanded={isElevatorOpen}>
            <svg className="plus-btn-svg" viewBox="0 0 56 56" preserveAspectRatio="none">
              <defs>
                <filter id="plusBtnGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#7b5fff" floodOpacity="0.9" />
                  <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#a855f7" floodOpacity="0.7" />
                  <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#5420f5" floodOpacity="0.6" />
                </filter>

                <linearGradient id="plusBtnGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7b5fff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <linearGradient id="plusDownlightConeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b794ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#7b5fff" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="plusDownlightCoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d={isElevatorOpen
                  ? "M 16 4.5 L 28 17 L 40 4.5 A 26 26 0 1 1 16 4.5 Z"
                  : "M 28 2 A 26 26 0 1 1 27.99 2 Z"}
                fill="url(#plusBtnGrad)"
                className="plus-btn-body-path" />

              <path
                d={isElevatorOpen
                  ? "M 16 4.5 L 28 17 L 40 4.5 A 26 26 0 1 1 16 4.5 Z"
                  : "M 28 2 A 26 26 0 1 1 27.99 2 Z"}
                fill="none" stroke="rgba(183, 148, 255, 0.9)" strokeWidth="2.5"
                strokeLinejoin="round" strokeLinecap="round"
                filter="url(#plusBtnGlow)"
                className="plus-btn-stroke-glow" />

              <path
                d={isElevatorOpen
                  ? "M 16 4.5 L 28 17 L 40 4.5 A 26 26 0 1 1 16 4.5 Z"
                  : "M 28 2 A 26 26 0 1 1 27.99 2 Z"}
                fill="none" stroke="#ffffff" strokeWidth="0.8"
                strokeLinejoin="round" strokeLinecap="round"
                opacity="0.7" />

              {isElevatorOpen && (
                <g className="plus-downlight-group">
                  <polygon points="28,2 14,24 42,24"
                    fill="url(#plusDownlightConeGrad)"
                    className="plus-downlight-cone" />
                  <polygon points="28,2 20,20 36,20"
                    fill="url(#plusDownlightCoreGrad)"
                    className="plus-downlight-core" />
                  <line x1="28" y1="2" x2="18" y2="24" stroke="#ffffff"
                    strokeWidth="1.2" strokeOpacity="0.35"
                    className="plus-downlight-ray dl-ray-1" />
                  <line x1="28" y1="2" x2="28" y2="26" stroke="#ffffff"
                    strokeWidth="1.8" strokeOpacity="0.45"
                    className="plus-downlight-ray dl-ray-2" />
                  <line x1="28" y1="2" x2="38" y2="24" stroke="#ffffff"
                    strokeWidth="1.2" strokeOpacity="0.35"
                    className="plus-downlight-ray dl-ray-3" />
                  <circle cx="28" cy="2" r="1.8" fill="#ffffff"
                    opacity="0.45" className="plus-vcut-emitter" />
                </g>
              )}
            </svg>

            <span className={`plus-center-hotspot ${isElevatorOpen ? 'is-firing' : ''}`}
              aria-hidden="true" />

            <span className={`red-plus-icon-holder ${isElevatorOpen ? 'is-rotated' : ''}`}>
              <IconPlus size={24} color="#ffffff" strokeWidth={2.8} />
            </span>
          </button>
        </div>
      </div>

      <ElevatorMenu
        isOpen={isElevatorOpen}
        onClose={() => setIsElevatorOpen(false)}
        onSelect={handleSelectElevatorFloor}
        plusCoords={plusCoords}
      />
    </div>
  );
}