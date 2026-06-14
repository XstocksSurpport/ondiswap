import { useState } from 'react';
import { getTokenLogoUri } from '../config/tokenLogos';
import type { Token } from '../config/tokens';

type TokenIconProps = {
  token: Token;
  size?: number;
  className?: string;
};

export function TokenIcon({ token, size = 24, className = '' }: TokenIconProps) {
  const [failed, setFailed] = useState(false);
  const src = getTokenLogoUri(token);

  if (!src || failed) {
    return (
      <span
        className={`token-icon-fallback ${className}`.trim()}
        style={{ width: size, height: size, fontSize: Math.max(10, size * 0.42) }}
        aria-hidden="true"
      >
        {token.symbol.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={`token-icon ${className}`.trim()}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
