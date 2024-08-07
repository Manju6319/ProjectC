import React, { useState } from 'react';
import AttendanceDashboard from './MemberAttendance';
import AttendanceCalendar from './PayroleMember';
// import TeamLeave from './TeaMLeave';

const MemberDetails = ({ member }) => {
  const [selectedSection, setSelectedSection] = useState('signin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderSection = () => {
    switch (selectedSection) {
      case 'signin':
        return <AttendanceDashboard userUID={member.id} />;
      case 'payroll':
        return <AttendanceCalendar userUID={member.id} />;
    //   case 'leave':
    //     return <TeamLeave userUID={member.id} />;
      default:
        return null;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className={`lg:w-1/4 bg-white border-b lg:border-r lg:border-b-0 border-black transition-all duration-300 ease-in-out ${isMenuOpen ? 'h-auto' : 'h-20 lg:h-auto'}`}>
        <div className="flex justify-between items-center p-4 lg:p-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black">{member.FirstName} {member.LastName}</h2>
          <button 
            className="lg:hidden text-black text-lg font-semibold py-2 px-4 border border-black rounded"
            onClick={toggleMenu}
          >
            {isMenuOpen ? 'Close' : 'Open'}
          </button>
        </div>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:block p-4 lg:p-6`}>
          <p className="text-black mb-6">Email: {member.Email}</p>
          <nav>
            <ul className="space-y-4">
              {['signin', 'payroll', 'leave'].map((section) => (
                <li key={section}>
                  <button
                    className={`w-full text-left py-4 px-6 rounded-lg transition-colors duration-300 text-lg font-medium ${
                      selectedSection === section
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-black hover:bg-gray-100'
                    }`}
                    onClick={() => handleSectionSelect(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="w-full lg:w-3/4 bg-white p-4 md:p-8">
        {renderSection()}
      </div>
    </div>
  );
};

export default MemberDetails;