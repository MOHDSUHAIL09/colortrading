// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import DashboardLayout from './layouts/DashboardLayout';
import LandingLayout from './layouts/LandingLayout';
import { ToastContainer } from 'react-toastify';

const AppRoutes = () => {
  const { isAuthenticated } = useUser();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* Dashboard tree — protected */}
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}
        />

        {/* Everything else — landing/auth pages */}
        <Route
          path="/*"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingLayout />}
        />
      </Routes>
    </>
  );
};

const App = () => (
  <UserProvider>
     <AppRoutes />
  </UserProvider>
);

export default App;