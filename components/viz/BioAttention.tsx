"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { palette } from "./primitives/colors";
import { useInView, usePrefersReducedMotion } from "./primitives/useInView";

type Props = {
  /** Body text. Anything not matched as a token renders as plain text. */
  text: string;
  /**
   * Words to highlight as attention tokens, in priority order.
   * Each token is wrapped on its first occurrence (case-sensitive substring match).
   */
  tokens: string[];
  /** Tailwind classes applied to the paragraph. */
  className?: string;
};

type Segment = { kind: "text"; text: string } | { kind: "token"; text: string; idx: number };

type Pos = { cx: number; topY: number; botY: number; w: number; h: number };

const HEAD_COLORS = [palette.cyan, palette.orange, palette.magenta] as const;
const QUERY_INTERVAL_MS = 1700;

export function BioAttention({ text, tokens, className }: Props) {
  // Build the segment list: alternating plain-text and token spans.
  // We find each token's first occurrence independently, then walk left-to-right
  // through the text. This order-independent matching is needed for languages
  // where token-list order doesn't match text order (e.g., "Ingeniero de IA"
  // in Spanish would otherwise consume "Ingeniero" first and skip "IA").
  const segments = useMemo<Segment[]>(() => {
    type Match = { token: string; pos: number; len: number };
    const matches: Match[] = [];
    for (const tok of tokens) {
      if (!tok) continue;
      const pos = text.indexOf(tok);
      if (pos < 0) continue;
      matches.push({ token: tok, pos, len: tok.length });
    }
    // Earlier position first; ties break by longer token (avoids "AI" consuming "AI Engineer").
    matches.sort((a, b) => a.pos - b.pos || b.len - a.len);

    // Drop overlaps with already-kept matches.
    const kept: Match[] = [];
    let lastEnd = -1;
    for (const m of matches) {
      if (m.pos < lastEnd) continue;
      kept.push(m);
      lastEnd = m.pos + m.len;
    }

    const out: Segment[] = [];
    let cursor = 0;
    kept.forEach((m, i) => {
      if (m.pos > cursor) out.push({ kind: "text", text: text.slice(cursor, m.pos) });
      out.push({ kind: "token", text: m.token, idx: i });
      cursor = m.pos + m.len;
    });
    if (cursor < text.length) out.push({ kind: "text", text: text.slice(cursor) });
    return out;
  }, [text, tokens]);

  const tokenCount = useMemo(
    () => segments.filter((s) => s.kind === "token").length,
    [segments],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tokenRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [positions, setPositions] = useState<Pos[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Recompute token bounding boxes whenever layout might change.
  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      if (!c) return;
      const cRect = c.getBoundingClientRect();
      setSize({ w: cRect.width, h: cRect.height });
      const ps: Pos[] = [];
      for (let i = 0; i < tokenCount; i++) {
        const el = tokenRefs.current[i];
        if (!el) {
          ps.push({ cx: 0, topY: 0, botY: 0, w: 0, h: 0 });
          continue;
        }
        const r = el.getBoundingClientRect();
        ps.push({
          cx: r.left - cRect.left + r.width / 2,
          topY: r.top - cRect.top,
          botY: r.bottom - cRect.top,
          w: r.width,
          h: r.height,
        });
      }
      setPositions(ps);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    // Fonts may load after first paint and reflow tokens.
    type FontDoc = Document & { fonts?: { ready?: Promise<unknown> } };
    const fontReady = (document as FontDoc).fonts?.ready;
    if (fontReady) fontReady.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [tokenCount, text]);

  const [containerInViewRef, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const reduced = usePrefersReducedMotion();

  // Combine refs for the container.
  const setContainerRef = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    containerInViewRef.current = el;
  };

  const [autoQ, setAutoQ] = useState(0);
  const [hoverQ, setHoverQ] = useState<number | null>(null);
  const [headIdx, setHeadIdx] = useState(0);

  useEffect(() => {
    if (!inView || reduced || tokenCount === 0) return;
    const id = setInterval(() => {
      setAutoQ((q) => {
        const next = q + 1;
        if (next >= tokenCount) {
          setHeadIdx((h) => (h + 1) % HEAD_COLORS.length);
          return 0;
        }
        return next;
      });
    }, QUERY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [inView, reduced, tokenCount]);

  const queryIdx = hoverQ ?? (reduced ? null : autoQ);
  const color = HEAD_COLORS[headIdx];

  // Soft attention weights from the active query to every key, decaying with token-index distance
  // and bumping the active query itself. Self-loops are not drawn.
  const weights = useMemo(() => {
    if (queryIdx === null || tokenCount === 0) return [] as number[];
    const raw: number[] = [];
    for (let k = 0; k < tokenCount; k++) {
      const d = Math.abs(k - queryIdx);
      raw.push(Math.exp(-d * 0.55));
    }
    const sum = raw.reduce((a, b) => a + b, 0);
    return raw.map((v) => v / sum);
  }, [queryIdx, tokenCount]);

  const showOverlay = queryIdx !== null && positions.length === tokenCount && tokenCount > 0;

  return (
    <div ref={setContainerRef} className="relative">
      {showOverlay && size.w > 0 && (
        <svg
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          style={{ overflow: "visible" }}
        >
          {positions.map((p, k) => {
            if (k === queryIdx) return null;
            const q = positions[queryIdx!];
            const w = weights[k];
            // Anchor curves on token bottoms — arcs ride along the baseline
            // through descender space, where they overlap text the least.
            const sx = q.cx;
            const sy = q.botY - 1;
            const tx = p.cx;
            const ty = p.botY - 1;
            const dx = tx - sx;
            const sameLine = Math.abs(p.botY - q.botY) < q.h * 0.5;
            const drop = sameLine
              ? Math.min(18, Math.abs(dx) * 0.18 + 8)
              : Math.min(22, Math.abs(dx) * 0.12 + 12);
            const cy1 = sy + drop;
            const cy2 = ty + drop;
            const d = `M ${sx} ${sy} C ${sx} ${cy1}, ${tx} ${cy2}, ${tx} ${ty}`;
            const visible = w >= 0.04;
            return (
              // Stable key (per key-token) lets the path morph smoothly
              // when the active query advances.
              <path
                key={k}
                d={d}
                fill="none"
                stroke={color}
                strokeOpacity={visible ? Math.min(0.85, 0.18 + w * 1.5) : 0}
                strokeWidth={visible ? Math.max(0.9, w * 3.2) : 0}
                strokeLinecap="round"
                style={{
                  transition:
                    "d 700ms cubic-bezier(0.22, 1, 0.36, 1), stroke 700ms ease, stroke-opacity 600ms ease, stroke-width 600ms ease",
                }}
              />
            );
          })}

          {/* anchor dot on the active query, sits on the baseline */}
          {queryIdx !== null && positions[queryIdx] && (
            <circle
              cx={positions[queryIdx].cx}
              cy={positions[queryIdx].botY - 1}
              r={2.5}
              fill={color}
              opacity={0.95}
              style={{
                filter: `drop-shadow(0 0 6px ${color})`,
                transition:
                  "cx 600ms cubic-bezier(0.22, 1, 0.36, 1), cy 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          )}
        </svg>
      )}

      <p className={className}>
        {segments.map((seg, i) => {
          if (seg.kind === "text") return <span key={i}>{seg.text}</span>;
          const isQ = queryIdx === seg.idx;
          const w = queryIdx !== null && weights[seg.idx] ? weights[seg.idx] : 0;
          const lit = !isQ && w > 0.08;
          // No font-weight changes — they reflow text and shift curve anchors.
          // We rely on color, brightness, and an underline for the active query.
          const tokenStyle: CSSProperties = {
            color: isQ || lit ? color : undefined,
            opacity: queryIdx !== null && !isQ && !lit ? 0.85 : 1,
            boxShadow: isQ ? `inset 0 -1.5px 0 ${color}` : "none",
            textShadow: isQ ? `0 0 12px ${color}55` : "none",
            transition:
              "color 600ms ease, opacity 600ms ease, box-shadow 500ms ease, text-shadow 500ms ease",
            cursor: "pointer",
            outline: "none",
          };
          return (
            <span
              key={i}
              ref={(el) => {
                tokenRefs.current[seg.idx] = el;
              }}
              tabIndex={0}
              onMouseEnter={() => setHoverQ(seg.idx)}
              onMouseLeave={() => setHoverQ(null)}
              onFocus={() => setHoverQ(seg.idx)}
              onBlur={() => setHoverQ(null)}
              style={tokenStyle}
              data-token-idx={seg.idx}
            >
              {seg.text}
            </span>
          );
        })}
      </p>

      <div
        aria-hidden
        className="mt-2 flex items-center gap-2 font-mono text-[10px] tracking-wider text-[var(--foreground-muted)]"
      >
        <span className="uppercase">{"// "}</span>
        <span className="lowercase text-[var(--foreground-dim)]">softmax</span>
        <span>(</span>
        <span
          style={{ color, transition: "color 700ms ease" }}
          className="font-semibold"
        >
          Q
        </span>
        <span>·</span>
        <span
          style={{ color, opacity: 0.85, transition: "color 700ms ease" }}
          className="font-semibold"
        >
          K<sup className="text-[8px]">⊤</sup>
        </span>
        <span>/</span>
        <span className="lowercase">√d</span>
        <span>) </span>
        <span
          style={{ color, opacity: 0.7, transition: "color 700ms ease" }}
          className="font-semibold"
        >
          V
        </span>
        <span className="uppercase opacity-70 ml-2">· 3 heads</span>
        <span className="flex gap-1 ml-1">
          {HEAD_COLORS.map((c, i) => (
            <span
              key={c}
              className="block size-1.5 rounded-full"
              style={{
                background: i === headIdx ? c : "transparent",
                border: `1px solid ${c}`,
                opacity: i === headIdx ? 1 : 0.5,
                transition: "opacity 400ms, background 400ms",
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
