import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageProvider';
import { LendCard } from './LendCard';
import { SwapCard } from './SwapCard';

type Tab = 'swap' | 'lend';

export function FeaturePanel() {
  const [tab, setTab] = useState<Tab>('swap');
  const { t } = useLanguage();

  return (
    <div className="swap-card">
      <div className="tab-nav" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'swap'}
          className={`tab-btn ${tab === 'swap' ? 'active' : ''}`}
          onClick={() => setTab('swap')}
        >
          {t('tabSwap')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'lend'}
          className={`tab-btn ${tab === 'lend' ? 'active' : ''}`}
          onClick={() => setTab('lend')}
        >
          {t('tabLend')}
        </button>
      </div>

      <div className="tab-panel" role="tabpanel">
        {tab === 'swap' ? <SwapCard /> : <LendCard />}
      </div>
    </div>
  );
}
