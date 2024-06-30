// src/contexts/DashboardContext.js

import React, { createContext, useState } from 'react';

const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('salary-table');

  return (
    <DashboardContext.Provider value={{ selectedMenuItem, setSelectedMenuItem }}>
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardProvider };
