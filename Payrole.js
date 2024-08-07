import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);
  const [allAttendance, setAllAttendance] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const fixedHolidays = [
    { date: '2024-01-15', name: 'Makara Sankranti' },
    { date: '2024-01-26', name: 'Republic Day' },
    { date: '2024-05-01', name: 'Labour Day' },
    { date: '2024-06-02', name: 'Telangana Formation Day' },
    { date: '2024-08-15', name: 'Independence Day ' },
    { date: '2024-10-02', name: 'Gandhi Jayanti' },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchAllAttendanceData(user.uid);
      } else {
        setUser(null);
        setAllAttendance({});
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const fetchAllAttendanceData = async (userUID) => {
    const attendanceRef = doc(collection(db, 'Payrole'), userUID);
    const docSnap = await getDoc(attendanceRef);
    if (docSnap.exists()) {
      setAllAttendance(docSnap.data());
    } else {
      setAllAttendance({});
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const currentMonthKey = format(currentDate, 'yyyy-MM');
    const monthAttendance = allAttendance[currentMonthKey] || [];
    const days = [];

    const isFixedHoliday = (dateString) => {
      return fixedHolidays.some(holiday => holiday.date === dateString);
    };

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateString = format(date, 'yyyy-MM-dd');
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isSelected = selectedDays.some(selectedDate => format(selectedDate, 'yyyy-MM-dd') === dateString);
      const isHoliday = isFixedHoliday(dateString);

      const attendanceBlock = monthAttendance.find(block => 
        block.days.includes(dateString)
      );
      const status = attendanceBlock ? attendanceBlock.status : 'none';
      let bgColor = isWeekend ? 'bg-gray-100' : '';
      if (status === 'pending') bgColor = 'bg-yellow-200';
      if (status === 'approved') bgColor = 'bg-green-200';
      if (isSelected) bgColor = 'bg-blue-200';
      if (isHoliday) bgColor = 'bg-red-200';

      days.push(
        <div
          key={day}
          onClick={() => status === 'none' && toggleDay(date)}
          className={`h-8 w-8 flex items-center justify-center border border-gray-200 rounded-full ${bgColor}
                      ${status === 'none' ? 'cursor-pointer' : 'cursor-not-allowed'}
          `}
        >
          <span className="text-xs font-bold">{day}</span>
        </div>
      );
    }
    return days;
  };

  const toggleDay = (date) => {
    if (date.getDay() === 6 || date.getDay() === 0) {
      alert("You cannot select Saturdays and Sundays.");
      return;
    }

    const dateString = format(date, 'yyyy-MM-dd');
    if (fixedHolidays.some(holiday => holiday.date === dateString)) {
      alert("You cannot select this holiday.");
      return;
    }

    setSelectedDays(prevState => {
      if (prevState.some(selectedDate => selectedDate.getTime() === date.getTime())) {
        return prevState.filter(selectedDate => selectedDate.getTime() !== date.getTime());
      } else if (prevState.length < 5) {
        return [...prevState, date];
      } else {
        alert("You can only select up to 5 days at a time.");
        return prevState;
      }
    });
  };

  const submitAttendance = async () => {
    if (!user) return;
    const userUID = user.uid;
    const attendanceRef = doc(collection(db, 'Payrole'), userUID);
    const formattedSelectedDays = selectedDays.map(date => format(date, 'yyyy-MM-dd'));
    const currentMonthKey = format(currentDate, 'yyyy-MM');
    try {
      const updatedAttendance = {...allAttendance};
      if (!updatedAttendance[currentMonthKey]) {
        updatedAttendance[currentMonthKey] = [];
      }
      const newBlock = {
        days: formattedSelectedDays,
        status: 'pending'
      };
      updatedAttendance[currentMonthKey].push(newBlock);
      await setDoc(attendanceRef, updatedAttendance);
      setAllAttendance(updatedAttendance);
      setSelectedDays([]);
      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance: ', error);
    }
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const getMonthlyStatistics = () => {
    const currentMonthKey = format(currentDate, 'yyyy-MM');
    const monthAttendance = allAttendance[currentMonthKey] || [];
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let approved = 0;
    let pending = 0;
    let holidays = 0;
    let weekends = 0;

    allDays.forEach(day => {
      const dateString = format(day, 'yyyy-MM-dd');
      if (day.getDay() === 0 || day.getDay() === 6) {
        weekends++;
      } else if (fixedHolidays.some(holiday => holiday.date === dateString)) {
        holidays++;
      } else {
        const attendanceBlock = monthAttendance.find(block => block.days.includes(dateString));
        if (attendanceBlock) {
          if (attendanceBlock.status === 'approved') approved++;
          if (attendanceBlock.status === 'pending') pending++;
        }
      }
    });

    const workingDays = allDays.length - weekends - holidays;
    const absent = workingDays - approved - pending;

    return { approved, pending, holidays, weekends, absent };
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const stats = getMonthlyStatistics();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      {user ? (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                Previous
              </button>
              <h2 className="text-xl font-bold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button onClick={nextMonth} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                Next
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center font-bold text-xs">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
            <button
              onClick={submitAttendance}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full"
              disabled={selectedDays.length === 0}
            >
              Submit Attendance
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Monthly Statistics</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Approved Days:</span> {stats.approved}</p>
              <p><span className="font-semibold">Pending Days:</span> {stats.pending}</p>
              <p><span className="font-semibold">Holidays:</span> {stats.holidays}</p>
              <p><span className="font-semibold">Weekends:</span> {stats.weekends}</p>
              <p><span className="font-semibold">Absent Days:</span> {stats.absent}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Please log in to view and submit attendance.</p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-200 rounded-full"></div>
          <span className="text-sm">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-200 rounded-full"></div>
          <span className="text-sm">Approved</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-200 rounded-full"></div>
          <span className="text-sm">Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;