import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { searchAirports } from '../../utils/api';
import { useFlights } from '../../contexts/FlightContext';
import { format } from 'date-fns';

interface Airport {
  id: string;
  name: string;
  city: string;
  code: string;
}

const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const { searchFlights } = useFlights();
  
  // Form state
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to a week from now
  );
  const [passengers, setPassengers] = useState(1);
  
  // Search suggestions
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  // Refs for click outside detection
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  
  // Fetch airport suggestions
  useEffect(() => {
    const fetchOriginSuggestions = async () => {
      if (originQuery.length >= 2) {
        const suggestions = await searchAirports(originQuery);
        setOriginSuggestions(suggestions);
      } else {
        setOriginSuggestions([]);
      }
    };
    
    fetchOriginSuggestions();
  }, [originQuery]);
  
  useEffect(() => {
    const fetchDestinationSuggestions = async () => {
      if (destinationQuery.length >= 2) {
        const suggestions = await searchAirports(destinationQuery);
        setDestinationSuggestions(suggestions);
      } else {
        setDestinationSuggestions([]);
      }
    };
    
    fetchDestinationSuggestions();
  }, [destinationQuery]);
  
  // Handle clicks outside of suggestion dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Format date as YYYY-MM-DD
    const formattedDate = format(departureDate, 'yyyy-MM-dd');
    
    // Search for flights
    searchFlights({
      from: origin.code,
      to: destination.code,
      date: formattedDate,
      passengers
    }).then(() => {
      navigate('/search');
    }).catch(error => {
      console.error('Error searching flights:', error);
    });
  };
  
  // Handle airport selection
  const handleSelectOrigin = (airport: Airport) => {
    setOrigin(airport);
    setOriginQuery(`${airport.city} (${airport.code})`);
    setShowOriginSuggestions(false);
  };
  
  const handleSelectDestination = (airport: Airport) => {
    setDestination(airport);
    setDestinationQuery(`${airport.city} (${airport.code})`);
    setShowDestinationSuggestions(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Origin */}
        <div className="relative" ref={originRef}>
          <label htmlFor="origin" className="form-label flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            From
          </label>
          <input
            id="origin"
            type="text"
            className="input"
            placeholder="City or Airport"
            value={originQuery}
            onChange={e => {
              setOriginQuery(e.target.value);
              setShowOriginSuggestions(true);
              if (e.target.value === '') {
                setOrigin(null);
              }
            }}
            onFocus={() => setShowOriginSuggestions(true)}
          />
          
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {originSuggestions.map(airport => (
                <div
                  key={airport.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectOrigin(airport)}
                >
                  <div className="font-medium text-black">{airport.city} ({airport.code})</div>
                  <div className="text-xs text-gray-500">{airport.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Destination */}
        <div className="relative" ref={destinationRef}>
          <label htmlFor="destination" className="form-label flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            To
          </label>
          <input
            id="destination"
            type="text"
            className="input"
            placeholder="City or Airport"
            value={destinationQuery}
            onChange={e => {
              setDestinationQuery(e.target.value);
              setShowDestinationSuggestions(true);
              if (e.target.value === '') {
                setDestination(null);
              }
            }}
            onFocus={() => setShowDestinationSuggestions(true)}
          />
          
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {destinationSuggestions.map(airport => (
                <div
                  key={airport.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectDestination(airport)}
                >
                  <div className="font-medium text-black">{airport.city} ({airport.code})</div>
                  <div className="text-xs text-gray-500">{airport.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Departure Date */}
        <div>
          <label htmlFor="departure" className="form-label flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            Departure Date
          </label>
          <DatePicker
            id="departure"
            selected={departureDate}
            onChange={date => setDepartureDate(date)}
            minDate={new Date()}
            className="input"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        
        {/* Passengers */}
        <div>
          <label htmlFor="passengers" className="form-label flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            Passengers
          </label>
          <select
            id="passengers"
            className="input"
            value={passengers}
            onChange={e => setPassengers(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Passenger' : 'Passengers'}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-6">
        <button type="submit" className="btn btn-primary w-full py-3 text-base flex items-center justify-center">
          <Search className="h-5 w-5 mr-2" />
          Search Flights
        </button>
      </div>
    </form>
  );
};

export default SearchForm;