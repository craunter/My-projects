export default function Tile({ tile, onClick, phase, autoMode, isPreSelected, preSelectOrder, autoSelectionLocked }) {
  // Clickable when: manual playing, OR auto pre-selection mode (idle, not locked)
  const canClick = (phase === 'playing' && !tile.revealed && !autoMode)
    || (autoMode && !autoSelectionLocked && phase === 'idle');

  const handleClick = () => {
    if (canClick || (autoMode && !autoSelectionLocked && phase === 'idle')) {
      onClick(tile.id);
    }
  };

  const frontContent = (
    <div
      className="tile-face tile-front"
      onClick={handleClick}
      style={{ cursor: canClick ? 'pointer' : 'default' }}
    >
      <div style={{ width: '30%', height: '30%', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      {/* Pre-selected tile overlay (auto mode, before session) */}
      {isPreSelected && !tile.revealed && (
        <>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            border: '2.5px solid #00ff88',
            boxShadow: '0 0 16px rgba(0,255,136,0.5), inset 0 0 12px rgba(0,255,136,0.08)',
            pointerEvents: 'none',
          }} />
          {/* Order badge */}
          <div style={{
            position: 'absolute',
            top: 4,
            right: 5,
            background: '#00ff88',
            color: '#0b1622',
            width: 16,
            height: 16,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.62rem',
            fontWeight: 900,
            lineHeight: 1,
          }}>
            {preSelectOrder}
          </div>
        </>
      )}

      {/* Hover "select" hint for auto pre-selection mode */}
      {autoMode && !autoSelectionLocked && phase === 'idle' && !isPreSelected && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          border: '1px dashed rgba(0,255,136,0.2)',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.15s',
        }} className="tile-select-hint" />
      )}
    </div>
  );

  const backContent = tile.isMine ? (
    <div className={`tile-face tile-back tile-back-mine ${tile.isExploding ? 'exploding' : ''}`}>
      {tile.isExploding && (
        <>
          <div className="shockwave shockwave-1" />
          <div className="shockwave shockwave-2" />
          <div className="shockwave shockwave-3" />
        </>
      )}
      <span className="mine-icon" role="img" aria-label="mine">💣</span>
    </div>
  ) : (
    <div className="tile-face tile-back tile-back-diamond">
      <span className="gem-icon" role="img" aria-label="diamond">💎</span>
    </div>
  );

  return (
    <div className="tile-scene">
      <div className={`tile-card ${tile.revealed ? 'flipped' : ''}`}>
        {frontContent}
        {backContent}
      </div>
    </div>
  );
}
