import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get("/api/v1/admin/fetchAdmin", {
          withCredentials: true,
        });
        setAdmin(response.data.data);
      } catch (error) {
        console.error("Failed to fetch admin:", error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post("/admin/loginAdmin", credentials, {
        withCredentials: true,
      });
      setAdmin(response.data.data);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        "/api/v1/admin/adminLogout",
        {},
        { withCredentials: true }
      );
      setAdmin(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
