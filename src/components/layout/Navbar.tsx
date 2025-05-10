import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, X, Plane, LogOut, User, BookOpen } from 'lucide-react';
import { useAuth} from '../../contexts/AuthContext';
import { signOut } from "../../utils/firebase";
import { auth } from "../../utils/firebase";


const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate('/');
      closeMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SkyWay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/search" className="text-gray-700 hover:text-blue-600 transition-colors">Search Flights</Link>

            {!loading && (
              <>
                {currentUser ? (
                  <div className="flex items-center space-x-6">
                    <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">My Bookings</Link>
                    
                    <div className="relative group">
                      <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                        <span className="mr-2">{userData?.displayName || currentUser.email?.split('@')[0]}</span>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          ₹{userData?.wallet.balance.toLocaleString()}
                        </div>
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <Link to="/bookings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <BookOpen className="h-4 w-4 mr-2" />
                          My Bookings
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Sign In</Link>
                    <Link to="/register" className="btn btn-primary">Sign Up</Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container-custom py-4 space-y-4">
            <Link to="/" className="block py-2 text-gray-700" onClick={closeMenu}>Home</Link>
            <Link to="/search" className="block py-2 text-gray-700" onClick={closeMenu}>Search Flights</Link>
            
            {!loading && (
              <>
                {currentUser ? (
                  <>
                    <div className="py-2 mb-2 flex items-center justify-between">
                      <span className="text-gray-700">{userData?.displayName || currentUser.email?.split('@')[0]}</span>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        ₹{userData?.wallet.balance.toLocaleString()}
                      </div>
                    </div>
                    <Link to="/profile" className="block py-2 text-gray-700" onClick={closeMenu}>Profile</Link>
                    <Link to="/bookings" className="block py-2 text-gray-700" onClick={closeMenu}>My Bookings</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-gray-700"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="pt-2 flex flex-col space-y-2">
                    <Link to="/login" 
                      className="btn btn-secondary w-full justify-center" 
                      onClick={closeMenu}
                    >
                      Sign In
                    </Link>
                    <Link to="/register" 
                      className="btn btn-primary w-full justify-center" 
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;