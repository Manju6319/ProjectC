import React, { useState, useEffect } from 'react';
import { FaEdit, FaIdCard, FaBuilding, FaSitemap, FaUserTie, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { auth, doc, getDoc, updateDoc, db } from '../Firebase';
import { toast } from 'react-toastify';

const EmployeeInformation = () => {
  const [emp, setEmp] = useState(null);
  const [editEmployeeInfo, setEditEmployeeInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const uid = sessionStorage.getItem('uid') || auth.currentUser.uid;
        sessionStorage.setItem('uid', uid);
        const employeeRef = doc(db, 'employees', uid);
        const docSnap = await getDoc(employeeRef);
        if (docSnap.exists()) {
          setEmp(docSnap.data());
        } else {
          throw new Error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const uid = sessionStorage.getItem('uid');
      const employeeRef = doc(db, 'employees', uid);
      const updatedData = {
        empID: event.target.employeeID.value,
        Department: event.target.department.value,
        Division: event.target.division.value,
        Position: event.target.position.value,
        'Position Entry Date': event.target.joiningDate.value,
        'Time in Position': event.target.timeInPosition.value
      };
      await updateDoc(employeeRef, updatedData);
      setEmp(prevEmp => ({ ...prevEmp, ...updatedData }));
      setEditEmployeeInfo(false);
      toast.success('Employee information updated successfully');
    } catch (error) {
      console.error('Error updating employee data:', error);
      toast.error('Failed to update employee information');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const InfoItem = ({ icon: Icon, label, value, name, editable, type = "text" }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center bg-white rounded-md shadow-sm p-2 border border-gray-200">
        <Icon className="w-5 h-5 text-gray-500 mr-2" />
        {editable ? (
          <input
            type={type}
            name={name}
            id={name}
            defaultValue={type === 'date' ? formatDate(value) : value}
            className="w-full focus:outline-none text-sm"
          />
        ) : (
          <span className="text-gray-800 text-sm">{type === 'date' ? formatDate(value) : value}</span>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!emp) return <div className="text-center mt-8">No employee data found.</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-orange-800">Employee Information</h2>
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => setEditEmployeeInfo(!editEmployeeInfo)}
        >
          <FaEdit className="mr-2" />
          {editEmployeeInfo ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={FaIdCard} label="Employee ID" value={emp.EmployeeId} name="employeeID" editable={editEmployeeInfo} />
          <InfoItem icon={FaBuilding} label="Department" value={emp.Department} name="department" editable={editEmployeeInfo} />
          <InfoItem icon={FaSitemap} label="Division" value={emp.Division} name="division" editable={editEmployeeInfo} />
          <InfoItem icon={FaUserTie} label="Position" value={emp.Position} name="position" editable={editEmployeeInfo} />
          <InfoItem icon={FaCalendarAlt} label="Joining Date" value={emp['Position Entry Date']} name="joiningDate" editable={editEmployeeInfo} type="date" />
          <InfoItem icon={FaClock} label="Time in Position" value={emp['Time in Position']} name="timeInPosition" editable={editEmployeeInfo} />
        </div>
        {editEmployeeInfo && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EmployeeInformation;