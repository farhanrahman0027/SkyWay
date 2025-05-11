import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Download, ArrowRight, ChevronLeft } from 'lucide-react';
import { generateTicketPDF } from '../utils/pdfGenerator';

interface BookingDetails {
  id: string;
  flightId: string;
  flightNumber: string;
  airline: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  passengers: number;
  passengerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  status: string;
  bookingDate: string;
}

const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchBooking = async () => {
      if (!id || !currentUser) return;
      
      try {
        const bookingRef = doc(db, 'bookings', id);
        const bookingDoc = await getDoc(bookingRef);
        
        if (bookingDoc.exists()) {
          const bookingData = bookingDoc.data() as BookingDetails;
          
          // Verify that this booking belongs to the current user
          if (bookingData.userId === currentUser.uid) {
            setBooking(bookingData);
          } else {
            setError('You do not have permission to view this booking');
          }
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [id, currentUser]);
  
  const handleDownloadTicket = () => {
    if (!booking) return;
    
    generateTicketPDF({
      id: booking.id,
      airline: booking.airline,
      flightNumber: booking.flightNumber,
      from: booking.from,
      to: booking.to,
      departureTime: booking.departureTime,
      arrivalTime: booking.arrivalTime,
      date: booking.date,
      passengerName: `${booking.passengerInfo.firstName} ${booking.passengerInfo.lastName}`,
      status: booking.status,
      bookingDate: booking.bookingDate,
      totalAmount: booking.totalAmount
    });
  };
  
  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading booking details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-xl mx-auto rounded-r-lg">
          <p className="text-red-700">{error}</p>
          <Link to="/search" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Go to flight search
          </Link>
        </div>
      </div>
    );
  }
  
  if (!booking) {
    return null;
  }
  
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="container-custom py-8">
      <Link to="/bookings" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        View all bookings
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 p-6 text-center border-b border-green-100">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
            <p className="text-green-700">
              Your booking has been confirmed. A confirmation email has been sent to {booking.passengerInfo.email}.
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Booking Details</h2>
              <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Booking ID: {booking.id.substring(0, 8).toUpperCase()}
              </div>
            </div>
            
            {/* Flight Information */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{booking.airline} {booking.flightNumber}</h3>
                <span className="text-gray-600">{formattedDate}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{booking.departureTime}</span>
                  <span className="ml-1 text-gray-600">{booking.from}</span>
                </div>
                
                <ArrowRight className="h-4 w-4 text-gray-400" />
                
                <div>
                  <span className="font-medium">{booking.arrivalTime}</span>
                  <span className="ml-1 text-gray-600">{booking.to}</span>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                Duration: {booking.duration}
              </div>
            </div>
            
            {/* Passenger Information */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Passenger Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {booking.passengerInfo.firstName} {booking.passengerInfo.lastName}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{booking.passengerInfo.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{booking.passengerInfo.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Passengers</p>
                  <p className="font-medium">{booking.passengers}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Payment Information</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Payment Method</span>
                  <span>Wallet</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="text-green-600 font-medium">Paid</span>
                </div>
                
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
              <button
                onClick={handleDownloadTicket}
                className="btn btn-primary flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download E-Ticket
              </button>
              
              <Link
                to="/bookings"
                className="btn btn-secondary flex items-center justify-center"
              >
                View All Bookings
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6 rounded-r-lg">
          <p className="text-sm text-blue-700">
            <strong>Important:</strong> Please arrive at the airport at least 2 hours before your scheduled departure time.
            Don't forget to carry a printed copy or digital version of your ticket along with a valid ID proof.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;