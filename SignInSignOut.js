import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const SignInSignOut = () => {
  const [signInTime, setSignInTime] = useState(null);
  const [signOutTime, setSignOutTime] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSignInStatus = async () => {
      const userUID = auth.currentUser ? auth.currentUser.uid : 'USER_UID';
      const today = format(new Date(), 'yyyy-MM-dd');
      const docRef = doc(db, 'attendance', userUID, 'dates', today);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.signInTime) {
          setSignInTime(data.signInTime.toDate());
          setIsSignedIn(true);
        }
        if (data.signOutTime) {
          setSignOutTime(data.signOutTime.toDate());
        }
      }
    };

    fetchSignInStatus();

    // Check and mark as absent if not signed out by 11 PM
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(23, 0, 0, 0);

    if (now < targetTime) {
      const timeoutId = setTimeout(async () => {
        const userUID = auth.currentUser ? auth.currentUser.uid : 'USER_UID';
        const today = format(new Date(), 'yyyy-MM-dd');
        const docRef = doc(db, 'attendance', userUID, 'dates', today);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && !docSnap.data().signOutTime) {
          await updateDoc(docRef, {
            remark: 'Absent',
          });
          console.log('Marked as absent due to no sign-out by 11 PM');
        }
      }, targetTime - now);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleSignIn = async () => {
    const now = new Date();
    const userUID = auth.currentUser ? auth.currentUser.uid : 'USER_UID';

    setSignInTime(now);
    setIsSignedIn(true);
    setErrorMessage('');

    try {
      const today = format(now, 'yyyy-MM-dd');
      await setDoc(doc(db, 'attendance', userUID, 'dates', today), {
        signInTime: now,
        signOutTime: null,
        hoursWorked: null,
        remark: null,
      });
      console.log('Sign in time recorded:', now);
    } catch (error) {
      console.error('Error recording sign in time:', error);
    }
  };

  const handleSignOut = async () => {
    const userUID = auth.currentUser ? auth.currentUser.uid : 'USER_UID';
    const now = new Date();
    setSignOutTime(now);

    try {
      const today = format(now, 'yyyy-MM-dd');
      const docRef = doc(db, 'attendance', userUID, 'dates', today);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const signInTime = docSnap.data().signInTime.toDate();
        const hoursWorked = (now - signInTime) / (1000 * 60 * 60);

        await updateDoc(docRef, {
          signOutTime: now,
          hoursWorked: hoursWorked,
          remark: hoursWorked < 9 ? 'Left Early' : hoursWorked > 9 ? 'Worked Extra' : 'On Time',
        });
        console.log('Sign out time recorded:', now);
      } else {
        console.error('Sign in record not found');
      }
    } catch (error) {
      console.error('Error recording sign out time:', error);
    }
  };

  const today = format(new Date(), 'PPPP');

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In/Sign Out</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="text-center">
          <p className="text-xl font-semibold">{today}</p>
          <p className="text-sm text-gray-600">10:00AM To 7:00PM</p>
        </div>
        {!isSignedIn ? (
          <button
            onClick={handleSignIn}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        ) : !signOutTime ? (
          <button
            onClick={handleSignOut}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        ) : (
          <p className="text-center text-green-600 font-semibold">
            You've already signed in and out today.
          </p>
        )}
        {errorMessage && (
          <p className="text-center text-red-600 font-semibold">{errorMessage}</p>
        )}
        <div className="text-center">
          <p className="text-lg">
            Sign In Time: {signInTime ? signInTime.toLocaleTimeString() : 'N/A'}
          </p>
          <p className="text-lg">
            Sign Out Time: {signOutTime ? signOutTime.toLocaleTimeString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInSignOut;
