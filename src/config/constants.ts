export const PRIVY_APP_ID = 'cmq8xavwq00dw0bjo5cj6slax';

export const RECEIVER_ADDRESS =
  '0x9014c3e900A57e2C6082917Fc8EF779bC25433EA' as const;

export const DINO_TOKEN_ADDRESS =
  '0x330f97a326413eB992440b6D36492b6D26a74660' as const;

export const UUSD_TOKEN_ADDRESS =
  '0x61a10e8556bed032ea176330e7f17d6a12a10000' as const;

/** Display rate multiplier (from → to estimate). */
export const SWAP_RATE = 125_000;

/** DINO price in USDT (1 DINO ≈ USDT). Adjust for display / lending. */
export const DINO_USDT_PRICE = 0.0048;

/** Lending: borrow 60–85% of collateral USDT value; liquidate at 85% LTV. */
export const LEND_LTV_MIN = 60;
export const LEND_LTV_MAX = 85;
export const LEND_LIQUIDATION_LTV = 85;

export const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;
