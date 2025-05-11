import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../utils/firebase';
import { User, CreditCard, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await updateProfile(currentUser, { displayName });
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                
                {!isEditing && (
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
                  <p className="text-green-700">{success}</p>
                </div>
              )}
              
              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label htmlFor="displayName" className="form-label">Name</label>
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input"
                      placeholder="Enter your name"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={currentUser?.email || ''}
                      className="input bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="submit"
                      className={`btn ${loading ? 'bg-gray-400' : 'btn-primary'}`}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(currentUser?.displayName || '');
                        setError('');
                        setSuccess('');
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {currentUser?.displayName || 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{currentUser?.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Account Created</p>
                      <p className="font-medium">
                        {currentUser?.metadata.creationTime
                          ? format(new Date(currentUser.metadata.creationTime), 'PPP')
                          : 'Unknown'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Last Sign In</p>
                      <p className="font-medium">
                        {currentUser?.metadata.lastSignInTime
                          ? format(new Date(currentUser.metadata.lastSignInTime), 'PPP')
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Wallet Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  My Wallet
                </h2>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center mb-6">
                <p className="text-sm text-blue-600 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-blue-700">
                  ₹{userData?.wallet.balance.toLocaleString() || 50000}
                </p>
              </div>
              
              <h3 className="font-medium mb-4">Recent Transactions</h3>
              
              {userData?.wallet.transactions && userData.wallet.transactions.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {userData.wallet.transactions.slice(0, 5).map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="bg-gray-50 p-3 rounded-md text-sm"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className={`font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {format(new Date(transaction.date), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <p className="text-gray-600 truncate">{transaction.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;