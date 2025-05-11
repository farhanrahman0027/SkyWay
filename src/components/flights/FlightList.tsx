import React from 'react';
import FlightCard from './FlightCard';
import { useFlights } from '../../contexts/FlightContext';
import { Loader, SearchX } from 'lucide-react';

const FlightList: React.FC = () => {
  const { flights, loading, searchParams, error } = useFlights();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Searching for the best flights...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg inline-flex items-center mb-4">
          <span className="mr-2">⚠️</span>
          <span>{error}</span>
        </div>
        <p className="text-gray-600">Please try again or adjust your search criteria.</p>
      </div>
    );
  }
  
  if (!searchParams) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">Search for flights to see results</p>
      </div>
    );
  }
  
  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <SearchX className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No flights found</h3>
        <p className="text-gray-600 mb-4">We couldn't find any flights matching your search criteria.</p>
        <p className="text-gray-500">Try adjusting your search parameters or selecting different dates.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-medium text-blue-800">
          {flights.length} flights found from {searchParams.from} to {searchParams.to}
        </h2>
        <p className="text-sm text-blue-600">
          {new Date(searchParams.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} 
          • {searchParams.passengers} {searchParams.passengers === 1 ? 'passenger' : 'passengers'}
        </p>
      </div>
      
      <div className="space-y-4">
        {flights.map(flight => (
          <FlightCard
            key={flight.id}
            id={flight.id}
            airline={flight.airline}
            flightNumber={flight.flightNumber}
            from={flight.from}
            to={flight.to}
            departureTime={flight.departureTime}
            arrivalTime={flight.arrivalTime}
            duration={flight.duration}
            price={flight.price}
            originalPrice={flight.originalPrice}
            date={flight.date}
          />
        ))}
      </div>
    </div>
  );
};

export default FlightList;