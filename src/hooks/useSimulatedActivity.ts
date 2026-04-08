import { useEffect, useRef } from "react";

/**
 * Simulates light activity by occasionally bumping a random count.
 * Calls onBump(id) with a random id from the provided list.
 */
export function useSimulatedActivity(
  ids: string[],
  onBump: (id: string) => void,
  options?: { minDelay?: number; maxDelay?: number; enabled?: boolean }
) {
  const { minDelay = 8000, maxDelay = 20000, enabled = true } = options || {};
  const onBumpRef = useRef(onBump);
  onBumpRef.current = onBump;

  useEffect(() => {
    if (!enabled || ids.length === 0) return;

    const schedule = () => {
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      return setTimeout(() => {
        const randomId = ids[Math.floor(Math.random() * ids.length)];
        onBumpRef.current(randomId);
        timerRef = schedule();
      }, delay);
    };

    let timerRef = schedule();
    return () => clearTimeout(timerRef);
  }, [ids, minDelay, maxDelay, enabled]);
}
