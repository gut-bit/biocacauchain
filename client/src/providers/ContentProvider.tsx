/**
 * ContentProvider.tsx — Fetches all content blocks from /api/content once
 * and makes them available to all components via useContent().
 *
 * Falls back to i18n static dictionary when a key is missing from the DB.
 */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

interface ContentMap {
  [key: string]: { pt: string; en: string; type: string };
}

interface ContentContextType {
  /** Get a content value for the current locale. Falls back to i18n t() if missing. */
  cb: (key: string, fallback?: string) => string;
  /** Full raw map — useful in admin or for parsing list_json blocks */
  raw: ContentMap;
  /** Whether the initial fetch is in-flight */
  loading: boolean;
  /** Re-fetch all blocks (call after admin saves) */
  refresh: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const { language, t } = useLanguage();
  const [raw, setRaw] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  const fetchBlocks = () => {
    fetch("/api/content")
      .then(r => r.json())
      .then((data: ContentMap) => {
        setRaw(data ?? {});
      })
      .catch(() => {
        // Silently fail — fallback to i18n will handle it
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const cb = (key: string, fallback?: string): string => {
    const block = raw[key];
    if (block) {
      const val = language === "en" ? block.en : block.pt;
      if (val && val.trim() !== "") return val;
    }
    // Fall back to: explicit fallback → i18n key → key itself
    return fallback ?? t(key) ?? key;
  };

  return (
    <ContentContext.Provider value={{ cb, raw, loading, refresh: fetchBlocks }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextType {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
