import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import { sounds } from './hooks/useSounds';
import LeftPanel from './components/LeftPanel';
import Grid from './components/Grid';
import RightPanel from './components/RightPanel';
import WinModal from './components/WinModal';

export default function App() {
  const {
    state,
    setWallet, setBet, halfBet, doubleBet, setMines,
    toggleAuto, toggleAutoTile, clearAutoTiles, updateAutoSettings,
    startAutoSession, stopAutoSession, autoRoundEnd,
    startGame, startNewRound, revealTile, cashOut, closeWinModal, reset, randomPick,
  } = useGameState();

  const prevPhase = useRef(state.phase);
  const prevOpened = useRef(state.openedCount);
  const autoTimer = useRef(null);
  const autoRevealTimers = useRef([]);

  // ── Sound effects ─────────────────────────────────────────────
  useEffect(() => {
    const prev = prevPhase.current;
    const cur = state.phase;
    if (cur === 'gameover' && prev === 'playing') sounds.explosion();
    else if (cur === 'cashedout' && prev === 'playing') sounds.win();
    else if (cur === 'playing' && prev === 'idle') sounds.click();
    prevPhase.current = cur;
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === 'playing' && state.openedCount > prevOpened.current) sounds.diamond();
    prevOpened.current = state.openedCount;
  }, [state.openedCount, state.phase]);

  // ── Clear all timers when auto session stops ──────────────────
  useEffect(() => {
    if (!state.autoRunning) {
      clearTimeout(autoTimer.current);
      autoRevealTimers.current.forEach(t => clearTimeout(t));
      autoRevealTimers.current = [];
    }
  }, [state.autoRunning]);

  // ── Auto: EFFECT 1 – idle → start game ───────────────────────
  // Only starts the game; reveal timers are set in Effect 2 below.
  useEffect(() => {
    if (!state.autoRunning || state.phase !== 'idle') return;
    if (state.autoSelectedTiles.length === 0) return;

    autoTimer.current = setTimeout(() => startGame(), 600);
    return () => clearTimeout(autoTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.autoRunning, state.phase]);

  // ── Auto: EFFECT 2 – playing → reveal pre-selected tiles ──────
  // Fires when phase flips to 'playing' (one render after startGame).
  // Kept separate so the idle effect cleanup never cancels these timers.
  useEffect(() => {
    if (!state.autoRunning || state.phase !== 'playing') return;

    // Snapshot tiles (locked during session, won't change mid-session)
    const tiles = [...state.autoSelectedTiles];
    if (tiles.length === 0) return;

    // Clear any stale timers from a previous round
    autoRevealTimers.current.forEach(t => clearTimeout(t));
    autoRevealTimers.current = [];

    // Reveal ALL tiles simultaneously (150ms after game starts)
    tiles.forEach((tileIdx) => {
      const t = setTimeout(() => revealTile(tileIdx), 150);
      autoRevealTimers.current.push(t);
    });
    // Cash out 400ms after reveals fire
    autoRevealTimers.current.push(setTimeout(() => cashOut(), 550));

    // Cleanup: only runs when phase changes away from 'playing'
    return () => {
      autoRevealTimers.current.forEach(t => clearTimeout(t));
      autoRevealTimers.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.autoRunning, state.phase]);

  // ── Auto: EFFECT 3 – round ended → update stats, start next ───
  useEffect(() => {
    if (!state.autoRunning) return;
    if (state.phase !== 'gameover' && state.phase !== 'cashedout') return;

    const isWin = state.phase === 'cashedout';
    const roundProfit = state.profit;

    // Short pause so the player can see the result, then advance
    autoTimer.current = setTimeout(() => {
      autoRoundEnd(isWin, roundProfit); // adjust bet + check stop conditions
      setTimeout(() => reset(), 180);   // reset to idle → triggers Effect 1 if still running
    }, 1000);

    return () => clearTimeout(autoTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.autoRunning]);

  // ── Tile click handler ────────────────────────────────────────
  const handleTileClick = (idx) => {
    if (state.autoMode) {
      if (!state.autoSelectionLocked && state.phase === 'idle') {
        // Pre-selection mode: toggle tile in/out of selected set
        toggleAutoTile(idx);
      }
      // During auto session, tile clicks are ignored (auto handles it)
      return;
    }
    // Manual mode
    if (state.phase !== 'playing') return;
    revealTile(idx);
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-dark)' }}>
      {/* Top nav */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>💎</span>
          <span className="logo-text" style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Mines & Diamonds
          </span>
          {state.autoMode && (
            <span style={{
              background: state.autoRunning ? 'rgba(0,255,136,0.15)' : 'rgba(167,139,250,0.15)',
              border: `1px solid ${state.autoRunning ? 'rgba(0,255,136,0.3)' : 'rgba(167,139,250,0.3)'}`,
              color: state.autoRunning ? '#00ff88' : '#a78bfa',
              borderRadius: 6,
              padding: '2px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              {state.autoRunning ? '⚡ AUTO RUNNING' : '🎛 AUTO MODE'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            🏆 {state.stats.wins}W
            <span style={{ margin: '0 4px', color: '#334155' }}>·</span>
            {state.stats.losses}L
          </div>
          <div style={{
            background: 'rgba(0,255,136,0.12)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: 8,
            padding: '4px 12px',
            fontSize: '0.875rem',
            color: '#00ff88',
            fontWeight: 700,
          }}>
            ₹{state.wallet.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="game-layout">
        <div>
          <LeftPanel
            state={state}
            setWallet={setWallet}
            setBet={setBet}
            halfBet={halfBet}
            doubleBet={doubleBet}
            setMines={setMines}
            toggleAuto={toggleAuto}
            clearAutoTiles={clearAutoTiles}
            updateAutoSettings={updateAutoSettings}
            startAutoSession={startAutoSession}
            stopAutoSession={stopAutoSession}
            startGame={startGame}
            startNewRound={startNewRound}
            cashOut={cashOut}
            reset={reset}
            randomPick={randomPick}
          />
        </div>

        <div style={{ paddingTop: 8 }}>
          <Grid
            grid={state.grid}
            phase={state.phase}
            onReveal={handleTileClick}
            multiplier={state.multiplier}
            openedCount={state.openedCount}
            mines={state.mines}
            autoMode={state.autoMode}
            autoSelectedTiles={state.autoSelectedTiles}
            autoSelectionLocked={state.autoSelectionLocked}
            autoRunning={state.autoRunning}
          />
        </div>

        <div className="panel-right">
          <RightPanel stats={state.stats} />
        </div>
      </div>

      <AnimatePresence>
        {state.showWinModal && (
          <WinModal
            winAmount={state.winAmount}
            multiplier={state.multiplier}
            onClose={closeWinModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
