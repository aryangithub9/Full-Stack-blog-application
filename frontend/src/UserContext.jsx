// UserContext.js
import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [UserInfo, setUserInfo] = useState(null);

  return (
    <UserContext.Provider value={{ UserInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
