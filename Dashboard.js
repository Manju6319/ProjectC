import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, CalendarIcon, CheckCircleIcon, CreditCardIcon, LoginIcon, LogoutIcon,UserCircleIcon } from '@heroicons/react/solid';

const Dashboard = () => {
 
  return (
    <div className="flex flex-col min-h-screen bg-white-100">
      
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/home/profile" className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition duration-200">
            
           
            <div className='flex gap-20' >
              <div className='grid '>
            <UserCircleIcon className="w-50 h-50 mr-4 text-gray-700" />
              <span className='font-semibold text-blue-700'>Jane smith</span>
            </div>
            <div ><ul>
            <li><h2 className='font-bold'>EmpId :</h2>
          </li>
          <li><h2 className='font-bold '>Email : </h2>
          </li>   <li><h2 className='font-bold'>Role :</h2>
          </li>   <li><h2 className='font-bold'>Experience :</h2>
          </li>   <li><h2 className='font-bold'> Location :</h2>
          </li>
            </ul></div>
            </div>
          </Link>
          <Link to="/home/leave" className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition duration-200">
            <CalendarIcon className="w-8 h-8 text-green-600" />
            <span className="text-lg font-medium">Leave</span>
          </Link>
          <Link to="/home/attendance" className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition duration-200">
            <CheckCircleIcon className="w-8 h-8 text-purple-600" />
            <span className="text-lg font-medium">Attendance</span>
          </Link>
          <Link to="/home/payroll" className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition duration-200">
            <CreditCardIcon className="w-8 h-8 text-yellow-600" />
            <span className="text-lg font-medium">Payroll</span>
          </Link>
          <Link to="/home/signin" className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition duration-200">
            <LoginIcon className="w-8 h-8 text-green-600" />
            <span className="text-lg font-medium">Sign In</span>
          </Link>
          <Link to="/home/signout" className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition duration-200">
            <LogoutIcon className="w-8 h-8 text-red-600" />
            <span className="text-lg font-medium">Sign Out</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
