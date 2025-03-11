import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ListingDetail from './pages/ListingDetail';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/user/Profile';
import Reservations from './pages/user/Reservations';
import Messages from './pages/user/Messages';
import Notifications from './pages/user/Notifications';
import Favorites from './pages/user/Favorites';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';
import AdminJobs from './pages/admin/AdminJobs';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReservations from './pages/admin/AdminReservations';
import AdminPayments from './pages/admin/AdminPayments';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSupport from './pages/admin/AdminSupport';
import AdminReviews from './pages/admin/AdminReviews';
import AdminStatus from './pages/admin/AdminStatus';
import AdminSettings from './pages/admin/AdminSettings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ToastProvider } from "@/components/ui/use-toast"
import AppInitializer from './components/auth/AppInitializer';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppInitializer />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          
          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute isAdminRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/listings" element={<ProtectedRoute isAdminRoute><AdminListings /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute isAdminRoute><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute isAdminRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/reservations" element={<ProtectedRoute isAdminRoute><AdminReservations /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute isAdminRoute><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute isAdminRoute><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/support" element={<ProtectedRoute isAdminRoute><AdminSupport /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute isAdminRoute><AdminReviews /></ProtectedRoute>} />
          <Route path="/admin/status" element={<ProtectedRoute isAdminRoute><AdminStatus /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute isAdminRoute><AdminSettings /></ProtectedRoute>} />
          
          {/* User routes */}
          <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/user/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
          <Route path="/user/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/user/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/user/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
