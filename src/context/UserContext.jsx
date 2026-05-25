import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    }
  }, [user]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};