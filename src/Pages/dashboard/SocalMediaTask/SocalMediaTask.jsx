// SocalMediaTask.jsx
import { useState } from 'react';
import './SocalMediaTask.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import toast from 'react-hot-toast';
import Toast from '../../../Componenets/ui/Toast';

const SocalMediaTask = () => {
  const [formData, setFormData] = useState({
    url: '',
    appName: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHistoryClick = () => {
    navigate('/dashboard/SocalMediaTaskHistory');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.url || !formData.appName) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    const regno = sessionStorage.getItem('Regno');

    if (!regno) {
      toast.error('Registration number not found');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/Dashboard/SocialTask', {
        regno: parseInt(regno),
        url: formData.url,
        appName: formData.appName
      });

      const data = response.data;

      if (data.result === "true" || data.result === true) {
        toast.success(data.message || 'Url saved successfully');
        setFormData({ url: '', appName: '' });
      } else {
        toast.error(data.message || 'Something went wrong');
      }

    } catch (err) {
      console.error('Error submitting:', err);
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast />

      <div className="social-task-container">

        {/* ===== HEADER CARD ===== */}
        <div className="dh-header-card">
          <div className="dh-header-icon">
            <i className="ti ti-share"></i>
          </div>
          <div className="dh-header-texts">
            <h2>Social Media Task</h2>
            <p>Submit your social media task URL to earn rewards</p>
          </div>
        </div>

        {/* ===== FORM CARD ===== */}
        <div className="st-form-card">

          {/* Header */}
          <div className="st-form-header">
            <h3>Submit Task</h3>
            <button className="st-history-btn" onClick={handleHistoryClick}>
              <i className="ti ti-history"></i>
              <span>History</span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="st-form-body">

            {/* URL Field */}
            <div className="st-form-group">
              <label className="st-label">
                <i className="ti ti-link"></i> URL Link
              </label>
              <input
                type="url"
                name="url"
                className="st-input"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>

            {/* App Name Field */}
            <div className="st-form-group">
              <label className="st-label">
                <i className="ti ti-apps"></i> App Name
              </label>
              <input
                type="text"
                name="appName"
                className="st-input"
                value={formData.appName}
                onChange={handleChange}
                placeholder="Enter app name"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="st-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="st-loading">
                  <span className="st-spinner"></span>
                  Submitting...
                </span>
              ) : (
                <>
                  Submit Task
                  <i className="ti ti-arrow-right"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SocalMediaTask;