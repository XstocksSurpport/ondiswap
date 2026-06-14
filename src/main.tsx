import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { App } from './App';
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from './config/chains';
import { PRIVY_APP_ID } from './config/constants';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#16B4A1',
          logo: `${window.location.origin}/logo.png`,
        },
        loginMethods: ['wallet'],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'off',
          },
          showWalletUIs: false,
        },
        defaultChain: DEFAULT_CHAIN,
        supportedChains: [...SUPPORTED_CHAINS],
      }}
    >
      <App />
    </PrivyProvider>,
);
