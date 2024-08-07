import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="flex min-h-screen shadow-lg">
      <div className="w-1/ bg-gray-100 p-10">
        <h2 className="text-lg font-semibold mb-4"> My Profile</h2>
        <ul>
          <li className="py-2">
            <NavLink 
              to="/home/profile/personal" 
              className={({ isActive }) => isActive ? 'text-orange-600' : ''}
            >
              Personal Information
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink 
              to="/home/profile/job" 
              className={({ isActive }) => isActive ? 'text-orange-600' : ''}
            >
              Job Information
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink 
              to="/home/profile/employee" 
              className={({ isActive }) => isActive ?'text-orange-600' : ''}
            >
              Employee Information
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink 
              to="/home/profile/organization" 
              className={({ isActive }) => isActive ? 'text-orange-600' : ''}
            >
              Organization Information
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

export default Profile;
