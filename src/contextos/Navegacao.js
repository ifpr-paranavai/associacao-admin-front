import React, { createContext, useState, useContext } from 'react';

export const NavigationContext = createContext({
  location: {},
  setLocation: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [location, setLocation] = useState(false);

  return (
    <NavigationContext.Provider value={{ location, setLocation }}>
      {children}
    </NavigationContext.Provider>
  );
};
