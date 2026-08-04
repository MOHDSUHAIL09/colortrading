import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import DashboardLayout from './layouts/DashboardLayout';
import LandingLayout from './layouts/LandingLayout';

const AppRoutes = () => {
  const { isAuthenticated } = useUser();
  return (
    <Routes>
      <Route 
        path="/*" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingLayout />} 
      />
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