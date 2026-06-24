import { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import apiClient from '../../../api/apiClient';
import toast from 'react-hot-toast';
import Toast from '../../../Componenets/ui/Toast';

const UserProfile = () => {
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);

  const [formData, setFormData] = useState({
    loginId: "",
    address: "",
    fullName: "",
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
      loginId: localStorage.getItem("loginId") || userData?.loginid || "",
      address: prev.address || userData?.TokenAddress || "",
      fullName: prev.fullName || fullName,
      firstName: prev.firstName || nameParts[0] || "",
      lastName: prev.lastName || nameParts.slice(1).join(" "),
      emailId: prev.emailId || userData?.email || "",
      mobileNumber: prev.mobileNumber || userData?.MobileNo || userData?.mobile || "",
      walletAddress: userData?.walletid || "",
    }));

    setLoading(false);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUpdating) {
      toast.error("Please wait...");
      return;
    }

    if (!formData.fullName) {
      toast.error("Full name is required");
      return;
    }
    // if (!formData.address) {
    //   toast.error("Token Address is required");
    //   return;
    // }
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
      const regNo = localStorage.getItem("Regno");


      if (!regNo) {
        toast.error("Registration number not found!");
        setIsUpdating(false);
        return;
      }

      // Split full name into first and last name
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
        walletAddress: formData.walletAddress || "" // Use formData se
      };

      console.log("Sending to API:", JSON.stringify(requestData, null, 2));

      const response = await apiClient.put('/Auth/UpdateProfile', requestData);

      console.log("API Response:", response.data);

      if (response.data?.result === "true" || response.data?.result === true ||
        response.data?.response === true || response.data?.response === "true") {

        toast.success("✅ Profile updated successfully!");

        // Update localStorage with new data
        localStorage.setItem("userName", formData.fullName);
        localStorage.setItem("userEmail", formData.emailId);
        if (formData.walletAddress) {
          localStorage.setItem("walletAddress", formData.walletAddress);
        }

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("❌ Update failed: " + (response.data?.message || "Unknown error"));
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
      <div className="text-center p-5">
        <div className="spinner-border text-primary"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="body-wrapper">
      <Toast />
      <div className="container">
        <div className="row mt-4">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-body">
                  <h4 className="mb-4">Profile Information</h4>

                  <div className="mb-3">
                    <label>Login ID</label>
                    <input style={{ color: "green" }}
                      type="text"
                      value={formData.loginId}
                      className="form-control bg-light"
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="form-control"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="mb-3">
                    <label>Email ID *</label>
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleChange}
                      className="form-control"
                      required
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="form-control"
                      required
                      placeholder="Enter your mobile number"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                    />
                  </div>

                  {/* Wallet Address - Always Show */}
                  <div className="mb-3">
                    <label>Income Payout Wallet Address</label>
                    <input
                      type="text"
                      name="walletAddress"
                      value={formData.walletAddress || ""}
                      onChange={handleChange}
                      className="form-control"
                      style={{ color: formData.walletAddress ? "green" : "#999" }}
                      placeholder="Enter your wallet address"
                    />
                    <small className="text-muted">Enter your income payout wallet address</small>
                  </div>

                  <div className="mb-3">
                    <label>Token Payout Address</label>
                    <input
                      type="text"
                      placeholder='Enter Token Addresh'
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  {/* <div className="mb-3">
                    <label>Login Password</label>
                    <div className="input-group">
                      <input
                        type={showMasterPassword ? "text" : "password"}
                        name="masterPassword"
                        placeholder="Enter your password "
                        value={formData.masterPassword}
                        onChange={handleChange}
                        className="form-control"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowMasterPassword(!showMasterPassword)}
                      >
                        <i className={showMasterPassword ? "ti ti-eye-off" : "ti ti-eye"}></i>
                      </button>
                    </div>
                  </div> */}

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        UPDATING...
                      </>
                    ) : (
                      "UPDATE PROFILE"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;