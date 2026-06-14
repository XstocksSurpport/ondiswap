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
          <img className="logo-icon" src="/logo.png" alt="ONDI SWAP" />
          <span className="logo-text">ONDI SWAP</span>
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
