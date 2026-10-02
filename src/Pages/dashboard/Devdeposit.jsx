import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wallet, Shield, ChevronDown, ArrowDownToLine
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from 'wagmi';
import { parseUnits } from 'viem';
import { bsc } from 'wagmi/chains';

// ============================================
//  CONFIG — BSC (BNB Smart Chain)
// ============================================
const DEPOSIT_ADDRESS = '0x4489626246c634a5012b768258e9bDb91C69F32C';
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
const USDT_DECIMALS = 18; //BSC USDT = 18 decimals
const BSC_SCAN_URL = 'https://bscscan.com/tx/'; //BSCScan URL
// ============================================

const USDT_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
];

//Address short helper (0xe1...757B format)
const shortenAddress = (addr) => {
  if (!addr) return '';
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
};

const Devdeposit = () => {
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);

  const { address: userAddress, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // ============ NETWORK SWITCH HANDLER ============
  const handleSwitchToBSC = async () => {
    try {
      setIsSwitching(true);
      setTxStatus(' Switching to BSC...');
      await switchChainAsync({ chainId: bsc.id });
      setTxStatus(' Switched to BSC. You can deposit now.');
      setTimeout(() => setTxStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setTxStatus(' Please add BSC network to MetaMask manually');
    } finally {
      setIsSwitching(false);
    }
  };

  // ============ DEPOSIT HANDLER ============
  const handleDeposit = async () => {
    setTxStatus('');

    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setTxStatus(' Please enter a valid amount');
      return;
    }
    if (!userAddress) {
      setTxStatus(' Wallet not connected');
      return;
    }

    // Agar BSC pe nahi hai toh switch karo
    if (chain?.id !== bsc.id) {
      await handleSwitchToBSC();
      return;
    }

    // BSC pe hai → transaction bhejo
    try {
      // 0.11 USDT input → 110000000000000000 wei (auto convert)
      const amountInWei = parseUnits(amount, USDT_DECIMALS);

      writeContract({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'transfer',
        args: [DEPOSIT_ADDRESS, amountInWei],
        chainId: bsc.id,
      });
    } catch (err) {
      console.error(err);
      setTxStatus(' Transaction failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '30px'
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(180deg, rgba(13,27,62,0.95), rgba(10,14,26,0.98))',
          borderRadius: '24px',
          maxWidth: '480px',
          width: '100%',
          padding: '28px',
          border: '1px solid rgba(28,133,234,0.2)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative',
          backdropFilter: 'blur(20px)'
        }}
      >
        <ConnectButton.Custom>
          {({
            account,
            chain: connectedChain,
            openAccountModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              connectedChain &&
              (!authenticationStatus || authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  // ============ NOT CONNECTED ============
                  if (!connected) {
                    return (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                          <div style={{
                            padding: '12px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, rgba(28,133,234,0.2), rgba(79,172,254,0.1))',
                            color: '#4facfe',
                            border: '1px solid rgba(79,172,254,0.2)',
                          }}>
                            <Wallet size={24} />
                          </div>
                          <div>
                            <h3 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: '700' }}>
                              Connect Wallet
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', fontSize: '12px' }}>
                              Connect MetaMask to continue
                            </p>
                          </div>
                        </div>

                        <motion.button
                          onClick={openConnectModal}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '14px',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '16px',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #1c85ea, #4facfe)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                          }}
                        >
                          <Shield size={20} />
                          Connect Wallet
                        </motion.button>
                      </>
                    );
                  }

                  // ============ WRONG NETWORK (AUTO SWITCH) ============
                  if (connectedChain.unsupported || connectedChain.id !== bsc.id) {
                    return (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                          <div style={{
                            padding: '12px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))',
                            color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.2)',
                          }}>
                            <Wallet size={24} />
                          </div>
                          <div>
                            <h3 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: '700' }}>
                              Wrong Network
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', fontSize: '12px' }}>
                              Currently on: {connectedChain.name}
                            </p>
                          </div>
                        </div>

                        <motion.button
                          onClick={handleSwitchToBSC}
                          disabled={isSwitching}
                          whileHover={{ scale: isSwitching ? 1 : 1.02 }}
                          whileTap={{ scale: isSwitching ? 1 : 0.98 }}
                          style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '14px',
                            border: '1px solid rgba(239,68,68,0.3)',
                            fontWeight: '700',
                            fontSize: '16px',
                            cursor: isSwitching ? 'not-allowed' : 'pointer',
                            background: isSwitching
                              ? 'rgba(239,68,68,0.05)'
                              : 'rgba(239,68,68,0.1)',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            opacity: isSwitching ? 0.6 : 1
                          }}
                        >
                          {isSwitching
                            ? ' Switching...'
                            : '⚠️ Click to Switch to BSC'}
                        </motion.button>

                        {txStatus && (
                          <div style={{
                            marginTop: '12px',
                            padding: '10px',
                            borderRadius: '10px',
                            background: txStatus.includes('')
                              ? 'rgba(239,68,68,0.1)'
                              : 'rgba(28,133,234,0.1)',
                            color: txStatus.includes('') ? '#ef4444' : '#4facfe',
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: '600'
                          }}>
                            {txStatus}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ============ CONNECTED (BSC) ============
                  return (
                    <div>
                      {/* Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        marginBottom: '28px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            padding: '12px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, rgba(28,133,234,0.2), rgba(79,172,254,0.1))',
                            color: '#4facfe',
                            border: '1px solid rgba(79,172,254,0.2)',
                          }}>
                            <Wallet size={24} />
                          </div>
                          <div>
                            <h3 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: '700' }}>
                              Deposit
                            </h3> 
                            <p style={{ color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', fontSize: '12px' }}>
                              BSC Network • MetaMask
                            </p>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '10px',
                          color: '#4ade80',
                          background: 'rgba(74,222,128,0.1)',
                          padding: '5px 10px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          border: '1px solid rgba(74,222,128,0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#4ade80',
                            boxShadow: '0 0 8px #4ade80'
                          }} />
                          BSC
                        </span>
                      </div>

                      {/* Wallet Info */}
                      <motion.button
                        onClick={openAccountModal}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                          width: '100%',
                          background: 'rgba(28,133,234,0.08)',
                          borderRadius: '16px',
                          padding: '16px',
                          border: '1px solid rgba(79,172,254,0.15)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          marginBottom: '10px',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #1c85ea, #4facfe)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {account.ensAvatar ? (
                            <img
                              src={account.ensAvatar}
                              alt="avatar"
                              style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                            />
                          ) : (
                            <Wallet size={22} color="#fff" />
                          )}
                        </div>

                        {/*0xe1...757B format */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: '700',
                            fontFamily: 'monospace',
                            letterSpacing: '0.5px'
                          }}>
                            {userAddress ? shortenAddress(userAddress) : account.displayName}
                          </div>
                          <div style={{
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: '12px',
                            marginTop: '4px',
                            fontFamily: 'monospace'
                          }}>
                            {account.displayBalance || 'Loading...'}
                          </div>
                        </div>

                        <ChevronDown size={18} color="rgba(255,255,255,0.3)" />
                      </motion.button>
                      {/* Deposit Form */}
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        padding: '18px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        marginBottom: '16px'
                      }}>
                        <label style={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          display: 'block',
                        }}>
                          Enter USDT Amount
                        </label>

                        {/* Decimal input */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '12px',
                          border: '1px solid rgba(79,172,254,0.15)',
                          padding: '4px 4px 4px 14px',
                          marginBottom: '12px'
                        }}>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                setAmount(val);
                              }
                            }}
                            style={{
                              flex: 1,
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              color: '#fff',
                              fontSize: '18px',
                              fontWeight: '700',
                              padding: '12px 0',
                              fontFamily: 'monospace'
                            }}
                          />
                          <span style={{
                            padding: '10px 14px',
                            background: 'rgba(38,161,123,0.2)',
                            border: '1px solid rgba(38,161,123,0.3)',
                            borderRadius: '10px',
                            color: '#26a17b',
                            fontSize: '13px',
                            fontWeight: '700',
                          }}>
                            USDT
                          </span>
                        </div>

                        {/* Quick amounts */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                          {['10', '50', '100', '1000'].map((val) => (
                            <button
                              key={val}
                              onClick={() => setAmount(val)}
                              style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: amount === val ? 'rgba(28,133,234,0.2)' : 'rgba(255,255,255,0.03)',
                                color: amount === val ? '#4facfe' : 'rgba(255,255,255,0.6)',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              {val}
                            </button>
                          ))}
                        </div>

                        <motion.button
                          onClick={handleDeposit}
                          disabled={isPending || isConfirming}
                          whileHover={{ scale: isPending || isConfirming ? 1 : 1.02 }}
                          whileTap={{ scale: isPending || isConfirming ? 1 : 0.98 }}
                          style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '14px',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '15px',
                            cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                            background: isPending || isConfirming
                              ? 'rgba(28,133,234,0.3)'
                              : 'linear-gradient(135deg, #1c85ea, #4facfe)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            opacity: isPending || isConfirming ? 0.7 : 1
                          }}
                        >
                          {/* <ArrowDownToLine size={18} /> */}
                          {isPending
                            ? 'Conform...'
                            : isConfirming
                            ? 'Confirming...'
                            : 'Deposit '}
                        </motion.button>

                        {txStatus && (
                          <div style={{
                            marginTop: '12px',
                            padding: '10px',
                            borderRadius: '10px',
                            background: txStatus.includes('')
                              ? 'rgba(239,68,68,0.1)'
                              : 'rgba(28,133,234,0.1)',
                            color: txStatus.includes('') ? '#ef4444' : '#4facfe',
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: '600'
                          }}>
                            {txStatus}
                          </div>
                        )}

                        {/*Confirming with BSCScan link */}
                        {isConfirming && hash && (
                          <div style={{
                            marginTop: '12px',
                            padding: '10px',
                            borderRadius: '10px',
                            background: 'rgba(28,133,234,0.1)',
                            color: '#4facfe',
                            fontSize: '11px',
                            textAlign: 'center',
                            fontWeight: '600'
                          }}>
                             Confirming on-chain...
                            <a
                              href={`${BSC_SCAN_URL}${hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'block',
                                marginTop: '4px',
                                color: '#4facfe',
                                textDecoration: 'underline',
                                fontFamily: 'monospace',
                                wordBreak: 'break-all'
                              }}
                            >
                              View on BSCScan
                            </a>
                          </div>
                        )}

                        {/*Success with BSCScan link */}
                        {isConfirmed && (
                          <div style={{
                            marginTop: '12px',
                            padding: '10px',
                            borderRadius: '10px',
                            background: 'rgba(74,222,128,0.1)',
                            border: '1px solid rgba(74,222,128,0.2)',
                            color: '#4ade80',
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: '600'
                          }}>
                           Deposit successful!

                            {hash && (
                              <motion.a
                                href={`${BSC_SCAN_URL}${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  marginTop: '10px',
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  background: 'linear-gradient(135deg, rgba(28,133,234,0.2), rgba(79,172,254,0.1))',
                                  border: '1px solid rgba(79,172,254,0.3)',
                                  color: '#4facfe',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  textDecoration: 'none',
                                  cursor: 'pointer',
                                  letterSpacing: '0.3px',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                🔗 View Transaction
                              </motion.a>
                            )}
                          </div>
                        )}

                        {writeError && (
                          <div style={{
                            marginTop: '12px',
                            padding: '10px',
                            borderRadius: '10px',
                            background: 'rgba(239,68,68,0.1)',
                            color: '#ef4444',
                            fontSize: '11px',
                            textAlign: 'center',
                            wordBreak: 'break-word'
                          }}>
                            {writeError.message?.includes('User rejected')
                              ? ' Transaction cancelled.'
                              : writeError.shortMessage || 'Transaction failed'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </motion.div>
    </div>
  );
};

export default Devdeposit;