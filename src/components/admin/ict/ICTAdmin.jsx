import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const ICTAdmin = () => {
  const [employees, setEmployees] = useState([
    { id: 1, fullName: 'አስቴር አለሙ', idNumber: 'REV-001', taxCenter: 'አዲስ አበባ ቅዱስ ጊዮርጊስ', role: 'ICT Administrator', jobCategory: 'ICT Administrator', status: 'Active', identityCreated: false, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: 2, fullName: 'ተስፋዬ መኮንን', idNumber: 'REV-002', taxCenter: 'አዲስ አበባ ቦሌ', role: 'Officer', jobCategory: 'Officer', status: 'Active', identityCreated: false, createdAt: '2024-02-10', updatedAt: '2024-02-10' },
    { id: 3, fullName: 'ሰላም አበበ', idNumber: 'REV-003', taxCenter: 'አዲስ አበባ መኩሪያ', role: 'Authority', jobCategory: 'Authority', status: 'Active', identityCreated: false, createdAt: '2024-03-05', updatedAt: '2024-03-05' },
    { id: 4, fullName: 'ዳዊት ሀይለማርያም', idNumber: 'REV-004', taxCenter: 'አዲስ አበባ ሳሪስ', role: 'Officer', jobCategory: 'Officer', status: 'Inactive', identityCreated: false, createdAt: '2024-04-20', updatedAt: '2024-04-20' },
    { id: 5, fullName: 'ሄለን ገብረእግዚአብሔር', idNumber: 'REV-005', taxCenter: 'አዲስ አበባ ካዛንቺስ', role: 'ICT Administrator', jobCategory: 'ICT Administrator', status: 'Active', identityCreated: false, createdAt: '2024-05-12', updatedAt: '2024-05-12' },
    { id: 6, fullName: 'አብይ አህመድ', idNumber: 'REV-006', taxCenter: 'አዲስ አበባ ላፍቶ', role: 'Officer', jobCategory: 'Officer', status: 'Pending', identityCreated: false, createdAt: '2024-06-18', updatedAt: '2024-06-18' },
    { id: 7, fullName: 'ማርያም በቀለ', idNumber: 'REV-007', taxCenter: 'አዲስ አበባ ጉለሌ', role: 'Authority', jobCategory: 'Authority', status: 'Active', identityCreated: false, createdAt: '2024-07-22', updatedAt: '2024-07-22' },
    { id: 8, fullName: 'ሳሙኤል ተስፋዬ', idNumber: 'REV-008', taxCenter: 'አዲስ አበባ ቀላም', role: 'Officer', jobCategory: 'Officer', status: 'Inactive', identityCreated: false, createdAt: '2024-08-30', updatedAt: '2024-08-30' },
  ]);

  return (
    <div className="p-4 md:p-6 w-full text-slate-800 dark:text-slate-100">
      <Outlet context={{ employees, setEmployees }} />
    </div>
  );
};

export default ICTAdmin;