import React, { useEffect, useRef } from 'react';

// Procedural Alpine Wind & Mountain Chime synthesizer
// Plays ambient natural sound automatically on page load/interaction with NO button UI
export default function ProceduralAudio() {
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);
  const isStartedRef = useRef(false);

  const startAudio = () => {
    if (isStartedRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master gain node with smooth, gentle ambient volume
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3.5);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // 1. Procedural Pink/Brown Wind Noise Generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter modeling mountain breeze sweeping across ridges
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      // Low-frequency oscillator (LFO) modulating wind intensity
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      whiteNoise.connect(filter);
      filter.connect(masterGain);

      whiteNoise.start(0);
      lfo.start(0);

      // 2. Pentatonic Himalayan Temple / Mountain Chimes
      const chimeFrequencies = [523.25, 587.33, 659.25, 783.99, 880.0];
      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const now = audioCtxRef.current.currentTime;
        const chimeFreq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];

        const chimeOsc = audioCtxRef.current.createOscillator();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(chimeFreq, now);

        const chimeGain = audioCtxRef.current.createGain();
        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.gain.linearRampToValueAtTime(0.022, now + 0.08);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(masterGain);

        chimeOsc.start(now);
        chimeOsc.stop(now + 3.4);
      };

      intervalRef.current = setInterval(playChime, 7500);
      isStartedRef.current = true;
    } catch (e) {
      console.warn('Procedural audio initialization waiting for user gesture:', e);
    }
  };

  useEffect(() => {
    // Attempt auto-start on mount
    startAudio();

    // Fallback: resume/start on first interaction (bypasses browser autoplay restrictions)
    const handleFirstInteraction = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      } else if (!isStartedRef.current) {
        startAudio();
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      cleanupListeners();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // No button UI rendered on screen as requested
  return null;
}
