"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import type { Translations } from "./types";
import { en } from "./translations/en";

const translations: Record<string, Translations> = { en };

interface LanguageContextType {
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

/**
 * Deep-merge a partial content object into the base translations.
 * Only overrides string fields that differ — arrays and nested objects are replaced wholesale.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
function mergeContent(base: Translations, overrides: Record<string, any>): Translations {
  const result = { ...base };
  for (const section of Object.keys(overrides)) {
    const key = section as keyof Translations;
    if (key in base && typeof overrides[key] === "object" && overrides[key] !== null) {
      (result as any)[key] = deepMergeObjects(base[key] as any, overrides[key]);
    }
  }
  return result;
}

function deepMergeObjects(base: any, override: any): any {
  if (typeof base !== "object" || base === null) return override ?? base;
  if (typeof override !== "object" || override === null) return override ?? base;
  const result = { ...base };
  for (const k of Object.keys(override)) {
    if (k in result && typeof result[k] === "object" && typeof override[k] === "object" && !Array.isArray(result[k]) && !Array.isArray(override[k])) {
      result[k] = deepMergeObjects(result[k], override[k]);
    } else {
      result[k] = override[k];
    }
  }
  return result;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<Translations>(translations["en"]);
  const controllerRef = useRef<AbortController | null>(null);

  // Fetch content with AbortController to prevent overlapping requests.
  // Re-fetches instantly when user returns to the tab (visibilitychange),
  // plus polls every 30s as a fallback for long sessions.
  const fetchContent = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    fetch("/api/site-content", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setT(mergeContent(translations["en"], data));
        }
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          // Silently fall back to base translations
        }
      });
  }, []);

  useEffect(() => {
    fetchContent();

    // Poll every 30 seconds
    const interval = setInterval(fetchContent, 30000);

    // Re-fetch instantly when user returns to the tab
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchContent();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      controllerRef.current?.abort();
    };
  }, [fetchContent]);

  const value: LanguageContextType = { t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
