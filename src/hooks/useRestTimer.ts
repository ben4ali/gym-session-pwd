import { useState, useEffect, useRef, useCallback } from 'react';

// Web Audio API beep synthesizer (clean Apple-style gentle double chime)
function playRestDoneChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // First tone (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second tone (D6) slightly higher and cheerful
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, now + 0.18);
    gain2.gain.setValueAtTime(0.12, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.4);
  } catch {
    // AudioContext blocked or not supported
  }

  // Mobile vibration if supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([150, 80, 150]);
    } catch {
      // Ignored
    }
  }
}

export function useRestTimer(onComplete?: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const endTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (!endTimeRef.current) return;
    const now = Date.now();
    const diff = Math.ceil((endTimeRef.current - now) / 1000);

    if (diff <= 0) {
      clearTimer();
      setRemainingSeconds(0);
      setIsActive(false);
      setIsPaused(false);
      endTimeRef.current = null;
      playRestDoneChime();
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    } else {
      setRemainingSeconds(diff);
    }
  }, [clearTimer]);

  const startTimer = useCallback((seconds: number) => {
    clearTimer();
    const sec = Math.max(1, Math.round(seconds));
    setTotalSeconds(sec);
    setRemainingSeconds(sec);
    setIsActive(true);
    setIsPaused(false);
    endTimeRef.current = Date.now() + sec * 1000;

    timerRef.current = window.setInterval(tick, 200);
  }, [clearTimer, tick]);

  const pauseTimer = useCallback(() => {
    if (!isActive || isPaused) return;
    clearTimer();
    pausedRemainingRef.current = remainingSeconds;
    setIsPaused(true);
  }, [isActive, isPaused, remainingSeconds, clearTimer]);

  const resumeTimer = useCallback(() => {
    if (!isActive || !isPaused) return;
    setIsPaused(false);
    endTimeRef.current = Date.now() + pausedRemainingRef.current * 1000;
    timerRef.current = window.setInterval(tick, 200);
  }, [isActive, isPaused, tick]);

  const skipTimer = useCallback(() => {
    clearTimer();
    setIsActive(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    endTimeRef.current = null;
  }, [clearTimer]);

  const adjustTime = useCallback((deltaSeconds: number) => {
    if (!isActive) return;
    if (isPaused) {
      const next = Math.max(0, pausedRemainingRef.current + deltaSeconds);
      pausedRemainingRef.current = next;
      setRemainingSeconds(next);
      setTotalSeconds(prev => Math.max(prev, next));
      if (next === 0) skipTimer();
    } else if (endTimeRef.current) {
      endTimeRef.current += deltaSeconds * 1000;
      const now = Date.now();
      const diff = Math.ceil((endTimeRef.current - now) / 1000);
      if (diff <= 0) {
        skipTimer();
      } else {
        setRemainingSeconds(diff);
        setTotalSeconds(prev => Math.max(prev, diff));
      }
    }
  }, [isActive, isPaused, skipTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    remainingSeconds,
    totalSeconds,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    skipTimer,
    adjustTime
  };
}
