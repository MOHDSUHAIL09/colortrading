// src/components/ChangePassword.jsx
import { useState } from 'react';
import apiClient from '../../../api/apiClient';


const ChangePassword = () => {
  const regno = sessionStorage.getItem('Regno');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleUpdatePassword = async () => {
    if (loading) return;

    if (!currentPassword) {
      showToast('Please enter current password', 'error');
      return;
    }
    if (!newPassword) {
      showToast('Please enter new password', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    if (currentPassword === newPassword) {
      showToast('New password cannot be same as current password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.put('/Auth/UpdatePassword', {
        regno: regno,
        password: newPassword
      });

      const isSuccess = response.data?.result === "true" || response.data?.result === true;

      if (isSuccess) {
        const successMsg = response.data?.response || 'Password updated successfully!';
        showToast(`${successMsg}`, 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorMsg = response.data?.message || response.data?.response || 'Password update failed';
        showToast(`${errorMsg}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMsg = 'Failed to update password';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.response) {
        errorMsg = error.response.data.response;
      } else if (error.message) {
        errorMsg = error.message;
      }
      showToast(`${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password change cancelled', 'info');
  };

  const isUpdateDisabled = loading || !currentPassword || !newPassword || !confirmPassword ||
    newPassword !== confirmPassword || newPassword.length < 8;

  return (
    <>
      {/* ===== CUSTOM TOAST ===== */}
      {toast.show && (
        <div className={`cp-toast cp-toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="cp-page">

        {/* ===== HEADER CARD ===== */}
        <div className="dh-header-card">
          <div className="dh-header-icon">
            <i className="ti ti-lock"></i>
          </div>
          <div className="dh-header-texts">
            <h2>Change Password</h2>
            <p>Update your account password securely</p>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="cp-card">
              <div className="cp-card-body">

                {/* Current Password */}
                <div className="cp-form-group">
                  <label className="cp-label">Current Password</label>
                  <div className="cp-input-wrap">
                    <i className="ti ti-lock cp-input-icon"></i>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="cp-input"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="cp-form-group">
                  <label className="cp-label">New Password</label>
                  <div className="cp-input-wrap">
                    <i className="ti ti-key cp-input-icon"></i>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 8 characters)"
                      className="cp-input"
                    />
                  </div>
                  {newPassword && newPassword.length < 8 && (
                    <small className="cp-hint cp-hint-error">
                      <i className="ti ti-alert-circle"></i> Password must be at least 8 characters
                    </small>
                  )}
                  {newPassword && newPassword.length >= 8 && (
                    <small className="cp-hint cp-hint-success">
                      <i className="ti ti-check"></i> Password strength: Good
                    </small>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="cp-form-group">
                  <label className="cp-label">Confirm New Password</label>
                  <div className="cp-input-wrap">
                    <i className="ti ti-shield-check cp-input-icon"></i>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="cp-input"
                    />
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <small className="cp-hint cp-hint-error">
                      <i className="ti ti-alert-circle"></i> Passwords do not match
                    </small>
                  )}
                  {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                    <small className="cp-hint cp-hint-success">
                      <i className="ti ti-check"></i> Passwords match
                    </small>
                  )}
                </div>

                {/* Submit */}
                <div className="cp-btn-row">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isUpdateDisabled}
                    className="cp-submit-btn"
                  >
                    {loading ? (
                      <>
                        <span className="cp-spinner"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-device-floppy"></i>
                        Update Password
                      </>
                    )}
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

export default ChangePassword;