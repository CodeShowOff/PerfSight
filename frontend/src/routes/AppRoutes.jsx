import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardLayout from '../layout/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import ServiceDetails from '../pages/ServiceDetails';
import Reports from '../pages/Reports';
import Baselines from '../pages/Baselines';
import Perf from '../pages/Perf';
import PrivateRoute from '../components/PrivateRoute';
import useScrollToTop from '../hooks/useScrollToTop';

const RouteScrollManager = () => {
  useScrollToTop();
  return null;
};

const AppRoutes = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteScrollManager />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Protected Routes - Profile outside dashboard */}
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>

        {/* Protected Dashboard Routes with Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/service/:service" element={<ServiceDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/baselines" element={<Baselines />} />
            <Route path="/perf" element={<Perf />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
