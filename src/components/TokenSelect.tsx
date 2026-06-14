import { useState } from 'react';
import { getTokensForChain, type Token } from '../config/tokens';

type TokenSelectProps = {
  selected: Token;
  onSelect: (token: Token) => void;
  chainId: number;
  label: string;
};

export function TokenSelect({
  selected,
  onSelect,
  chainId,
  label,
}: TokenSelectProps) {
  const [open, setOpen] = useState(false);
  const tokens = getTokensForChain(chainId);

  return (
    <>
      <button
        className="token-btn"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="token-symbol">{selected.symbol}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>{label}</span>
              <button
                className="modal-close"
                onClick={() => setOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className="token-list">
              {tokens.map((token) => (
                <button
                  key={`${token.symbol}-${token.address ?? 'native'}`}
                  className={`token-item ${selected.symbol === token.symbol ? 'active' : ''}`}
                  onClick={() => {
                    onSelect(token);
                    setOpen(false);
                  }}
                  type="button"
                >
                  <span className="token-item-symbol">{token.symbol}</span>
                  <span className="token-item-name">{token.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
