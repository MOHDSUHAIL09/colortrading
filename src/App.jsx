import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import DashboardLayout from './layouts/DashboardLayout';
import LandingLayout from './layouts/LandingLayout';

const AppRoutes = () => {
  const { isAuthenticated } = useUser();

  console.log("🔍 isAuthenticated:", isAuthenticated);



  return (
    <Routes>
      {/* ✅ Agar authenticated hai toh dashboard, nahi toh landing */}
      <Route 
        path="/*" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingLayout />} 
      />
      
      {/* ✅ Dashboard routes - sirf authenticated users ke liye */}
      <Route 
        path="/dashboard/*" 
        element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/" replace />} 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App;