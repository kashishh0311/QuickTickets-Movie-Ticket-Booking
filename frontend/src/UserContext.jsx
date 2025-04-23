import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axios.get("/user/getuser", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          setUser({ ...response.data.data, token });
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const { user, accessToken } = response.data.data;
      setUser({ ...user, token: accessToken }); // Map accessToken to token
      localStorage.setItem("accessToken", accessToken);
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "/user/refresh",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const newToken = response.data.data.accessToken;
      setUser({ ...user, token: newToken });
      localStorage.setItem("accessToken", newToken);
      return newToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  };

  const value = { user, setUser, isLoading, login, logout, refreshToken };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("useUser must be used within a UserProvider");
  return context;
};

export default UserContext;
