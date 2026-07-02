// InvestFund.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import './Invest.css';
import { Link } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { useUser } from '../../../context/UserContext';
import Toast from '../../../Componenets/ui/Toast';

const InvestFund = () => {
  const { fetchData, userData } = useUser();
  const [bot1Amount, setBot1Amount] = useState('');
  const [bot2Amount, setBot2Amount] = useState('');
  const [loadingBot1, setLoadingBot1] = useState(false);
  const [loadingBot2, setLoadingBot2] = useState(false);

  const regno = localStorage.getItem("Regno");

  const investInBot = async (botId, amount, retryCount = 0) => {
    if (!navigator.onLine) {
      toast.error('No internet connection. Please check your network.');
      return;
    }
    if (!regno) {
      toast.error('Please login again. Session expired!');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    if (botId === 1 && (parseFloat(amount) < 100 || parseFloat(amount) > 999)) {
      toast.error('Bot 1: Amount must be between $100 and $999.');
      return;
    }
    if (botId === 2 && (parseFloat(amount) < 1000 || parseFloat(amount) > 5000)) {
      toast.error('Bot 2: Amount must be between $1000 and $5000.');
      return;
    }
    
    if (botId === 1) setLoadingBot1(true);
    else setLoadingBot2(true);

    const payload = {
      regno: regno,
      rkprice: parseFloat(amount),
      uRegno: 0,
    };

    try {
      const response = await apiClient.post('/Dashboard/Investment', payload);
      const data = response.data;

      // ✅ SIRF API KA MESSAGE - BINA EMOJI KE
      if (data.result === 'true') {
        toast.success(data.message);  // 👈 SIRF YAHI
        await fetchData();
        if (botId === 1) setBot1Amount('');
        else setBot2Amount('');
      } else {
        toast.error(data.message || 'Something went wrong');  // 👈 SIRF YAHI
      }
    } catch (error) {
      console.error('API Error:', error);

      const isNetworkError = !error.response && !error.request;
      const isTimeout = error.code === 'ECONNABORTED';
      const isServerBusy = error.response?.status === 429 || error.response?.status === 503;

      if (retryCount < 2 && (isNetworkError || isTimeout || isServerBusy)) {      
        if (retryCount === 0) {
          toast('Network issue. Retrying...');
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (botId === 1) setLoadingBot1(false);
        else setLoadingBot2(false);
        
        return investInBot(botId, amount, retryCount + 1);
      }

      if (error.response) {
        toast.error(error.response.data?.message || error.response.statusText);
      } 
      else if (error.request) {
        if (!navigator.onLine) {
          toast.error('No internet. Please check connection.');
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Server timeout. Please try again.');
        } else {
          toast.error('Server not responding. Please try again.');
        }
      } 
      else {
        toast.error(error.message || 'Server error. Please try again.');
      }
    } finally {
      if (botId === 1) setLoadingBot1(false);
      else setLoadingBot2(false);
    }
  };

  return (
    <>
      <Toast />
      <div className='Table-container'>
        {/* Header */}
        <div className="header-container">
          <div className="d-flex justify-content-between align-items-center p-3 p-md-4 bg-white rounded-3 shadow-sm mb-4 border border-light flex-wrap gap-2">
            <h2 className="text-dark fw-bold mb-0" style={{ fontSize: "clamp(18px, 3vw, 28px)" }}>
              Invest Bot
            </h2>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="investment-display d-inline-flex align-items-center" style={{ gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>Deposit Fund:</span>
                <span style={{
                  background: '#fff',
                  color: "green",
                  padding: '1px 8px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                }}>
                  ${userData?.Depositfund || 0}
                </span>
              </div>

              <Link to="/dashboard/InvestmentHistory">
                <button type="button" className="btn btn-primary px-3 px-md-4 py-2" style={{ whiteSpace: 'nowrap' }}>
                  History
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Cards Grid - Fully Responsive */}
        <div className="row g-3 g-md-4 px-3">
          {/* Bot 1 */}
          <div className="col-12 col-md-6 col-lg-6 d-flex align-items-stretch">
            <div className="invest-card w-100">
              <div
                className="card-header"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "14px 20px",
                  textAlign: "center",
                  borderBottom: "none",
                  borderRadius: "16px 16px 0 0"
                }}
              >
                <span
                  className="bot-name"
                  style={{
                    color: "#ffffff",
                    fontSize: "20px",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    margin: 0
                  }}
                >
                  🤖 Bot 1
                </span>
              </div>

              <div className="image-wrapper">
                <img
                  src="https://i.pinimg.com/1200x/18/39/fe/1839fe826cbbda43160f5aa76031d9a3.jpg"
                  alt="Bot 1"
                  className="bot-image"
                />
              </div>

              <div className="c-box">
                <div className="card-body01 p-2 p-md-3">
                  <div className="input-group02">
                    <span className="currency-icon">$</span> |
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="amount-input"
                      value={bot1Amount}
                      onChange={(e) => setBot1Amount(e.target.value)}
                      disabled={loadingBot1}
                    />
                  </div>

                  <div className="note-section d-flex">
                    <span className="note-label">Note:</span>
                    <p className="mb-0">A member will get upto 2.5% profit on equity deposit weekly.</p>
                  </div>

                  <div className="limit-section">
                    <span className="limit-label">Limit:</span>
                    <span className="limit-text">Min deposit $100 | Max $999</span>
                  </div>

                  <button
                    className="invest-btn w-100"
                    onClick={() => investInBot(1, bot1Amount)}
                    disabled={loadingBot1}
                  >
                    {loadingBot1 ? 'Processing...' : 'Invest Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bot 2 */}
          <div className="col-12 col-md-6 col-lg-6 d-flex align-items-stretch">
            <div className="invest-card w-100">
              <div
                className="card-header"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "14px 20px",
                  textAlign: "center",
                  borderBottom: "none",
                  borderRadius: "16px 16px 0 0"
                }}
              >
                <span
                  className="bot-name"
                  style={{
                    color: "#ffffff",
                    fontSize: "20px",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    margin: 0
                  }}
                >
                  🤖 Bot 2
                </span>
              </div>

              <div className="image-wrapper">
                <img
                  src="https://i.pinimg.com/736x/2f/a9/af/2fa9afe7803e88bf73727ba5d83d25a9.jpg"
                  alt="Bot 2"
                  className="bot-image"
                />
              </div>

              <div className="c-box">
                <div className="card-body02 p-2 p-md-3">
                  <div className="input-group02">
                    <span className="currency-icon">$</span> |
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="amount-input"
                      value={bot2Amount}
                      onChange={(e) => setBot2Amount(e.target.value)}
                      disabled={loadingBot2}
                    />
                  </div>

                  <div className="note-section d-flex">
                    <span className="note-label">Note:</span>
                    <p className="mb-0">A member will get upto 3% profit on equity deposit weekly.</p>
                  </div>

                  <div className="limit-section">
                    <span className="limit-label">Limit:</span>
                    <span className="limit-text">Min deposit $1000 | Max $5000</span>
                  </div>

                  <button
                    className="invest-btn w-100"
                    onClick={() => investInBot(2, bot2Amount)}
                    disabled={loadingBot2}
                  >
                    {loadingBot2 ? 'Processing...' : 'Invest Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestFund;