import React, { useEffect, useState } from 'react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { format, isSameMonth } from 'date-fns';

const AttendanceDashboard = ({ userUID }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'attendance', userUID, 'dates'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAttendanceData(data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setLoading(false); // Ensure loading state is handled in case of error
      }
    };

    fetchAttendanceData();
  }, [userUID]);

  const filteredAttendanceData = attendanceData.filter(item =>
    isSameMonth(new Date(item.id), selectedMonth)
  );

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Monthly Attendance</h3>
        <div className="mb-4">
          <label htmlFor="month" className="block text-gray-700 font-bold mb-2">Select Month:</label>
          <input
            type="month"
            id="month"
            className="p-2 border rounded"
            value={format(selectedMonth, 'yyyy-MM')}
            onChange={(e) => handleMonthChange(new Date(e.target.value))}
          />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Sign In</th>
                <th className="px-4 py-2 border">Sign Out</th>
                <th className="px-4 py-2 border">Hours Worked</th>
                <th className="px-4 py-2 border">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceData.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{format(new Date(item.id), 'yyyy-MM-dd')}</td>
                  <td className="border px-4 py-2">{item.signInTime ? item.signInTime.toDate().toLocaleTimeString() : 'N/A'}</td>
                  <td className="border px-4 py-2">{item.signOutTime ? item.signOutTime.toDate().toLocaleTimeString() : 'N/A'}</td>
                  <td className="border px-4 py-2">{item.hoursWorked !== null ? item.hoursWorked.toFixed(2) : 'N/A'}</td>
                  <td className="border px-4 py-2">{getRemark(item.hoursWorked)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const getRemark = (hoursWorked) => {
  if (hoursWorked === null) return ''; // No remarks if hoursWorked is not defined

  if (hoursWorked === 9) {
    return 'No remarks'; // Exactly 9 hours
  } else if (hoursWorked > 9) {
    const extraHours = hoursWorked - 9;
    return `Worked Extra ${extraHours.toFixed(2)} hours`;
  } else if (hoursWorked < 9) {
    return 'Left Early'; // Less than 9 hours
  } else if (hoursWorked === 4.5) {
    return 'Half Day'; // Half-day scenario (9/2 = 4.5 hours)
  }

  return '';
};

export default AttendanceDashboard;
