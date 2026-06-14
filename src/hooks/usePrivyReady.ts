import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

/** Fallback so balance hooks can run if Privy init stalls (e.g. allowlist). */
const BALANCE_READY_FALLBACK_MS = 3_000;

/**
 * Do not block the UI on Privy `ready`. Wallet connect buttons render immediately;
 * `ready` is only used internally (e.g. fetching balances after SDK init).
 */
export function usePrivyReady() {
  const { ready: privyReady, ...rest } = usePrivy();
  const [balanceReady, setBalanceReady] = useState(false);

  useEffect(() => {
    if (privyReady) {
      setBalanceReady(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setBalanceReady(true);
    }, BALANCE_READY_FALLBACK_MS);

    return () => window.clearTimeout(timer);
  }, [privyReady]);

  return {
    ...rest,
    privyReady,
    /** @deprecated UI should not gate on this — kept for balance hooks only. */
    ready: privyReady || balanceReady,
  };
}
