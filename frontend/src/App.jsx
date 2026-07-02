import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookReservation from './pages/BookReservation';
import MyReservations from './pages/MyReservations';
import ManageTables from './pages/ManageTables';
import NotFound from './pages/NotFound';

const App = () => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect root based on auth/role
  const getHomeRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={getHomeRedirect()} />

          {/* Auth pages */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
              ) : (
                <RegisterPage />
              )
            }
          />

          {/* Customer routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book"
            element={
              <ProtectedRoute roles={['customer']}>
                <BookReservation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reservations"
            element={
              <ProtectedRoute roles={['customer']}>
                <MyReservations />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <ProtectedRoute roles={['admin']}>
                <ManageTables />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
