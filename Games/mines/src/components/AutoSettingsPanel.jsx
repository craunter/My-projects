import { useState } from 'react';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';

function SettingRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function WinLossToggle({ value, onChange, label, color }) {
  return (
    <SettingRow label={label}>
      <div className="toggle-pill">
        <button
          className={`toggle-option ${value === 'reset' ? 'active' : ''}`}
          style={value === 'reset' ? { color } : {}}
          onClick={() => onChange('reset')}
        >
          Reset
        </button>
        <button
          className={`toggle-option ${value === 'increase' ? 'active' : ''}`}
          style={value === 'increase' ? { color } : {}}
          onClick={() => onChange('increase')}
        >
          Increase %
        </button>
      </div>
    </SettingRow>
  );
}

export default function AutoSettingsPanel({
  settings, onUpdate,
  autoSelectedTiles, clearAutoTiles,
  autoRunning, autoStats,
  bet,
}) {
  const [expanded, setExpanded] = useState(false);

  const fmt = v => Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Selected tiles display */}
      <div className="stat-card" style={{ padding: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
            📌 Pre-selected Tiles
          </span>
          {autoSelectedTiles.length > 0 && !autoRunning && (
            <button
              className="btn-secondary"
              style={{ padding: '2px 8px', fontSize: '0.7rem' }}
              onClick={clearAutoTiles}
            >
              Clear
            </button>
          )}
        </div>

        {autoSelectedTiles.length === 0 ? (
          <div style={{ fontSize: '0.75rem', color: '#475569' }}>
            {autoRunning ? 'No tiles selected' : '← Click tiles on the grid to select'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {autoSelectedTiles.map((idx, order) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0,255,136,0.15)',
                  border: '1px solid rgba(0,255,136,0.35)',
                  color: '#00ff88',
                  borderRadius: 6,
                  padding: '2px 7px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                #{idx + 1}
              </div>
            ))}
          </div>
        )}

        {!autoRunning && autoSelectedTiles.length > 0 && (
          <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 6 }}>
            These tiles open every round in order
          </div>
        )}
      </div>

      {/* Session running stats */}
      {autoRunning && (
        <div
          className="stat-card"
          style={{
            background: 'rgba(0,255,136,0.06)',
            border: '1px solid rgba(0,255,136,0.2)',
            padding: 10,
          }}
        >
          <div style={{ fontSize: '0.7rem', color: '#00ff88', fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>
            ⚡ SESSION LIVE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Bets Placed</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>
                {autoStats.betsPlaced}
                {settings.maxBets ? ` / ${settings.maxBets}` : ''}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Current Bet</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>
                ₹{fmt(bet)}
              </div>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Session P/L</div>
              <div style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: autoStats.sessionProfit >= 0 ? '#00ff88' : '#ff6b6b',
              }}>
                {autoStats.sessionProfit >= 0 ? '+' : ''}₹{fmt(autoStats.sessionProfit)}
              </div>
            </div>
          </div>
          {/* Progress bar for maxBets */}
          {settings.maxBets && (
            <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: '#00ff88',
                borderRadius: 2,
                width: `${Math.min((autoStats.betsPlaced / Number(settings.maxBets)) * 100, 100)}%`,
                transition: 'width 0.4s ease',
              }} />
            </div>
          )}
        </div>
      )}

      {/* Advanced Settings accordion */}
      {!autoRunning && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: expanded ? '8px 8px 0 0' : 8,
              padding: '8px 12px',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Settings size={13} /> Advanced Settings
            </span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: 'rgba(0,0,0,0.2)',
            }}>

              {/* On Win */}
              <WinLossToggle
                label="🟢 On Win"
                value={settings.onWin}
                color="#00ff88"
                onChange={v => onUpdate({ onWin: v })}
              />
              {settings.onWin === 'increase' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: -6 }}>
                  <input
                    className="field-input"
                    type="number"
                    min="1"
                    max="999"
                    style={{ flex: 1 }}
                    value={settings.onWinPct}
                    onChange={e => onUpdate({ onWinPct: e.target.value })}
                  />
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>%</span>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

              {/* On Loss */}
              <WinLossToggle
                label="🔴 On Loss"
                value={settings.onLoss}
                color="#ff6b6b"
                onChange={v => onUpdate({ onLoss: v })}
              />
              {settings.onLoss === 'increase' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: -6 }}>
                  <input
                    className="field-input"
                    type="number"
                    min="1"
                    max="999"
                    style={{ flex: 1 }}
                    value={settings.onLossPct}
                    onChange={e => onUpdate({ onLossPct: e.target.value })}
                  />
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>%</span>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

              {/* Stop on Profit */}
              <SettingRow label="Stop on Profit ≥">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#00ff88', fontSize: '0.85rem' }}>₹</span>
                  <input
                    className="field-input"
                    type="number"
                    min="1"
                    placeholder="No limit"
                    style={{ paddingLeft: 24 }}
                    value={settings.stopOnProfit || ''}
                    onChange={e => onUpdate({ stopOnProfit: e.target.value || null })}
                  />
                </div>
              </SettingRow>

              {/* Stop on Loss */}
              <SettingRow label="Stop on Loss ≥">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#ff6b6b', fontSize: '0.85rem' }}>₹</span>
                  <input
                    className="field-input"
                    type="number"
                    min="1"
                    placeholder="No limit"
                    style={{ paddingLeft: 24 }}
                    value={settings.stopOnLoss || ''}
                    onChange={e => onUpdate({ stopOnLoss: e.target.value || null })}
                  />
                </div>
              </SettingRow>

              {/* Number of Bets */}
              <SettingRow label="Number of Bets">
                <input
                  className="field-input"
                  type="number"
                  min="1"
                  placeholder="∞ Infinite"
                  value={settings.maxBets || ''}
                  onChange={e => onUpdate({ maxBets: e.target.value || null })}
                />
              </SettingRow>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
