import { usePrivy } from '@privy-io/react-auth';

export function Header() {
  const { ready, authenticated, login, logout, user } = usePrivy();
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
          {!ready ? (
            <button className="btn-connect" disabled type="button">
              Loading...
            </button>
          ) : authenticated ? (
            <div className="wallet-group">
              <button className="btn-wallet" type="button">
                {shortAddress}
              </button>
              <button
                className="btn-disconnect"
                onClick={logout}
                type="button"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button className="btn-connect" onClick={login} type="button">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
