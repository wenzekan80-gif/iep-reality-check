"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Screen } from "./demo-data";

export const PAGE_FLIP_DURATION = 680;
export type PageFlip = { direction: "forward" | "backward"; key: number };
const pageOrder: Screen[] = ["home", "plan", "review", "meeting"];
const motionQuery = "(prefers-reduced-motion: reduce)";

/** A disposable visual sheet; the caller keeps ownership of the real screen. */
export function usePageFlip(screen: Screen, commit: (next: Screen) => void) {
  const [flip, setFlip] = useState<PageFlip | null>(null);
  const serial = useRef(0);
  const active = useRef<{ target: Screen; committed: boolean } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const commitRef = useRef(commit);
  commitRef.current = commit;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const cancel = useCallback(() => {
    clearTimers();
    active.current = null;
    setFlip(null);
  }, [clearTimers]);

  useEffect(() => {
    const media = typeof window.matchMedia === "function" ? window.matchMedia(motionQuery) : null;
    const onMotionChange = () => {
      if (!media?.matches || !active.current) return;
      const pending = active.current;
      cancel();
      if (!pending.committed) commitRef.current(pending.target);
    };
    media?.addEventListener("change", onMotionChange);
    return () => {
      media?.removeEventListener("change", onMotionChange);
      clearTimers();
      active.current = null;
    };
  }, [cancel, clearTimers]);

  const navigate = useCallback((next: Screen) => {
    if (active.current || next === screen) return;
    // Unknown motion support gets the same safe instant behavior as reduced motion.
    if (typeof window.matchMedia !== "function" || window.matchMedia(motionQuery).matches) {
      commitRef.current(next);
      return;
    }
    const pending = { target: next, committed: false };
    active.current = pending;
    setFlip({ direction: pageOrder.indexOf(next) > pageOrder.indexOf(screen) ? "forward" : "backward", key: ++serial.current });
    timers.current = [
      setTimeout(() => {
        pending.committed = true;
        commitRef.current(next);
      }, PAGE_FLIP_DURATION / 2),
      setTimeout(cancel, PAGE_FLIP_DURATION),
    ];
  }, [screen, cancel]);

  return { navigate, flip, busy: flip !== null, cancel };
}
