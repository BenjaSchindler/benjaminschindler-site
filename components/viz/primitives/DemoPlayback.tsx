"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/Language";

/** Discrete explanatory steps. One pass on entry; pauses offscreen, never loops.
 *  Reduced motion shows the final step unless the viewer picks one with `seek`. */
export function useDemoPlayback(count = 4, interval = 1300) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.25 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(true);
  const [seeked, setSeeked] = useState(false);
  const playing = running && step < count - 1 && !reduced;

  useEffect(() => {
    if (!visible || !playing) return;
    const timer = window.setTimeout(() => setStep(s => Math.min(s + 1, count - 1)), interval);
    return () => window.clearTimeout(timer);
  }, [visible, playing, step, count, interval]);

  return [ref, {
    reduced: Boolean(reduced), step: reduced && !seeked ? count - 1 : step, count, playing,
    toggle: () => setRunning(v => !v),
    replay: () => { setStep(0); setRunning(true); setSeeked(false); },
    seek: (i: number) => { setStep(i); setRunning(false); setSeeked(true); },
  }] as const;
}
export type Playback = ReturnType<typeof useDemoPlayback>[1];

export function DemoControls({ playback, label }: { playback: Playback; label?: string }) {
  const { lang } = useLanguage();
  const es = lang === "es";
  return <div className="demo-controls">
    <span className="min-w-0 text-xs text-[var(--foreground-muted)]">{label ?? (es ? "Simulación ilustrativa" : "Illustrative simulation")}</span>
    {playback.reduced ? <span className="text-xs text-[var(--foreground-muted)]">{es ? "Sin movimiento" : "Motion off"}</span> : <div className="flex shrink-0 items-center gap-1">
      <span aria-hidden className="mr-2 flex gap-1">{Array.from({ length: playback.count }, (_, i) => <span key={i} className={`h-1 w-3 rounded-full transition-colors ${i <= playback.step ? "bg-[var(--accent-cyan)]" : "bg-[var(--border-strong)]"}`} />)}</span>
      {playback.step < playback.count - 1 && <button type="button" onClick={playback.toggle} aria-label={playback.playing ? (es ? "Pausar animación" : "Pause animation") : (es ? "Continuar animación" : "Resume animation")} className="demo-icon-button">{playback.playing ? <Pause aria-hidden className="size-3.5" /> : <Play aria-hidden className="size-3.5" />}</button>}
      <button type="button" onClick={playback.replay} aria-label={es ? "Repetir animación" : "Replay animation"} className="demo-icon-button"><RotateCcw aria-hidden className="size-3.5" /></button>
    </div>}
  </div>;
}
