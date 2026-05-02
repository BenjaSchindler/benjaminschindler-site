"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "es";
const STORAGE_KEY = "cv-lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  hydrated: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function syncHtmlLang(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "es" || saved === "en") {
        setLangState(saved);
        syncHtmlLang(saved);
      } else {
        const navLang = (navigator.language || "en").slice(0, 2).toLowerCase();
        const initial: Lang = navLang === "es" ? "es" : "en";
        setLangState(initial);
        syncHtmlLang(initial);
      }
    } catch {
      syncHtmlLang("en");
    }
    setHydrated(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    syncHtmlLang(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "en" ? "es" : "en";
      syncHtmlLang(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, hydrated }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
