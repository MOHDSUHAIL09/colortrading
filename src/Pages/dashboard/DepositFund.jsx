import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Wallet, History, Copy, Share2, Smartphone, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import apiClient from '../../api/apiClient';


const DepositFund = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [error, setError] = useState(null);

    const regno = localStorage.getItem('Regno');

    // 1. Fetch Wallet Address logic (GET API)
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                setLoading(true);
                setError(null);

                // Pehle LocalStorage check karein
                const userData = localStorage.getItem('userData');
                if (userData) {
                    try {
                        const parsed = JSON.parse(userData);
                        const userAddress = parsed?.NameAppearOnCheque;
                        if (userAddress && userAddress !== 'null' && userAddress !== '') {
                            setWalletAddress(userAddress);
                            setLoading(false);
                            return;
                        }
                    } catch (e) { console.warn(e); }
                }

                if (!regno) {
                    setError("Registration number not found");
                    setLoading(false);
                    return;
                }

                // API se address layein
                const response = await apiClient.get(`/DepositReport/DepositAddress/${regno}`);
                if (response.data?.result === "true") {
                    const walletId = response.data.response?.walletid;
                    if (walletId && walletId !== 'null') {
                        setWalletAddress(walletId);
                    } else { setError("No wallet address found"); }
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
    }, [regno]);

    // 2. Confirm Deposit logic (POST API)
    const handleConfirmDeposit = async () => {
        if (!walletAddress || !regno) {
            toast.error("Required data missing");
            return;
        }

        setConfirmLoading(true);
        try {
            const response = await apiClient.post('/DepositReport/ConfirmDeposit', {
                walletAddress: walletAddress,
                regno: parseInt(regno) 
            });

            if (response.data.result === "true") {
                toast.success(response.data.message || "Deposit confirmed successfully!");
            } else {
                toast.error(response.data.message || "Confirmation failed");
            }
        } catch (err) {
            console.error("Confirm error:", err);
            toast.error("Server error. Please try again.");
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!walletAddress) return;
        try {
            await navigator.clipboard.writeText(walletAddress);
            setCopySuccess('Copied!');
            toast.success("Address Copied!");
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = walletAddress;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success("Address Copied!");
        }
    };

    const handleShare = async () => {
        if (!walletAddress) return;
        const shareData = {
            title: 'Deposit Wallet',
            text: `Wallet Address: ${walletAddress}`,
            url: window.location.href
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (e) { console.log(e); }
        } else { handleCopy(); }
    };

    const truncateAddress = (address) => {
        if (!address) return '';
        if (address.length <= 22) return address;
        return `${address.slice(0, 11)}...${address.slice(-11)}`;
    };

    return (
        <div className="unique-df-main-wrapper">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="unique-df-card-container">
                
                {/* Image style Blue Header */}
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
                    <Link to="/dashboard/DepositHistory" className="btn btn-primary gap-1">
                        <History size={18} />
                        <span>History</span>
                    </Link>
                </div>

                <div className="unique-df-content-body">
                    {/* QR Code Section */}
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

                    {/* Address Detail Card (Same as Image) */}
                    {walletAddress && (
                        <div className="unique-df-address-info-card">

                            <div className="unique-df-address-input-pill">
                                <span className="unique-df-label">Wallet Address</span>
                                <div className="unique-df-divider"></div>
                                <span className="unique-df-address-text">{truncateAddress(walletAddress)}</span>
                                  
                                <button className="unique-df-copy-icon-btn" onClick={handleShare}>
                                    <Share2 size={18} />
                                </button>
                                <button className="unique-df-copy-icon-btn ms-2" onClick={handleCopy}>
                                    <Copy size={18} />
                                </button>

                            </div>

                            {/* Share & Copy Buttons */}
                            {/* <div className="unique-df-action-row">
                                <button className="unique-df-btn-share" onClick={handleShare}>
                                    <Share2 size={18} />
                                    <span>Share</span>
                                </button>
                                <button className="unique-df-btn-copy" onClick={handleCopy}>
                                    <Copy size={18} />
                                    <span>{copySuccess || 'Copy'}</span>
                                </button>
                            </div> */}

                            {/* Confirm Deposit Main Button */}
                            <div className="unique-df-confirm-container">
                                <button 
                                    className={`btn btn-primary unique-df-confirm-btn ${confirmLoading ? 'loading' : ''}`}
                                    onClick={handleConfirmDeposit}
                                    disabled={confirmLoading}
                                >
                                    {confirmLoading ? (
                                        <div className="df-mini-spinner"></div>
                                    ) : (
                                        <><CheckCircle size={20} /> Confirm Deposit</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer Warning Note */}
                    <div className="unique-df-bottom-note">
                        <AlertCircle size={18} />
                        <p>Note: If your wallet balance is not updated immediately, please wait a few minutes and try again.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepositFund;