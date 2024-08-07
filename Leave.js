import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const leave = () => {
  return (
    <div className="flex min-h-screen shadow-lg">
      <div className="w-1/ bg-gray-100 p-10">
        
        <ul>
          <li className="py-2">
            <NavLink 
              to="/home/leave/apply" 
              className={({ isActive }) => isActive ? 'text-orange-600' : ''}
            >
             Leave Apply 
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink 
              to="/home/leave/calendar" 
              className={({ isActive }) => isActive ?'text-orange-600' : ''}
            >
              Leave Calendar
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink 
              to="/home/leave/balance" 
              className={({ isActive }) => isActive ? 'text-orange-600' : ''}
            >
              Leave Balance
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink 
              to="/home/leave/cancel" 
              className={({ isActive }) => isActive ?'text-orange-600' : ''}
            >
              Leave Cancel
            </NavLink>
          </li>
         
        </ul>
      </div>
      <div className="w-3/4 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default leave;
