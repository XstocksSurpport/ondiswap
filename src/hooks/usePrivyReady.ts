import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const BOOT_TIMEOUT_MS = 12_000;

/**
 * Privy `ready` can stay false if the dashboard origin allowlist is missing
 * or the SDK is slow to init. After a timeout, unblock the UI so users can
 * still attempt wallet connect.
 */
export function usePrivyReady() {
  const { ready: privyReady, ...rest } = usePrivy();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (privyReady) return;

    const timer = window.setTimeout(() => {
      setTimedOut(true);
    }, BOOT_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [privyReady]);

  const ready = privyReady || timedOut;

  return { ready, privyReady, timedOut, ...rest };
}
