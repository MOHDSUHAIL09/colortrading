// InvestToken.jsx - Fixed API URL
import React, { useState } from "react";
import "./InvestToken.css";
import { Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { useUser } from "../../../context/UserContext";

const ApexMiningProgram = () => {
  const [tier1Amount, setTier1Amount] = useState("");
  const [tier2Amount, setTier2Amount] = useState("");
  const [tier3Amount, setTier3Amount] = useState("");
  const [loadingTier1, setLoadingTier1] = useState(false);
  const [loadingTier2, setLoadingTier2] = useState(false);
  const [loadingTier3, setLoadingTier3] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

   const { userData } = useUser();

  // Show Toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // ✅ API Call Function - FIXED URL
  const callInvestAPI = async (regno, miningAmt, uregno, slotNum, setLoading) => {
    try {
      setLoading(true);

      console.log("📤 Sending Request:", { regno, miningAmt, uregno, slotNum });

      // ✅ FIX: Use full URL or remove extra slash
      // Option 1: Use full URL (Recommended)
      const response = await apiClient.post(`https://api.apexmindai.in/TokenMiningAsync`, null, {
        params: {
          Regno: regno,
          MiningAmt: miningAmt,
          URegno: uregno,
          SlotNum: slotNum
        }
      });

      // ✅ Option 2: If base URL is https://api.apexmindai.in/api/
      // const response = await apiClient.post(`/TokenMiningAsync`, null, {
      //   params: {
      //     Regno: regno,
      //     MiningAmt: miningAmt,
      //     URegno: uregno,
      //     SlotNum: slotNum
      //   }
      // });

      console.log("📡 API Response:", response);
      console.log("📊 Result:", response.data?.result);
      console.log("💬 Message:", response.data?.message);

      // ✅ Check response - result can be boolean or string
      if (response.data?.result === true || response.data?.result === "true") {
        setSuccessData({
          message: response.data.message || "Investment Successful!",
          amount: miningAmt,
          tier: slotNum === 10 ? "Tier 1" : slotNum === 8 ? "Tier 2" : "Tier 3",
          months: slotNum,
          returnRate: "2X"
        });
        setShowSuccessModal(true);
        showToast("✅ Investment Successful!", "success");
        return response.data;
      } else {
        showToast(`❌ ${response.data?.message || 'Transaction failed'}`, "error");
        return null;
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      console.error("❌ Error Response:", error.response?.data);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error URL:", error.config?.url);
      
      let errorMsg = error.response?.data?.message || error.message || "Something went wrong";
      showToast(`❌ ${errorMsg}`, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get Slot Number based on Tier
  const getSlotNumber = (tier) => {
    switch(tier) {
      case "Tier 1": return 10;
      case "Tier 2": return 8;
      case "Tier 3": return 6;
      default: return 0;
    }
  };

  const getLoadingState = (tier) => {
    switch(tier) {
      case "Tier 1": return loadingTier1;
      case "Tier 2": return loadingTier2;
      case "Tier 3": return loadingTier3;
      default: return false;
    }
  };

  const getSetLoading = (tier) => {
    switch(tier) {
      case "Tier 1": return setLoadingTier1;
      case "Tier 2": return setLoadingTier2;
      case "Tier 3": return setLoadingTier3;
      default: return () => {};
    }
  };

  const getAmountSetter = (tier) => {
    switch(tier) {
      case "Tier 1": return setTier1Amount;
      case "Tier 2": return setTier2Amount;
      case "Tier 3": return setTier3Amount;
      default: return () => {};
    }
  };

  const handleInvest = async (tier, amount) => {
    const loading = getLoadingState(tier);
    
    if (loading) return;

    if (!amount || amount <= 0) {
      showToast(`Please enter a valid amount for ${tier}`, "error");
      return;
    }

    const amountNum = parseFloat(amount);
    const slotNum = getSlotNumber(tier);
    const regno = localStorage.getItem("Regno") || 1;
    const uregno = 0;
    
    let isValid = false;
    let minAmount = 0;
    let maxAmount = 0;
    
    switch(tier) {
      case "Tier 1": 
        isValid = amountNum >= 100 && amountNum <= 5000;
        minAmount = 100;
        maxAmount = 5000;
        break;
      case "Tier 2": 
        isValid = amountNum >= 5001 && amountNum <= 15000;
        minAmount = 5001;
        maxAmount = 15000;
        break;
      case "Tier 3": 
        isValid = amountNum >= 15001 && amountNum <= 25000;
        minAmount = 15001;
        maxAmount = 25000;
        break;
      default: 
        isValid = false;
    }

    if (!isValid) {
      showToast(`❌ Amount must be between $${minAmount} and $${maxAmount} for ${tier}`, "error");
      return;
    }

    const setLoading = getSetLoading(tier);
    const setAmount = getAmountSetter(tier);
    
    const result = await callInvestAPI(regno, amountNum, uregno, slotNum, setLoading);

    if (result && (result.result === true || result.result === "true")) {
      setAmount("");
    }
  };

  const resetModal = () => {
    setShowSuccessModal(false);
    setSuccessData({});
  };

  return (
    <div className="Table-container apex-mining-app"> 
      
      {toast.show && (
        <div className={`apex-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 apex-header">
  <div>
    <h1 className="apex-title mb-1">APEX MINING PROGRAM</h1> 
  </div>
  
  {/* ✅ Mobile me inline, desktop me alag */}
  <div className="d-flex align-items-center gap-2">
    {/* Deposit Button */}
    <div 
      className="d-inline-flex align-items-center"
      style={{
        gap: '6px',
        background: '#0d6efd',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span>Deposit</span>
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

    {/* History Button */}
    <Link to="/dashboard/InvestTokenHistory">
      <button 
        className="btn btn-primary"
        style={{
          padding: '6px 14px',
          fontSize: '13px',
          whiteSpace: 'nowrap',
        }}
      >
        History
      </button>
    </Link>
  </div>
</div>

      <div className="apex-tiers-row">        
        {/* Tier 1 */}
        <div className="apex-tier-card">
          <h2>TIER 1</h2>
          <p className="apex-investment-range">$100 – $5,000</p>
          <div className="apex-lockup">LOCK-UP: 10 MONTHS</div>
          <div className="apex-return">2X RETURN IN APEX TOKENS</div>
          <div className="apex-invest-group">
            <input
              type="number"
              placeholder="Enter amount"
              value={tier1Amount}
              onChange={(e) => setTier1Amount(e.target.value)}
              disabled={loadingTier1}
            />
            <button 
              onClick={() => handleInvest("Tier 1", tier1Amount)} 
              disabled={loadingTier1}
            >
              {loadingTier1 ? 'Processing...' : 'Invest'}
            </button>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="apex-tier-card">
          <h2>TIER 2</h2>
          <p className="apex-investment-range">$5,001 – $15,000</p>
          <div className="apex-lockup">LOCK-UP: 8 MONTHS</div>
          <div className="apex-return">2X RETURN IN APEX TOKENS</div>
          <div className="apex-invest-group">
            <input
              type="number"
              placeholder="Enter amount"
              value={tier2Amount}
              onChange={(e) => setTier2Amount(e.target.value)}
              disabled={loadingTier2}
            />
            <button 
              onClick={() => handleInvest("Tier 2", tier2Amount)} 
              disabled={loadingTier2}
            >
              {loadingTier2 ? 'Processing...' : 'Invest'}
            </button>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="apex-tier-card">
          <h2>TIER 3</h2>
          <p className="apex-investment-range">$15,001 – $25,000</p>
          <div className="apex-lockup">LOCK-UP: 6 MONTHS</div>
          <div className="apex-return">2X RETURN IN APEX TOKENS</div>
          <div className="apex-invest-group">
            <input
              type="number"
              placeholder="Enter amount"
              value={tier3Amount}
              onChange={(e) => setTier3Amount(e.target.value)}
              disabled={loadingTier3}
            />
            <button 
              onClick={() => handleInvest("Tier 3", tier3Amount)} 
              disabled={loadingTier3}
            >
              {loadingTier3 ? 'Processing...' : 'Invest'}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <div className="apex-modal-overlay" onClick={resetModal}>
          <div className="apex-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="apex-modal-icon">✅</div>
            <h2>Investment Successful!</h2>
            <div className="apex-modal-details">
              <p><strong>Amount:</strong> ${successData.amount}</p>
              <p><strong>Plan:</strong> {successData.tier}</p>
              <p><strong>Lock-up:</strong> {successData.months} Months</p>
              <p><strong>Return:</strong> {successData.returnRate} in APEX Tokens</p>
            </div>
            <p className="apex-modal-message">{successData.message}</p>
            <button className="apex-modal-btn" onClick={resetModal}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApexMiningProgram;