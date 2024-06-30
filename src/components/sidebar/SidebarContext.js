import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('salary-table');

  return (
    <SidebarContext.Provider value={{ selectedMenuItem, setSelectedMenuItem }}>
      {children}
    </SidebarContext.Provider>
  );
};
