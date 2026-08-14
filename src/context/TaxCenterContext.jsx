import React, { createContext, useState, useContext } from 'react';

// Create Context
const TaxCenterContext = createContext();

// Provider Component
export const TaxCenterProvider = ({ children }) => {
  const [taxCenters, setTaxCenters] = useState([
    { id: 1, name: 'አዲስ አበባ ቅዱስ ጊዮርጊስ' },
    { id: 2, name: 'አዲስ አበባ ቦሌ' },
    { id: 3, name: 'አዲስ አበባ መኩሪያ' },
    { id: 4, name: 'አዲስ አበባ ሳሪስ' },
    { id: 5, name: 'አዲስ አበባ ካዛንቺስ' },
    { id: 6, name: 'አዲስ አበባ ላፍቶ' },
    { id: 7, name: 'አዲስ አበባ ጉለሌ' },
    { id: 8, name: 'አዲስ አበባ ቀላም' },
  ]);

  // Add a new tax center
  const addTaxCenter = (newCenter) => {
    setTaxCenters(prev => [...prev, newCenter]);
  };

  // Get tax center names for dropdowns
  const getTaxCenterNames = () => {
    return taxCenters.map(center => center.name);
  };

  return (
    <TaxCenterContext.Provider value={{ taxCenters, addTaxCenter, getTaxCenterNames }}>
      {children}
    </TaxCenterContext.Provider>
  );
};

// Custom hook to use the context
export const useTaxCenters = () => {
  const context = useContext(TaxCenterContext);
  if (!context) {
    throw new Error('useTaxCenters must be used within a TaxCenterProvider');
  }
  return context;
};

export default TaxCenterContext;