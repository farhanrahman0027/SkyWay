import { initializeApp } from 'firebase/app';
import { 
 getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM2MTI12dmETpv2gIQ5GGJ4zpY1EIavOg",
  authDomain: "flightbook-fe60e.firebaseapp.com",
  projectId: "flightbook-fe60e",
  storageBucket: "flightbook-fe60e.firebasestorage.app",
  messagingSenderId: "1008027536349",
  appId: "1:1008027536349:web:4e79550b17053f73a04434"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  app, 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged
};