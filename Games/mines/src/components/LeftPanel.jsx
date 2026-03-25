import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Coins, Zap, Shuffle, LogOut, ChevronDown, StopCircle } from 'lucide-react';
import AutoSettingsPanel from './AutoSettingsPanel';

const mineOptions = Array.from({ length: 24 }, (_, i) => i + 1);

function formatINR(v) {
  return '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export default function LeftPanel({
  state,
  setWallet, setBet, halfBet, doubleBet, setMines,
  toggleAuto, clearAutoTiles, updateAutoSettings,
  startAutoSession, stopAutoSession,
  startGame, cashOut, reset, randomPick,
}) {
  const {
    phase, wallet, bet, mines, multiplier, openedCount, profit,
    autoMode, autoSelectedTiles, autoSelectionLocked, autoRunning,
    autoSettings, autoStats,
  } = state;

  const playing = phase === 'playing';
  const canCashOut = playing && openedCount > 0;
  const safeLeft = 25 - mines - openedCount;
  const [walletInput, setWalletInput] = useState(wallet);

  const handleWalletBlur = () => {
    const v = Math.max(1, Math.min(100000, Number(walletInput)));
    setWalletInput(v);
    setWallet(v);
  };

  // Controls locked when: playing manually, or auto session is running
  const locked = playing || autoRunning;

  return (
    <div className="glass p-4 flex flex-col gap-4 sticky top-4">
      {/* Logo */}
      <div className="text-center pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="logo-text" style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
          💎 Mines
        </span>
      </div>

      {/* Manual / Auto toggle */}
      <div>
        <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
          Mode
        </label>
        <div className="toggle-pill">
          <button
            className={`toggle-option ${!autoMode ? 'active' : ''}`}
            onClick={() => autoMode && !locked && toggleAuto()}
            disabled={locked}
          >
            Manual
          </button>
          <button
            className={`toggle-option ${autoMode ? 'active' : ''}`}
            onClick={() => !autoMode && !locked && toggleAuto()}
            disabled={locked}
          >
            Auto
          </button>
        </div>
      </div>

      {/* Wallet */}
      <div>
        <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <Wallet size={11} /> Wallet
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#00ff88', fontWeight: 700, fontSize: '0.85rem' }}>₹</span>
          <input
            className="field-input"
            style={{ paddingLeft: 24 }}
            type="number"
            min="1"
            max="100000"
            value={locked ? wallet : walletInput}
            disabled={locked}
            onChange={e => setWalletInput(e.target.value)}
            onBlur={handleWalletBlur}
          />
        </div>
        <div style={{ marginTop: 4, fontSize: '0.75rem', color: '#00ff88', opacity: 0.8 }}>
          Balance: {formatINR(wallet)}
        </div>
      </div>

      {/* Bet Amount */}
      <div>
        <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <Coins size={11} /> Bet Amount
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>₹</span>
          <input
            className="field-input"
            style={{ paddingLeft: 24 }}
            type="number"
            min="0"
            max={wallet}
            value={bet}
            disabled={locked}
            onChange={e => setBet(Number(e.target.value))}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={halfBet} disabled={locked}>½</button>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={doubleBet} disabled={locked}>2×</button>
        </div>
      </div>

      {/* Mines selector */}
      <div>
        <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          💣 Mines
        </label>
        <div style={{ position: 'relative' }}>
          <select
            className="field-input"
            style={{ appearance: 'none', paddingRight: 32, cursor: locked ? 'not-allowed' : 'pointer' }}
            value={mines}
            disabled={locked}
            onChange={e => setMines(Number(e.target.value))}
          >
            {mineOptions.map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'mine' : 'mines'}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Gems remaining */}
      <div className="stat-card flex items-center justify-between">
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>💎 Safe tiles left</span>
        <span style={{ fontWeight: 700, color: '#00ff88', fontSize: '0.95rem' }}>
          {playing ? safeLeft : 25 - mines}
        </span>
      </div>

      {/* ── AUTO MODE PANEL ─────────────────────────────── */}
      {autoMode && (
        <AutoSettingsPanel
          settings={autoSettings}
          onUpdate={updateAutoSettings}
          autoSelectedTiles={autoSelectedTiles}
          clearAutoTiles={clearAutoTiles}
          autoRunning={autoRunning}
          autoStats={autoStats}
          bet={bet}
        />
      )}

      {/* ── Live profit (manual mode) ──────────────────── */}
      {!autoMode && (
        <AnimatePresence>
          {playing && openedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="stat-card"
            >
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>Current Profit</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00ff88', textShadow: '0 0 12px rgba(0,255,136,0.5)' }}>
                +{formatINR(profit.toFixed(2))}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                {multiplier.toFixed(3)}× multiplier
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── ACTION BUTTONS ─────────────────────────────── */}

      {/* MANUAL MODE buttons */}
      {!autoMode && (
        <>
          {phase === 'idle' && (
            <button
              className="btn-primary w-full"
              onClick={startGame}
              disabled={bet <= 0 || bet > wallet}
              style={{ width: '100%' }}
            >
              <Zap size={15} style={{ display: 'inline', marginRight: 6 }} />
              Place Bet
            </button>
          )}
          {(phase === 'gameover' || phase === 'cashedout') && (
            <button className="btn-primary w-full" onClick={reset} style={{ width: '100%' }}>
              🔄 New Game
            </button>
          )}
          {playing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn-random w-full" onClick={randomPick} style={{ width: '100%' }}>
                <Shuffle size={13} style={{ display: 'inline', marginRight: 6 }} />
                Random Pick
              </button>
              <AnimatePresence>
                {canCashOut && (
                  <motion.button
                    className="btn-cashout"
                    style={{ width: '100%' }}
                    onClick={cashOut}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  >
                    <LogOut size={14} style={{ display: 'inline', marginRight: 6 }} />
                    Cash Out {formatINR((bet * multiplier).toFixed(2))}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* AUTO MODE buttons */}
      {autoMode && (
        <>
          {!autoRunning && phase === 'idle' && (
            <motion.button
              className="btn-primary w-full"
              style={{ width: '100%', opacity: autoSelectedTiles.length === 0 || bet <= 0 ? 0.4 : 1 }}
              onClick={startAutoSession}
              disabled={autoSelectedTiles.length === 0 || bet <= 0 || bet > wallet}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Zap size={15} style={{ display: 'inline', marginRight: 6 }} />
              Start Auto Bet
              {autoSelectedTiles.length === 0 && <span style={{ fontSize: '0.75rem', marginLeft: 6, opacity: 0.7 }}>(select tiles first)</span>}
            </motion.button>
          )}

          {autoRunning && (
            <motion.button
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ff4444 0%, #cc2222 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 20px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 0 20px rgba(255,68,68,0.35)',
                animation: 'cashout-pulse 1.5s ease-in-out infinite',
              }}
              onClick={stopAutoSession}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <StopCircle size={15} style={{ display: 'inline', marginRight: 6 }} />
              Stop Auto
            </motion.button>
          )}

          {!autoRunning && (phase === 'gameover' || phase === 'cashedout') && (
            <button className="btn-secondary" style={{ width: '100%' }} onClick={reset}>
              🔄 Reset Board
            </button>
          )}
        </>
      )}

      {/* Fairness */}
      <button
        className="btn-secondary"
        style={{ fontSize: '0.75rem', padding: '6px 12px', marginTop: 'auto' }}
        onClick={() => alert('This game uses a provably fair Fisher-Yates shuffle to place mines. The RNG seed is generated client-side.')}
      >
        🔒 Provably Fair
      </button>
    </div>
  );
}
