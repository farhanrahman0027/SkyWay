import React from 'react';
import SearchForm from '../components/search/SearchForm';
import FlightList from '../components/flights/FlightList';
import { useFlights } from '../contexts/FlightContext';

const FlightSearch: React.FC = () => {
  const { searchParams } = useFlights();
  
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <SearchForm />
      </div>
      
      <FlightList />
    </div>
  );
};

export default FlightSearch;