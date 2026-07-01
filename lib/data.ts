"use client";
import { useLanguage } from "./Language";
import { getData, type DataSet } from "./cvData";

// The datasets themselves live in cvData.ts (a pure module the server-side
// agent route also imports). This client wrapper adds the language-aware hook.
export * from "./cvData";

export function useData(): DataSet {
  const { lang } = useLanguage();
  return getData(lang);
}
