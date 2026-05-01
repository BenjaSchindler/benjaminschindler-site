"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

const STORAGE_KEY = "cv-view-mode";

type ViewModeContextValue = {
  detailed: boolean;
  setDetailed: (v: boolean) => void;
  toggle: () => void;
  hydrated: boolean;
};

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

function syncHtmlClass(detailed: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("concise", !detailed);
}

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => unknown;
};

function withViewTransition(apply: () => void) {
  if (typeof document === "undefined") {
    apply();
    return;
  }
  const doc = document as DocWithVT;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && typeof doc.startViewTransition === "function") {
    doc.startViewTransition(() => flushSync(apply));
  } else {
    apply();
  }
}

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [detailed, setDetailedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "detailed") {
        setDetailedState(true);
        syncHtmlClass(true);
      } else {
        syncHtmlClass(false);
      }
    } catch {
      syncHtmlClass(false);
    }
    setHydrated(true);
  }, []);

  const setDetailed = useCallback((v: boolean) => {
    withViewTransition(() => {
      setDetailedState(v);
      syncHtmlClass(v);
      try {
        window.localStorage.setItem(STORAGE_KEY, v ? "detailed" : "concise");
      } catch {}
    });
  }, []);

  const toggle = useCallback(() => {
    withViewTransition(() => {
      setDetailedState((prev) => {
        const next = !prev;
        syncHtmlClass(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next ? "detailed" : "concise");
        } catch {}
        return next;
      });
    });
  }, []);

  return (
    <ViewModeContext.Provider value={{ detailed, setDetailed, toggle, hydrated }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) {
    throw new Error("useViewMode must be used within ViewModeProvider");
  }
  return ctx;
}
