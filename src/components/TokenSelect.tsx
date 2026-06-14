import { useEffect, useMemo, useRef, useState } from 'react';
import { getTokensForChain, type Token } from '../config/tokens';
import { TokenIcon } from './TokenIcon';

type TokenSelectProps = {
  selected: Token;
  onSelect: (token: Token) => void;
  chainId: number;
  label: string;
};

function filterTokens(tokens: Token[], query: string): Token[] {
  const q = query.trim().toLowerCase();
  if (!q) return tokens;

  return tokens.filter((token) => {
    if (token.symbol.toLowerCase().includes(q)) return true;
    if (token.address?.toLowerCase().includes(q)) return true;
    return false;
  });
}

export function TokenSelect({
  selected,
  onSelect,
  chainId,
  label,
}: TokenSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const tokens = getTokensForChain(chainId);
  const filteredTokens = useMemo(
    () => filterTokens(tokens, searchQuery),
    [tokens, searchQuery],
  );

  useEffect(() => {
    if (open) {
      setSearchQuery('');
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        className="token-btn"
        onClick={() => setOpen(true)}
        type="button"
      >
        <TokenIcon token={selected} size={24} />
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
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>{label}</span>
              <button className="modal-close" onClick={close} type="button">
                ✕
              </button>
            </div>
            <div className="token-search-wrap">
              <input
                ref={searchRef}
                type="text"
                className="token-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="token-list">
              {filteredTokens.map((token) => (
                <button
                  key={`${token.symbol}-${token.address ?? 'native'}`}
                  className={`token-item ${selected.symbol === token.symbol ? 'active' : ''}`}
                  onClick={() => {
                    onSelect(token);
                    close();
                  }}
                  type="button"
                >
                  <TokenIcon token={token} size={32} />
                  <span className="token-item-info">
                    <span className="token-item-symbol">{token.symbol}</span>
                    <span className="token-item-name">{token.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
