"use client";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useInView";

type Props = {
  text: string;
  speed?: number; // chars per second
  delay?: number; // ms before starting
  prompt?: string;
  promptColor?: string;
  textColor?: string;
  showCaret?: boolean;
  onDone?: () => void;
  className?: string;
};

export function TerminalLine({
  text,
  speed = 35,
  delay = 0,
  prompt,
  promptColor = "var(--accent)",
  textColor = "inherit",
  showCaret = true,
  onDone,
  className,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(text);
      setDone(true);
      onDone?.();
      return;
    }
    setShown("");
    setDone(false);
    const charDuration = 1000 / speed;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= text.length; i++) {
      const id = setTimeout(() => {
        if (cancelled) return;
        setShown(text.slice(0, i));
        if (i === text.length) {
          setDone(true);
          onDone?.();
        }
      }, delay + (i - 1) * charDuration);
      timers.push(id);
    }
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [text, speed, delay, onDone, reduced]);

  return (
    <div className={className}>
      {prompt && (
        <span style={{ color: promptColor }} className="select-none">
          {prompt}
        </span>
      )}
      <span style={{ color: textColor }}>{shown}</span>
      {showCaret && !done && <span className="caret ml-0.5 align-middle">&nbsp;</span>}
    </div>
  );
}
