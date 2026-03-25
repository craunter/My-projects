import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

function formatINR(v) {
  return '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// Simple confetti particles
function Confetti() {
  const colors = ['#00ff88', '#ffd700', '#00ccff', '#ff6b6b', '#a78bfa'];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${20 + Math.random() * 20}%`,
            background: colors[i % colors.length],
            '--dx': `${(Math.random() - 0.5) * 100}px`,
            '--rot': `${Math.random() * 720}deg`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${0.9 + Math.random() * 0.6}s`,
          }}
        />
      ))}
    </div>
  );
}

// Animated count-up number
function CountUp({ target, duration = 1200 }) {
  const ref = useRef(null);
  const start = useRef(Date.now());
  const frame = useRef(null);

  useEffect(() => {
    start.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) {
        ref.current.textContent = '₹' + (target * eased).toLocaleString('en-IN', { maximumFractionDigits: 2 });
      }
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return <span ref={ref}>₹0</span>;
}

export default function WinModal({ winAmount, multiplier, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #0f2a1a 0%, #0a1f2e 100%)',
            border: '1px solid rgba(0,255,136,0.3)',
            borderRadius: 20,
            padding: '40px 48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            minWidth: 300,
            boxShadow: '0 0 60px rgba(0,255,136,0.2), 0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          <Confetti />

          {/* Glow ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>🏆</div>

          <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: 4, fontWeight: 500 }}>
            You cashed out at
          </div>
          <div style={{ fontSize: '1.4rem', color: '#00ff88', fontWeight: 700, marginBottom: 16, textShadow: '0 0 16px rgba(0,255,136,0.7)' }}>
            {multiplier.toFixed(2)}×
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 6 }}>Your winnings</div>
          <div
            style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              color: '#00ff88',
              textShadow: '0 0 24px rgba(0,255,136,0.6)',
              lineHeight: 1,
              marginBottom: 28,
            }}
          >
            <CountUp target={winAmount} />
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            onClick={onClose}
          >
            Collect & Continue
          </button>

          <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#334155' }}>
            Click anywhere to dismiss
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
