import { usePrivyReady } from '../hooks/usePrivyReady';
import { useLanguage } from '../i18n/LanguageProvider';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { authenticated, login, logout, user } = usePrivyReady();
  const { t } = useLanguage();
  const address = user?.wallet?.address;
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-mark" aria-hidden="true">
            <img className="logo-icon" src="/logo.png" alt="" />
          </div>
          <div className="logo-copy">
            <span className="logo-text">ONDI</span>
            <span className="logo-sub">SWAP</span>
          </div>
        </div>
        <div className="header-actions">
          <LanguageToggle />
          {authenticated ? (
            <div className="wallet-group">
              <button className="btn-wallet" type="button">
                {shortAddress}
              </button>
              <button
                className="btn-disconnect"
                onClick={logout}
                type="button"
              >
                {t('disconnect')}
              </button>
            </div>
          ) : (
            <button className="btn-connect" onClick={login} type="button">
              {t('connectWallet')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
