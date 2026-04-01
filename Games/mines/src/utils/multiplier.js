/**
 * Mines & Diamonds – Multiplier Calculator
 * ─────────────────────────────────────────────────────────────────────────────
 * Mathematical basis:
 *
 *   P(m, k)   = probability of revealing k safe tiles in a 25-tile grid with m mines
 *             = C(25-m, k) / C(25, k)
 *             = ∏_{i=0}^{k-1} (25-m-i) / (25-i)
 *
 *   multiplier(m, k) = HOUSE_EDGE / P(m, k)
 *
 * Verified against reference sequences (99% RTP / 1% house edge):
 *   1 mine : [1.03, 1.08, 1.12, 1.18, 1.24, 1.30, 1.37, 1.46, 1.55, 1.65, 1.77, 1.90, 2.06]
 *   2 mines: [1.08, 1.17, 1.29, 1.41, 1.57, 1.77, 2.01, ...]
 *   3 mines: [1.13, 1.29, 1.48, 1.71, 2.00, ...]
 *
 * Adjustable constants:
 *   - HOUSE_EDGE   : 0.99 = 1% house edge (set to 1.00 for zero-edge)
 *   - GRID_SIZE    : 25 tiles (5×5 grid)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Total tiles in the grid (5×5). */
const GRID_SIZE = 25;

/**
 * House edge factor applied to the fair payout.
 * 0.99  →  1% house edge (99% RTP), matches Stake.com reference values.
 * Increase toward 1.00 to reduce house edge; decrease to increase it.
 */
const HOUSE_EDGE = 0.99;

/**
 * Calculate the current payout multiplier.
 *
 * @param {number} mines       - Mines placed in the grid (1–24)
 * @param {number} openedCount - Safe tiles revealed so far (≥ 0)
 * @returns {number} Payout multiplier, rounded to 2 decimal places.
 *                   Returns 1.00 before any tile is opened.
 */
export function getMultiplier(mines, openedCount) {
  if (openedCount <= 0) return 1.00;

  const safeTiles = GRID_SIZE - mines;

  // Guard: can't open more safe tiles than exist
  if (openedCount > safeTiles) return getMultiplier(mines, safeTiles);

  // Cumulative survival probability
  // P = ∏_{i=0}^{k-1} (safeTiles - i) / (GRID_SIZE - i)
  let probability = 1;
  for (let i = 0; i < openedCount; i++) {
    probability *= (safeTiles - i) / (GRID_SIZE - i);
  }

  const raw = HOUSE_EDGE / probability;
  return Math.round(raw * 100) / 100;   // round to 2 d.p.
}

/**
 * Build a preview multiplier table for UI display (e.g. "next payout" panel).
 *
 * @param {number} mines   - Mine count
 * @param {number} [limit] - How many entries to return (defaults to all safe tiles)
 * @returns {number[]} Multipliers indexed from 0 (no tile opened = 1.00×) up to limit.
 *
 * @example
 * getMultiplierTable(1)
 * //=> [1.00, 1.03, 1.08, 1.12, 1.18, 1.24, 1.30, 1.37, 1.46, ...]
 */
export function getMultiplierTable(mines, limit) {
  const safeTiles = GRID_SIZE - mines;
  const max = limit ?? safeTiles;
  return Array.from({ length: max + 1 }, (_, k) => getMultiplier(mines, k));
}

/**
 * Calculate the profit for a round.
 *
 * @param {number} bet         - Bet amount placed
 * @param {number} mines       - Mine count
 * @param {number} openedCount - Safe tiles opened
 * @returns {{ multiplier: number, winAmount: number, profit: number }}
 */
export function calcPayout(bet, mines, openedCount) {
  const multiplier = getMultiplier(mines, openedCount);
  const winAmount = Math.round(bet * multiplier * 100) / 100;
  const profit = Math.round((winAmount - bet) * 100) / 100;
  return { multiplier, winAmount, profit };
}
