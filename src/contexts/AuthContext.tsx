import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, onAuthStateChanged, User } from '../utils/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

interface WalletInfo {
  balance: number;
  transactions: {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    date: Date;
  }[];
}

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  wallet: WalletInfo;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  updateUserWallet: (amount: number, type: 'credit' | 'debit', description: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user data from Firestore
  const fetchUserData = async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<UserData, 'uid'>;
        setUserData({
          uid: user.uid,
          ...userData
        });
      } else {
        // Create new user data if it doesn't exist
        const newUserData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          wallet: {
            balance: 50000, // Initial balance of Rs 50,000
            transactions: [{
              id: Date.now().toString(),
              amount: 50000,
              type: 'credit',
              description: 'Initial wallet balance',
              date: new Date()
            }]
          }
        };
        
        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user wallet
  const updateUserWallet = async (amount: number, type: 'credit' | 'debit', description: string) => {
    if (!currentUser || !userData) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Calculate new balance
      const newBalance = type === 'credit' 
        ? userData.wallet.balance + amount 
        : userData.wallet.balance - amount;
      
      // Create new transaction
      const newTransaction = {
        id: Date.now().toString(),
        amount,
        type,
        description,
        date: new Date()
      };
      
      // Update user data in state
      const updatedUserData = {
        ...userData,
        wallet: {
          balance: newBalance,
          transactions: [...userData.wallet.transactions, newTransaction]
        }
      };
      
      // Update Firestore
      await updateDoc(userDocRef, {
        'wallet.balance': newBalance,
        'wallet.transactions': [...userData.wallet.transactions, newTransaction]
      });
      
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        fetchUserData(user);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    updateUserWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};