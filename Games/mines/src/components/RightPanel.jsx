import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

function formatINR(v) {
  const abs = Math.abs(v);
  const str = abs.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return (v < 0 ? '-₹' : '₹') + str;
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card">
      <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon} {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '1rem', fontWeight: 700, color: color || '#e2e8f0' }}
      >
        {value}
      </motion.div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div style={{
        background: '#0d1b27',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: '0.8rem',
      }}>
        <div style={{ color: '#64748b' }}>Round {label}</div>
        <div style={{ color: val >= 0 ? '#00ff88' : '#ff4444', fontWeight: 700 }}>
          {formatINR(val)}
        </div>
      </div>
    );
  }
  return null;
}

export default function RightPanel({ stats }) {
  const { wins, losses, wagered, totalProfit, history } = stats;
  const winRate = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : '—';
  const profitColor = totalProfit >= 0 ? '#00ff88' : '#ff4444';

  // Build chart data – sliding window of last 20 rounds
  const chartData = history.slice(-20).map((h, i) => ({
    round: h.round,
    profit: parseFloat(h.profit.toFixed(2)),
  }));

  // Cumulative line
  const cumulativeData = (() => {
    let running = 0;
    return history.slice(-20).map(h => {
      running += h.profit;
      return { round: h.round, profit: parseFloat(running.toFixed(2)) };
    });
  })();

  return (
    <div className="glass p-4 flex flex-col gap-4 sticky top-4">
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5 }}>
          <BarChart2 size={12} /> Live Stats
        </div>
      </div>

      {/* Stat cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <StatCard
          label="Total Profit"
          value={formatINR(totalProfit)}
          color={profitColor}
          icon={totalProfit >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        />
        <StatCard label="Total Wagered" value={'₹' + wagered.toLocaleString('en-IN')} />
        <StatCard label="Wins" value={wins} color="#00ff88" icon="✅" />
        <StatCard label="Losses" value={losses} color="#ff6b6b" icon="💥" />
      </div>

      {/* Win rate */}
      <div className="stat-card">
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 4 }}>Win Rate</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: '#00ff88', borderRadius: 3 }}
              initial={{ width: 0 }}
              animate={{ width: `${wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00ff88', minWidth: 40 }}>
            {winRate}{winRate !== '—' ? '%' : ''}
          </span>
        </div>
      </div>

      {/* Profit Trend Graph */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <TrendingUp size={11} /> Profit Trend
        </div>

        {cumulativeData.length === 0 ? (
          <div style={{
            height: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 8,
            color: '#334155',
          }}>
            <BarChart2 size={32} opacity={0.4} />
            <span style={{ fontSize: '0.8rem' }}>Play to see your graph</span>
          </div>
        ) : (
          <div className="graph-wrap">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={cumulativeData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="round"
                  tick={{ fill: '#475569', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => (v >= 0 ? '+' : '') + v}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke={cumulativeData[cumulativeData.length - 1]?.profit >= 0 ? '#00ff88' : '#ff4444'}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#00ff88', stroke: 'none' }}
                  isAnimationActive
                  animationDuration={600}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Per-round history strip */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Recent rounds
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {history.slice(-10).map((h, i) => (
              <div
                key={i}
                style={{
                  width: 28, height: 28,
                  borderRadius: 6,
                  background: h.profit >= 0 ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,68,0.2)',
                  border: `1px solid ${h.profit >= 0 ? 'rgba(0,255,136,0.35)' : 'rgba(255,68,68,0.35)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem',
                  color: h.profit >= 0 ? '#00ff88' : '#ff6b6b',
                  fontWeight: 700,
                }}
                title={formatINR(h.profit)}
              >
                {h.profit >= 0 ? 'W' : 'L'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
