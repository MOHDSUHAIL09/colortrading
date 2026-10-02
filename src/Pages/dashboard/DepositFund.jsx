import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Wallet, History, Copy, Share2, Smartphone, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import apiClient from '../../api/apiClient';
import Toast from '../../Componenets/ui/Toast';
import { useUser } from '../../context/UserContext';


const DepositFund = () => {
    const { userData, refreshData } = useUser();

    const [walletAddress, setWalletAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [error, setError] = useState(null);

    const [timeLeft, setTimeLeft] = useState(300);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [autoCheckCount, setAutoCheckCount] = useState(0);
    const [isTimerComplete, setIsTimerComplete] = useState(false);

    const regno = sessionStorage.getItem('Regno');

    // FundDeposit API Call
    const callFundDepositAPI = async () => {
        if (!walletAddress || !regno) return;
        try {
            const payload = { walletAddress, regno: parseInt(regno) };
            await apiClient.post('/DepositReport/FundDeposit', payload);
        } catch (err) {
            console.error('FundDeposit API Error:', err);
        }
    };

    useEffect(() => {
        if (!walletAddress || !regno) return;
        callFundDepositAPI();
        const intervalId = setInterval(() => { callFundDepositAPI(); }, 60000);
        return () => { if (intervalId) clearInterval(intervalId); };
    }, [walletAddress, regno]);

    // Fetch wallet address
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                setLoading(true);
                setError(null);
                if (userData?.NameAppearOncheque) {
                    setWalletAddress(userData.NameAppearOncheque);
                    setLoading(false);
                    return;
                }
                const response = await apiClient.get(`/DepositReport/DepositAddress/${regno}`);
                if (response.data?.result === "true") {
                    const walletId = response.data.response?.walletid;
                    if (walletId && walletId !== 'null') {
                        setWalletAddress(walletId);
                    } else {
                        setError("No wallet address found");
                    }
                } else {
                    setError(response.data?.message || "Failed to fetch address");
                }
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchAddress();
    }, [regno, userData?.NameAppearOncheque]);

    // Timer
    useEffect(() => {
        let timer = null;
        if (isTimerRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    if (newTime % 60 === 0 && newTime < 300 && newTime > 0) {
                        confirmDeposit(false);
                    }
                    if (newTime <= 0) {
                        setIsTimerRunning(false);
                        setIsTimerComplete(true);
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => { if (timer) clearInterval(timer); };
    }, [isTimerRunning, timeLeft]);

    const showSuccessModal = (message) => {
        Swal.fire({
            icon: 'success',
            title: '🎉 Deposit Confirmed!',
            text: message || 'Your deposit has been confirmed successfully!',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK, Got it!',
            backdrop: 'rgba(0,0,0,0.7)',
            zIndex: 9999999,
            width: '450px',
            padding: '2.5rem',
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
    };

    const confirmDeposit = async (isManual = false) => {
        if (!walletAddress || !regno) {
            if (isManual) toast.error("Required data missing");
            return;
        }
        if (isManual) setConfirmLoading(true);
        try {
            if (!isManual) setAutoCheckCount(prev => prev + 1);
            const payload = { walletAddress, regno: parseInt(regno) };
            const response = await apiClient.post('/DepositReport/ConfirmDeposit', payload);
            if (response.data?.result === "true" || response.data?.result === true) {
                showSuccessModal(response.data?.message || 'Deposit confirmed successfully!');
                await refreshData();
                if (isManual) {
                    setTimeLeft(300);
                    setIsTimerRunning(true);
                    setAutoCheckCount(0);
                    setIsTimerComplete(false);
                } else {
                    setIsTimerRunning(false);
                    setTimeLeft(0);
                    setIsTimerComplete(false);
                }
                return;
            }
            if (isManual) {
                if (response.data?.message?.toLowerCase().includes('hash already exists')) {
                    toast.error('This deposit has already been confirmed.');
                } else {
                    toast.error(response.data?.message || "Confirmation failed");
                }
            }
        } catch (err) {
            console.error(`Confirm ERROR:`, err);
            if (isManual) toast.error(err.response?.data?.message || "Server error.");
        } finally {
            if (isManual) setConfirmLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCopy = async () => {
        if (!walletAddress) return;
        try {
            await navigator.clipboard.writeText(walletAddress);
            toast.success("Address Copied!");
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = walletAddress;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success("Address Copied!");
        }
    };

    const handleShare = async () => {
        if (!walletAddress) { toast.error("No address to share"); return; }
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Deposit Wallet',
                    text: `Wallet Address: ${walletAddress}`,
                    url: window.location.href
                });
                toast.success("Shared successfully!");
            } catch (error) {
                if (error.name === 'AbortError') return;
                toast.error("Share failed. Copying address instead...");
                handleCopy();
            }
        } else {
            toast.info("Share not available. Address copied!");
            handleCopy();
        }
    };

    const truncateAddress = (address) => {
        if (!address) return '';
        if (address.length <= 22) return address;
        return `${address.slice(0, 11)}...${address.slice(-11)}`;
    };

    return (
        <>
            <Toast />

            <div className="unique-df-main-wrapper">
                {/* ONE MAIN CARD - Left aligned, plain border */}
                <div className="unique-df-card">

                    {/* ===== HEADER ===== */}
                    <div className="unique-df-top-header">
                        <div className="unique-df-header-left">
                            <div className="unique-df-wallet-bg">
                                <Wallet size={24} color="white" fill="white" />
                            </div>
                            <div className="unique-df-header-texts">
                                <h2>Deposit Fund</h2>
                                <p>Scan the QR code or copy wallet address to deposit funds</p>
                            </div>
                        </div>
                        <Link to="/dashboard/FundDepositStatus" className="unique-df-history-btn">
                            <History size={18} />
                            <span>History</span>
                        </Link>
                    </div>

                    {/* ===== CONTENT BODY ===== */}
                    <div className="unique-df-content-body">

                        {/* QR Section */}
                        <div className="unique-df-qr-section">
                            <div className="unique-df-qr-frame">
                                {loading ? (
                                    <div className="unique-df-spinner"></div>
                                ) : walletAddress ? (
                                    <QRCodeSVG value={walletAddress} size={180} level="H" includeMargin={true} />
                                ) : (
                                    <div className="unique-df-error-msg">{error || "Address Not Found"}</div>
                                )}
                            </div>
                            <div className="unique-df-scan-pay-badge">
                                <Smartphone size={16} />
                                <span>Scan to Pay</span>
                            </div>
                        </div>

                        {/* Address Card */}
                        {walletAddress && (
                            <div className="unique-df-address-info-card">
                                <div className="unique-df-address-input-pill">
                                    <span className="unique-df-label">Wallet address</span>
                                    <span className="unique-df-address-text">{truncateAddress(walletAddress)}</span>
                                    <div className="unique-df-address-actions">
                                        <button
                                            className="unique-df-copy-icon-btn"
                                            onClick={handleShare}
                                            aria-label="Share"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                        <button
                                            className="unique-df-copy-icon-btn"
                                            onClick={handleCopy}
                                            aria-label="Copy"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="unique-df-confirm-container">
                                    {isTimerRunning && timeLeft > 0 && (
                                        <div className="unique-df-progress-bar">
                                            <div
                                                className="unique-df-progress-fill"
                                                style={{
                                                    width: `${((300 - timeLeft) / 300) * 100}%`,
                                                    backgroundColor: timeLeft > 60 ? '#10b981' : '#ef4444'
                                                }}
                                            ></div>
                                        </div>
                                    )}

                                    <button
                                        className={`unique-df-confirm-btn ${confirmLoading ? 'loading' : ''}`}
                                        onClick={isTimerComplete ? () => confirmDeposit(true) : null}
                                        disabled={confirmLoading || (!isTimerComplete && isTimerRunning)}
                                        style={{
                                            cursor: isTimerComplete ? 'pointer' : 'default',
                                            opacity: isTimerComplete ? 1 : 0.8
                                        }}
                                    >
                                        {confirmLoading ? (
                                            <div className="df-mini-spinner"></div>
                                        ) : isTimerComplete ? (
                                            <><CheckCircle size={20} /> Confirm Deposit</>
                                        ) : (
                                            <>
                                                <Clock size={20} />
                                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                    {formatTime(timeLeft)}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bottom Note */}
                        <div className="unique-df-bottom-note">
                            <AlertCircle size={18} />
                            <p>Note: If your wallet balance is not updated immediately, please wait a few minutes and try again.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DepositFund;