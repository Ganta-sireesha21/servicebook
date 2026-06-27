import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminServiceManagementPage from './pages/AdminServicesPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import Layout from './layouts/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:id" element={<ServiceDetailsPage />} />
          <Route path="booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
          <Route path="payment/cancel" element={<ProtectedRoute><PaymentCancelPage /></ProtectedRoute>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="payments" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="admin/services" element={<AdminRoute><AdminServiceManagementPage /></AdminRoute>} />
          <Route path="admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
