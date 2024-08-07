import React, { useEffect, useState } from 'react';
import { db, auth } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isAfter, setHours, setMinutes, setSeconds } from 'date-fns';

const AttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const userUID = auth.currentUser ? auth.currentUser.uid : 'USER_UID';

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'attendance', userUID, 'dates'));
        const data = {};
        const stats = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          data[doc.id] = docData;
          stats.push({ date: doc.id, ...docData });
        });
        setAttendanceData(data);
        setStatistics(stats);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setLoading(false); // Ensure loading state is handled in case of error
      }
    };

    fetchAttendanceData();
  }, [userUID]);

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
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = format(date, 'yyyy-MM-dd');
      const attendance = attendanceData[dateString];
      const now = new Date();
      const endOfDay = setHours(setMinutes(setSeconds(date, 0), 0), 22); // 10 PM on the given date

      if (isAfter(now, endOfDay)) {
        if (!attendance || !attendance.signInTime) {
          return <span className="bg-red-500 text-white p-1 rounded">A</span>;
        }
      }

      if (attendance) {
        const hoursWorked = attendance.hoursWorked;

        if (hoursWorked >= 4.5) {
          return <span className="bg-green-500 text-white p-1 rounded">P</span>;
        } else {
          return <span className="bg-red-500 text-white p-1 rounded">A</span>;
        }
      }
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Attendance Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar 
            tileContent={tileContent} 
            className="border rounded-lg shadow-md"
            tileClassName={({ date, view }) => {
              const dateString = format(date, 'yyyy-MM-dd');
              if (view === 'month' && attendanceData[dateString]) {
                return 'bg-blue-100';
              }
              return 'p-2';
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Daily Statistics</h3>
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
                {statistics.map((stat) => (
                  <tr key={stat.date}>
                    <td className="border px-4 py-2">{stat.date}</td>
                    <td className="border px-4 py-2">
                      {stat.signInTime ? stat.signInTime.toDate().toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="border px-4 py-2">
                      {stat.signOutTime ? stat.signOutTime.toDate().toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="border px-4 py-2">
                      {stat.hoursWorked !== null ? stat.hoursWorked.toFixed(2) : 'N/A'}
                    </td>
                    <td className="border px-4 py-2">
                      {getRemark(stat.hoursWorked)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
