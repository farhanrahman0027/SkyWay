import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="container-custom py-16">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold mt-6 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
          
          <Link to="/search" className="btn btn-secondary flex items-center justify-center">
            <Search className="h-5 w-5 mr-2" />
            Search Flights
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;