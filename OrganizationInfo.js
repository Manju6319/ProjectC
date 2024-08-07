import React from 'react';
import { Building2, Globe, MapPin, Phone } from 'lucide-react';

const OrganizationalInfo = () => {
  const orgInfo = {
    organizationName: 'MarkAtlasInkjet',
    typeOfOrganization: 'IT Dept.',
    establishedIn: '2021',
    website: 'https://markatlasinkjettechnologies.com/',
    location: 'Hyderabad',
    contactNo: '+91 xxxxxxxxxx',
  };

  const InfoItem = ({ icon: Icon, label, value, isLink = false }) => (
    <div className="mb-4">
      <label htmlFor={label.toLowerCase().replace(' ', '-')} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center bg-white rounded-md shadow-sm p-2 border border-gray-200">
        <Icon className="w-5 h-5 text-gray-500 mr-2" />
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
            {value}
          </a>
        ) : (
          <span className="text-gray-800 text-sm">{value}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-orange-800 mb-6">Organization Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={Building2} label="Organization Name" value={orgInfo.organizationName} />
        <InfoItem icon={Building2} label="Type of Organization" value={orgInfo.typeOfOrganization} />
        <InfoItem icon={Building2} label="Established In" value={orgInfo.establishedIn} />
        <InfoItem icon={Globe} label="Website" value={orgInfo.website} isLink={true} />
        <InfoItem icon={MapPin} label="Location" value={orgInfo.location} />
        <InfoItem icon={Phone} label="Organization Contact No." value={orgInfo.contactNo} />
      </div>
    </div>
  );
};

export default OrganizationalInfo;