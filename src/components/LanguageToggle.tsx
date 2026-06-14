import { useLanguage } from '../i18n/LanguageProvider';

export function LanguageToggle() {
  const { locale, toggleLocale, t } = useLanguage();

  return (
    <button
      type="button"
      className="btn-lang"
      onClick={toggleLocale}
      aria-label={locale === 'en' ? t('switchToChinese') : t('switchToEnglish')}
      title={locale === 'en' ? '中文' : 'English'}
    >
      <svg
        className="lang-globe-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <ellipse
          cx="12"
          cy="12"
          rx="4"
          ry="9"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.5 7.5h15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.5 16.5h15" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
