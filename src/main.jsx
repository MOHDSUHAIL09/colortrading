import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import App from './App.jsx'

import './App.css'
import './assets/Main.css'
import './assets/Index.css'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { mainnet, polygon, sepolia, bsc } from 'wagmi/chains'  // 👈 bsc add kiya
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const config = getDefaultConfig({
  appName: 'Dev Deposit App',
  projectId: '5447aae0bc64a87aa7537cc7228f4a02',
  chains: [bsc, mainnet, polygon, sepolia],  // 👈 bsc FIRST me rakha
  ssr: false,
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={darkTheme()}>
        <BrowserRouter>
          <UserProvider>
            <App />
          </UserProvider>
        </BrowserRouter>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)