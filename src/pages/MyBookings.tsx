import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import BookingCard from '../components/bookings/BookingCard';
import { Inbox, Loader } from 'lucide-react';

interface Booking {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  passengerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  totalAmount: number;
}

const MyBookings: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;
      
      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', currentUser.uid),
          orderBy('bookingDate', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const bookingsData: Booking[] = [];
        
        querySnapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
        });
        
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [currentUser]);
  
  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading your bookings...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-custom py-16">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet</p>
          <a href="/search" className="btn btn-primary">
            Search for Flights
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              id={booking.id}
              airline={booking.airline}
              flightNumber={booking.flightNumber}
              from={booking.from}
              to={booking.to}
              departureTime={booking.departureTime}
              arrivalTime={booking.arrivalTime}
              date={booking.date}
              passengerName={`${booking.passengerInfo.firstName} ${booking.passengerInfo.lastName}`}
              status={booking.status}
              bookingDate={booking.bookingDate}
              totalAmount={booking.totalAmount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;