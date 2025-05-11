import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Calendar, Clock } from 'lucide-react';
import { generateTicketPDF } from '../../utils/pdfGenerator';

interface BookingCardProps {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  passengerName: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  totalAmount: number;
}

const BookingCard: React.FC<BookingCardProps> = ({
  id,
  airline,
  flightNumber,
  from,
  to,
  departureTime,
  arrivalTime,
  date,
  passengerName,
  status,
  bookingDate,
  totalAmount
}) => {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800'
  };
  
  const handleDownloadTicket = () => {
    generateTicketPDF({
      id,
      airline,
      flightNumber,
      from,
      to,
      departureTime,
      arrivalTime,
      date,
      passengerName,
      status,
      bookingDate,
      totalAmount
    });
  };
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  return (
    <div className="card overflow-hidden">
      <div className={`px-4 py-2 ${status === 'confirmed' ? 'bg-green-50' : status === 'cancelled' ? 'bg-red-50' : 'bg-gray-50'} border-b border-gray-200`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{formattedDate}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <span className="font-bold text-lg">{airline}</span>
              <span className="ml-2 text-sm text-gray-500">{flightNumber}</span>
            </div>
            
            <div className="flex items-center text-sm mb-2">
              <Clock className="h-3 w-3 mr-1 text-gray-500" />
              <span className="text-gray-600">
                {departureTime} - {arrivalTime}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="font-medium">{from}</span>
              <span className="text-gray-400">→</span>
              <span className="font-medium">{to}</span>
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              Booked on {new Date(bookingDate).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-lg font-bold mb-2">₹{totalAmount.toLocaleString()}</div>
            
            <div className="flex space-x-2">
              <button 
                onClick={handleDownloadTicket}
                className="btn btn-secondary flex items-center text-xs py-1.5"
                disabled={status === 'cancelled'}
              >
                <Download className="h-3 w-3 mr-1" />
                E-Ticket
              </button>
              
              {/* <Link 
                to={`/bookings/${id}`}
                className="btn btn-primary flex items-center text-xs py-1.5"
              >
                <FileText className="h-3 w-3 mr-1" />
                Details
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;