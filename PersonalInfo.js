import React, { useState, useEffect } from 'react';
import { FaEdit, FaUser, FaIdCard, FaPhone, FaEnvelope, FaBirthdayCake, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaFlag, FaUsers, FaUserTie } from 'react-icons/fa';
import { auth, doc, getDoc, updateDoc, db, storage } from '../Firebase';
import { ref, deleteObject, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const PersonalInformation = () => {
  const [emp, setEmp] = useState(null);
  const [editPersonalInfo, setEditPersonalInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const uid = sessionStorage.getItem('uid');
      const employeeRef = doc(db, 'employees', uid);
      let updatedData = {
        'Preferred First Name': event.target.preferredFirstName.value,
        'Business Number': event.target.businessNumber.value,
        'Business Email': event.target.businessEmail.value,
        Location: event.target.location.value,
        'Date of Birth (DOB)': new Date(event.target.dob.value).getTime(),
        Nationality: event.target.nationality.value,
        Citizenship: event.target.citizenship.value,
      };

      if (imageFile) {
        if (emp.Image) {
          const storageRef = ref(storage, emp.Image);
          await deleteObject(storageRef);
        }

        const imageRef = ref(storage, `Images/${uid}/profile`);
        const uploadTask = uploadBytesResumable(imageRef, imageFile);
        await uploadTask;
        const imageUrl = await getDownloadURL(imageRef);
        updatedData.Image = imageUrl;
      }

      await updateDoc(employeeRef, updatedData);
      setEmp(prevEmp => ({ ...prevEmp, ...updatedData }));
      setEditPersonalInfo(false);
      setImageFile(null);
      toast.success('Personal information updated successfully');
    } catch (error) {
      console.error('Error updating personal data:', error);
      toast.error('Failed to update personal information');
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
        <h2 className="text-2xl font-semibold text-orange-800">Personal Information</h2>
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => setEditPersonalInfo(!editPersonalInfo)}
        >
          <FaEdit className="mr-2" />
          {editPersonalInfo ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <div className="flex items-center">
            <img src={emp?.Image} alt="Profile" className="h-16 w-16 rounded-full object-cover" />
            {editPersonalInfo && (
              <input
                type="file"
                className="ml-4 text-sm"
                onChange={handleFileUpload}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={FaUser} label="Preferred Name" value={emp['Preferred First Name']} name="preferredFirstName" editable={editPersonalInfo} />
          <InfoItem icon={FaIdCard} label="employeeId" value={emp.EmployeeId} name="employeeId" editable={false} />
          <InfoItem icon={FaPhone} label="Business Number" value={emp['Business Number']} name="businessNumber" editable={editPersonalInfo} />
          <InfoItem icon={FaEnvelope} label="Business Email" value={emp['Business Email']} name="businessEmail" editable={editPersonalInfo} type="email" />
          <InfoItem icon={FaBirthdayCake} label="Date of Birth" value={emp['Date of Birth (DOB)']} name="dob" editable={editPersonalInfo} type="date" />
          <InfoItem icon={FaMapMarkerAlt} label="Location" value={emp.Location} name="location" editable={editPersonalInfo} />
          <InfoItem icon={FaFlag} label="Nationality" value={emp.Nationality} name="nationality" editable={editPersonalInfo} />
          <InfoItem icon={FaFlag} label="Citizenship" value={emp.Citizenship} name="citizenship" editable={editPersonalInfo} />
          {/* <InfoItem icon={FaUserTie} label="Job Title" value={emp['Job Title']} name="jobTitle" editable={false} />
          <InfoItem icon={FaBriefcase} label="Department" value={emp.Department} name="department" editable={false} />
          <InfoItem icon={FaUsers} label="Relationship Status" value={emp['Relationship Status']} name="relationshipStatus" editable={false} />
          <InfoItem icon={FaCalendarAlt} label="Position Entry Date" value={emp['Position Entry Date']} name="positionEntryDate" editable={false} type="date" /> */}
        </div>
        {editPersonalInfo && (
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

export default PersonalInformation;