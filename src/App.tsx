
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlightSearch from './pages/FlightSearch';
import FlightDetails from './pages/FlightDetails';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import PrivateRoute from './components/auth/PrivateRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<FlightSearch />} />
          <Route path="/flight/:id" element={<FlightDetails />} />
          <Route path="/checkout/:id" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="/confirmation/:id" element={
            <PrivateRoute>
              <BookingConfirmation />
            </PrivateRoute>
          } />
          <Route path="/bookings" element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;