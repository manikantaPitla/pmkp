import { useEffect, useRef, useState, useCallback } from "react";
import { SESSION } from "../utils/constants";

const DEFAULT_TIMEOUT_MS = SESSION.TIMEOUT_MS; 

function useSessionTimeout(timeoutMs = DEFAULT_TIMEOUT_MS, options = {}) {
  const { resetOnMount = false } = options;
  const [isExpired, setIsExpired] = useState(false);
  const timerRef = useRef(null);
  const lastActiveRef = useRef(Date.now());

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    clearTimer();
    const remaining = timeoutMs - (Date.now() - lastActiveRef.current);
    timerRef.current = setTimeout(
      () => {
        setIsExpired(true);
      },
      Math.max(remaining, 0)
    );
  }, [timeoutMs]);

  const markActivity = useCallback(() => {
    if (isExpired) return;
    lastActiveRef.current = Date.now();
    try {
      localStorage.setItem("pmkp_last_active", String(lastActiveRef.current));
    } catch {}
    startTimer();
  }, [isExpired, startTimer]);

  useEffect(() => {
    const onActivity = () => markActivity();

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "focus", "visibilitychange"];

    events.forEach(evt => window.addEventListener(evt, onActivity, { passive: true }));
    // Initialize from persisted last active timestamp
    try {
      const stored = Number(localStorage.getItem("pmkp_last_active"));
      if (resetOnMount) {
        lastActiveRef.current = Date.now();
        localStorage.setItem("pmkp_last_active", String(lastActiveRef.current));
        startTimer();
      } else {
        if (Number.isFinite(stored) && stored > 0) {
          lastActiveRef.current = stored;
        } else {
          localStorage.setItem("pmkp_last_active", String(lastActiveRef.current));
        }
        // If already inactive beyond timeout, expire immediately
        if (Date.now() - lastActiveRef.current >= timeoutMs) {
          setIsExpired(true);
        } else {
          startTimer();
        }
      }
    } catch {
      startTimer();
    }

    return () => {
      events.forEach(evt => window.removeEventListener(evt, onActivity));
      clearTimer();
    };
  }, [startTimer, markActivity]);

  return { isExpired };
}

export default useSessionTimeout;
