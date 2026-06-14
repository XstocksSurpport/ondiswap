import { useState } from 'react';
import { LendCard } from './LendCard';
import { SwapCard } from './SwapCard';

type Tab = 'swap' | 'lend';

export function FeaturePanel() {
  const [tab, setTab] = useState<Tab>('swap');

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
          Swap
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'lend'}
          className={`tab-btn ${tab === 'lend' ? 'active' : ''}`}
          onClick={() => setTab('lend')}
        >
          Lend
        </button>
      </div>

      <div className="tab-panel" role="tabpanel">
        {tab === 'swap' ? <SwapCard /> : <LendCard />}
      </div>
    </div>
  );
}
