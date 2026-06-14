import { usePrivyReady } from '../hooks/usePrivyReady';
import { useLend } from '../hooks/useLend';
import {
  DINO_USDT_PRICE,
  LEND_LIQUIDATION_LTV,
  LEND_LTV_MAX,
  LEND_LTV_MIN,
} from '../config/constants';
import { useLanguage } from '../i18n/LanguageProvider';
import { DINO_TOKEN, getTokenBySymbol } from '../config/tokens';
import { bsc } from 'viem/chains';
import { TokenIcon } from './TokenIcon';

export function LendCard() {
  const { login } = usePrivyReady();
  const { t } = useLanguage();
  const usdtToken = getTokenBySymbol(bsc.id, 'USDT');
  const {
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
  } = useLend();

  const error = errorKey ? t(errorKey) : errorRaw;
  const success = successKey ? t(successKey, successVars) : null;

  return (
    <>
      <div className="swap-header">
        <div className="swap-brand">
          <div className="swap-brand-mark">
            <img src="/logo.png" alt="" className="swap-brand-icon" />
          </div>
          <h1 className="swap-title">{t('lend')}</h1>
        </div>
        <span className="chain-badge">{t('bnbSmartChain')}</span>
      </div>

      <div className="swap-field">
        <div className="field-header">
          <span className="field-label">{t('collateral')}</span>
          <div className="field-balance-row">
            <span className="field-balance">
              {t('dinoBalance')}: {parseFloat(dinoBalance).toFixed(4)}
            </span>
            <button className="btn-max" onClick={setMaxCollateral} type="button">
              MAX
            </button>
          </div>
        </div>
        <div className="field-input-row">
          <input
            type="number"
            className="amount-input"
            placeholder="0.0"
            value={collateralAmount}
            onChange={(e) => setCollateralAmount(e.target.value)}
            min="0"
            step="any"
          />
          <div className="token-btn token-btn-static">
            <TokenIcon token={DINO_TOKEN} size={24} />
            <span className="token-symbol">{DINO_TOKEN.symbol}</span>
          </div>
        </div>
      </div>

      {parseFloat(collateralAmount) > 0 && (
        <div className="swap-info">
          <div className="info-row">
            <span>{t('collateralValue')}</span>
            <span>{metrics.collateralUsdt.toFixed(2)} USDT</span>
          </div>
          <div className="info-row">
            <span>{t('dinoPrice')}</span>
            <span>{DINO_USDT_PRICE} USDT</span>
          </div>
        </div>
      )}

      <div className="lend-ltv-block">
        <div className="field-header">
          <span className="field-label">{t('loanRatio')}</span>
          <span className="field-balance ltv-value">{ltv}%</span>
        </div>
        <input
          type="range"
          className="ltv-slider"
          min={LEND_LTV_MIN}
          max={LEND_LTV_MAX}
          step={1}
          value={ltv}
          onChange={(e) => setLtv(Number(e.target.value))}
        />
        <div className="ltv-labels">
          <span>{LEND_LTV_MIN}%</span>
          <span>{LEND_LTV_MAX}%</span>
        </div>
      </div>

      <div className="swap-field lend-borrow-field">
        <div className="field-header">
          <span className="field-label">{t('borrow')}</span>
        </div>
        <div className="field-input-row">
          <input
            type="text"
            className="amount-input"
            readOnly
            value={
              metrics.borrowUsdt > 0 ? metrics.borrowUsdt.toFixed(2) : '0.0'
            }
          />
          <div className="token-btn token-btn-static">
            {usdtToken && <TokenIcon token={usdtToken} size={24} />}
            <span className="token-symbol">USDT</span>
          </div>
        </div>
      </div>

      <div className="swap-info lend-risk">
        <div className="info-row">
          <span>{t('liquidationLtv')}</span>
          <span className="risk-highlight">{LEND_LIQUIDATION_LTV}%</span>
        </div>
        {metrics.liquidationPrice > 0 && (
          <div className="info-row">
            <span>{t('liquidationPrice')}</span>
            <span>
              {metrics.liquidationPrice.toFixed(6)} {t('perDino')}
            </span>
          </div>
        )}
        <div className="info-row">
          <span>{t('loanRange')}</span>
          <span>
            {t('loanRangeValue', { min: LEND_LTV_MIN, max: LEND_LTV_MAX })}
          </span>
        </div>
      </div>

      {error && <div className="msg msg-error">{error}</div>}
      {success && <div className="msg msg-success">{success}</div>}

      {authenticated ? (
        <button
          className="btn-swap"
          onClick={() => void executeBorrow()}
          disabled={
            loading ||
            !collateralAmount ||
            parseFloat(collateralAmount) <= 0
          }
          type="button"
        >
          {loading ? t('confirming') : t('borrow')}
        </button>
      ) : (
        <button className="btn-swap" onClick={login} type="button">
          {t('connectWallet')}
        </button>
      )}
    </>
  );
}
