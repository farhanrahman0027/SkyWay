import React from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/search/SearchForm';
import { Plane, Check, Shield, CreditCard, MapPin } from 'lucide-react';

const Home: React.FC = () => {
  // Popular destinations
  const destinations = [
    {
      id: 1,
      city: 'Delhi',
      code: 'DEL',
      image: 'https://images.pexels.com/photos/1792/city-buildings-temple-india.jpg',
    },
    {
      id: 2,
      city: 'Mumbai',
      code: 'BOM',
      image: 'https://images.pexels.com/photos/2315409/pexels-photo-2315409.jpeg',
    },
    {
      id: 3,
      city: 'Bangalore',
      code: 'BLR',
      image: 'https://images.pexels.com/photos/3694341/pexels-photo-3694341.jpeg',
    },
    {
      id: 4,
      city: 'Goa',
      code: 'GOI',
      image: 'https://images.pexels.com/photos/2111089/pexels-photo-2111089.jpeg',
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container-custom relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in">Book Your Journey with SkyWay</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 slide-up">
              Discover affordable flights to the most popular destinations across India
            </p>
          </div>
          
          <div className="slide-up">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkyWay</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">Get the best deals with our price match policy.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Your data is protected with industry-standard security.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Cancellation</h3>
              <p className="text-gray-600">Flexible cancellation and refund policies.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Choose from hundreds of airlines and routes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Destinations</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Explore these trending destinations for your next journey
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map(destination => (
              <div key={destination.id} className="card group overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">{destination.city}</h3>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{destination.code}</span>
                  </div>
                  <Link
                    to="/search"
                    className="btn btn-secondary w-full text-center"
                  >
                    Find Flights
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Sign up for exclusive deals and special offers on flights to your favorite destinations.
          </p>
          <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 focus:ring-white px-8 py-3 text-lg font-medium">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;