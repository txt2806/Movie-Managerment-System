import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthController } from './hooks/useAuthController';
import Navbar from './components/Navbar';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import MovieForm from './pages/MovieForm';
import Login from './pages/Login';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import Management from './pages/Management';
import './App.css';

// Component to protect authenticated routes
function ProtectedRoute({ children, requiredRole }) {
  const { session, checkAuthentication } = useAuthController();
  const isLoggedIn = checkAuthentication();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && session?.role !== requiredRole) {
    // If user tries to access admin stuff but is not admin
    return <Navigate to="/movies" replace />;
  }

  return children;
}

// Component to protect auth page (login) from already authenticated users
function GuestRoute({ children }) {
  const { checkAuthentication } = useAuthController();
  const isLoggedIn = checkAuthentication();

  if (isLoggedIn) {
    return <Navigate to="/movies" replace />;
  }

  return children;
}

function App() {
  const { checkAuthentication } = useAuthController();
  const isLoggedIn = checkAuthentication();

  return (
    <div className="app-container">
      {isLoggedIn && <Navbar />}
      <main className={isLoggedIn ? "main-content" : "main-content auth-layout"}>
        <Routes>
          {/* Guest routes */}
          <Route 
            path="/login" 
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } 
          />

          {/* User & Admin authenticated routes */}
          <Route 
            path="/movies" 
            element={
              <ProtectedRoute>
                <MovieList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/movies/:id" 
            element={
              <ProtectedRoute>
                <MovieDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/:movieId" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            } 
          />

          {/* Admin-only authenticated routes */}
          <Route 
            path="/management" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Management />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add" 
            element={
              <ProtectedRoute requiredRole="admin">
                <MovieForm isEdit={false} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute requiredRole="admin">
                <MovieForm isEdit={true} />
              </ProtectedRoute>
            } 
          />

          {/* Wildcard redirects */}
          <Route path="*" element={<Navigate to="/movies" replace />} />
        </Routes>
      </main>
      {isLoggedIn && (
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} CineSphere. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
