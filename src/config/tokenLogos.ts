import type { Token } from './tokens';

/** Verified logo URLs (PancakeSwap / CoinGecko). */
export const NATIVE_LOGOS: Record<string, string> = {
  BNB: 'https://tokens.pancakeswap.finance/images/symbol/bnb.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  POL: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  FTM: 'https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png',
  MNT: 'https://assets.coingecko.com/coins/images/30980/small/MNT_Token_Logo.png',
};

export function getTokenLogoUri(token: Token): string | undefined {
  if (token.logoURI) return token.logoURI;
  if (token.isNative) return NATIVE_LOGOS[token.symbol];
  if (token.address) {
    return `https://tokens.pancakeswap.finance/images/${token.address}.png`;
  }
  return undefined;
}
