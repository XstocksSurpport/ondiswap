import {
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  fantom,
  linea,
  mainnet,
  mantle,
  optimism,
  polygon,
  scroll,
  zkSync,
} from 'viem/chains';

export const SUPPORTED_CHAINS = [
  bsc,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
  fantom,
  linea,
  scroll,
  zkSync,
  mantle,
  blast,
] as const;

export const DEFAULT_CHAIN = bsc;
