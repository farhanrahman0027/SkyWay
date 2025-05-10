import axios from 'axios';

// Create a base API instance
const api = axios.create({
  baseURL: 'https://api.example.com/v1', // Replace with your actual API endpoint
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Airport search API
export const searchAirports = async (query: string) => {
  try {
    // For demo purposes, we'll use a mock implementation
    // In production, replace with actual API call
    if (!query || query.length < 2) return [];
    
    const airports = [
      { id: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', code: 'DEL' },
      { id: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', code: 'BOM' },
      { id: 'MAA', name: 'Chennai International Airport', city: 'Chennai', code: 'MAA' },
      { id: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', code: 'CCU' },
      { id: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', code: 'BLR' },
      { id: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', code: 'HYD' },
      { id: 'COK', name: 'Cochin International Airport', city: 'Kochi', code: 'COK' },
      { id: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', code: 'AMD' },
      { id: 'GOI', name: 'Goa International Airport', city: 'Goa', code: 'GOI' },
      { id: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', code: 'JAI' },
    ];
    
    const filtered = airports.filter(airport => {
      const lowercaseQuery = query.toLowerCase();
      return (
        airport.city.toLowerCase().includes(lowercaseQuery) ||
        airport.name.toLowerCase().includes(lowercaseQuery) ||
        airport.code.toLowerCase().includes(lowercaseQuery)
      );
    });
    
    return filtered;
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
};

// Flight search API
export const searchFlights = async (from: string, to: string, date: string, passengers: number) => {
  try {
    // For demo purposes, we'll generate mock flight data
    // In production, replace with actual API call
    
    const airlines = ['SkyWings', 'BlueStar Air', 'Falcon Airways', 'SunLight Express', 'Ocean Air'];
    const flights = [];
    
    // Generate 10 random flights
    for (let i = 0; i < 10; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const flightNumber = `${airline.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`;
      const basePrice = 2000 + Math.floor(Math.random() * 1000); // Between 2000 and 3000
      
      // Random departure time (6 AM to 10 PM)
      const depHour = 6 + Math.floor(Math.random() * 16);
      const depMinute = Math.floor(Math.random() * 60);
      const depTime = `${depHour.toString().padStart(2, '0')}:${depMinute.toString().padStart(2, '0')}`;
      
      // Random duration (1 to 4 hours)
      const durationHours = 1 + Math.floor(Math.random() * 3);
      const durationMinutes = Math.floor(Math.random() * 60);
      const duration = `${durationHours}h ${durationMinutes}m`;
      
      // Calculate arrival time
      let arrHour = depHour + durationHours;
      let arrMinute = depMinute + durationMinutes;
      if (arrMinute >= 60) {
        arrHour += 1;
        arrMinute -= 60;
      }
      arrHour = arrHour % 24; // Handle day rollover
      const arrTime = `${arrHour.toString().padStart(2, '0')}:${arrMinute.toString().padStart(2, '0')}`;
      
      flights.push({
        id: `FLIGHT-${i + 1}`,
        airline,
        flightNumber,
        from,
        to,
        date,
        departureTime: depTime,
        arrivalTime: arrTime,
        duration,
        price: basePrice,
        originalPrice: basePrice,
        seatsAvailable: 10 + Math.floor(Math.random() * 90),
        bookingAttempts: 0,
        lastAttemptTime: null
      });
    }
    
    return flights;
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
};

export default api;