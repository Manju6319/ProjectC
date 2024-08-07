import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase'; // Adjust the path to your Firebase configuration
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaEdit, FaBriefcase, FaClock, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

// const JobInfo = () => {
//   const [jobInfo, setJobInfo] = useState({
//     employmentType: '',
//     weeklyHours: '',
//     location: '',
//     workEmail: '',
//     workPhone: '',
//   });
//   const [editJobInfo, setEditJobInfo] = useState(false);
//   const [emp, setEmp] = useState({});

//   useEffect(() => {
//     const fetchJobInfo = async () => {
//       try {
//         let uid = sessionStorage.getItem('uid') || auth.currentUser.uid;
//         sessionStorage.setItem('uid', uid);
//         const jobRef = doc(db, 'employees', uid);
//         const docSnap = await getDoc(jobRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setEmp(data);
//           setJobInfo({
//             employmentType: data['Is Full Time Employee'] ? 'Full Time Employment' : 'Part Time Employment',
//             weeklyHours: data['Standard Weekly Hours'] || '',
//             location: data['Location'] || '',
//             workEmail: data.Email || '',
//             workPhone: data['Business Number'] || '',
//           });
//         } else {
//           console.log('No such document!');
//         }
//       } catch (error) {
//         console.error('Error fetching job info:', error);
//       }
//     };

//     fetchJobInfo();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setJobInfo((prevJobInfo) => ({
//       ...prevJobInfo,
//       [name]: value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       const jobRef = doc(db, 'employees', auth.currentUser.uid);
//       await setDoc(jobRef, {
//         'Is Full Time Employee': jobInfo.employmentType === 'Full Time Employment',
//         'Standard Weekly Hours': jobInfo.weeklyHours,
//         'Location': jobInfo.location,
//         'Email': jobInfo.workEmail,
//         'Business Number': jobInfo.workPhone,
//       }, { merge: true });
//       setEditJobInfo(false);
//     } catch (error) {
//       console.error('Error saving job info:', error);
//     }
//   };

//   const InfoItem = ({ icon: Icon, label, value }) => (
//     <div className="mb-6">
//       <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//       <div className="flex items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200">
//         <Icon className="w-5 h-5 text-blue-500 mr-3" />
//         <span className="text-gray-800">{value}</span>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Job Information</h2>
//         <button
//           className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
//           onClick={() => setEditJobInfo(!editJobInfo)}
//         >
//           <FaEdit className="mr-2" />
//           {editJobInfo ? 'Cancel' : 'Edit'}
//         </button>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
//         {editJobInfo ? (
//           <form>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
//                 <select
//                   name="employmentType"
//                   value={jobInfo.employmentType}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-300 ease-in-out"
//                 >
//                   <option value="Full Time Employment">Full Time Employment</option>
//                   <option value="Part Time Employment">Part Time Employment</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Work Hours</label>
//                 <input
//                   type="text"
//                   name="weeklyHours"
//                   value={jobInfo.weeklyHours}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-300 ease-in-out"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={jobInfo.location}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-300 ease-in-out"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
//                 <input
//                   type="email"
//                   name="workEmail"
//                   value={jobInfo.workEmail}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-300 ease-in-out"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
//                 <input
//                   type="tel"
//                   name="workPhone"
//                   value={jobInfo.workPhone}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-300 ease-in-out"
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end">
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 Save
//               </button>
//             </div>
//           </form>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <InfoItem icon={FaBriefcase} label="Employment Type" value={jobInfo.employmentType} />
//             <InfoItem icon={FaClock} label="Weekly Work Hours" value={jobInfo.weeklyHours} />
//             <InfoItem icon={FaMapMarkerAlt} label="Location" value={jobInfo.location} />
//             <InfoItem icon={FaEnvelope} label="Work Email" value={jobInfo.workEmail} />
//             <InfoItem icon={FaPhone} label="Work Phone" value={jobInfo.workPhone} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobInfo;
// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaBriefcase, FaClock, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
// import { auth, doc, getDoc, setDoc, db } from '../Firebase';
import { toast } from 'react-toastify';

const JobInfo = () => {
  const [jobInfo, setJobInfo] = useState({
    employmentType: '',
    weeklyHours: '',
    location: '',
    workEmail: '',
    workPhone: '',
  });
  const [editJobInfo, setEditJobInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobInfo = async () => {
      try {
        setLoading(true);
        let uid = sessionStorage.getItem('uid') || auth.currentUser.uid;
        sessionStorage.setItem('uid', uid);
        const jobRef = doc(db, 'employees', uid);
        const docSnap = await getDoc(jobRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setJobInfo({
            employmentType: data['Is Full Time Employee'] ? 'Full Time Employment' : 'Part Time Employment',
            weeklyHours: data['Standard Weekly Hours'] || '',
            location: data['Location'] || '',
            workEmail: data.Email || '',
            workPhone: data['Business Number'] || '',
          });
        } else {
          throw new Error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching job info:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobInfo();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const uid = sessionStorage.getItem('uid');
      const jobRef = doc(db, 'employees', uid);
      const updatedData = {
        'Is Full Time Employee': jobInfo.employmentType === 'Full Time Employment',
        'Standard Weekly Hours': jobInfo.weeklyHours,
        'Location': jobInfo.location,
        'Email': jobInfo.workEmail,
        'Business Number': jobInfo.workPhone,
      };
      await setDoc(jobRef, updatedData, { merge: true });
      setEditJobInfo(false);
      toast.success('Job information updated successfully');
    } catch (error) {
      console.error('Error updating job info:', error);
      toast.error('Failed to update job information');
    }
  };

  const InfoItem = ({ icon: Icon, label, value, name, editable, type = "text" }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center bg-white rounded-md shadow-sm p-2 border border-gray-200">
        <Icon className="w-5 h-5 text-gray-500 mr-2" />
        {editable ? (
          type === "select" ? (
            <select
              name={name}
              id={name}
              value={value}
              onChange={(e) => setJobInfo({ ...jobInfo, [name]: e.target.value })}
              className="w-full focus:outline-none text-sm"
            >
              <option value="Full Time Employment">Full Time Employment</option>
              <option value="Part Time Employment">Part Time Employment</option>
            </select>
          ) : (
            <input
              type={type}
              name={name}
              id={name}
              value={value}
              onChange={(e) => setJobInfo({ ...jobInfo, [name]: e.target.value })}
              className="w-full focus:outline-none text-sm"
            />
          )
        ) : (
          <span className="text-gray-800 text-sm">{value}</span>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-orange-800">Job Information</h2>
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => setEditJobInfo(!editJobInfo)}
        >
          <FaEdit className="mr-2" />
          {editJobInfo ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={FaBriefcase} label="Employment Type" value={jobInfo.employmentType} name="employmentType" editable={editJobInfo} type="select" />
          <InfoItem icon={FaClock} label="Weekly Work Hours" value={jobInfo.weeklyHours} name="weeklyHours" editable={editJobInfo} />
          <InfoItem icon={FaMapMarkerAlt} label="Location" value={jobInfo.location} name="location" editable={editJobInfo} />
          <InfoItem icon={FaEnvelope} label="Work Email" value={jobInfo.workEmail} name="workEmail" editable={editJobInfo} type="email" />
          <InfoItem icon={FaPhone} label="Work Phone" value={jobInfo.workPhone} name="workPhone" editable={editJobInfo} type="tel" />
        </div>
        {editJobInfo && (
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

export default JobInfo;