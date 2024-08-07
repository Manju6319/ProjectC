


import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDAsmecFFrtMfF2JB1K7_ScjaEgqbUdekk",
//   authDomain: "userpage-e716b.firebaseapp.com",
//   projectId: "userpage-e716b",
//   storageBucket: "userpage-e716b.appspot.com",
//   messagingSenderId: "443867862806",
//   appId: "1:443867862806:web:b24f329cd0097747ef2237",
//   measurementId: "G-5C17Z9QP3C"
// };

const firebaseConfig = {
    apiKey: "AIzaSyA7VsiaN73MJSabrl9U5ZtgmUmGaz9xdyw",
  authDomain: "ems1-e1e93.firebaseapp.com",
  projectId: "ems1-e1e93",
  storageBucket: "ems1-e1e93.appspot.com",
  messagingSenderId: "357175637345",
  appId: "1:357175637345:web:63c4e58a82343d9ea5c120",
  measurementId: "G-JMB5MSP6CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get instances of Firebase services
const auth = getAuth(app);
const db = getFirestore(app);  // Ensure 'db' is used instead of 'firestore'
const storage = getStorage(app);

// Export Firebase services
export { auth, db, doc, getDoc, updateDoc, signInWithEmailAndPassword, storage };  // Export `doc` and `getDoc` functions

