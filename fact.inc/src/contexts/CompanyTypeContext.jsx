import React, { createContext, useContext, useState } from 'react';

//  Create the Context
const CompanyTypeContext = createContext();

//  Create Provider Component
export const CompanyTypeProvider = ({ children }) => {
    const [companyType, setCompanyType] = useState(null);
      const [availableName, setAvailableName] = useState('');


    return (
        <CompanyTypeContext.Provider value={{ companyType, setCompanyType, availableName,
      setAvailableName }}>
            {children}
        </CompanyTypeContext.Provider>
    );
};

//  Custom Hook for easier use in components
export const useCompanyType = () => {
    const context = useContext(CompanyTypeContext);
    if (!context) {
        throw new Error('useCompanyType must be used within a CompanyTypeProvider');
    }
    return context;
};