import { useState } from 'react';
import { FaArrowDown, FaRobot, FaShareNodes } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import QRModal from '../../Pages/dashboard/QRModal';
import smalldashboardlogo from '../../assets/images/logo/favicon-01.png';
import { FaUserAlt } from 'react-icons/fa';

const userProfileImage = "https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg";

const Header = ({ toggleSidebar }) => {

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user, userData, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const userName = userData?.fname;
  const userEmail = userData?.email || user?.email || "guest@example.com";
  const loginid = userData?.loginid || user?.loginid;

  const regno = userData?.regno || userData?.Regno || sessionStorage.getItem('regno');

  const getReferralLink = () => {
    const directId = userData?.directId || userData?.directid || regno || 'TEST123';
    return `${window.location.origin}/signup?ref=${directId}`;
  };

  const openQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  return (
    <>
      <QRModal
        isOpen={isQRModalOpen}
        onClose={closeQRModal}
        referralLink={getReferralLink()}
        userData={userData}
      />

      <div className="topbar px-4">
        <nav className="navbar navbar-expand p-0">
          <ul className="navbar-nav d-block d-sm-none">
            <li className="nav-item nav-icon-hover-bg rounded-circle ms-n2">
              <Link to="/dashboard">
                <button
                  className="nav-link sidebartoggler"
                            style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <img src={smalldashboardlogo} />
                </button>
              </Link>
            </li>
          </ul>

          {/* Left side - Menu Icon for Sidebar Toggle */}
          <ul className="navbar-nav ms-3 ms-ms-0">
            <li className="nav-item nav-icon-hover-bg rounded-circle ms-n2">
              <button
                className="nav-link sidebartoggler"
                onClick={toggleSidebar}
style={{
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  border: "none",
  background: "rgba(255, 255, 255, 0.12)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  cursor: "pointer",
  transition: "all 0.3s ease",
}}

              >
                <i className="ti ti-menu-2"></i>
              </button>
            </li>
          </ul>

          {/* Right Side Dropdowns */}
          <div className="d-flex align-items-center ms-auto">
            <ul className="navbar-nav flex-row align-items-center" style={{ flexDirection: 'row', display: 'flex' }}>

              <a href="/ApexmindAI.apk" download>
                <li className="nav-item">
                  <div
                    className="btn01"
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(255, 255, 255, 0.12)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <FaArrowDown />
                  </div>
                </li>
              </a>

              {/* Share Button */}
              <li className="nav-item">
                <div
                  onClick={openQRModal}
                  className="btn01"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255, 255, 255, 0.12)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <FaShareNodes />
                </div>
              </li>

              {/* Profile Dropdown */}
              <li className="nav-item dropdown">
                <button
                  className="pe-0"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="d-flex align-items-center"
                                    style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255, 255, 255, 0.12)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  >
                   
                    
  
                      {/* <img
                        src={userProfileImage}
                        className="rounded-circle"
                        width="45"
                        height="45"
                        alt="profile"
                      /> */}
                      <FaUserAlt />
             
                  </div>
                </button>

           {profileDropdownOpen && (
  <>
    {/* Backdrop */}
    <div
      className="dropdown-backdrop"
      onClick={() => setProfileDropdownOpen(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1040,
      }}
    />

    {/* Dropdown Menu */}
    <div
      className="dropdown-menu show dropdown-menu-end topbar-dropdown"
      style={{
        position: window.innerWidth < 576 ? 'fixed' : 'absolute',
        top: window.innerWidth < 576 ? '70px' : '100%',
        right: window.innerWidth < 576 ? '10px' : '0',
        left: window.innerWidth < 576 ? '10px' : 'auto',
        width: window.innerWidth < 576 ? 'calc(100vw - 20px)' : '360px',
        maxWidth: '400px',
        maxHeight: window.innerWidth < 576 ? 'calc(100vh - 100px)' : 'auto',
        overflowY: window.innerWidth < 576 ? 'auto' : 'visible',
        display: 'block',
        zIndex: 1050,
        borderRadius: window.innerWidth < 576 ? '16px' : '14px',
        padding: 0,
      }}
    >
      <div className="profile-dropdown position-relative" data-simplebar>

        {/* ===== User Info ===== */}
        <div className="td-user-info">
          {/* <img
            src={userProfileImage}
            className="rounded-circle"
            width={window.innerWidth < 576 ? "60" : "72"}
            height={window.innerWidth < 576 ? "60" : "72"}
            alt="profile"
          /> */}
          <FaUserAlt className='rounded-circle' style={{fontSize: "45px"}}/>
          <div className="td-user-texts">
            <h5 className="td-user-name">{userName || 'User'}</h5>
            {loginid && (
              <span className="td-user-loginid">
                Login Id: <span className="td-loginid-value">{loginid}</span>
              </span>
            )}
            <div className="td-user-email">
              <i className="ti ti-mail"></i>
              <span>{userEmail}</span>
            </div>
          </div>
        </div>

        {/* ===== Menu Items ===== */}
        <div className="td-menu-body">

          <Link
            to="/dashboard/changepassword"
            className="td-menu-item"
            onClick={() => setProfileDropdownOpen(false)}
          >
            <span className="td-menu-icon">
              <i className="ti ti-lock"></i>
            </span>
            <div className="td-menu-text">
              <h6>Change Password</h6>
            </div>
          </Link>

          <Link
            to="/dashboard/support"
            className="td-menu-item"
            onClick={() => setProfileDropdownOpen(false)}
          >
            <span className="td-menu-icon">
              <i className="ti ti-headset"></i>
            </span>
            <div className="td-menu-text">
              <h6>Support</h6>
            </div>
          </Link>

          <Link
            to="/dashboard/profile"
            className="td-menu-item"
            onClick={() => setProfileDropdownOpen(false)}
          >
            <span className="td-menu-icon">
              <i className="ti ti-user-circle"></i>
            </span>
            <div className="td-menu-text">
              <h6>Profile</h6>
            </div>
          </Link>
        </div>

        {/* ===== Footer — Upgrade + Logout ===== */}
        <div className="td-footer">

          <div className="td-upgrade-box">
            <div className="td-upgrade-content">
              <h5>Max Invest $5000</h5>
              <Link to="/dashboard/InvestFund">
                <button className="td-upgrade-btn">Invest</button>
              </Link>
            </div>
            <img
              src="https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/backgrounds/unlimited-bg.png"
              alt="unlimited"
              className="td-upgrade-img"
            />
          </div>

          <button className="td-logout-btn" onClick={handleLogout}>
            <i className="ti ti-logout"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  </>
)}
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* ===== TOPBAR STYLES ===== */}
      <style>{`
        /* Topbar background with your --backtop gradient */
        .topbar {
          background: var(--backtop) !important;
          background: linear-gradient(90deg, #071542 0%, #0d1f5c 50%, #071542 100%) !important;
          box-shadow: 0 2px 12px rgba(7, 21, 66, 0.25);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* Menu toggle icon (hamburger) - white */
        .topbar .sidebartoggler i {
          color: #ffffff !important;
          font-size: 22px;
          transition: all 0.3s ease;
        }

        .topbar .sidebartoggler:hover i {
          color: #7fa8ff !important;
        }

        /* Hover effect on topbar circle buttons */
        .topbar .btn01:hover {
          background: rgba(255, 255, 255, 0.22) !important;
          transform: translateY(-1px);
        }

        /* Mobile logo area */
        .topbar .navbar-nav img {
          filter: brightness(0) invert(1);
        }

        /* User profile image hover */
        .topbar .user-profile-img img {
          transition: all 0.3s ease;
        }

        .topbar .user-profile-img img:hover {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
        }
      `}</style>
    </>
  );
};

export default Header;