import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  IconHome,
  IconDeviceImacDollar,
  IconReplaceUser,
  IconCreditCardRefund,
  IconHistory,
  IconUsersGroup,
  IconBinaryTree2,
  IconAward,
  IconPower
} from '@tabler/icons-react';
import { RiRobot2Fill, RiRobot2Line } from "react-icons/ri";
import { RiHandCoinFill } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";
import dashboardlogo from '../../assets/images/logo/dashboardlogo.png'
import { useUser } from '../../context/UserContext';

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

  // Close sidebar when clicking on link in mobile
  const handleLinkClick = () => {
    if (window.innerWidth <= 992 && closeMobileSidebar) {
      closeMobileSidebar();
    }
  };



  const handleLogout = () => {
    logoutUser();
    navigate('/');


  };

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`left-sidebar with-vertical ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div>
        {/* Brand Logo */}
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <Link to="/" className="text-nowrap logo-img" onClick={handleLinkClick}>
            <img
              src={dashboardlogo}
              alt="Logo-Dark"
              className="dark-logo"
              style={{ width: "180px" }}
            />
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
            {/* Dashboard Items */}
            <li className="sidebar-item mt-3">
              <Link
                className={`sidebar-link ${isActive('./dashboard') ? 'active' : ''}`}
                to="/dashboard"
                onClick={handleLinkClick}
              >
                <span><IconHome stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Home</span>}
              </Link>
            </li>

            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/Subscription') ? 'active' : ''}`}
                to="/dashboard/DepositFund"
                onClick={handleLinkClick}
              >
                <span style={{ fontSize: "19px" }}><FaWallet stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Deposit Fund</span>}
              </Link>
            </li>

            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/DepositHistory') ? 'active' : ''}`}
                to="/dashboard/DepositHistory"
                onClick={handleLinkClick}
              >
                <span><IconHistory stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Deposit History</span>}
              </Link>
            </li>

            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/InvestFund') ? 'active' : ''}`}
                to="/dashboard/InvestFund"
                onClick={handleLinkClick}
              >
                <span><IconDeviceImacDollar stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Invest</span>}
              </Link>
            </li>

            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/DepositHistory') ? 'active' : ''}`}
                to="/dashboard/InvestmentHistory"
                onClick={handleLinkClick}
              >
                <span><IconHistory stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Investment History</span>}
              </Link>
            </li>

            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/Subscription') ? 'active' : ''}`}
                to="/dashboard/BotTreading"
                onClick={handleLinkClick}
              >
                <span><RiRobot2Line stroke={2} style={{ fontSize: "23px" }} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Bot Status</span>}
              </Link>
            </li>

            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/SelfTradingHistory') ? 'active' : ''}`}
                to="/dashboard/BotTradingHistory"
                onClick={handleLinkClick}
              >
                <span><IconHistory stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Bot Status History</span>}
              </Link>
            </li>

                        <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('PayOutHistory') ? 'active' : ''}`}
                to="/dashboard/PayOutHistory"
                onClick={handleLinkClick}
              >
                <span><IconHistory stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Income Payout History</span>}
              </Link>
            </li>



            <li className="sidebar-item ms-1 ">
              <Link
                className={`sidebar-link ${isActive('/InvestFund') ? 'active' : ''}`}
                to="/dashboard/InvestToken"
                onClick={handleLinkClick}
              >
                <span style={{ fontSize: "19px" }}><RiHandCoinFill stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Token Mining</span>}
              </Link>
            </li>

            <li className="sidebar-item ms-1 ">
              <Link
                className={`sidebar-link ${isActive('/InvestTokenHistory') ? 'active' : ''}`}
                to="/dashboard/InvestTokenHistory"
                onClick={handleLinkClick}
              >
                <span style={{ fontSize: "20px" }}><IconHistory stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Token Mining History</span>}
              </Link>
            </li>
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/TokenMiningIncomeHistory') ? 'active' : ''}`}
                to="/dashboard/TokenMiningIncomeHistory"
                onClick={handleLinkClick}
              >
                <span><IconHistory stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Token Mining Income </span>}
              </Link>
            </li>


            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/Fundtransfer') ? 'active' : ''}`}
                to="/dashboard/Fundtransfer"
                onClick={handleLinkClick}
              >
                <span><IconReplaceUser stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Fund Transfer</span>}
              </Link>
            </li>


            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('PayOutHistory') ? 'active' : ''}`}
                to="/dashboard/SelfPayoutHistory"
                onClick={handleLinkClick}
              >
                <span><IconHistory stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Self Payout History </span>}
              </Link>
            </li>

            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/IncomeReport') ? 'active' : ''}`}
                to="/dashboard/IncomeReport"
                onClick={handleLinkClick}
              >
                <span><IconHistory stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Income History</span>}
              </Link>
            </li>

                   <li className="sidebar-item ms-1 ">
              <Link
                className={`sidebar-link ${isActive('/InvestFund') ? 'active' : ''}`}
                to="/dashboard/SocalMediaTask"
                onClick={handleLinkClick}
              >
                <span><FaExternalLinkAlt stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Socal Media Task</span>}
              </Link>
            </li>

          
            {/* Downline Team */}
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/downline-team') ? 'active' : ''}`}
                to="/dashboard/downline-team"
                onClick={handleLinkClick}
              >
                <span><IconUsersGroup stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Downline Team</span>}
              </Link>
            </li>

            {/* Tree View */}
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isActive('/tree-view') ? 'active' : ''}`}
                to="/dashboard/tree-view"
                onClick={handleLinkClick}
              >
                <span><IconBinaryTree2 stroke={2} /></span>
                {(!sidebarCollapsed || window.innerWidth <= 992) && <span className="hide-menu">Tree View</span>}
              </Link>
            </li>
     
            {/* Fixed Profile Section */}
            <div className={`fixed-profile ${(!sidebarCollapsed || window.innerWidth <= 992) ? '' : 'collapsed-profile'}`}>
              <div className="hstack gap-3">
                <div className="john-img">
                  <img
                    src='https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg'
                    className="rounded-circle"
                    width="45px"
                    height="45px"
                    alt="profile"
                  />
                </div>
                {(!sidebarCollapsed || window.innerWidth <= 992) && (
                  <>
                    <div className="john-title">
                      <h6 className="mb-0 text-dark amount-report">{userData?.fname}</h6>
                      <span className="" style={{ fontSize: "18px" }}>{userData?.loginid}</span>
                    </div>
                    <div
                      className="border-0 bg-transparent text-primary ms-auto"
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
    </aside>
  );
};

export default Sidebar;