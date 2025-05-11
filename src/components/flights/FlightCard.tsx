import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

interface FlightCardProps {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  originalPrice: number;
  date: string;
}

const FlightCard: React.FC<FlightCardProps> = ({
  id,
  airline,
  flightNumber,
  from,
  to,
  departureTime,
  arrivalTime,
  duration,
  price,
  originalPrice,
  date
}) => {
  const isPriceIncreased = price > originalPrice;
  
  return (
    <div className="card p-4 md:p-6 transition-all hover:translate-y-[-2px] duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Flight Info */}
        <div className="mb-4 md:mb-0">
          <div className="flex items-center mb-2">
            <span className="font-bold text-lg text-gray-900">{airline}</span>
            <span className="ml-2 text-gray-500 text-sm">{flightNumber}</span>
          </div>
          
          <div className="flex flex-wrap items-center text-sm md:text-base">
            <div className="flex items-center">
              <span className="font-medium">{departureTime}</span>
              <span className="mx-1 text-gray-500 font-semibold">{from}</span>
            </div>
            
            <div className="flex items-center mx-2">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center">
              <span className="font-medium">{arrivalTime}</span>
              <span className="mx-1 text-gray-500 font-semibold">{to}</span>
            </div>
          </div>

          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{duration}</span>
            <span className="mx-2">•</span>
            <span>Non-stop</span>
            <span className="mx-2">•</span>
            <span>{new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
        
        {/* Price & Book Section */}
        <div className="w-full md:w-auto">
          <div className="text-right mb-2">
            {isPriceIncreased && (
              <span className="block text-xs text-red-600 mb-1">
                Price increased due to high demand
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
            <span className="block text-xs text-gray-500">Per passenger</span>
          </div>
          
          <Link to={`/flight/${id}`} className="btn btn-primary w-full md:w-auto">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;