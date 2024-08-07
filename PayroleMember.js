import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminDashboard = ({ userUID }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const attendanceCollectionRef = collection(db, 'Payrole');
        const snapshot = await getDocs(attendanceCollectionRef);
        const attendanceList = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));
        setAttendanceData(attendanceList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchAttendanceData();
  }, []);

  const handleApprove = async (userUId, monthKey) => {
    try {
      const attendanceDocRef = doc(db, 'Payrole', userUId);
      await updateDoc(attendanceDocRef, {
        [monthKey]: attendanceData.find(data => data.id === userUId).data[monthKey].map(block => ({
          ...block,
          status: 'approved'
        }))
      });
      // Optionally, update UI or reload data after approval
    } catch (error) {
      console.error('Error approving attendance:', error);
    }
  };

  const handleDecline = async (userUId, monthKey) => {
    try {
      const attendanceDocRef = doc(db, 'Payrole', userUId);
      await updateDoc(attendanceDocRef, {
        [monthKey]: attendanceData.find(data => data.id === userUId).data[monthKey].map(block => ({
          ...block,
          status: 'declined'
        }))
      });
      // Optionally, update UI or reload data after decline
    } catch (error) {
      console.error('Error declining attendance:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // Filter attendanceData to show only data for the specific userUID
  const filteredAttendanceData = attendanceData.filter(item => item.id === userUID);

  // Get unique months from the attendance data
  const months = [...new Set(filteredAttendanceData.flatMap(item => Object.keys(item.data)))];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Attendance Submissions</h2>
      <div className="mb-4">
        <label htmlFor="month" className="block text-gray-700 font-bold mb-2">Select Month:</label>
        <select
          id="month"
          className="p-2 border rounded"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          <option value="">-- Select a month --</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {filteredAttendanceData.map(({ id, data }) => (
          <div key={id} className="border p-4 rounded-lg shadow-md">
           
            {Object.keys(data)
              .filter(monthKey => monthKey === selectedMonth)
              .map(monthKey => (
                <div key={monthKey} className="mb-2">
                  <p className="font-semibold">{monthKey}</p>
                  <ul className="ml-4 space-y-2">
                    {data[monthKey].map((block, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{block.days.join(', ')}</span>
                        <div>
                          {block.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(id, monthKey)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                              <button onClick={() => handleDecline(id, monthKey)} className="bg-red-500 text-white px-2 py-1 rounded">Decline</button>
                            </>
                          )}
                          {block.status === 'approved' && <span className="text-green-500">Approved</span>}
                          {block.status === 'declined' && <span className="text-red-500">Declined</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
