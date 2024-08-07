import React, { useState, useEffect } from 'react';
import { auth } from '../Firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import logo from './logo.png';
import { HomeIcon, UserIcon, CalendarIcon, CheckCircleIcon, CreditCardIcon, UsersIcon, InformationCircleIcon, LogoutIcon, UserCircleIcon, BellIcon, ChevronDownIcon } from '@heroicons/react/solid';

const db = getFirestore();

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employeeName, setEmployeeName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const userUID = sessionStorage.getItem('uid');

  useEffect(() => {
    const fetchEmployeeName = async () => {
      if (userUID) {
        const docRef = doc(db, 'employees', userUID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployeeName(`${data.FirstName} ${data['Last Name']}`);
        } else {
          console.log('No such document!');
        }
      }
    };
    fetchEmployeeName();
  }, [userUID]);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setPageTitle(path.charAt(0).toUpperCase() + path.slice(1) || 'Home');
  }, [location]);

  const handleLogout = async () => {
    await auth.signOut();
    sessionStorage.removeItem('uid');
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out w-64 bg-white text-black flex flex-col lg:relative lg:translate-x-0`}>
        <div className="p-4 bg-white-200 text-center relative">
          <img src={logo} alt="Company Logo" className="h-15 w-30 mr-3" />
          <h2 className="mt-10 flex items-left text-xl font-semibold text-orange-800">
            <UserCircleIcon className="w-10 h-10 mr-4 text-gray-700" />
            {employeeName}
          </h2>

          <button
            className="absolute top-4 right-4 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav className="mt-6 flex-grow">
          <Link to="/home" className={`block px-4 py-2 hover:bg-gray-300 flex items-center ${isActive('/home') ? 'bg-gray-100' : ''}`}>
            <HomeIcon className="w-7 h-7 mr-4 text-gray-600 " />
            Home
          </Link>
          <Link to="/home/profile" className={`block px-4 py-2 hover:bg-gray-300 flex items-center ${isActive('/home/profile') ? 'bg-gray-100' : ''}`}>
            <UserIcon className="w-7 h-7 mr-4 text-blue-600" />
            Profile
          </Link>
          <Link to="/home/leave" className={`block px-4 py-2 hover:bg-gray-300 flex items-center ${isActive('/home/leave') ? 'bg-gray-100' : ''}`}>
            <CalendarIcon className="w-7 h-7 mr-4 text-green-600" />
            Leave
          </Link>
          <Link to="/home/attendance" className={`block px-4 py-2 hover:bg-gray-300 flex items-center ${isActive('/home/attendance') ? 'bg-gray-100' : ''}`}>
            <CheckCircleIcon className="w-7 h-7 mr-4 text-purple-600" />
            Attendance
          </Link>
          <Link to="/home/payrole" className={`block px-4 py-2 hover:bg-gray-300 flex items-center ${isActive('/home/payrole') ? 'bg-gray-100' : ''}`}>
            <CreditCardIcon className="w-7 h-7 mr-4 text-yellow-600" />
            Payrole
          </Link>
          <Link to="/home/team-members" className={`block px-4 py-2 hover:bg-gray-300 flex items-center ${isActive('/home/team-members') ? 'bg-gray-100' : ''}`}>
            <UsersIcon className="w-7 h-7 mr-4 text-blue-600" />
            Team Members
          </Link>
          <Link to="/home/about" className={`block px-4 py-2 hover:bg-gray-300 flex items-center ${isActive('/home/about') ? 'bg-gray-100' : ''}`}>
            <InformationCircleIcon className="w-7 h-7 mr-4 text-gray-600" />
            About
          </Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <button className="lg:hidden text-gray-700" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <h1 className="text-xl font-bold">{pageTitle}</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative">
              <BellIcon className="w-6 h-6 text-gray-700" />
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
                  <p className="text-gray-700">No notifications yet.</p>
                </div>
              )}
            </button>
            <button onClick={() => setQuickLinksOpen(!quickLinksOpen)} className="relative">
              <ChevronDownIcon className="w-6 h-6 text-gray-700" />
              {quickLinksOpen && (

                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
                  <ul className="space-y-2">
                    <li><h2>Quick Links</h2></li>
                    <li><Link to="/quick-link-1" className="text-gray-700 hover:bg-gray-200 px-2 py-1 block rounded">Leave Apply</Link></li>
                    <li><Link to="/quick-link-2" className="text-gray-700 hover:bg-gray-200 px-2 py-1 block rounded">Employee Info</Link></li>
                    <li><Link to="/quick-link-1" className="text-gray-700 hover:bg-gray-200 px-2 py-1 block rounded">Pay slips</Link></li>
                    <li><Link to="/quick-link-2" className="text-gray-700 hover:bg-gray-200 px-2 py-1 block rounded">Time Sheets </Link></li>
    
                  </ul>
                </div>
              )}
            </button>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
              <LogoutIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 flex-grow">
          {location.pathname === '/home' && (
            <h2 className="text-2xl mb-4">Welcome, {employeeName}</h2>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
