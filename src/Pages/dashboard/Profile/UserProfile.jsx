import { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import apiClient from '../../../api/apiClient';
import toast from 'react-hot-toast';
import Toast from '../../../Componenets/ui/Toast';


const UserProfile = () => {
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [formData, setFormData] = useState({
    loginId: "",
    address: "",
    fullName: "apexmindai",
    emailId: "",
    mobileNumber: "",
    firstName: "",
    lastName: "",
    walletAddress: ""
  });

  useEffect(() => {
    if (!userData) return;

    const fullName = userData?.fname || "";
    const nameParts = fullName.split(" ");

    setFormData(prev => ({
      ...prev,
      loginId: sessionStorage.getItem("loginId") || userData?.loginid || "",
      address: userData?.TokenAddress || userData?.address || "",
      fullName: prev.fullName || fullName,
      firstName: prev.firstName || nameParts[0] || "",
      lastName: prev.lastName || nameParts.slice(1).join(" "),
      emailId: prev.emailId || userData?.email || "",
      mobileNumber: prev.mobileNumber || userData?.MobileNo || userData?.mobile || "",
      walletAddress: prev.walletAddress || userData?.walletid || userData?.walletAddress || "",
    }));

    setLoading(false);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = async () => {
    try {
      const loginId = sessionStorage.getItem("loginId");
      const regNo = sessionStorage.getItem("Regno");

      if (!loginId || !regNo) {
        toast.error("Login ID or Registration number not found");
        return;
      }

      setOtpLoading(true);
      setOtpVerified(false);
      setOtp("");

      const response = await apiClient.post('/Auth/genrate-otp', null, {
        params: { loginid: loginId, regno: regNo }
      });

      if (response.data.result === "true") {
        toast.success(response.data.message || "OTP sent successfully!");
        setOtpSent(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!otp || otp.length < 6) {
        toast.error("Please enter valid 6-digit OTP");
        return;
      }

      const loginId = sessionStorage.getItem("loginId");
      const regNo = sessionStorage.getItem("Regno");

      if (!loginId || !regNo) {
        toast.error("Login ID or Registration number not found");
        return;
      }

      setOtpLoading(true);
      const response = await apiClient.post('/Auth/verify-otp', null, {
        params: { loginid: loginId, regno: regNo, otp: otp }
      });

      if (response.data.result === "true") {
        toast.success("OTP Verified Successfully");
        setOtpVerified(true);
        setOtpSent(false);
      } else {
        setOtpVerified(false);
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      setOtpVerified(false);
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUpdating) {
      toast.error("Please wait...");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify OTP first before updating profile");
      return;
    }

    if (!formData.emailId) {
      toast.error("Email ID is required");
      return;
    }
    if (!formData.mobileNumber) {
      toast.error("Mobile number is required");
      return;
    }

    setIsUpdating(true);

    try {
      const regNo = sessionStorage.getItem("Regno");

      if (!regNo) {
        toast.error("Registration number not found!");
        setIsUpdating(false);
        return;
      }

      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(' ') || "";

      const requestData = {
        regNo: parseInt(regNo),
        emailID: formData.emailId,
        address: formData.address,
        firstName: firstName,
        lastName: lastName,
        mobile: formData.mobileNumber,
        stateId: 0,
        cityId: 0,
        pinCode: "0",
        alternateContactNo: "",
        walletAddress: formData.walletAddress || ""
      };

      const response = await apiClient.put('/Auth/UpdateProfile', requestData);

      if (response.data?.result === "true" || response.data?.result === true ||
        response.data?.response === true || response.data?.response === "true") {

        toast.success("Profile updated successfully!");

        sessionStorage.setItem("userEmail", formData.emailId);
        if (formData.walletAddress) {
          sessionStorage.setItem("walletAddress", formData.walletAddress);
        }
        if (formData.address) {
          sessionStorage.setItem("tokenAddress", formData.address);
        }

        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Update failed: " + (response.data?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(error.response?.data?.message || "API Error - Please try again");
      }
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="up-loading">
        <div className="up-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="up-page">
      <Toast />

      {/* ===== HEADER CARD ===== */}
      <div className="dh-header-card">
        <div className="dh-header-icon">
          <i className="ti ti-user-circle"></i>
        </div>
        <div className="dh-header-texts">
          <h2>Profile Information</h2>
          <p>Update your profile details and wallet addresses</p>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="up-card">
              <div className="up-card-body">

                {/* Login ID */}
                <div className="up-form-group">
                  <label className="up-label">Login ID</label>
                  <div className="up-input-wrap">
                    <i className="ti ti-user up-input-icon"></i>
                    <input
                      type="text"
                      value={formData.loginId}
                      className="up-input up-input-readonly"
                      disabled
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="up-form-group">
                  <label className="up-label">Email ID *</label>
                  <div className="up-input-wrap">
                    <i className="ti ti-mail up-input-icon"></i>
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleChange}
                      className="up-input up-input-readonly"
                      required
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="up-form-group">
                  <label className="up-label">Mobile Number *</label>
                  <div className="up-input-wrap">
                    <i className="ti ti-phone up-input-icon"></i>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="up-input"
                      required
                      placeholder="Enter your mobile number"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                    />
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="up-form-group">
                  <label className="up-label">Income Payout Wallet Address</label>
                  <div className="up-input-wrap">
                    <i className="ti ti-wallet up-input-icon"></i>
                    <input
                      type="text"
                      name="walletAddress"
                      value={formData.walletAddress || ""}
                      onChange={handleChange}
                      className="up-input"
                      placeholder="Enter your wallet address"
                    />
                  </div>
                </div>

                {/* Token Address */}
                <div className="up-form-group">
                  <label className="up-label">Token Payout Address</label>
                  <div className="up-input-wrap">
                    <i className="ti ti-coin up-input-icon"></i>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="up-input"
                      placeholder="Enter Token Address"
                    />
                  </div>
                </div>

                {/* OTP Section */}
                <div className={`up-otp-box ${otpVerified ? 'up-otp-verified' : ''}`}>
                  <label className="up-otp-label">
                    <i className="ti ti-shield-check"></i>
                    OTP Verification
                    {otpVerified && <span className="up-otp-status">✓ Verified</span>}
                  </label>

                  <div className="up-otp-row">
                    <input
                      type="number"
                      className="up-otp-input"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={!otpSent || otpVerified}
                      maxLength="6"
                    />

                    {!otpVerified && (
                      !otpSent ? (
                        <button
                          type="button"
                          className="up-otp-btn"
                          onClick={handleSendOTP}
                          disabled={otpLoading}
                        >
                          {otpLoading ? (
                            <>
                              <span className="up-spinner-sm"></span>
                              Sending...
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="up-otp-btn up-otp-btn-verify"
                          onClick={handleVerifyOTP}
                          disabled={otpLoading || otp.length < 6}
                        >
                          {otpLoading ? (
                            <>
                              <span className="up-spinner-sm"></span>
                              Verifying...
                            </>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="up-submit-btn"
                  disabled={isUpdating || !otpVerified}
                >
                  {isUpdating ? (
                    <>
                      <span className="up-spinner-sm"></span>
                      UPDATING...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-device-floppy"></i>
                      UPDATE PROFILE
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;