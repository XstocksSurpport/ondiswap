import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { App } from './App';
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from './config/chains';
import { PRIVY_APP_ID } from './config/constants';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#FFB237',
          logo: '/logo.png',
        },
        loginMethods: ['wallet'],
        embeddedWallets: {
          createOnLogin: 'off',
        },
        defaultChain: DEFAULT_CHAIN,
        supportedChains: [...SUPPORTED_CHAINS],
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
);
