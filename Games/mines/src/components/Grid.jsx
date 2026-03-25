import { motion } from 'framer-motion';
import Tile from './Tile';

const IDLE_GRID = Array.from({ length: 25 }, (_, i) => ({
  id: i, isMine: false, revealed: false, isExploding: false,
}));

export default function Grid({
  grid, phase, onReveal, multiplier, openedCount, mines,
  autoMode, autoSelectedTiles = [], autoSelectionLocked, autoRunning,
}) {
  const safeCount = 25 - mines;
  const displayGrid = phase === 'idle' ? IDLE_GRID : grid;

  return (
    <div className="flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>💎 {openedCount} revealed</span>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>•</span>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>💣 {mines} mines</span>
        </div>
        {phase === 'playing' && openedCount > 0 && (
          <motion.div
            className="mult-badge"
            key={multiplier.toFixed(2)}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            {multiplier.toFixed(2)}×
          </motion.div>
        )}
        {(phase === 'gameover' || phase === 'cashedout') && (
          <div className="mult-badge">
            {multiplier.toFixed(2)}×
            <span style={{ fontSize: '0.75rem', marginLeft: 6, opacity: 0.7 }}>final</span>
          </div>
        )}
      </div>

      {/* 5×5 Grid */}
      <motion.div
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'clamp(6px, 1.2vw, 10px)',
        }}
      >
        {displayGrid.map((tile, i) => {
          const preSelectOrder = autoSelectedTiles.indexOf(tile.id);
          const isPreSelected = preSelectOrder !== -1;
          return (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.012, type: 'spring', stiffness: 260, damping: 22 }}
            >
              <Tile
                tile={tile}
                onClick={onReveal}
                phase={phase}
                autoMode={autoMode}
                isPreSelected={isPreSelected}
                preSelectOrder={preSelectOrder + 1}
                autoSelectionLocked={autoSelectionLocked}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Status hints */}
      {phase === 'gameover' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-3 px-4 rounded-xl"
          style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', color: '#ff6b6b', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.04em' }}
        >
          💥 Boom! Mine hit — better luck next time
        </motion.div>
      )}
      {phase === 'cashedout' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-3 px-4 rounded-xl"
          style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88', fontWeight: 700, fontSize: '1rem' }}
        >
          ✅ Cashed out at {multiplier.toFixed(2)}×
        </motion.div>
      )}
      {phase === 'idle' && (
        <div className="text-center py-2" style={{ color: '#475569', fontSize: '0.8rem' }}>
          {autoMode && !autoSelectionLocked
            ? <span style={{ color: '#a78bfa' }}>⚡ Click tiles to pre-select them · selected: {autoSelectedTiles.length}</span>
            : autoMode && autoSelectionLocked
            ? <span style={{ color: '#00ff88' }}>⚡ Auto Selected Tiles Active — session running</span>
            : 'Place your bet to start — tiles are locked 🔒'}
        </div>
      )}
      {phase === 'playing' && autoMode && autoRunning && (
        <div className="text-center py-2" style={{ color: '#00ff88', fontSize: '0.78rem', animation: 'fade-in 0.3s ease-out' }}>
          ⚡ Auto opening tiles in sequence…
        </div>
      )}
    </div>
  );
}
