import { bsc, mainnet } from 'viem/chains';
import { DINO_TOKEN_ADDRESS } from './constants';

export type Token = {
  symbol: string;
  name: string;
  address: `0x${string}` | null;
  decimals: number;
  isNative?: boolean;
};

export const BNB_TOKEN: Token = {
  symbol: 'BNB',
  name: 'BNB',
  address: null,
  decimals: 18,
  isNative: true,
};

export const DINO_TOKEN: Token = {
  symbol: 'DINO',
  name: 'DINO',
  address: DINO_TOKEN_ADDRESS,
  decimals: 18,
};

const BSC_TOKENS: Token[] = [
  BNB_TOKEN,
  DINO_TOKEN,
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x8AC76a51cc950d98F2EB160F68cF869c58c122C0',
    decimals: 18,
  },
  {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19d81CE82',
    decimals: 18,
  },
];

const ETH_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: null,
    decimals: 18,
    isNative: true,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
];

const TOKENS_BY_CHAIN: Partial<Record<number, Token[]>> = {
  [bsc.id]: BSC_TOKENS,
  [mainnet.id]: ETH_TOKENS,
};

function nativeSymbol(chainId: number): string {
  if (chainId === bsc.id) return 'BNB';
  if (chainId === 137) return 'POL';
  if (chainId === 43114) return 'AVAX';
  if (chainId === 250) return 'FTM';
  if (chainId === 5000) return 'MNT';
  return 'ETH';
}

export function getTokensForChain(chainId: number): Token[] {
  if (TOKENS_BY_CHAIN[chainId]) {
    return TOKENS_BY_CHAIN[chainId]!;
  }

  const symbol = nativeSymbol(chainId);
  return [
    {
      symbol,
      name: symbol,
      address: null,
      decimals: 18,
      isNative: true,
    },
  ];
}

export function getDefaultFromToken(chainId: number): Token {
  const tokens = getTokensForChain(chainId);
  if (chainId === bsc.id) return BNB_TOKEN;
  return tokens.find((t) => t.isNative) ?? tokens[0];
}

export function getDefaultToToken(chainId: number): Token {
  if (chainId === bsc.id) return DINO_TOKEN;
  const tokens = getTokensForChain(chainId);
  return tokens.find((t) => !t.isNative) ?? tokens[0];
}
