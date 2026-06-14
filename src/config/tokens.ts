import { bsc, mainnet } from 'viem/chains';
import { NATIVE_LOGOS } from './tokenLogos';
import { DINO_TOKEN_ADDRESS, UUSD_TOKEN_ADDRESS } from './constants';

export type Token = {
  symbol: string;
  name: string;
  address: `0x${string}` | null;
  decimals: number;
  isNative?: boolean;
  logoURI?: string;
};

export const BNB_TOKEN: Token = {
  symbol: 'BNB',
  name: 'BNB',
  address: null,
  decimals: 18,
  isNative: true,
  logoURI: NATIVE_LOGOS.BNB,
};

export const DINO_TOKEN: Token = {
  symbol: 'FOSSIL',
  name: 'FOSSIL',
  address: DINO_TOKEN_ADDRESS,
  decimals: 18,
  logoURI: '/tokens/dino.png',
};

export const UUSD_TOKEN: Token = {
  symbol: 'UUSD',
  name: 'UUSD',
  address: UUSD_TOKEN_ADDRESS,
  decimals: 18,
  logoURI:
    'https://tokens.pancakeswap.finance/images/0x61a10E8556BEd032eA176330e7F17D6a12a10000.png',
};

/** BSC mainstream stablecoins (payment tokens). */
const BSC_STABLECOINS: Token[] = [
  UUSD_TOKEN,
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0x55d398326f99059fF775485246999027B3197955.png',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x8AC76a51cc950d98F2EB160F68cF869c58c122C0',
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d.png',
  },
  {
    symbol: 'BUSD',
    name: 'Binance USD',
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x1AF3F329e8BE154074D8766D1E4Aa11d962D033',
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3.png',
  },
  {
    symbol: 'FDUSD',
    name: 'First Digital USD',
    address: '0xc5f0f6b3577Ba5E9163dC6a6ce66a7e7056E654',
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409.png',
  },
  {
    symbol: 'TUSD',
    name: 'TrueUSD',
    address: '0x14016E85a25aeb13065688cAF951430dD32628Cb',
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0x40af3827F39D0EAcBF4A168f8D4ee67c121D11c9.png',
  },
  {
    symbol: 'USD1',
    name: 'World Liberty USD',
    address: '0x8d0D000Ee44948FC98c9B98a4FA4921476F08B0d',
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d.png',
  },
];

const BSC_TOKENS: Token[] = [
  BNB_TOKEN,
  ...BSC_STABLECOINS,
  DINO_TOKEN,
  {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19d81CE82',
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
  },
];

const ETH_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: null,
    decimals: 18,
    isNative: true,
    logoURI: NATIVE_LOGOS.ETH,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
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
      logoURI: NATIVE_LOGOS[symbol],
    },
  ];
}

export function getTokenBySymbol(
  chainId: number,
  symbol: string,
): Token | undefined {
  return getTokensForChain(chainId).find((t) => t.symbol === symbol);
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
