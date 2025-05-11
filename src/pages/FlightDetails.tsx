import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlights } from '../contexts/FlightContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Clock, 
  Calendar, 
  Users, 
  CreditCard, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  ChevronLeft 
} from 'lucide-react';

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFlight, updateFlightPrice } = useFlights();
  const { currentUser } = useAuth();
  const [passengers, setPassengers] = useState(1);
  const [flight, setFlight] = useState(getFlight(id || ''));
  const [isPriceIncreased, setIsPriceIncreased] = useState(false);
  
  useEffect(() => {
    // If flight not found, redirect to search page
    if (!flight) {
      navigate('/search');
      return;
    }
    
    // Check if price is increased
    setIsPriceIncreased(flight.price > flight.originalPrice);
  }, [flight, navigate]);
  
  const handleProceedToCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Update flight price based on booking attempts
    const updatedFlight = updateFlightPrice(id || '');
    if (updatedFlight) {
      setFlight(updatedFlight);
      
      // Check if price has increased
      if (updatedFlight.price > updatedFlight.originalPrice && !isPriceIncreased) {
        setIsPriceIncreased(true);
        
        // Return early to show price increase warning
        return;
      }
    }
    
    // Proceed to checkout
    navigate(`/checkout/${id}`);
  };
  
  if (!flight) {
    return null; // Will redirect via useEffect
  }
  
  const totalPrice = flight.price * passengers;
  const formattedDate = new Date(flight.date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to results
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Flight Header */}
        <div className="bg-blue-600 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">{flight.airline} {flight.flightNumber}</h1>
          <div className="flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {/* Flight Details */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <h2 className="text-gray-500 text-sm mb-1">Departure</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{flight.departureTime}</span>
                <span className="ml-2 text-lg text-gray-600">{flight.from}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-24 md:w-48 h-0.5 bg-gray-300 relative">
                <div className="absolute w-2 h-2 bg-gray-500 rounded-full -mt-[3px]"></div>
                <div className="absolute w-2 h-2 bg-gray-500 rounded-full -mt-[3px] right-0"></div>
                <div className="absolute left-1/2 -translate-x-1/2 -mt-6 text-xs text-gray-500">
                  {flight.duration}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-gray-500 text-sm mb-1">Arrival</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{flight.arrivalTime}</span>
                <span className="ml-2 text-lg text-gray-600">{flight.to}</span>
              </div>
            </div>
          </div>
          
          <hr className="my-8" />
          
          {/* Price and Booking Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Price Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Base Fare</span>
                  <span>₹{flight.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Passengers</span>
                  <span>x {passengers}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              {isPriceIncreased && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-r-lg">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm text-yellow-700">
                        Price increased due to high demand for this flight. Book now to secure your seat!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 md:mt-0 w-full md:w-auto">
              <div className="mb-4">
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Passengers
                </label>
                <select
                  id="passengers"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="input w-full md:w-48"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="btn btn-primary w-full py-3 mb-3"
              >
                Proceed to Checkout
              </button>
              
              <div className="text-center text-sm text-gray-500">
                {/* <div className="flex items-center justify-center mb-1">
                  <Shield className="h-4 w-4 mr-1 text-green-500" />
                  <span>Secure payment</span>
                </div> */}
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Easy cancellation</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Flight Information */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Flight Information</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Airline</h3>
                <p className="font-medium">{flight.airline}</p>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Flight Number</h3>
                <p className="font-medium">{flight.flightNumber}</p>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Duration</h3>
                <p className="font-medium">{flight.duration}</p>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Aircraft</h3>
                <p className="font-medium">Boeing 737-800</p>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Class</h3>
                <p className="font-medium">Economy</p>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Baggage</h3>
                <p className="font-medium">15kg Check-in, 7kg Cabin</p>
              </div>
            </div>
          </div>
          
          {/* Policies and Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Important Information</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-blue-700">
                    Please arrive at the airport at least 2 hours before the scheduled departure time.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium mb-2">Cancellation Policy</h3>
              <p className="text-gray-600 text-sm mb-4">
                Cancellations made 24 hours before departure are eligible for a full refund.
                Cancellations made within 24 hours of departure are subject to a 10% fee.
              </p>
              
              <h3 className="font-medium mb-2">Check-in Information</h3>
              <p className="text-gray-600 text-sm">
                Online check-in opens 24 hours before departure and closes 2 hours before the scheduled departure time.
                Airport check-in counters close 45 minutes before departure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;