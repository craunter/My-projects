// Web Audio API procedural sound effects – no external files needed

let ctx = null;

function getContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (autoplay policy)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq, type, duration, gain = 0.2, fadeOut = true) {
  try {
    const ac = getContext();
    const osc = ac.createOscillator();
    const gainNode = ac.createGain();
    osc.connect(gainNode);
    gainNode.connect(ac.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gainNode.gain.setValueAtTime(gain, ac.currentTime);
    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    }
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch (_) {}
}

function playNoise(duration, gain = 0.15) {
  try {
    const ac = getContext();
    const bufSize = ac.sampleRate * duration;
    const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ac.createBufferSource();
    src.buffer = buf;

    const gainNode = ac.createGain();
    gainNode.gain.setValueAtTime(gain, ac.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

    src.connect(gainNode);
    gainNode.connect(ac.destination);
    src.start();
  } catch (_) {}
}

export const sounds = {
  click() {
    playTone(440, 'sine', 0.08, 0.15);
  },
  diamond() {
    playTone(880, 'sine', 0.12, 0.18);
    setTimeout(() => playTone(1100, 'sine', 0.1, 0.12), 60);
    setTimeout(() => playTone(1320, 'sine', 0.08, 0.1), 130);
  },
  explosion() {
    playNoise(0.6, 0.3);
    playTone(80, 'sawtooth', 0.5, 0.25);
  },
  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.25, 0.18), i * 100));
  },
};
