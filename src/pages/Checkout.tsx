import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlights } from '../contexts/FlightContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {
  CreditCard,
  Calendar,
  Lock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFlight } = useFlights();
  const { currentUser, userData, updateUserWallet } = useAuth();

  const [flight, setFlight] = useState(getFlight(id || ''));
  const [passengers, setPassengers] = useState(1);
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo>({
    firstName: '',
    lastName: '',
    email: currentUser?.email || '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // If flight not found, redirect to search page
    if (!flight) {
      navigate('/search');
    }
  }, [flight, navigate]);

  const totalPrice = flight ? flight.price * passengers : 0;
  const walletBalance = userData?.wallet?.balance ?? 50000;
  const hasEnoughBalance = walletBalance >= totalPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'passengers') {
      setPassengers(parseInt(value));
    } else {
      setPassengerInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (!passengerInfo.firstName || !passengerInfo.lastName || !passengerInfo.email || !passengerInfo.phone) {
      toast.error('Please fill in all passenger details');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passengerInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(passengerInfo.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    if (!hasEnoughBalance) {
      toast.error('Insufficient wallet balance for this booking');
      return false;
    }

    return true;
  };

  const handleBookFlight = async () => {
    if (!validateForm() || !flight || !currentUser) return;

    try {
      setIsLoading(true);
      setIsProcessingPayment(true);

      // Generate booking ID
      const bookingId = uuidv4();

      // Create booking object
      const booking = {
        id: bookingId,
        userId: currentUser.uid,
        flightId: flight.id,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: flight.from,
        to: flight.to,
        date: flight.date,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: flight.duration,
        passengers,
        passengerInfo,
        totalAmount: totalPrice,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        paymentStatus: 'completed'
      };

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save booking to Firestore
      await setDoc(doc(db, 'bookings', bookingId), booking);

      // Update user wallet
      await updateUserWallet(
        totalPrice,
        'debit',
        `Flight booking: ${flight.airline} ${flight.flightNumber} (${flight.from} to ${flight.to})`
      );

      // Navigate to confirmation page
      navigate(`/confirmation/${bookingId}`);

    } catch (error) {
      console.error('Error booking flight:', error);
      toast.error('An error occurred while processing your booking. Please try again.');
    } finally {
      setIsLoading(false);
      setIsProcessingPayment(false);
    }
  };

  if (!flight) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to flight details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {/* Flight Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">{flight.airline} {flight.flightNumber}</h2>
                <span className="text-blue-600">{new Date(flight.date).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{flight.departureTime}</span>
                  <span className="mx-1 text-gray-500">{flight.from}</span>
                </div>

                <div className="text-gray-400">→</div>

                <div>
                  <span className="font-medium">{flight.arrivalTime}</span>
                  <span className="mx-1 text-gray-500">{flight.to}</span>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Passenger Information</h2>

              <div className="mb-4">
                <label htmlFor="passengers" className="form-label">Number of Passengers</label>
                <select
                  id="passengers"
                  name="passengers"
                  value={passengers}
                  onChange={handleInputChange}
                  className="input"
                  disabled={isLoading}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={passengerInfo.firstName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="First Name"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={passengerInfo.lastName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Last Name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={passengerInfo.email}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Email Address"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={passengerInfo.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="10-digit phone number"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                <CreditCard className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Pay from Wallet</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Current Balance: ₹{walletBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {!hasEnoughBalance && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="text-sm text-red-700">
                        Insufficient wallet balance. Please add funds to continue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center mb-6">
                <Lock className="h-4 w-4 text-green-600 mr-2" />
                <p className="text-sm text-gray-600">Your payment information is secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Fare ({passengers} {passengers === 1 ? 'passenger' : 'passengers'})</span>
                <span>₹{flight.price.toLocaleString()} x {passengers}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Taxes & Fees</span>
                <span>Included</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleBookFlight}
              disabled={isLoading || !hasEnoughBalance}
              className={`btn w-full py-3 flex items-center justify-center ${isLoading || !hasEnoughBalance ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'
                }`}
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Booking
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By clicking "Confirm Booking", you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;