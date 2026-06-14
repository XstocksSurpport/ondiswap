import { usePrivyReady } from '../hooks/usePrivyReady';
import { useLend } from '../hooks/useLend';
import {
  DINO_USDT_PRICE,
  LEND_LIQUIDATION_LTV,
  LEND_LTV_MAX,
  LEND_LTV_MIN,
} from '../config/constants';

export function LendCard() {
  const { login } = usePrivyReady();
  const {
    ready,
    authenticated,
    collateralAmount,
    setCollateralAmount,
    ltv,
    setLtv,
    dinoBalance,
    loading,
    error,
    success,
    metrics,
    executeBorrow,
    setMaxCollateral,
  } = useLend();

  return (
    <>
      <div className="swap-header">
        <div className="swap-brand">
          <div className="swap-brand-mark">
            <img src="/logo.png" alt="" className="swap-brand-icon" />
          </div>
          <h1 className="swap-title">Lend</h1>
        </div>
        <span className="chain-badge">BNB Smart Chain</span>
      </div>

      <div className="swap-field">
        <div className="field-header">
          <span className="field-label">Collateral</span>
          <span className="field-balance">
            DINO Balance: {parseFloat(dinoBalance).toFixed(4)}
          </span>
        </div>
        <div className="field-input-row">
          <div className="field-input-wrap">
            <input
              type="number"
              className="amount-input"
              placeholder="0.0"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              min="0"
              step="any"
            />
            <button className="btn-max" onClick={setMaxCollateral} type="button">
              MAX
            </button>
          </div>
          <div className="token-btn token-btn-static">
            <span className="token-symbol">DINO</span>
          </div>
        </div>
      </div>

      {parseFloat(collateralAmount) > 0 && (
        <div className="swap-info">
          <div className="info-row">
            <span>Collateral value</span>
            <span>{metrics.collateralUsdt.toFixed(2)} USDT</span>
          </div>
          <div className="info-row">
            <span>DINO price</span>
            <span>{DINO_USDT_PRICE} USDT</span>
          </div>
        </div>
      )}

      <div className="lend-ltv-block">
        <div className="field-header">
          <span className="field-label">Loan ratio (LTV)</span>
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
          <span className="field-label">Borrow</span>
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
            <span className="token-symbol">USDT</span>
          </div>
        </div>
      </div>

      <div className="swap-info lend-risk">
        <div className="info-row">
          <span>Liquidation LTV</span>
          <span className="risk-highlight">{LEND_LIQUIDATION_LTV}%</span>
        </div>
        {metrics.liquidationPrice > 0 && (
          <div className="info-row">
            <span>Liquidation price</span>
            <span>{metrics.liquidationPrice.toFixed(6)} USDT / DINO</span>
          </div>
        )}
        <div className="info-row">
          <span>Loan range</span>
          <span>
            {LEND_LTV_MIN}% – {LEND_LTV_MAX}% of collateral (USDT)
          </span>
        </div>
      </div>

      {error && <div className="msg msg-error">{error}</div>}
      {success && <div className="msg msg-success">{success}</div>}

      {!ready ? (
        <button className="btn-swap" disabled type="button">
          Loading...
        </button>
      ) : authenticated ? (
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
          {loading ? '确认中...' : 'Borrow'}
        </button>
      ) : (
        <button className="btn-swap" onClick={login} type="button">
          Connect Wallet
        </button>
      )}
    </>
  );
}
