import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  interpolate,
  translations,
  type Locale,
  type TranslationKey,
} from './translations';

type LanguageContextValue = {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const STORAGE_KEY = 'ondi-swap-locale';

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') return stored;
  } catch {
    /* ignore */
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'en' ? 'zh' : 'en'));
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const text = translations[locale][key];
      return vars ? interpolate(text, vars) : text;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, toggleLocale, t }),
    [locale, toggleLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
