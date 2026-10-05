import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { ColorProvider } from './context/ColorContext'  // ✅ Ye import add karo
import App from './App.jsx'

import './App.css'
import './assets/css/Main.css'
import './assets/css/Index.css' 

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { mainnet, polygon, sepolia, bsc } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const config = getDefaultConfig({
  appName: 'Dev Deposit App',
  projectId: '5447aae0bc64a87aa7537cc7228f4a02',
  chains: [bsc, mainnet, polygon, sepolia],
  ssr: false,
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={darkTheme()}>
        <BrowserRouter>
          <UserProvider>
            <ColorProvider>      {/* ✅ Ye add karo */}
              <App />
            </ColorProvider>     {/* ✅ Ye closing tag */}
          </UserProvider>
        </BrowserRouter>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)