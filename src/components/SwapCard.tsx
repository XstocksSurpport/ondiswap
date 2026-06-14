import { usePrivyReady } from '../hooks/usePrivyReady';
import { useSwap } from '../hooks/useSwap';
import { useLanguage } from '../i18n/LanguageProvider';
import { TokenSelect } from './TokenSelect';

export function SwapCard() {
  const { login } = usePrivyReady();
  const { t } = useLanguage();
  const {
    ready,
    authenticated,
    chainId,
    chains,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    balance,
    loading,
    errorKey,
    errorRaw,
    successKey,
    successVars,
    setFromToken,
    setToToken,
    setFromAmount,
    switchChain,
    executeSwap,
    flipTokens,
  } = useSwap();

  const error = errorKey ? t(errorKey) : errorRaw;
  const success = successKey ? t(successKey, successVars) : null;

  const handleMax = () => {
    const value = parseFloat(balance);
    if (value > 0) {
      const reserve = fromToken.isNative ? 0.001 : 0;
      setFromAmount(Math.max(0, value - reserve).toString());
    }
  };

  const rate =
    fromAmount && toAmount && parseFloat(fromAmount) > 0
      ? (parseFloat(toAmount) / parseFloat(fromAmount)).toLocaleString(
          undefined,
          { maximumFractionDigits: 2 },
        )
      : '—';

  return (
    <>
      <div className="swap-header">
        <div className="swap-brand">
          <div className="swap-brand-mark">
            <img src="/logo.png" alt="" className="swap-brand-icon" />
          </div>
          <h1 className="swap-title">{t('swap')}</h1>
        </div>
        <select
          className="chain-select"
          value={chainId}
          onChange={(e) => void switchChain(Number(e.target.value))}
        >
          {chains.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="swap-panel">
        <div className="swap-field">
          <div className="field-header">
            <span className="field-label">{t('from')}</span>
            <span className="field-balance">
              {t('balance')}: {parseFloat(balance).toFixed(4)}
            </span>
          </div>
          <div className="field-input-row">
            <div className="field-input-wrap">
              <input
                type="number"
                className="amount-input"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                min="0"
                step="any"
              />
              <button className="btn-max" onClick={handleMax} type="button">
                MAX
              </button>
            </div>
            <TokenSelect
              selected={fromToken}
              onSelect={setFromToken}
              chainId={chainId}
              label={t('selectToken')}
            />
          </div>
        </div>

        <button className="swap-flip" onClick={flipTokens} type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M4 6L8 2L12 6M12 10L8 14L4 10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </button>

        <div className="swap-field">
          <div className="field-header">
            <span className="field-label">{t('to')}</span>
          </div>
          <div className="field-input-row">
            <input
              type="text"
              className="amount-input"
              placeholder="0.0"
              value={toAmount}
              readOnly
            />
            <TokenSelect
              selected={toToken}
              onSelect={setToToken}
              chainId={chainId}
              label={t('selectToken')}
            />
          </div>
        </div>
      </div>

      {fromAmount && toAmount && (
        <div className="swap-info">
          <div className="info-row">
            <span>{t('rate')}</span>
            <span>
              1 {fromToken.symbol} = {rate} {toToken.symbol}
            </span>
          </div>
        </div>
      )}

      {error && <div className="msg msg-error">{error}</div>}
      {success && <div className="msg msg-success">{success}</div>}

      {!ready ? (
        <button className="btn-swap" disabled type="button">
          {t('loading')}
        </button>
      ) : authenticated ? (
        <button
          className="btn-swap"
          onClick={() => void executeSwap()}
          disabled={loading || !fromAmount || parseFloat(fromAmount) <= 0}
          type="button"
        >
          {loading ? t('confirming') : t('pay')}
        </button>
      ) : (
        <button className="btn-swap" onClick={login} type="button">
          {t('connectWallet')}
        </button>
      )}
    </>
  );
}
