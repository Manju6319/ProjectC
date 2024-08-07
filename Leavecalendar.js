import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // Start from January 2024

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const holidays = [
    { date: new Date(2024, 0, 15), name: 'Makara Sankranti', type: 'Optional' },
    { date: new Date(2024, 0, 26), name: 'Republic Day', type: 'Fixed' },
    { date: new Date(2024, 2, 25), name: 'Holi', type: 'Optional' },
    { date: new Date(2024, 3, 9), name: 'Ugadi', type: 'Optional' },
    { date: new Date(2024, 3, 10), name: 'Idul Fitr', type: 'Optional' },
    { date: new Date(2024, 3, 17), name: 'Sree Rama Navami', type: 'Optional' },
    { date: new Date(2024, 4, 1), name: 'Labour Day', type: 'Fixed' },
    { date: new Date(2024, 5, 2), name: 'Telangana Formation Day', type: 'Fixed' },
    { date: new Date(2024, 7, 15), name: 'Independence Day', type: 'Fixed' },
    { date: new Date(2024, 8, 7), name: 'Ganesh Chaturthi', type: 'Optional' },
    { date: new Date(2024, 8, 16), name: 'Eid e Milad', type: 'Optional' },
    { date: new Date(2024, 9, 2), name: 'Gandhi Jayanti', type: 'Fixed' },
    { date: new Date(2024, 9, 13), name: 'Vijaya Dashami', type: 'Optional' },
    { date: new Date(2024, 9, 31), name: 'Deepavali', type: 'Optional' },
    { date: new Date(2024, 11, 25), name: 'Christmas Day', type: 'Optional' },
  ];

  const getHoliday = (date) => {
    return holidays.find(h => 
      h.date.getDate() === date.getDate() &&
      h.date.getMonth() === date.getMonth() &&
      h.date.getFullYear() === date.getFullYear()
    );
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const holiday = getHoliday(date);
      let bgColor = isWeekend ? 'bg-red-100' : '';
      let holidayName = '';

      if (holiday) {
        bgColor = holiday.type === 'Fixed' ? 'bg-green-200' : 'bg-yellow-200';
        holidayName = holiday.name;
      }

      days.push(
        <div
          key={day}
          className={`h-12 flex flex-col items-center justify-start p-1 border border-gray-200 ${bgColor}`}
        >
          <span className="text-sm font-bold">{day}</span>
          {holidayName && (
            <span className="text-xs text-center">{holidayName}</span>
          )}
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-4 py-2 bg-blue-500 text-white rounded">
          Previous
        </button>
        <h2 className="text-2xl font-bold">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 mr-2"></div>
          <span>Weekend</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 mr-2"></div>
          <span>Fixed Holiday</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-200 mr-2"></div>
          <span>Optional Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
