import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const ICTAdmin = () => {
  // ============================================
  // SHARED STATE - Employee Data
  // This state is shared between EmployeeData and UserData
  // ============================================
  const [employees, setEmployees] = useState([
    { id: 1, fullName: 'አስቴር አለሙ', idNumber: 'REV-001', taxCenter: 'አዲስ አበባ ቅዱስ ጊዮርጊስ' },
    { id: 2, fullName: 'ተስፋዬ መኮንን', idNumber: 'REV-002', taxCenter: 'አዲስ አበባ ቦሌ' },
    { id: 3, fullName: 'ሰላም አበበ', idNumber: 'REV-003', taxCenter: 'አዲስ አበባ መኩሪያ' },
    { id: 4, fullName: 'ዳዊት ሀይለማርያም', idNumber: 'REV-004', taxCenter: 'አዲስ አበባ ሳሪስ' },
    { id: 5, fullName: 'ሄለን ገብረእግዚአብሔር', idNumber: 'REV-005', taxCenter: 'አዲስ አበባ ካዛንቺስ' },
    { id: 6, fullName: 'አብይ አህመድ', idNumber: 'REV-006', taxCenter: 'አዲስ አበባ ላፍቶ' },
    { id: 7, fullName: 'ማርያም በቀለ', idNumber: 'REV-007', taxCenter: 'አዲስ አበባ ጉለሌ' },
    { id: 8, fullName: 'ሳሙኤል ተስፋዬ', idNumber: 'REV-008', taxCenter: 'አዲስ አበባ ቀላም' },
  ]);

  return (
    <div className="page-content">
      {/* Content - Pass shared state to child components */}
      <Outlet context={{ employees, setEmployees }} />
    </div>
  );
};

export default ICTAdmin;