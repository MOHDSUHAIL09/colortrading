import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  IconHome,
  IconDeviceImacDollar,
  IconReplaceUser,
  IconHistory,
  IconUsersGroup,
  IconBinaryTree2,
  IconPower,
  IconAward
} from '@tabler/icons-react';
import { RiRobot2Line } from "react-icons/ri";
import { RiHandCoinFill } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";
import { useUser } from '../../context/UserContext';
import dashboardlogo from '../../assets/images/logo/dashboardlogo.png';
import smalldashboardlogo from '../../assets/images/logo/favicon-01.png';

const Sidebar = ({ sidebarCollapsed, mobileSidebarOpen, closeMobileSidebar }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, logoutUser } = useUser();

  const toggleMenu = (menu) => {
    if (!sidebarCollapsed || window.innerWidth <= 992) {
      setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    }
  };

  useEffect(() => {
    if (sidebarCollapsed && window.innerWidth > 992) {
      setOpenMenus({});
    }
  }, [sidebarCollapsed]);

  const handleLinkClick = () => {
    if (window.innerWidth <= 992 && closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', icon: <IconHome stroke={2} />, label: 'Home' },
    { path: '/dashboard/Devdeposit', icon: <FaWallet stroke={2} />, label: 'Dev Deposit' },
    { path: '/dashboard/DepositFund', icon: <FaWallet stroke={2} />, label: 'Deposit Fund' },
    { path: '/dashboard/DepositHistory', icon: <IconHistory stroke={2} />, label: 'Deposit History' },
    { path: '/dashboard/InvestFund', icon: <IconDeviceImacDollar stroke={2} />, label: 'Invest' },
    { path: '/dashboard/InvestmentHistory', icon: <IconHistory stroke={2} />, label: 'Investment History' },
    { path: '/dashboard/BotTreading', icon: <RiRobot2Line style={{ fontSize: "23px" }} />, label: 'Bot Status' },
    { path: '/dashboard/BotTradingHistory', icon: <IconHistory stroke={2} />, label: 'Bot Status History' },
    { path: '/dashboard/InvestToken', icon: <RiHandCoinFill stroke={2} />, label: 'Token Mining' },
    { path: '/dashboard/InvestTokenHistory', icon: <IconHistory stroke={2} />, label: 'Token Mining History' },
    { path: '/dashboard/TokenMiningIncomeHistory', icon: <IconHistory stroke={2} />, label: 'Token Mining Income' },
    { path: '/dashboard/Fundtransfer', icon: <IconReplaceUser stroke={2} />, label: 'Fund Transfer' },
    { path: '/dashboard/IncomePayOutHistory', icon: <IconHistory stroke={2} />, label: 'Income Payout History' },
    { path: '/dashboard/SelfPayoutHistory', icon: <IconHistory stroke={2} />, label: 'Self Payout History' },
    { path: '/dashboard/SelfTradingHistory', icon: <IconHistory stroke={2} />, label: 'Self Trading History' },
    { path: '/dashboard/IncomeReport', icon: <IconHistory stroke={2} />, label: 'Income History' },
    { path: '/dashboard/Reward', icon: <IconAward stroke={2} />, label: 'Reward' },
    { path: '/dashboard/SocalMediaTask', icon: <FaExternalLinkAlt />, label: 'Social Media Task' },
    { path: '/dashboard/downline-team', icon: <IconUsersGroup stroke={2} />, label: 'Downline Team' },
    { path: '/dashboard/tree-view', icon: <IconBinaryTree2 stroke={2} />, label: 'Tree View' },
  ];

  const isCollapsed = sidebarCollapsed && window.innerWidth > 992;

  return (
    <aside className={`left-sidebar with-vertical ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div>
        {/* Brand Logo */}
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <Link to="/" className="text-nowrap logo-img" onClick={handleLinkClick}>
            {!isCollapsed ? (
              <img
                src={dashboardlogo}
                alt="Logo-Dark"
                className="dark-logo"
                style={{ width: "180px", transition: 'all 0.3s ease' }}
              />
            ) : (
              <img
                src={smalldashboardlogo}
                alt="Logo-Dark"
                className="dark-logo"
                style={{
                  width: "40px",
                  height: "40px",
                  transition: 'all 0.3s ease',
                  borderRadius: '8px'
                }}
              />
            )}
          </Link>

          <button
            className="mobile-close-btn d-lg-none"
            onClick={closeMobileSidebar}
          >
            <i className="ti ti-x"></i>
          </button>
        </div>

        <nav className="sidebar-nav scroll-sidebar" data-simplebar>
          <ul id="sidebarnav">
            {/* Main Menu Items */}
            {menuItems.map((item, index) => (
              <li className="sidebar-item" key={index}>
                <Link
                  className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                  to={item.path}
                  onClick={handleLinkClick}
                >
                  <span>{item.icon}</span>
                  {(!sidebarCollapsed || window.innerWidth <= 992) && (
                    <span className="hide-menu">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}

            {/* Fixed Profile Section */}
            <div className={`fixed-profile ${(!sidebarCollapsed || window.innerWidth <= 992) ? '' : 'collapsed-profile'}`}>
              <div className="hstack gap-3">
                <Link to="/dashboard/profile">
                  <div className="john-img">
                    <img
                      src='https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg'
                      className="rounded-circle"
                      width="45px"
                      height="45px"
                      alt="profile"
                    />
                  </div>
                </Link>
                {(!sidebarCollapsed || window.innerWidth <= 992) && (
                  <>
                    <div className="john-title">
                      <h6 className="mb-0 amount-report" style={{ fontWeight: '600' }}>
                        {userData?.fname}
                      </h6>
                      <span className="login-id">
                        {userData?.loginid || 'Guest'}
                      </span>
                    </div>
                    <div
                      className="logout-icon-btn ms-auto"
                      onClick={handleLogout}
                    >
                      <IconPower stroke={2} size={20} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </ul>
        </nav>
      </div>

      {/* Sidebar Styles */}
      <style>{`
        /* ===== SIDEBAR BACKGROUND - navy gradient ===== */
        .left-sidebar {
          background: var(--backtop) !important;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* ===== ACTIVE MENU ===== */
        .left-sidebar .sidebar-link.active {
          background: var(--apex-gradient) !important;
          color: #fff !important;
          box-shadow: 0 6px 18px rgba(23, 69, 245, 0.45);
          position: relative;
        }

        .left-sidebar .sidebar-link.active span,
        .left-sidebar .sidebar-link.active .hide-menu,
        .left-sidebar .sidebar-link.active svg {
          color: #fff !important;
          stroke: #fff !important;
        }

        /* ===== HOVER (non-active) - light navy glow ===== */
        .left-sidebar .sidebar-link:hover:not(.active) {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }

        .left-sidebar .sidebar-link:hover:not(.active) span,
        .left-sidebar .sidebar-link:hover:not(.active) svg {
          color: #ffffff !important;
          stroke: #ffffff !important;
        }

        /* ===== BASE ITEM ===== */
        .left-sidebar .sidebar-item {
          margin: 2px 0;
        }

        .left-sidebar .sidebar-link {
          padding: 10px 20px;
          border-radius: 10px;
          margin: 0 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #a9b7d6 !important;
          font-weight: 500;
          font-size: 14px;
        }

        .left-sidebar .sidebar-link span,
        .left-sidebar .sidebar-link svg {
          color: #a9b7d6 !important;
          transition: all 0.3s ease;
        }

        .left-sidebar .sidebar-link span:first-child {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          font-size: 18px;
        }

        .left-sidebar .hide-menu {
          font-size: 14px;
          font-weight: 500;
        }

        /* ===== PROFILE - navy background ===== */
        .fixed-profile {
          padding: 16px 20px;
          margin-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent !important;
        }

        .fixed-profile .john-img img {
          border: 2px solid rgba(255, 255, 255, 0.25);
          object-fit: cover;
        }

        .fixed-profile .john-title h6 {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff !important;
          margin-bottom: 0;
        }

        .fixed-profile .john-title .login-id {
          font-size: 13px;
          color: #a9b7d6 !important;
        }

        /* Logout button */
        .fixed-profile .logout-icon-btn {
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a9b7d6;
        }

        .fixed-profile .logout-icon-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        /* ===== BRAND LOGO ===== */
        .brand-logo {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: ${sidebarCollapsed ? 'center' : 'space-between'};
        }

        /* ===== MOBILE CLOSE ===== */
        .mobile-close-btn {
          background: transparent;
          border: none;
          font-size: 24px;
          color: #a9b7d6;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        /* Logo animation */
        .brand-logo img {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;