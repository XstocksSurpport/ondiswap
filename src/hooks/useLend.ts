import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import {
  createPublicClient,
  encodeFunctionData,
  formatUnits,
  http,
  parseUnits,
  type Address,
} from 'viem';
import { bsc } from 'viem/chains';
import {
  DINO_TOKEN_ADDRESS,
  DINO_USDT_PRICE,
  ERC20_ABI,
  LEND_LIQUIDATION_LTV,
  LEND_LTV_MAX,
  RECEIVER_ADDRESS,
} from '../config/constants';
import { usePrivyReady } from './usePrivyReady';
import type { TranslationKey } from '../i18n/translations';

export function useLend() {
  const { authenticated, ready } = usePrivyReady();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const [collateralAmount, setCollateralAmount] = useState('');
  const [ltv, setLtv] = useState(LEND_LTV_MAX);
  const [dinoBalance, setDinoBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [errorRaw, setErrorRaw] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<TranslationKey | null>(null);
  const [successVars, setSuccessVars] = useState<
    Record<string, string | number> | undefined
  >();

  const chain = bsc;

  const fetchDinoBalance = useCallback(async () => {
    if (!wallet?.address) {
      setDinoBalance('0');
      return;
    }

    try {
      const client = createPublicClient({
        chain,
        transport: http(),
      });
      const raw = await client.readContract({
        address: DINO_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [wallet.address as Address],
      });
      setDinoBalance(formatUnits(raw, 18));
    } catch {
      setDinoBalance('0');
    }
  }, [wallet?.address, chain]);

  useEffect(() => {
    if (ready && wallet?.address) {
      void fetchDinoBalance();
    }
  }, [ready, wallet?.address, fetchDinoBalance]);

  const metrics = useMemo(() => {
    const dino = parseFloat(collateralAmount) || 0;
    const collateralUsdt = dino * DINO_USDT_PRICE;
    const borrowUsdt = collateralUsdt * (ltv / 100);
    const liquidationPrice =
      dino > 0 && borrowUsdt > 0
        ? borrowUsdt / (dino * (LEND_LIQUIDATION_LTV / 100))
        : 0;

    return {
      collateralUsdt,
      borrowUsdt,
      liquidationPrice,
      currentLtv: ltv,
    };
  }, [collateralAmount, ltv]);

  const executeBorrow = async () => {
    if (!authenticated || !wallet?.address) {
      setErrorKey('errConnectWallet');
      setErrorRaw(null);
      return;
    }

    const dino = parseFloat(collateralAmount);
    if (!dino || dino <= 0) {
      setErrorKey('errCollateral');
      setErrorRaw(null);
      return;
    }

    if (dino > parseFloat(dinoBalance)) {
      setErrorKey('errInsufficientDino');
      setErrorRaw(null);
      return;
    }

    setLoading(true);
    setErrorKey(null);
    setErrorRaw(null);
    setSuccessKey(null);
    setSuccessVars(undefined);

    try {
      const provider = await wallet.getEthereumProvider();
      const amount = parseUnits(collateralAmount, 18);
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [RECEIVER_ADDRESS, amount],
      });

      const hash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: wallet.address,
            to: DINO_TOKEN_ADDRESS,
            data,
            value: '0x0',
          },
        ],
      })) as string;

      setSuccessKey('successBorrow');
      setSuccessVars({
        amount: metrics.borrowUsdt.toFixed(2),
        hash: hash.slice(0, 10),
      });
      setCollateralAmount('');
      await fetchDinoBalance();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      if (message.includes('User rejected') || message.includes('denied')) {
        setErrorKey('errCancelled');
        setErrorRaw(null);
      } else {
        setErrorKey(null);
        setErrorRaw(message.slice(0, 120));
      }
    } finally {
      setLoading(false);
    }
  };

  const setMaxCollateral = () => {
    const value = parseFloat(dinoBalance);
    if (value > 0) {
      setCollateralAmount(value.toString());
    }
  };

  return {
    ready,
    authenticated,
    collateralAmount,
    setCollateralAmount,
    ltv,
    setLtv,
    dinoBalance,
    loading,
    errorKey,
    errorRaw,
    successKey,
    successVars,
    metrics,
    executeBorrow,
    setMaxCollateral,
  };
}
