import React, { createContext, useState, useContext, useEffect } from 'react';
import { searchFlights } from '../utils/api';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  originalPrice: number;
  seatsAvailable: number;
  bookingAttempts: number;
  lastAttemptTime: Date | null;
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

interface FlightContextType {
  flights: Flight[];
  searchParams: SearchParams | null;
  loading: boolean;
  error: string | null;
  searchFlights: (params: SearchParams) => Promise<void>;
  getFlight: (id: string) => Flight | undefined;
  updateFlightPrice: (id: string) => Flight | undefined;
  resetFlightPrice: (id: string) => void;
}

const FlightContext = createContext<FlightContextType | null>(null);

export const useFlights = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlights must be used within a FlightProvider');
  }
  return context;
};

export const FlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search for flights
  const searchForFlights = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setSearchParams(params);

    try {
      const results = await searchFlights(
        params.from,
        params.to,
        params.date,
        params.passengers
      );
      
      setFlights(results);
    } catch (err) {
      setError('Failed to fetch flights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get a specific flight by ID
  const getFlight = (id: string) => {
    return flights.find(flight => flight.id === id);
  };

  // Update flight price based on booking attempts
  const updateFlightPrice = (id: string) => {
    const flightIndex = flights.findIndex(flight => flight.id === id);
    if (flightIndex === -1) return;

    const flight = {...flights[flightIndex]};
    flight.bookingAttempts += 1;
    flight.lastAttemptTime = new Date();
    
    // If this is the third attempt in 5 minutes, increase price by 10%
    if (flight.bookingAttempts >= 3) {
      flight.price = Math.round(flight.originalPrice * 1.1);
    }

    const updatedFlights = [...flights];
    updatedFlights[flightIndex] = flight;
    setFlights(updatedFlights);
    
    return flight;
  };

  // Reset flight price after 10 minutes
  const resetFlightPrice = (id: string) => {
    const flightIndex = flights.findIndex(flight => flight.id === id);
    if (flightIndex === -1) return;

    const flight = {...flights[flightIndex]};
    flight.price = flight.originalPrice;
    flight.bookingAttempts = 0;
    flight.lastAttemptTime = null;

    const updatedFlights = [...flights];
    updatedFlights[flightIndex] = flight;
    setFlights(updatedFlights);
  };

  // Check if any flight prices need to be reset after 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let updated = false;

      const updatedFlights = flights.map(flight => {
        if (flight.lastAttemptTime && 
            (now.getTime() - flight.lastAttemptTime.getTime() > 10 * 60 * 1000) && 
            flight.price !== flight.originalPrice) {
          updated = true;
          return {
            ...flight,
            price: flight.originalPrice,
            bookingAttempts: 0,
            lastAttemptTime: null
          };
        }
        return flight;
      });

      if (updated) {
        setFlights(updatedFlights);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [flights]);

  const value = {
    flights,
    searchParams,
    loading,
    error,
    searchFlights: searchForFlights,
    getFlight,
    updateFlightPrice,
    resetFlightPrice
  };

  return (
    <FlightContext.Provider value={value}>
      {children}
    </FlightContext.Provider>
  );
};