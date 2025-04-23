// // import { createContext, useState, useEffect } from "react";
// // import axios from "axios";

// // // Create context with a default value
// // export const AdminContext = createContext({
// //   admin: null,
// //   loading: true,
// //   login: () => {},
// //   logout: () => {},
// // });

// // export const AdminProvider = ({ children }) => {
// //   const [admin, setAdmin] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchAdmin = async () => {
// //       try {
// //         const response = await axios.get("/admin/fetchAdmin", {
// //           withCredentials: true,
// //         });
// //         setAdmin(response.data.data);
// //       } catch (error) {
// //         console.error("Failed to fetch admin:", error);
// //         setAdmin(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchAdmin();
// //   }, []);

// //   const login = async (credentials) => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.post("/admin/loginAdmin", credentials, {
// //         withCredentials: true,
// //       });
// //       setAdmin(response.data.data);
// //       return response.data; // Good practice to return something
// //     } catch (error) {
// //       console.error("Login failed:", error);
// //       throw error;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const logout = async () => {
// //     try {
// //       setLoading(true);
// //       await axios.post("/admin/adminLogout", {}, { withCredentials: true });
// //       setAdmin(null);
// //     } catch (error) {
// //       console.error("Logout failed:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const value = { admin, login, logout, loading };

// //   return (
// //     <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
// //   );
// // };
// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AdminContext = createContext();

// export const AdminProvider = ({ children }) => {
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const fetchAdmin = async () => {
//       try {
//         const response = await axios.get("/admin/fetchAdmin", {
//           withCredentials: true,
//         });
//         setAdmin(response.data.data);
//       } catch (error) {
//         console.error("Failed to fetch admin:", error);
//         setAdmin(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAdmin();
//   }, []);

//   // Login function
//   const login = async (credentials) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "/api/v1/admin/loginAdmin",
//         credentials,
//         {
//           withCredentials: true,
//         }
//       );
//       setAdmin(response.data.data);
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await axios.post(
//         "/api/v1/admin/adminLogout",
//         {},
//         { withCredentials: true }
//       );
//       setAdmin(null);
//     } catch (error) {
//       console.error("Logout failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminContext.Provider value={{ admin, login, logout, loading }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };
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
