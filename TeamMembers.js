import React, { useState, useEffect } from 'react';
import { db } from '../Firebase'; // Adjust path as per your project structure
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MemberDetails from './MemberDetails'; // Adjust path as per your project structure

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLead, setTeamLead] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isTeamLead, setIsTeamLead] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
        fetchTeamMembers(user.email);
      } else {
        setCurrentUser(null);
        setTeamMembers([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTeamMembers = async (userEmail) => {
    setIsLoading(true);
    setError(null);
    try {
      const employeesRef = collection(db, 'employees');

      // Check if the user is a team lead
      const teamLeadQuery = query(employeesRef, where('TeamLeadEmailID', '==', userEmail));
      const teamLeadSnapshot = await getDocs(teamLeadQuery);

      if (!teamLeadSnapshot.empty) {
        setIsTeamLead(true);
        const members = teamLeadSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeamMembers(members);
      } else {
        setIsTeamLead(false);
        // If the user is not a team lead, fetch their team lead's details
        const teamMemberQuery = query(employeesRef, where('Email', '==', userEmail));
        const teamMemberSnapshot = await getDocs(teamMemberQuery);

        if (!teamMemberSnapshot.empty) {
          const userDoc = teamMemberSnapshot.docs[0].data();
          const teamLeadEmail = userDoc.TeamLeadEmailID;

          const teamLeadQuery = query(employeesRef, where('Email', '==', teamLeadEmail));
          const teamLeadSnapshot = await getDocs(teamLeadQuery);

          if (!teamLeadSnapshot.empty) {
            const teamLeadDetails = teamLeadSnapshot.docs[0].data();
            setTeamLead(teamLeadDetails);
          }
        }
      }
    } catch (error) {
      setError('Failed to fetch team members. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleBackToTeamMembers = () => {
    setSelectedMember(null);
  };

  if (!currentUser) {
    return <div className="text-center mt-4 text-red-600">Please log in to view team members.</div>;
  }

  if (isLoading) {
    return <div className="text-center mt-4">Loading team members...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Team Info</h2>
      {selectedMember ? (
        <div>
          <button
            className="text-xl font-bold p-2 rounded bg-gray-200 hover:bg-gray-300 mb-4"
            onClick={handleBackToTeamMembers}
          >
            Back to Team Members
          </button>
          <MemberDetails member={selectedMember} />
        </div>
      ) : isTeamLead ? (
        teamMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Team ID</th>
                  <th className="py-2 px-4 border-b">Job Title</th>
                  <th className="py-2 px-4 border-b">Department</th>
                  <th className="py-2 px-4 border-b">Location</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-100 cursor-pointer">
                    <td className="py-2 px-4 border-b">{member.FirstName} {member.LastName}</td>
                    <td className="py-2 px-4 border-b">{member.Email}</td>
                    <td className="py-2 px-4 border-b">{member.TeamID}</td>
                    <td className="py-2 px-4 border-b">{member.JobTitle}</td>
                    <td className="py-2 px-4 border-b">{member.Department}</td>
                    <td className="py-2 px-4 border-b">{member.Location}</td>
                    <td className="py-2 px-4 border-b text-blue-600" onClick={() => handleMemberClick(member)}>View More</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center mt-4 text-gray-600">No team members found.</p>
        )
      ) : (
        teamLead ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <strong className="text-lg font-bold">{teamLead.FirstName} {teamLead.LastName}</strong><br />
            <p className="text-gray-600">Email: {teamLead.Email}</p>
            <p className="text-gray-600">Team ID: {teamLead.TeamID}</p>
            <p className="text-gray-600">Job Title: {teamLead.JobTitle}</p>
            <p className="text-gray-600">Department: {teamLead.Department}</p>
            <p className="text-gray-600">Location: {teamLead.Location}</p>
          </div>
        ) : (
          <p className="text-center mt-4 text-gray-600">No team lead found.</p>
        )
      )}
    </div>
  );
};

export default TeamMembers;
