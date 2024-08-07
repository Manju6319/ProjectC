import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Leave from './components/Leave';
import PersonalInfo from './components/PersonalInfo';
import JobInfo from './components/JobInfo';
import EmployeeInfo from './components/EmployeeInfo';
import OrganizationInfo from './components/OrganizationInfo';
import Attendance from './components/Attendance';
import Payrole from './components/Payrole';
import TeamMembers from './components/TeamMembers';
import About from './components/About';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import LeaveApply from './components/LeaveApply';
import LeaveBalance from './components/LeaveBalance';
import LeaveCancel from './components/LeaveCancel';
import Leavecalendar from './components/Leavecalendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />}>
            <Route index element={<PersonalInfo />} /> 
            <Route path="personal" element={<PersonalInfo />} />
            <Route path="job" element={<JobInfo />} />
            <Route path="employee" element={<EmployeeInfo />} />
            <Route path="organization" element={<OrganizationInfo />} />
          </Route>
          <Route path="leave" element={<Leave />}>
            <Route index element={<LeaveApply />} /> 
            <Route path="apply" element={<LeaveApply />} />
            <Route path="balance" element={<LeaveBalance />} />
            <Route path="calendar" element={<Leavecalendar />} />
            <Route path="cancel" element={<LeaveCancel />} /> 
          </Route>
          <Route path="attendance" element={<Attendance />} />
          <Route path="payrole" element={<Payrole />} />
          <Route path="team-members" element={<TeamMembers />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
