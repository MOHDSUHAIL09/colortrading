import { useEffect, useState } from 'react';
import { FaCreditCard } from "react-icons/fa6";

import { GiProfit } from "react-icons/gi";
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import apexcoin from "../../assets/images/coins/apexcoin.png"
import Swal from 'sweetalert2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';
import Marquee from './Marquee';
import Toast from '../../Componenets/ui/Toast';

// Swiper imports — ye add karo
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cube';
import { EffectCube, Pagination, Autoplay } from 'swiper/modules';

import wingoimg from '../../assets/images/logo/wingogame.png'
import botimg from '../../assets/images/logo/botimg.png'


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Filler
);



const GameSlider = () => {
    const images = [wingoimg, wingoimg, wingoimg, wingoimg, wingoimg];

    return (
        <Swiper
            effect={'cube'}
            grabCursor={true}
            loop={true}
            loopedSlides={5}
            loopAdditionalSlides={2}
            speed={2000}
            cubeEffect={{
                shadow: false,
                slideShadows: false,
            }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
            }}
            modules={[EffectCube, Autoplay]}
            style={{
                width: '100%',
                borderRadius: '0.5rem',
            }}
        >
{images.map((img, index) => (
  <SwiperSlide
    key={index}
    style={{ height: '100%', overflow: 'hidden' }}
  >
    <Link to="/dashboard/game" className="game-banner-link">
      <img
        src={img}
        alt={`game-${index + 1}`}
        className="game-banner-img"
      />
    </Link>
  </SwiperSlide>
))}
        </Swiper>
    );
};


const Dashboard = () => {
    const navigate = useNavigate();


    const { userData, refreshData } = useUser();
    //  Add this state at the top with other states
    const [hoveredIncome, setHoveredIncome] = useState(null);





    // Withdraw Modal States -  FIXED
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [payoutAmount, setPayoutAmount] = useState('');
    const [minimumWithdraw] = useState(10);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [apiBotStatus, setApiBotStatus] = useState();
    const [countdown, setCountdown] = useState("");
    const displayBalance = userData?.WorkingWallet || 0;
    const NameAppearOnCheque = userData?.NameAppearOncheque;
    // Add these states with other states
    const [showSelfPayoutModal, setShowSelfPayoutModal] = useState(false);
    const [selfPayoutAmount, setSelfPayoutAmount] = useState('');
    const [selfPayoutLoading, setSelfPayoutLoading] = useState(false);



    // Add these states at the top with other states
    const [showTokenPayoutModal, setShowTokenPayoutModal] = useState(false);
    const [tokenPayoutAmount, setTokenPayoutAmount] = useState('');
    const [tokenPayoutLoading, setTokenPayoutLoading] = useState(false);


    const loginId = sessionStorage.getItem("loginId");
    const regno = sessionStorage.getItem('Regno');

    // ============ SIRF RIGHT SIDE UPDATE - CHART STABLE ============
    const [price, setPrice] = useState(2.00);
    const [chartData, setChartData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [priceChange, setPriceChange] = useState(0);
    const [previousPrice, setPreviousPrice] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [baseApiPrice, setBaseApiPrice] = useState(0);
    const [isBotStarting, setIsBotStarting] = useState(false);


    //  Initialize chart with initial data
    useEffect(() => {
        const initialData = [8, 18, 12, 28, 20, 34, 26];
        const initialLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setChartData(initialData);
        setLabels(initialLabels);
        setIsInitialized(true);

        // ✅ First API call - Real price fetch
        fetchLivePrice();
    }, []);



    // ✅ Generate random price between min (apiPrice - 20%) and max (apiPrice)
    const generateRandomPriceFromApi = (apiPrice) => {
        // 20% minus karo
        const minPrice = apiPrice - 0.5; // 20% kam
        const maxPrice = apiPrice; // API price (max)

        // Random price generate karo between min and max
        const randomValue = (Math.random() * (maxPrice - minPrice) + minPrice);
        return parseFloat(randomValue.toFixed(4));
    };

    // ✅ Generate chart data point
    const generateNewDataPoint = (currentPrice) => {
        const min = 5;
        const max = 40;
        const baseValue = currentPrice * 8;
        const variation = (Math.random() - 0.5) * 8;
        return Math.round(Math.max(5, Math.min(45, baseValue + variation)));
    };


    // ✅ Fetch real price from API
    const fetchLivePrice = async () => {
        try {
            const response = await apiClient.get('/Token/token-live-price');

            if (response.data?.result === "true" && response.data?.data?.length > 0) {
                const livePrice = parseFloat(response.data.data[0].tokenLivePrice);
                if (!isNaN(livePrice) && livePrice > 0) {
                    // ✅ API se real price mil gayi
                    setBaseApiPrice(livePrice);

                    // ✅ API price ke 80% se 100% ke beech random price generate karo
                    const randomPrice = generateRandomPriceFromApi(livePrice);
                    updatePrice(randomPrice);
                    return randomPrice;
                }
            }
            // ✅ Agar API fail ho toh default 2.00 - 2.50 ke beech random
            const fallbackPrice = generateRandomPriceFallback();
            updatePrice(fallbackPrice);
            return fallbackPrice;
        } catch (error) {
            console.error('Error fetching live price:', error);
            // ✅ Error pe fallback random
            const fallbackPrice = generateRandomPriceFallback();
            updatePrice(fallbackPrice);
            return fallbackPrice;
        }
    };

    // ✅ Fallback random price (2.00 - 2.50)
    const generateRandomPriceFallback = () => {
        const min = 2.00;
        const max = 2.50;
        const randomValue = (Math.random() * (max - min) + min);
        return parseFloat(randomValue.toFixed(4));
    };

    // ✅ Update price and chart
    const updatePrice = (newPrice) => {
        // Price change calculate
        const change = ((newPrice - previousPrice) / previousPrice * 100);
        setPriceChange(change);
        setPreviousPrice(newPrice);
        setPrice(newPrice);

        // Chart update
        setChartData(prevData => {
            const newData = [...prevData];
            newData.push(generateNewDataPoint(newPrice));
            if (newData.length > 20) {
                newData.shift();
            }
            return newData;
        });

        setLabels(prevLabels => {
            const newLabels = [...prevLabels];
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            newLabels.push(timeStr);
            if (newLabels.length > 20) {
                newLabels.shift();
            }
            return newLabels;
        });
    };

    // ✅ Initialize chart with initial data
    useEffect(() => {
        const initialData = [8, 18, 12, 28, 20, 34, 26];
        const initialLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setChartData(initialData);
        setLabels(initialLabels);
        setIsInitialized(true);

        // ✅ First call - API se fetch
        fetchLivePrice();
    }, []);



    const handleDashboardStartBot = async () => {
        if (apiBotStatus === 0) {
            toast.warning('Bot is already running!');
            return;
        }

        const investAmount = parseFloat(userData?.Invest) || 0;
        if (investAmount <= 0) {
            toast.error(' Please invest first to start bot!');
            return;
        }

        // ✅ RANDOM CURRENCY
        const currencies = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'];
        const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
        const defaultSlot = 24;

        // ✅ DIRECT MAPPING - Bina getCryptoConfig ke
        const binanceSymbols = {
            'BTC': 'BTCUSDT',
            'ETH': 'ETHUSDT',
            'BNB': 'BNBUSDT',
            'SOL': 'SOLUSDT',
            'XRP': 'XRPUSDT'
        };

        const binanceSymbol = binanceSymbols[randomCurrency];

        // ✅ FETCH PRICE
        let currencyRate = 0;
        try {
            const response = await fetch(
                `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
            );
            if (response.ok) {
                const data = await response.json();
                currencyRate = parseFloat(data.price);
            } else {
                currencyRate = 50000;
            }
        } catch (error) {
            currencyRate = 50000;
        }

        // ✅ PAYLOAD
        const payload = {
            regno: parseInt(regno),
            betAmount: investAmount,
            currency: randomCurrency.toLowerCase(),
            currencyRate: parseFloat(currencyRate.toFixed(4)),
            slot: defaultSlot
        };

        setIsBotStarting(true);
        try {
            const response = await apiClient.post('/Trading/BotTrading', payload);

            if (response.data?.result === "true") {
                toast.success(`Bot started successfully with ${randomCurrency}!`);
                await refreshData();
                await fetchBotStatus();
                setApiBotStatus(0);
            } else {
                toast.error(response.data?.message || ' Failed to start bot');
            }
        } catch (error) {
            console.error(' Error:', error);
            if (error.response) {
                toast.error(error.response.data?.message || ' Failed to start bot');
            } else {
                toast.error(' Network error. Please try again.');
            }
        } finally {
            setIsBotStarting(false);
        }
    };

    // ✅ Auto update every 5 seconds
    useEffect(() => {
        if (!isInitialized) return;

        const interval = setInterval(() => {
            fetchLivePrice();
        }, 5000);

        return () => clearInterval(interval);
    }, [price, previousPrice, isInitialized]);

    //  Token Payout - Complete Function with API Call
    const handleTokenPayoutSubmit = async () => {
        const amountNum = parseFloat(tokenPayoutAmount);

        //  Validations
        if (!tokenPayoutAmount || isNaN(amountNum) || amountNum <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount!',
                text: 'Please enter a valid token amount.',
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (amountNum < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Minimum Withdrawal 10 Tokens!',
                text: `You entered ${tokenPayoutAmount} tokens. Minimum withdrawal is 10 tokens.`,
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK, Got it!',
            });
            return;
        }

        const availableTokens = Number(userData?.TotalEarnTokenInWallet) || 0;
        if (amountNum > availableTokens) {
            Swal.fire({
                icon: 'error',
                title: ' Insufficient Tokens!',
                text: `Available tokens: ${availableTokens}. You entered ${amountNum}.`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
            return;
        }

        //  OTP Verified Check
        if (!otpVerified) {
            Swal.fire({
                icon: 'info',
                title: 'OTP Required!',
                text: 'Please verify OTP first before proceeding.',
                confirmButtonColor: '#667eea',
                confirmButtonText: 'Verify OTP',
            });
            return;
        }

        setTokenPayoutLoading(true);

        try {
            const payload = {
                regno: parseInt(regno),
                amount: amountNum,
                payMode: "usdt"
            };
            //  API CALL - POST /Token/TokenPayoutRequest
            const response = await apiClient.post('/Token/TokenPayoutRequest', payload);
            //  Check response - result can be boolean or string
            if (response.data?.result === true || response.data?.result === "true") {
                Swal.fire({
                    icon: 'success',
                    title: ' Withdrawal Successful!',
                    text: response.data?.message || 'Token withdrawal request submitted successfully!',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                });
                //  Close modal and reset
                setShowTokenPayoutModal(false);
                setTokenPayoutAmount('');
                setOtp('');
                setOtpVerified(false);
                setOtpSent(false);
                await refreshData();

            } else {
                //  FAILURE
                const errorMsg = response.data?.message || 'Withdrawal failed';
                Swal.fire({
                    icon: 'error',
                    title: ' Withdrawal Failed!',
                    text: errorMsg,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error(' Token Payout Error:', error);
            console.error(' Error Response:', error.response);

            let errorMsg = 'Server error. Please try again.';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.response?.data?.response) {
                errorMsg = error.response.data.response;
            } else if (error.message) {
                errorMsg = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Server Error!',
                text: errorMsg,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Try Again',
            });
        } finally {
            setTokenPayoutLoading(false);
        }
    };
    //  Open Token Payout Modal (Validation Only)
    const handleTokenPayout = () => {
        const amountNum = parseFloat(tokenPayoutAmount);

        if (!tokenPayoutAmount || isNaN(amountNum) || amountNum <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount!',
                text: 'Please enter a valid token amount.',
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (amountNum < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Minimum Withdrawal 10 Tokens!',
                text: `You entered ${tokenPayoutAmount} tokens. Minimum withdrawal is 10 tokens.`,
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK, Got it!',
            });
            return;
        }

        const availableTokens = Number(userData?.TotalEarnTokenInWallet) || 0;
        if (amountNum > availableTokens) {
            Swal.fire({
                icon: 'error',
                title: ' Insufficient Tokens!',
                text: `Available tokens: ${availableTokens}. You entered ${amountNum}.`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
            return;
        }

        //  All validations passed - open modal
        setShowTokenPayoutModal(true);
    };

    // BOT start in Dashboard direct
    const fetchBotStatus = async () => {
        try {
            setLoading(true);
            const regno = sessionStorage.getItem('Regno');


            const response = await apiClient.get(`/Trading/BotStatus?regno=${regno}`);


            if (response.data?.result === "true") {
                const status = response.data?.response?.status;
                await refreshData();
                setApiBotStatus(status);
                return status;
            }
            setApiBotStatus(1);
            return 1;
        } catch (error) {
            console.error(" Error fetching bot status:", error);
            setApiBotStatus(1);
            return 1;
        } finally {
            setLoading(false);
        }
    };

    //  2. FETCH STATUS ON MOUNT
    useEffect(() => {
        fetchBotStatus();
    }, []);

    //  3. COUNTDOWN TIMER - Only when status = 0 (Running)

    useEffect(() => {
        const targetTime = new Date(
            userData.status.replace(" ", "T") + "+04:00"
        ).getTime();

        const timer = setInterval(() => {
            const diff = targetTime - Date.now();

            if (diff <= 0) {
                setCountdown("00H : 00M : 00S");
                clearInterval(timer);
                //  Auto refresh status when timer expires
                fetchBotStatus();
                return;
            }

            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            setCountdown(
                `${String(hours).padStart(2, "0")}H : ${String(minutes).padStart(2, "0")}M : ${String(seconds).padStart(2, "0")}S`
            );
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [userData?.status, apiBotStatus]);


    // Send OTP - SIRF API KA MESSAGE
    const handleSendOTP = async () => {
        try {
            setLoading(true);
            setOtpVerified(false);

            const url = `/Auth/genrate-otp?loginid=${loginId}&regno=${regno}`;
            const response = await apiClient.post(url);
            // SIRF API KA MESSAGE DIKHAO
            if (response.data.result === "true") {
                toast.success(response.data.message);
                setOtpSent(true);
            } else {
                toast.error(response.data.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Verify OTP - SIRF API KA MESSAGE
    const handleVerifyOTP = async () => {
        try {
            setLoading(true);

            const response = await apiClient.post('/Auth/verify-otp', null, {
                params: {
                    loginid: loginId,
                    regno: regno,
                    otp: otp
                }
            });
            // CHECK KARO - result string hai ya boolean
            const isSuccess = response.data?.result === "true" || response.data?.result === true;

            if (isSuccess) {
                // SUCCESS - API ka exact message
                const successMsg = response.data?.message || 'OTP verified successfully!';
                toast.success(successMsg);
                setOtpVerified(true);
                setOtpSent(true);
            } else {
                //  FAILURE - API ka exact message
                const errorMsg = response.data?.message || 'Invalid OTP. Please try again.';
                toast.error(errorMsg);
                setOtp('');
            }
        } catch (error) {
            console.error(" API Error:", error);
            console.error(" Error Response:", error.response);

            // Error response se message nikaalo
            let errorMsg = 'Network error. Please try again.';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.response?.data?.Message) {
                errorMsg = error.response.data.Message;
            }
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Self Trading Payout Function - FIXED
    const handleSelfTradingPayout = async () => {
        const amountNum = parseFloat(selfPayoutAmount);

        if (!selfPayoutAmount || isNaN(amountNum) || amountNum <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (amountNum < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Minimum Withdrawal $10!',
                text: `You entered $${selfPayoutAmount || 0}. Minimum withdrawal amount is $10.`,
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK, Got it!',
                backdrop: 'rgba(0,0,0,0.4)',
            });
            return;
        }

        if (amountNum > displayBalance) {
            Swal.fire({
                icon: 'error',
                title: 'Insufficient Balance!',
                text: `Available balance is $${displayBalance.toFixed(2)}. Please enter a valid amount.`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
                backdrop: 'rgba(0,0,0,0.4)',
            });
            return;
        }

        // ✅ USE MAIN otpVerified
        if (!otpVerified) {
            Swal.fire({
                icon: 'info',
                title: 'OTP Required!',
                text: 'Please verify OTP first before proceeding with payout.',
                confirmButtonColor: '#667eea',
                confirmButtonText: 'Verify OTP',
                backdrop: 'rgba(0,0,0,0.4)',
            });
            return;
        }

        setSelfPayoutLoading(true);
        try {
            const response = await apiClient.post('/Trading/TradingPayout', {
                regno: parseInt(regno),
                amount: amountNum
            });

            if (response.data?.result === 'true') {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Payout Successful!',
                    text: response.data?.message || 'Payout request submitted successfully!',
                    timer: 3000,
                    showConfirmButton: true,
                    confirmButtonColor: '#28a745',
                    backdrop: 'rgba(0,0,0,0.4)',
                });
                resetSelfPayoutModal();
                await refreshData();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Payout Failed!',
                    text: response.data?.message || 'Payout failed. Please try again.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Try Again',
                    backdrop: 'rgba(0,0,0,0.4)',
                });
            }
        } catch (error) {
            console.error('Payout error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Server error. Please try again.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
                backdrop: 'rgba(0,0,0,0.4)',
            });
        } finally {
            setSelfPayoutLoading(false);
        }
    };

    // ✅ Self Trading Payout - Reset Modal (Clean)
    const resetSelfPayoutModal = () => {
        setSelfPayoutAmount('');
        setSelfPayoutLoading(false);
        setShowSelfPayoutModal(false);
    };




    // Dashboard.js
    const goToStatement = (type) => {
        const encodedType = encodeURIComponent(type);
        navigate(`/dashboard/IncomeReport?type=${encodedType}`);
    };

    const goToHistory = (type) => {
        const encodedType = encodeURIComponent(type);
        navigate(`/dashboard/TokenMiningIncomeHistory?type=${encodedType}`);
    };



    // ✅ Income Payout
    const handleWithdraw = async () => {
        const amountNum = parseFloat(withdrawAmount);

        // Validations
        if (!withdrawAmount || isNaN(amountNum) || amountNum <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        if (amountNum < minimumWithdraw) {
            Swal.fire({
                icon: 'warning',
                title: 'Minimum Withdrawal $10!',
                text: `You entered $${withdrawAmount}. Minimum withdrawal amount is $10.`,
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK, Got it!',
                backdrop: 'rgba(0,0,0,0.6)',
                zIndex: 9999999,
            });
            return;
        }
        if (amountNum > displayBalance) {
            Swal.fire({
                icon: 'error',
                title: 'Insufficient Balance!',
                text: `Available balance is $${displayBalance.toFixed(2)}. Please enter a valid amount.`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
                backdrop: 'rgba(0,0,0,0.6)',
                zIndex: 9999999,
            });
            return;
        }

        setWithdrawLoading(true);
        try {
            const payload = {
                regNo: parseInt(regno),
                amount: amountNum,
                payMode: "usdt"
            };

            const response = await apiClient.post('/IncomePayout/WithdrawRequest', payload);

            if (response.data?.result === "true") {
                // ✅ SUCCESS - SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: '✅ Withdrawal Successful!',
                    text: response.data?.message || 'Withdrawal request submitted successfully!',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    backdrop: 'rgba(0,0,0,0.6)',
                    zIndex: 9999999,
                });

                // ✅ Close modal and reset
                setShowWithdrawModal(false);
                setWithdrawAmount('');
                setOtp('');
                setOtpSent(false);
                setOtpVerified(false);
                await refreshData();

            } else {
                // FAILURE - API ka exact message
                const errorMsg = response.data?.message || 'Withdrawal failed';
                Swal.fire({
                    icon: 'error',
                    title: 'Withdrawal Failed!',
                    text: errorMsg,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK',
                    backdrop: 'rgba(0,0,0,0.6)',
                    zIndex: 9999999,
                });
            }
        } catch (error) {
            console.error('Withdrawal error:', error);

            let errorMsg = 'Server error. Please try again.';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMsg = error.response.data.error;
            } else if (error.message) {
                errorMsg = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Server Error!',
                text: errorMsg,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Try Again',
                backdrop: 'rgba(0,0,0,0.6)',
                zIndex: 9999999,
            });
        } finally {
            setWithdrawLoading(false);
        }
    };


    // Self Trading Payout - Fixed
    const handleSelfPayoutButtonClick = () => {
        const amountNum = parseFloat(selfPayoutAmount);

        //  Check if amount is valid
        if (!selfPayoutAmount || isNaN(amountNum) || amountNum <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount!',
                text: 'Please enter a valid amount.',
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK',
            });
            return;
        }

        //  Check minimum amount
        if (amountNum < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Minimum Withdrawal $10!',
                text: `You entered $${selfPayoutAmount}. Minimum withdrawal amount is $10.`,
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK, Got it!',
            });
            return;
        }

        //  Check balance
        const availableBalance = Number(userData?.SelfTrade) || 0;
        if (amountNum > availableBalance) {
            Swal.fire({
                icon: 'error',
                title: ' Insufficient Balance!',
                text: `Available balance is $${availableBalance.toFixed(2)}. You entered $${amountNum.toFixed(2)}.`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
            return;
        }

        //  Sab sahi hai to modal open karo
        setShowSelfPayoutModal(true);
    };


    const handlePayoutClick = () => {
        const amountNum = parseFloat(payoutAmount);

        //  Check if amount is valid
        if (!payoutAmount || isNaN(amountNum) || amountNum <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount!',
                text: 'Please enter a valid amount.',
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK',
            });
            return;
        }

        //  Check minimum amount
        if (amountNum < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Minimum Withdrawal $10!',
                text: `You entered $${payoutAmount}. Minimum withdrawal amount is $10.`,
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK, Got it!',
            });
            return;
        }

        //  Check balance
        const availableBalance = Number(userData?.WorkingWallet) || 0;
        if (amountNum > availableBalance) {
            Swal.fire({
                icon: 'error',
                title: ' Insufficient Balance!',
                text: `Available balance is $${availableBalance.toFixed(2)}. You entered $${amountNum.toFixed(2)}.`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
            return;
        }

        //  Sab sahi hai to modal open karo
        setWithdrawAmount(payoutAmount);
        setShowWithdrawModal(true);
    };
    const resetWithdrawModal = () => {
        setWithdrawAmount("");
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
        setLoading(false);
        setWithdrawLoading(false);
        setShowTokenPayoutModal(false);
    };


    return (
        <>
            <Toast />
            <div className="container-fluid">
                <div
                    className="card01 mb-2"
                    style={{
                        borderRadius: "8px",
                        overflow: "hidden",
                    }}
                >
                    <Marquee />
                </div>

                {/* whatsapp contact */}
                {/* <div className="whatsapp-float">
           
                    <div className="bubble-ring ring-1"></div>
                    <div className="bubble-ring ring-2"></div>
                    <div className="bubble-ring ring-3"></div>
                    <a
                        href="https://wa.me/447400402001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-btn"
                        aria-label="Chat on WhatsApp"
                    >
                        <FaWhatsapp />
                    </a>
                </div> */}
                {/* top section */}
                <div className="row mt-4 ">
                    {/* ===== WELCOME CARD ===== */}

                    <div className="col-12 col-lg-8 d-flex align-items-stretch ">
                        <div className=" w-100 welcome-card overflow-hidden glow-card aa ">
                            <div className="card-body02 position-relative">
                                <div className="row">
                                    <div className="col-12 col-sm-7">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle overflow-hidden me-6 flex-shrink-0 profile-img-circle">
                                                    <img
                                                        src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg"
                                                        alt="profile"
                                                        width="40"
                                                        height="40"
                                                    />
                                                </div>
                                                <div className="welcome-text-wrap">
                                                    <div className="welcome-sub text-white">Welcome back</div>
                                                    <h5 className="welcome-title m-0">
                                                        <span className="login-id">{userData?.loginid || 'ApexMindAi'}</span>
                                                    </h5>
                                                </div>
                                            </div>
                                            <button
                                                className="invite-btn btn d-block d-sm-none"
                                                style={{
                                                    backgroundColor: Number(userData?.kid) > 0 ? "#04832f" : "#dc3545",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "6px 16px",
                                                    borderRadius: "6px",
                                                    fontSize: "13px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {Number(userData?.kid) > 0 ? "Active" : "Inactive"}
                                            </button>
                                        </div>

                                        <div className='mt-4'>
                                            <div className="row g-2">
                                                <div className="col-4">
                                                    <div className="card01 border-0 shadow-sm welcome-inner-card">
                                                        <Link to='/dashboard/DepositHistory' className="text-decoration-none">
                                                            <div className="card-body01 p-2 text-center">
                                                                <p className="income-text mb-1 small">Deposit Fund</p>
                                                                <h6 className="income-balance mb-0 fw-bold">
                                                                    ${userData?.Depositfund || "0.00"}
                                                                </h6>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="card01 border-0 shadow-sm welcome-inner-card">
                                                        <Link to='/dashboard/InvestmentHistory' className="text-decoration-none">
                                                            <div className="card-body01 p-2 text-center">
                                                                <p className="income-text mb-1 small">Investment</p>
                                                                <h6 className="income-balance mb-0 fw-bold">
                                                                    ${userData?.Invest?.toFixed(2) || '0.00'}
                                                                </h6>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="card01 border-0 shadow-sm welcome-inner-card">
                                                        <Link to='/dashboard/IncomeReport' className="text-decoration-none">
                                                            <div className="card-body01 p-2 text-center">
                                                                <p className="income-text mb-1 small">Total Income</p>
                                                                <h6 className="income-balance mb-0 fw-bold">
                                                                    ${userData?.TotalIncome?.toFixed(2) || '0.00'}
                                                                </h6>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Countdown Timer */}
                                            <div className="row g-2 mt-1">
                                                <div className="col-6">
                                                    <div className="countdown-box text-center p-1">
                                                        <div className="small fw-semibold">
                                                            {apiBotStatus === 0 && ("BOT EXPIRE")}
                                                        </div>

                                                        {loading ? (
                                                            <div className="left-timer">
                                                                <span
                                                                    className="spinner-border"
                                                                    role="status"
                                                                    style={{
                                                                        width: '38px',
                                                                        height: '38px',
                                                                        borderWidth: '4px'
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : apiBotStatus === 0 ? (
                                                            <div className="left-timer fw-bold">
                                                                {countdown || "00H : 00M : 00S"}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={handleDashboardStartBot}
                                                                disabled={isBotStarting}
                                                            >
                                                                {isBotStarting ? 'Starting...' : 'Start Bot'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="countdown-box text-center p-1">
                                                        <div className="small fw-semibold">
                                                            RANK
                                                        </div>
                                                        <div className="left-timer">
                                                            {userData?.Ranks || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-5 mt-4 mt-sm-0">
                                        <div className="welcome-bg-img text-center text-sm-end position-relative">
                                            <button
                                                className="btn d-none d-sm-inline-block position-absolute"
                                                style={{
                                                    backgroundColor: Number(userData?.kid) > 0 ? "#04832f" : "#dc3545",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "8px 24px",
                                                    borderRadius: "6px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    top: "-5px",
                                                    right: "0",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#ffffff",
                                                        textShadow: "0 0 5px rgba(179, 62, 62, 0.8)",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    {Number(userData?.kid) > 0 ? "Active" : "Inactive"}
                                                </span>
                                            </button>
                                            <img
                                                src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/backgrounds/welcome-bg.svg"
                                                alt="welcome"
                                                className="img-fluid"
                                                style={{ maxWidth: "100%", height: "auto", marginTop: "5px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== INCOME WALLET ===== */}
                    <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
                        <div className="card w-100 income-wallet-card glow-card">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h5 className="income-wallet-title mb-0" style={{ fontSize: "clamp(16px, 2vw, 20px)" }}>
                                        Income Wallet
                                    </h5>
                                </div>

                                <div className="row g-2 align-items-center">
                                    {/* Left - Chart */}
                                    <div className="col-5 col-sm-5 col-md-6">
                                        <div style={{
                                            height: "clamp(100px, 15vw, 130px)",
                                            position: "relative",
                                            width: "100%"
                                        }}>
                                            {(() => {
                                                const categories = [
                                                    { label: "Bot Income", value: Number(userData?.AIBOTIncome) || 0, color: "#22C55E", hoverColor: "#16A34A" },
                                                    { label: "Trading Level Bonus", value: Number(userData?.TradingLevelIncome) || 0, color: "#14B8A6", hoverColor: "#0D9488" },
                                                    { label: "Sponsor Bonus", value: Number(userData?.SponsorIncome) || 0, color: "#F59E0B", hoverColor: "#D97706" },
                                                    { label: "Salary", value: Number(userData?.Salary) || 0, color: "#EC4899", hoverColor: "#DB2777" },
                                                    { label: "Reward", value: Number(userData?.Reward) || 0, color: "#A855F7", hoverColor: "#9333EA" }
                                                ];

                                                const filteredCategories = categories.filter(c => c.value > 0);

                                                if (filteredCategories.length === 0) {
                                                    return (
                                                        <>
                                                            <Doughnut
                                                                data={{
                                                                    labels: ["No Income"],
                                                                    datasets: [{
                                                                        data: [100],
                                                                        backgroundColor: ["rgba(255,255,255,0.12)"],
                                                                        borderWidth: 0,
                                                                        cutout: "75%"
                                                                    }]
                                                                }}
                                                                options={{
                                                                    responsive: true,
                                                                    maintainAspectRatio: false,
                                                                    plugins: {
                                                                        legend: { display: false },
                                                                        tooltip: { enabled: false }
                                                                    }
                                                                }}
                                                            />
                                                            <div className="chart-center-label" style={{
                                                                position: "absolute",
                                                                top: "50%",
                                                                left: "50%",
                                                                transform: "translate(-50%, -50%)",
                                                                textAlign: "center",
                                                                pointerEvents: 'none',
                                                            }}>
                                                                <h6 style={{ fontSize: "clamp(11px, 1.2vw, 14px)" }}>
                                                                    $0.00
                                                                </h6>
                                                                <small style={{ fontSize: "clamp(7px, 0.8vw, 9px)" }}>
                                                                    No Income
                                                                </small>
                                                            </div>
                                                        </>
                                                    );
                                                }

                                                const getColors = () => {
                                                    return filteredCategories.map(c => {
                                                        if (hoveredIncome && hoveredIncome.label === c.label) {
                                                            return c.hoverColor || c.color;
                                                        }
                                                        if (hoveredIncome) {
                                                            return c.color + '40';
                                                        }
                                                        return c.color;
                                                    });
                                                };

                                                return (
                                                    <>
                                                        <Doughnut
                                                            data={{
                                                                labels: filteredCategories.map(c => c.label),
                                                                datasets: [{
                                                                    data: filteredCategories.map(c => c.value),
                                                                    backgroundColor: getColors(),
                                                                    borderColor: hoveredIncome ? '#ffffff' : 'transparent',
                                                                    borderWidth: hoveredIncome ? 2 : 0,
                                                                    cutout: "75%"
                                                                }]
                                                            }}
                                                            options={{
                                                                responsive: true,
                                                                maintainAspectRatio: false,
                                                                plugins: {
                                                                    legend: { display: false },
                                                                    tooltip: {
                                                                        backgroundColor: "rgba(0,0,0,0.85)",
                                                                        titleColor: "#ffffff",
                                                                        bodyColor: "#ffffff",
                                                                        padding: 10,
                                                                        cornerRadius: 6,
                                                                        callbacks: {
                                                                            label: function (context) {
                                                                                const value = context.parsed || 0;
                                                                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                                                                return `💰 $${value.toFixed(2)} (${percentage}%)`;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <div className="chart-center-label" style={{
                                                            position: "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform: "translate(-50%, -50%)",
                                                            textAlign: "center",
                                                            pointerEvents: 'none',
                                                        }}>
                                                            <h6 style={{ fontSize: "clamp(11px, 1.2vw, 14px)" }}>
                                                                ${Number(userData?.TotalIncome || 0).toFixed(2)}
                                                            </h6>
                                                            <small style={{ fontSize: "clamp(7px, 0.8vw, 9px)" }}>
                                                                Total Income
                                                            </small>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Right - Income List */}
                                    <div className="col-7 col-sm-7 col-md-6">
                                        <div className="d-flex flex-column gap-1">
                                            {(() => {
                                                const categories = [
                                                    { label: "Bot Income", value: Number(userData?.AIBOTIncome) || 0, color: "#22C55E" },
                                                    { label: "Trading Level Bonus", value: Number(userData?.TradingLevelIncome) || 0, color: "#14B8A6" },
                                                    { label: "Sponsor Bonus", value: Number(userData?.SponsorIncome) || 0, color: "#F59E0B" },
                                                    { label: "Salary", value: Number(userData?.Salary) || 0, color: "#EC4899" },
                                                    { label: "Reward", value: Number(userData?.Reward) || 0, color: "#A855F7" }
                                                ];

                                                return categories.map((cat, index) => {
                                                    const isHovered = hoveredIncome && hoveredIncome.label === cat.label;
                                                    const hasValue = cat.value > 0;

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="income-list-row d-flex align-items-center justify-content-between"
                                                            style={{
                                                                background: isHovered ? cat.color + '25' : 'transparent',
                                                                border: isHovered ? `2px solid ${cat.color}` : '1px solid transparent',
                                                                cursor: hasValue ? 'pointer' : 'default',
                                                                opacity: hoveredIncome && !isHovered ? 0.4 : 1,
                                                                pointerEvents: hasValue ? 'auto' : 'none'
                                                            }}
                                                            onMouseEnter={() => {
                                                                if (hasValue) setHoveredIncome(cat);
                                                            }}
                                                            onMouseLeave={() => {
                                                                setHoveredIncome(null);
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center gap-1">
                                                                <span style={{
                                                                    width: "clamp(6px, 0.8vw, 10px)",
                                                                    height: "clamp(6px, 0.8vw, 10px)",
                                                                    borderRadius: "50%",
                                                                    backgroundColor: cat.color,
                                                                    display: "inline-block",
                                                                    opacity: hasValue ? 1 : 0.3,
                                                                    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                                                                    transition: 'all 0.3s ease',
                                                                    boxShadow: hasValue ? `0 0 8px ${cat.color}80` : 'none'
                                                                }}></span>
                                                                <span className="income-label" style={{
                                                                    fontSize: "clamp(8px, 0.9vw, 11px)",
                                                                    fontWeight: isHovered ? '700' : (hasValue ? '500' : '400'),
                                                                    whiteSpace: 'nowrap',
                                                                    color: isHovered ? cat.color : ''
                                                                }}>
                                                                    {cat.label}
                                                                </span>
                                                            </div>
                                                            <span className="income-value" style={{
                                                                fontSize: "clamp(8px, 0.9vw, 11px)",
                                                                fontWeight: isHovered ? '700' : '600',
                                                                color: isHovered ? cat.color : ''
                                                            }}>
                                                                ${cat.value.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* game and bot section */}
                <div className=" row g-3 ">

                    {/* Game Slider */}
                    <div className="col-12 col-md-6">
                        <Link to="/dashboard/game">
                            <div className="game-slider-wrapper glow-card">
                                <GameSlider />
                            </div>
                        </Link>
                    </div>

    {/* Bot Image */}
<div className="col-12 col-md-6">
  <Link to="/dashboard/bot" className="d-block bot-card-link">
    <div className="bot-image-wrapper glow-card">
      <img
        src={botimg}
        alt="Smart Trading Bot"
        className="bot-card-img"
      />
    </div>
  </Link>
</div>
                </div>




                <div className='row mt-5 '>
                    <div className="col-12 col-lg-8">
                        <div className="row g-2">

                            {/* Card 1 - BOT INCOME */}
                            <div className="col-6 col-lg-4 d-flex align-items-stretch">
                                <div className="card01 w-100 h-100 income-stat-card" onClick={() => goToStatement("AI Bot Income")}>
                                    <div className="card-body02 p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <p className="income-stat-label mb-1">Bot Income</p>
                                                <div className="income-stat-value">
                                                    ${userData?.AIBOTIncome?.toLocaleString() || '0.00'}
                                                </div>
                                            </div>
                                            <div className="income-stat-icon icon-blue">
                                                <i className="ti ti-bot-id"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 - Trading Level Bonus */}
                            <div className="col-6 col-lg-4 d-flex align-items-stretch">
                                <div className="card01 w-100 h-100 income-stat-card" onClick={() => goToStatement("Trading Level Bonus")}>
                                    <div className="card-body02 p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <p className="income-stat-label mb-1">Trading Level Bonus</p>
                                                <div className="income-stat-value">
                                                    ${userData?.TradingLevelIncome?.toLocaleString() || '0.00'}
                                                </div>
                                            </div>
                                            <div className="income-stat-icon icon-green">
                                                <i className="ti ti-brand-vinted"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 - Direct Income */}
                            <div className="col-12 col-lg-4 col-md-12 d-flex align-items-stretch">
                                <div className="card01 w-100 h-100 income-stat-card" onClick={() => goToStatement("Sponsor Bonus")}>
                                    <div className="card-body02 p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <p className="income-stat-label mb-1">Sponsor Bonus</p>
                                                <div className="income-stat-value">
                                                    ${userData?.SponsorIncome?.toLocaleString() || '0.00'}
                                                </div>
                                            </div>
                                            <div className="income-stat-icon icon-cyan">
                                                <i className="ti ti-fidget-spinner"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Row 2 - 3 Cards */}
                        <div className="row g-2" style={{marginTop: "1px"}}>

                            {/* Card 4 - Salary */}
                            <div className="col-6 col-lg-4 d-flex align-items-stretch">
                                <div className="card01 w-100 h-100 income-stat-card" onClick={() => goToStatement("Salary")}>
                                    <div className="card-body02 p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="w-100">
                                                <p className="income-stat-label mb-1">Salary</p>
                                                <div className="income-stat-value">
                                                    ${userData?.Salary?.toLocaleString() || '0.00'}
                                                </div>
                                            </div>
                                            <div className="income-stat-icon icon-yellow">
                                                <i className="ti ti-moneybag"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5 - Reward */}
                            <div className="col-6 col-lg-4 d-flex align-items-stretch">
                                <div className="card01 w-100 h-100 income-stat-card" onClick={() => goToStatement("Reward")}>
                                    <div className="card-body02 p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <p className="income-stat-label mb-1">Reward</p>
                                                <div className="income-stat-value">
                                                    ${userData?.Reward?.toLocaleString() || '0.00'}
                                                </div>
                                            </div>
                                            <div className="income-stat-icon icon-pink">
                                                <i className="ti ti-crown"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 6 - Payoutable */}
                            <div className="col-12 col-lg-4 col-md-12 d-flex align-items-stretch mb-2 mb-lg-0 ">
                                <div className="card01 w-100 h-100 income-stat-card">
                                    <div className="card-body02 p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <p className="income-stat-label mb-1">Payoutable</p>
                                                <div className="income-stat-value">
                                                    ${userData?.WorkingWallet?.toLocaleString() || '0.00'}
                                                </div>
                                            </div>
                                            <div className="income-stat-icon icon-yellow">
                                                <i className="ti ti-building-bank"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ===== Apex Mind Token (Right Card) ===== */}
                    <div className="col-lg-4 ">
                        <div className="row">
                            <div className="col-sm-12 d-flex align-items-stretch">
                                <div className="card w-100 apex-token-card">
                                    <div className="card-body02">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className='d-flex'>
                                                <div className="p-2 d-inline-block mb-3">
                                                    <img
                                                        src={apexcoin}
                                                        alt="Apex Coin"
                                                        style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                                                    />
                                                </div>
                                                <div className='mt-1 ms-1 apex-token-title'>APEX</div>
                                            </div>

                                            {/* Price Change Indicator */}
                                            <div className="apex-price-badge" style={{
                                                color: priceChange >= 0 ? '#00e5a0' : '#ff6b6b',
                                                background: priceChange >= 0 ? 'rgba(0,229,160,0.12)' : 'rgba(255,107,107,0.12)',
                                                border: priceChange >= 0 ? '1px solid rgba(0,229,160,0.35)' : '1px solid rgba(255,107,107,0.35)'
                                            }}>
                                                {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                                            </div>
                                        </div>

                                        {/* Live Chart */}
                                        <div style={{ height: "65px" }}>
                                            <Line
                                                data={{
                                                    labels: labels,
                                                    datasets: [{
                                                        data: chartData,
                                                        borderColor: priceChange >= 0 ? "#00e5a0" : "#ff6b6b",
                                                        backgroundColor: priceChange >= 0
                                                            ? "rgba(0,229,160,0.15)"
                                                            : "rgba(255,107,107,0.15)",
                                                        fill: true,
                                                        tension: 0.4,
                                                        borderWidth: 3,
                                                        pointRadius: 2,
                                                        pointHoverRadius: 5,
                                                        pointBackgroundColor: "#ffffff",
                                                        pointBorderColor: priceChange >= 0 ? "#00e5a0" : "#ff6b6b",
                                                        pointBorderWidth: 2
                                                    }],
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: { display: false },
                                                        tooltip: {
                                                            backgroundColor: "#111827",
                                                            padding: 10,
                                                            displayColors: false,
                                                            cornerRadius: 10,
                                                            callbacks: {
                                                                label: function (context) {
                                                                    return `$${(context.parsed.y / 8).toFixed(2)}`;
                                                                }
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        x: { display: false, grid: { display: false }, border: { display: false } },
                                                        y: { display: false, grid: { display: false }, border: { display: false }, suggestedMin: 0, suggestedMax: 45 }
                                                    },
                                                    animation: { duration: 750, easing: 'easeInOutQuad' }
                                                }}
                                            />
                                        </div>

                                        {/* Live Price Display */}
                                        <div className="mt-2 apex-live-price-wrap">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <h4 className="apex-live-price d-flex align-items-center mb-1">
                                                        ${price.toFixed(2)}
                                                        <i className={`ti ti-arrow-up-right fs-5 ms-1 ${priceChange >= 0 ? 'text-success' : 'text-danger'}`}></i>
                                                    </h4>
                                                    <div className="apex-live-label">Live Token Price</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>












                <div>
                    {/* ===== SECTION HEADER ===== */}
                    <div className="d-flex align-items-center justify-content-between mt-4 mb-3 mining-header-wrap">
                        <div className="d-flex align-items-center gap-2">
                            <h3 className="mining-header-title mb-0">Apex Mining Program</h3>
                        </div>
                    </div>

                    {/* Team/Business Details Section */}
                    <div className="">
                        <div className="row g-3">

                            {/* Left Side - col-8 */}
                            <div className="col-12 col-lg-8">
                                <div className="row g-2">

                                    {/* Row 1 - 3 Cards */}
                                    <div className="col-12">
                                        <div className="row g-2">

                                            {/* Card 1 - Invest Token */}
                                            <div className="col-6 col-md-4 col-lg-4 d-flex align-items-stretch glow-card03">
                                                <div className="card02 w-100 h-100 mining-card">
                                                    <div className="card-body02 p-3 d-flex flex-column">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="flex-grow-1">
                                                                <p className="mining-label">Invest Amount</p>
                                                                <h3 className='amount-report01'>
                                                                    <Link to="/dashboard/InvestTokenHistory">
                                                                        ${userData?.TotalAmountBuyToken || '0'}
                                                                    </Link>
                                                                </h3>
                                                                <div className='mt-1'>
                                                                    <p className="mining-label">Invest Token</p>
                                                                    <div className='mt-1 amount-report01 d-flex align-items-center gap-2'>
                                                                        <img
                                                                            src={apexcoin}
                                                                            alt="Apex Coin"
                                                                            style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                                                                        />
                                                                        <Link to="/dashboard/InvestTokenHistory">
                                                                            {userData?.TotalTokenInWallet || '0'}
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mining-icon-box icon-blue ms-2">
                                                                <i className="ti ti-wallet"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card 2 - Overall Token */}
                                            <div className="col-6 col-md-4 col-lg-4 d-flex align-items-stretch glow-card03">
                                                <div className="card02 w-100 h-100 mining-card">
                                                    <div className="card-body02 p-3 d-flex flex-column">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="flex-grow-1">
                                                                <p className="mining-label">Earned Token</p>
                                                                <div className='mt-1 amount-report01 d-flex align-items-center gap-2'>
                                                                    <img
                                                                        src={apexcoin}
                                                                        alt="Apex Coin"
                                                                        style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                                                                    />
                                                                    <div onClick={() => goToHistory("")}>
                                                                        {userData?.TotalEarnTokenInWallet || '0'}
                                                                    </div>
                                                                </div>
                                                                <div className="mining-label mt-2">Current Value</div>
                                                                <div className='amount-report01 mt-1'>
                                                                    ${((userData?.TotalEarnTokenInWallet || 0) * price).toFixed(2)}
                                                                </div>
                                                            </div>
                                                            <div className="mining-icon-box icon-cyan ms-2">
                                                                <i className="ti ti-chart-line"></i>
                                                            </div>
                                                        </div>
                                                        <p className="mining-live-price mt-2 mb-0">
                                                            Live Token Price:
                                                            <span className="live-price-value">{price.toFixed(2)}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card 3 - Mining(ROI) */}
                                            <div className="col-12 col-md-4 col-lg-4 d-flex align-items-stretch glow-card03">
                                                <div className="card02 w-100 h-100 mining-card">
                                                    <div className="card-body02 p-3 d-flex flex-column">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="flex-grow-1">
                                                                <p className="mining-label">Mining (ROI)</p>
                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                    <img
                                                                        src={apexcoin}
                                                                        alt="Apex Coin"
                                                                        style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                                                                    />
                                                                    <h5 className='amount-report01 mb-0'>
                                                                        <div onClick={() => goToHistory("Token Stake Bonus")}>
                                                                            {userData?.TokenStakeBonus?.toLocaleString() || '0'}
                                                                        </div>
                                                                    </h5>
                                                                </div>
                                                                <div className='mining-label mt-2 mb-1'>Level Income</div>
                                                                <h5 className='amount-report01 d-flex align-items-center gap-2 mb-0'>
                                                                    <img
                                                                        src={apexcoin}
                                                                        alt="Apex Coin"
                                                                        style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                                                                    />
                                                                    <div onClick={() => goToHistory("Level Income")}>
                                                                        {userData?.LevelIncome
                                                                            ? Number(userData.LevelIncome).toLocaleString(undefined, {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2
                                                                            })
                                                                            : '0.00'}
                                                                    </div>
                                                                </h5>
                                                            </div>
                                                            <div className="mining-icon-box icon-cyan ms-2">
                                                                <i className="ti ti-hammer"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 - 2 Cards */}
                                    <div className="col-12 mt-2">
                                        <div className="row g-2">

                                            {/* Card 4 - Social Media Bonus */}
                                            <div className="col-12 col-md-6 d-flex align-items-stretch glow-card03">
                                                <div className="card02 w-100 h-100 mining-card">
                                                    <div className="card-body02 p-3 d-flex flex-column">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div>
                                                                <div className="mining-label">Social Media Bonus</div>
                                                                <div className='mt-3 d-flex align-items-center gap-2'>
                                                                    <img
                                                                        src={apexcoin}
                                                                        alt="Apex Coin"
                                                                        style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                                                                    />
                                                                    <h5 className="mining-value-lg mb-0">
                                                                        <div onClick={() => goToHistory("Social Media Bonus")}>
                                                                            {userData?.SocialBonus?.toLocaleString() || '0'}
                                                                        </div>
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                            <div className="mining-icon-box icon-blue ms-2">
                                                                <i className="ti ti-user"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card 5 - Air drop */}
                                            <div className="col-12 col-md-6 d-flex align-items-stretch glow-card03">
                                                <div className="card02 w-100 h-100 mining-card">
                                                    <div className="card-body02 p-3 d-flex flex-column">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="flex-grow-1">
                                                                <div className="mining-label">Air Drop</div>
                                                                <div className='mt-3 d-flex align-items-center gap-2 mb-2'>
                                                                    <img
                                                                        src={apexcoin}
                                                                        alt="Apex Coin"
                                                                        style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                                                                    />
                                                                    <h5 className="mining-value-lg mb-0">
                                                                        <div onClick={() => goToHistory("Invest Token Bonus")}>
                                                                            {userData?.tokenBonusOnUpgrade?.toLocaleString() || '0'}
                                                                        </div>
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                            <div className="mining-icon-box icon-purple ms-2">
                                                                <i className="ti ti-crown"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Team/Business Details */}
                            <div className="col-12 col-lg-4 d-flex align-items-stretch glow-card03">
                                <div className="card02 w-100 h-100 mining-card">
                                    <div className="card-body02 p-3">
                                        <h5 className="team-title mb-3">Team/Business Details</h5>

                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="mining-icon-box icon-purple">
                                                    <i className="ti ti-users"></i>
                                                </div>
                                                <h6 className="team-label mb-0">Total Team</h6>
                                            </div>
                                            <h6 className="team-value mb-0">{userData?.TeamCount || '0'}</h6>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="ti ti-chart-line team-icon"></i>
                                                <h6 className="team-label mb-0">Active Team</h6>
                                            </div>
                                            <h6 className="team-value mb-0">{userData?.ActiveTeam || '0'}</h6>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="ti ti-arrows-exchange team-icon"></i>
                                                <h6 className="team-label mb-0">Inactive Team</h6>
                                            </div>
                                            <h6 className="team-value mb-0">{userData?.InactiveTeam || '0'}</h6>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="ti ti-repeat team-icon"></i>
                                                <h6 className="team-label mb-0">Active Direct</h6>
                                            </div>
                                            <h6 className="team-value mb-0">{userData?.directId || '0'}</h6>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className="ti ti-calendar-stats team-icon"></i>
                                                <h6 className="team-label mb-0">Level Open</h6>
                                            </div>
                                            <h6 className="team-value mb-0">{userData?.OpenLevel || '0'}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                <div className='mining-header-wrap mt-5 mb-3'>
                    <div className='d-flex align-items-center gap-2'>
                        <i className='ti ti-cash-banknote mining-header-icon'></i>
                        <h3 className='mining-header-title mb-0'>All Payout</h3>
                    </div>
                </div>

                {/* payout */}
                <div className='row'>
                    {/* ===== Income Payout Card ===== */}
                    <div className="col-12 col-lg-4 d-flex align-items-stretch">
                        <div className="card w-100 payout-card">
                            <div className="d-flex justify-content-between align-items-center p-3 pt-3 px-3">
                                <div className="payout-title">Income Payout</div>
                                <div className='mint-box'><GiProfit /></div>
                            </div>
                            <div className="c-box">
                                <div className="payout-input-box p-3">
                                    <input
                                        type="number"
                                        className="custom-pay-form form-control mb-2"
                                        placeholder='Enter Amount'
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(e.target.value)}
                                    />
                                    <div className="d-flex align-items-center justify-content-between mt-4">
                                        <Link to="/dashboard/IncomePayOutHistory" className="text-decoration-none">
                                            <h5 className='amount-report mb-1'>
                                                ${userData?.WorkingWallet?.toLocaleString() || '0.00'}
                                            </h5>
                                            <p className="payout-sub-label mb-0">Payout Amount</p>
                                        </Link>
                                        <button
                                            type="button"
                                            className="custtom-button"
                                            onClick={handlePayoutClick}
                                        >
                                            PayOut
                                        </button>
                                    </div>
                                    <div className='d-flex align-items-center gap-2 mt-3'>
                                        <span className="payout-note-label">Note :</span>
                                        <p className="payout-note-text">Min Withdrawal $10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Self Trading Payout ===== */}
                    <div className="col-12 col-lg-4 d-flex align-items-stretch">
                        <div className="card w-100 payout-card">
                            <div className="d-flex justify-content-between align-items-center p-3 pt-3 px-3">
                                <div className="payout-title">Self Trading Payout</div>
                                <div className='mint-box'><GiProfit /></div>
                            </div>
                            <div className="c-box">
                                <div className="payout-input-box p-3">
                                    <input
                                        type="number"
                                        className="custom-pay-form form-control mb-2"
                                        placeholder='Enter Amount'
                                        value={selfPayoutAmount}
                                        onChange={(e) => setSelfPayoutAmount(e.target.value)}
                                    />
                                    <div className="d-flex align-items-center justify-content-between mt-4">
                                        <Link to="/dashboard/SelfPayoutHistory" className="text-decoration-none">
                                            <h5 className='amount-report mb-1'>
                                                ${Number(userData?.SelfTrade || 0).toFixed(2)}
                                            </h5>
                                            <p className="payout-sub-label mb-0">Payout Amount</p>
                                        </Link>
                                        <button
                                            type="button"
                                            className="custtom-button"
                                            onClick={handleSelfPayoutButtonClick}
                                        >
                                            PayOut
                                        </button>
                                    </div>
                                    <div className='d-flex align-items-center gap-2 mt-3'>
                                        <span className="payout-note-label">Note :</span>
                                        <p className="payout-note-text">Min Withdrawal $10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Token Payout ===== */}
                    <div className="col-12 col-lg-4 d-flex align-items-stretch">
                        <div className="card w-100 payout-card">
                            <div className="d-flex justify-content-between align-items-center p-3 pt-3 px-3">
                                <div className="payout-title">Token Payout</div>
                                <div className='mint-box'><GiProfit /></div>
                            </div>
                            <div className="c-box">
                                <div className="payout-input-box p-3">
                                    <input
                                        type="number"
                                        className="custom-pay-form form-control mb-2"
                                        placeholder='Enter Amount'
                                        value={tokenPayoutAmount}
                                        onChange={(e) => setTokenPayoutAmount(e.target.value)}
                                    />
                                    <div className="d-flex align-items-center justify-content-between mt-4">
                                        <div className='d-flex align-items-center gap-2'>
                                            <img
                                                src={apexcoin}
                                                alt="Apex Coin"
                                                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                                            />
                                            <h5 className='amount-report mb-0'>
                                                <div style={{ fontWeight: "800" }} onClick={() => goToHistory("Fund Withdrawal")}>
                                                    {userData?.TotalEarnTokenInWallet?.toLocaleString() || '0.00'}
                                                </div>
                                            </h5>
                                        </div>
                                        <button
                                            type="button"
                                            className="custtom-button"
                                            onClick={() => handleTokenPayout()}
                                        >
                                            PayOut
                                        </button>
                                    </div>
                                    <p className="payout-sub-label mt-2 mb-2">Payout Token</p>
                                    <div className='d-flex align-items-center gap-2'>
                                        <span className="payout-note-label">Note :</span>
                                        <p className="payout-note-text">Min Withdrawal Tokens 10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== WITHDRAW MODAL ==================== */}
                    {showWithdrawModal && (
                        <div className="modal-overlay">
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h4>Income Payout</h4>
                                    <button
                                        className="modal-close"
                                        onClick={() => {
                                            setShowWithdrawModal(false);
                                            setWithdrawAmount('');
                                            setOtp('');
                                            setOtpSent(false);
                                            setOtpVerified(false);
                                            setLoading(false);
                                            setWithdrawLoading(false);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <div className="balance-info">
                                        <h6>Available balance</h6>
                                        <strong>${displayBalance?.toLocaleString() || '0.00'}</strong>
                                    </div>

                                    <div className='meddle'>
                                        <div className="methods-grid mt-3">
                                            <div className="method-chip active">
                                                <FaCreditCard />
                                                <span>Wallet Address</span>
                                            </div>
                                        </div>

                                        <div className="saved-details-box mt-3">
                                            <div className="details-content">
                                                <div className="detail-row">
                                                    <span className="detail-value">
                                                        {userData.walletid || 'No wallet address found'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="amount-area mb-3 mt-3">
                                            <div className="amount-label">Enter Amount</div>
                                            <div className="amount-input-wrapper">
                                                <span className="currency-symbol">$</span>
                                                <input
                                                    type="number"
                                                    className="amount-input"
                                                    placeholder="Enter amount"
                                                    value={withdrawAmount}
                                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                                    disabled={withdrawLoading}
                                                />
                                            </div>
                                        </div>

                                        <div className="amount-area mb-3 mt-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="amount-input-wrapper w-100">
                                                    <input
                                                        type="number"
                                                        className="amount-input"
                                                        placeholder="Enter OTP"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        disabled={!otpSent}
                                                    />
                                                </div>

                                                {!otpSent ? (
                                                    <button
                                                        className="btn-primary py-2 px-4 text-nowrap"
                                                        onClick={handleSendOTP}
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Sending..." : "Send OTP"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-success py-2 px-4 text-nowrap"
                                                        onClick={handleVerifyOTP}
                                                        disabled={loading || otp.length < 6}
                                                    >
                                                        {loading ? "Verifying..." : "Verify OTP"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            className="modal-submit-btn mt-3"
                                            onClick={handleWithdraw}
                                            disabled={withdrawLoading || !otpVerified}
                                        >
                                            {withdrawLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Processing...
                                                </>
                                            ) : !otpVerified ? (
                                                "Withdraw (Verify OTP First)"
                                            ) : (
                                                "Withdraw"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== SELF TRADING MODAL ==================== */}
                    {showSelfPayoutModal && (
                        <div className="modal-overlay" onClick={() => resetSelfPayoutModal()}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h4>Self Trading Payout</h4>
                                    <button className="modal-close" onClick={resetSelfPayoutModal}>✕</button>
                                </div>

                                <div className="modal-body">
                                    <div className="balance-info">
                                        <h6>Available Balance</h6>
                                        <strong>${Number(userData?.SelfTrade || 0).toFixed(2)}</strong>
                                    </div>

                                    <div className="methods-grid mt-3">
                                        <div className="method-chip active">
                                            <FaCreditCard />
                                            <span>Wallet Address</span>
                                        </div>
                                    </div>

                                    <div className="saved-details-box mt-3">
                                        <div className="details-content">
                                            <div className="detail-row">
                                                <span className="detail-value">
                                                    {userData.walletid || 'No wallet address found'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label className="amount-label">Enter Amount</label>
                                        <div className="amount-input-wrapper">
                                            <span className="currency-symbol">$</span>
                                            <input
                                                type="number"
                                                className="amount-input"
                                                placeholder="Enter amount"
                                                value={selfPayoutAmount}
                                                onChange={(e) => setSelfPayoutAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="amount-area mb-3 mt-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="amount-input-wrapper w-100">
                                                <input
                                                    type="number"
                                                    className="amount-input"
                                                    placeholder="Enter OTP"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    disabled={!otpSent}
                                                />
                                            </div>

                                            {!otpSent ? (
                                                <button
                                                    className="btn-primary py-2 px-4 text-nowrap"
                                                    onClick={handleSendOTP}
                                                    disabled={loading}
                                                >
                                                    {loading ? "Sending..." : "Send OTP"}
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-success py-2 px-4 text-nowrap"
                                                    onClick={handleVerifyOTP}
                                                    disabled={loading || otp.length < 6}
                                                >
                                                    {loading ? "Verifying..." : "Verify OTP"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        className="modal-submit-btn"
                                        onClick={handleSelfTradingPayout}
                                        disabled={selfPayoutLoading || !otpVerified}
                                    >
                                        {selfPayoutLoading ? (
                                            <span className="d-flex align-items-center justify-content-center gap-2">
                                                <span className="spinner-border spinner-border-sm" role="status"></span>
                                                Processing...
                                            </span>
                                        ) : !otpVerified ? (
                                            "PayOut (Verify OTP First)"
                                        ) : (
                                            "PayOut"
                                        )}
                                    </button>

                                    <div className='mt-3 ms-1'>
                                        <span className="modal-note-text">Note: Minimum Withdraw Limit $10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== TOKEN PAYOUT MODAL ==================== */}
                    {showTokenPayoutModal && (
                        <div className="modal-overlay" onClick={() => setShowTokenPayoutModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h4>Token Payout</h4>
                                    <button
                                        className="modal-close"
                                        onClick={() => {
                                            resetWithdrawModal();
                                            setTokenPayoutAmount('');
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <div className="balance-info">
                                        <h6>Available Tokens</h6>
                                        <strong className="d-flex align-items-center gap-2">
                                            <img src={apexcoin} alt="Apex Coin" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                                            {userData?.TotalEarnTokenInWallet?.toLocaleString() || '0.00'}
                                        </strong>
                                    </div>

                                    <div className="token-rate-info">
                                        <span>Live Token Price</span>
                                        <span className="token-rate-value">{price.toFixed(2)}</span>
                                    </div>

                                    <div className="methods-grid mt-3">
                                        <div className="method-chip active">
                                            <FaCreditCard />
                                            <span>Wallet Address</span>
                                        </div>
                                    </div>

                                    <div className="saved-details-box mt-3">
                                        <div className="details-content">
                                            <div className="detail-row">
                                                <span className="detail-value">
                                                    {userData?.TokenAddress || 'No wallet address found'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label className="amount-label">Enter Token Amount</label>
                                        <div className="amount-input-wrapper">
                                            <span className="currency-symbol">
                                                <img src={apexcoin} alt="Apex Coin" style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
                                            </span>
                                            <input
                                                type="number"
                                                className="amount-input"
                                                placeholder="Enter token amount"
                                                value={tokenPayoutAmount}
                                                onChange={(e) => setTokenPayoutAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="amount-area mb-3 mt-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="amount-input-wrapper w-100">
                                                <input
                                                    type="number"
                                                    className="amount-input"
                                                    placeholder="Enter OTP"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    disabled={!otpSent}
                                                />
                                            </div>

                                            {!otpSent ? (
                                                <button
                                                    className="btn-primary py-2 px-4 text-nowrap"
                                                    onClick={handleSendOTP}
                                                    disabled={loading}
                                                >
                                                    {loading ? "Sending..." : "Send OTP"}
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-success py-2 px-4 text-nowrap"
                                                    onClick={handleVerifyOTP}
                                                    disabled={loading || otp.length < 6}
                                                >
                                                    {loading ? "Verifying..." : "Verify OTP"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        className="modal-submit-btn mt-3"
                                        onClick={handleTokenPayoutSubmit}
                                        disabled={tokenPayoutLoading || !otpVerified}
                                    >
                                        {tokenPayoutLoading ? (
                                            <span className="d-flex align-items-center justify-content-center gap-2">
                                                <span className="spinner-border spinner-border-sm" role="status"></span>
                                                Processing...
                                            </span>
                                        ) : !otpVerified ? (
                                            "Payout Tokens"
                                        ) : (
                                            "Payout Tokens"
                                        )}
                                    </button>

                                    <div className='mt-3 ms-1'>
                                        <span className="modal-note-text">Note: Minimum Withdraw Limit 10 Tokens</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>




            </div>
        </>

    );
};

export default Dashboard;