// Game State Management Hook – Advanced Auto Mode
import { useReducer, useCallback } from 'react';

const GRID_SIZE = 25;
const HOUSE_EDGE = 0.97;

function placeMines(count) {
  const indices = Array.from({ length: GRID_SIZE }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return new Set(indices.slice(0, count));
}

function createGrid(mineSet) {
  return Array.from({ length: GRID_SIZE }, (_, i) => ({
    id: i, isMine: mineSet.has(i), revealed: false, isExploding: false,
  }));
}

function calcNextMultiplier(currentMult, mines, openedCount) {
  const remaining = GRID_SIZE - openedCount;
  const safeTilesLeft = remaining - mines;
  if (safeTilesLeft <= 0) return currentMult;
  const prob = safeTilesLeft / remaining;
  return currentMult * (HOUSE_EDGE / prob);
}

const initialState = {
  phase: 'idle',
  wallet: 1000,
  bet: 100,
  mines: 3,
  grid: [],
  multiplier: 1,
  openedCount: 0,
  profit: 0,
  stats: { wins: 0, losses: 0, wagered: 0, totalProfit: 0, history: [] },
  // ── Auto mode ──────────────────────────────────────────────
  autoMode: false,
  autoSelectedTiles: [],       // indices chosen before session start
  autoSelectionLocked: false,  // true while session is running
  autoRunning: false,
  autoSettings: {
    onWin: 'reset',           // 'reset' | 'increase'
    onWinPct: 10,
    onLoss: 'reset',          // 'reset' | 'increase'
    onLossPct: 20,
    stopOnProfit: null,       // ₹ limit, null = no limit
    stopOnLoss: null,
    maxBets: null,            // null = infinite
  },
  autoStats: { betsPlaced: 0, sessionProfit: 0, baseBet: 0 },
  // ────────────────────────────────────────────────────────────
  lastExplodedIdx: -1,
  showWinModal: false,
  winAmount: 0,
};

function reducer(state, action) {
  switch (action.type) {

    case 'SET_WALLET':
      if (state.phase === 'playing') return state;
      return { ...state, wallet: action.value };

    case 'SET_BET': {
      if (state.phase === 'playing' || state.autoRunning) return state;
      const v = Math.max(0, Math.min(action.value, state.wallet));
      return { ...state, bet: v };
    }

    case 'HALF_BET':
      if (state.phase === 'playing' || state.autoRunning) return state;
      return { ...state, bet: Math.max(1, Math.floor(state.bet / 2)) };

    case 'DOUBLE_BET':
      if (state.phase === 'playing' || state.autoRunning) return state;
      return { ...state, bet: Math.min(state.wallet, state.bet * 2) };

    case 'SET_MINES':
      if (state.phase === 'playing' || state.autoRunning) return state;
      return { ...state, mines: action.value };

    case 'TOGGLE_AUTO':
      if (state.phase === 'playing') return state;
      return {
        ...state,
        autoMode: !state.autoMode,
        autoSelectedTiles: [],
        autoSelectionLocked: false,
        autoRunning: false,
        autoStats: { betsPlaced: 0, sessionProfit: 0, baseBet: 0 },
      };

    case 'TOGGLE_AUTO_TILE': {
      if (state.autoSelectionLocked || state.phase === 'playing') return state;
      const idx = action.index;
      const tiles = state.autoSelectedTiles;
      const next = tiles.includes(idx) ? tiles.filter(i => i !== idx) : [...tiles, idx];
      return { ...state, autoSelectedTiles: next };
    }

    case 'CLEAR_AUTO_TILES':
      if (state.autoSelectionLocked) return state;
      return { ...state, autoSelectedTiles: [] };

    case 'UPDATE_AUTO_SETTINGS':
      return { ...state, autoSettings: { ...state.autoSettings, ...action.patch } };

    case 'START_AUTO_SESSION': {
      if (state.autoSelectedTiles.length === 0) return state;
      if (state.bet <= 0 || state.bet > state.wallet) return state;
      return {
        ...state,
        autoSelectionLocked: true,
        autoRunning: true,
        autoStats: { betsPlaced: 0, sessionProfit: 0, baseBet: state.bet },
      };
    }

    case 'STOP_AUTO_SESSION':
      return {
        ...state,
        autoRunning: false,
        autoSelectionLocked: false,
        bet: state.autoStats.baseBet,
      };

    case 'AUTO_ROUND_END': {
      const { isWin, profit } = action;
      const newBetsPlaced = state.autoStats.betsPlaced + 1;
      const newSessionProfit = state.autoStats.sessionProfit + profit;

      // Check stop conditions
      const maxBets = state.autoSettings.maxBets ? Number(state.autoSettings.maxBets) : null;
      const stopProfit = state.autoSettings.stopOnProfit ? Number(state.autoSettings.stopOnProfit) : null;
      const stopLoss = state.autoSettings.stopOnLoss ? Number(state.autoSettings.stopOnLoss) : null;

      let shouldStop = false;
      if (maxBets && newBetsPlaced >= maxBets) shouldStop = true;
      if (stopProfit && newSessionProfit >= stopProfit) shouldStop = true;
      if (stopLoss && newSessionProfit <= -stopLoss) shouldStop = true;

      // Adjust bet for next round
      let nextBet = state.bet;
      if (!shouldStop) {
        if (isWin) {
          nextBet = state.autoSettings.onWin === 'increase'
            ? state.bet * (1 + Number(state.autoSettings.onWinPct) / 100)
            : state.autoStats.baseBet;
        } else {
          nextBet = state.autoSettings.onLoss === 'increase'
            ? state.bet * (1 + Number(state.autoSettings.onLossPct) / 100)
            : state.autoStats.baseBet;
        }
        // Clamp: at least ₹1, at most current wallet (after this round's deduction is already applied)
        nextBet = Math.max(1, Math.round(nextBet * 100) / 100);
      }

      return {
        ...state,
        bet: shouldStop ? state.autoStats.baseBet : nextBet,
        autoRunning: !shouldStop,
        autoSelectionLocked: !shouldStop,
        autoStats: { ...state.autoStats, betsPlaced: newBetsPlaced, sessionProfit: newSessionProfit },
      };
    }

    case 'START_GAME': {
      if (state.bet <= 0 || state.bet > state.wallet) return state;
      const mineSet = placeMines(state.mines);
      const grid = createGrid(mineSet);
      return {
        ...state,
        phase: 'playing',
        grid,
        multiplier: 1,
        openedCount: 0,
        profit: 0,
        wallet: state.wallet - state.bet,
        lastExplodedIdx: -1,
        showWinModal: false,
        winAmount: 0,
        stats: { ...state.stats, wagered: state.stats.wagered + state.bet },
      };
    }

    case 'REVEAL_TILE': {
      if (state.phase !== 'playing') return state;
      const idx = action.index;
      const tile = state.grid[idx];
      if (tile.revealed) return state;

      if (tile.isMine) {
        const newGrid = state.grid.map((t, i) => ({ ...t, revealed: true, isExploding: i === idx }));
        const newStats = {
          ...state.stats,
          losses: state.stats.losses + 1,
          totalProfit: state.stats.totalProfit - state.bet,
          history: [...state.stats.history, { round: state.stats.wins + state.stats.losses + 1, profit: -state.bet }],
        };
        return { ...state, phase: 'gameover', grid: newGrid, lastExplodedIdx: idx, profit: -state.bet, stats: newStats };
      }

      const newOpenedCount = state.openedCount + 1;
      const newMultiplier = calcNextMultiplier(state.multiplier, state.mines, state.openedCount);
      const currentProfit = (state.bet * newMultiplier) - state.bet;
      const allSafeRevealed = newOpenedCount === GRID_SIZE - state.mines;
      const newGrid = state.grid.map((t, i) => i === idx ? { ...t, revealed: true } : t);

      if (allSafeRevealed) {
        const winAmt = state.bet * newMultiplier;
        const newStats = {
          ...state.stats,
          wins: state.stats.wins + 1,
          totalProfit: state.stats.totalProfit + currentProfit,
          history: [...state.stats.history, { round: state.stats.wins + state.stats.losses + 1, profit: currentProfit }],
        };
        return {
          ...state, phase: 'cashedout', grid: newGrid, multiplier: newMultiplier,
          openedCount: newOpenedCount, profit: currentProfit,
          wallet: state.wallet + winAmt,
          showWinModal: !state.autoRunning,
          winAmount: winAmt, stats: newStats,
        };
      }

      return { ...state, grid: newGrid, multiplier: newMultiplier, openedCount: newOpenedCount, profit: currentProfit };
    }

    case 'CASH_OUT': {
      if (state.phase !== 'playing' || state.openedCount === 0) return state;
      const winAmt = state.bet * state.multiplier;
      const profit = winAmt - state.bet;
      const newStats = {
        ...state.stats,
        wins: state.stats.wins + 1,
        totalProfit: state.stats.totalProfit + profit,
        history: [...state.stats.history, { round: state.stats.wins + state.stats.losses + 1, profit }],
      };
      return {
        ...state, phase: 'cashedout', wallet: state.wallet + winAmt, profit,
        showWinModal: !state.autoRunning, // suppress modal during auto session
        winAmount: winAmt, stats: newStats,
      };
    }

    case 'CLOSE_WIN_MODAL':
      return { ...state, showWinModal: false };

    case 'RESET':
      return {
        ...state, phase: 'idle', grid: [], multiplier: 1, openedCount: 0,
        profit: 0, lastExplodedIdx: -1, showWinModal: false, winAmount: 0,
        // autoRunning / autoSelectionLocked carry over (managed by AUTO_ROUND_END)
      };

    case 'RANDOM_PICK': {
      if (state.phase !== 'playing') return state;
      const unrevealed = state.grid.map((t, i) => ({ ...t, i })).filter(t => !t.revealed);
      if (unrevealed.length === 0) return state;
      const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      return reducer(state, { type: 'REVEAL_TILE', index: pick.i });
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setWallet = useCallback(v => dispatch({ type: 'SET_WALLET', value: v }), []);
  const setBet = useCallback(v => dispatch({ type: 'SET_BET', value: v }), []);
  const halfBet = useCallback(() => dispatch({ type: 'HALF_BET' }), []);
  const doubleBet = useCallback(() => dispatch({ type: 'DOUBLE_BET' }), []);
  const setMines = useCallback(v => dispatch({ type: 'SET_MINES', value: v }), []);
  const toggleAuto = useCallback(() => dispatch({ type: 'TOGGLE_AUTO' }), []);
  const toggleAutoTile = useCallback(i => dispatch({ type: 'TOGGLE_AUTO_TILE', index: i }), []);
  const clearAutoTiles = useCallback(() => dispatch({ type: 'CLEAR_AUTO_TILES' }), []);
  const updateAutoSettings = useCallback(patch => dispatch({ type: 'UPDATE_AUTO_SETTINGS', patch }), []);
  const startAutoSession = useCallback(() => dispatch({ type: 'START_AUTO_SESSION' }), []);
  const stopAutoSession = useCallback(() => dispatch({ type: 'STOP_AUTO_SESSION' }), []);
  const autoRoundEnd = useCallback((isWin, profit) => dispatch({ type: 'AUTO_ROUND_END', isWin, profit }), []);
  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const revealTile = useCallback(i => dispatch({ type: 'REVEAL_TILE', index: i }), []);
  const cashOut = useCallback(() => dispatch({ type: 'CASH_OUT' }), []);
  const closeWinModal = useCallback(() => dispatch({ type: 'CLOSE_WIN_MODAL' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const randomPick = useCallback(() => dispatch({ type: 'RANDOM_PICK' }), []);

  return {
    state,
    setWallet, setBet, halfBet, doubleBet, setMines,
    toggleAuto, toggleAutoTile, clearAutoTiles, updateAutoSettings,
    startAutoSession, stopAutoSession, autoRoundEnd,
    startGame, revealTile, cashOut, closeWinModal, reset, randomPick,
  };
}
