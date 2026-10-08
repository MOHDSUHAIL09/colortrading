import { Routes, Route } from 'react-router-dom';
import Home from '../Componenets/landing/Home';
import Auth from '../Componenets/authComponent/Auth';
import Dashboard from '../Pages/dashboard/Dashboard';

const LandingLayout = () => {
  return (
    <>
      <main className="landing-main">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ✅ key lagayi — URL change pe Auth fresh mount hoga */}
          <Route path="/login" element={<Auth key="login-view" />} />
          <Route path="/signup" element={<Auth key="signup-view" />} />

          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </>
  );
};

export default LandingLayout;