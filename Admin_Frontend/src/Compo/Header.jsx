import { React, useContext, useState } from "react"; // Added useState
import { NavLink, useNavigate } from "react-router-dom";
import { AdminContext } from "../AdminContext";
import { toast, ToastContainer } from "react-toastify";
function Header() {
  const { admin, logout, loading } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful!", { autoClose: 2000 });
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <svg
            className="fill-current h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 22.1c1.2-7.2 6.3-12.1 13.3-12.1 7 0 12.1 4.9 13.3 12.1 1.2 7.2-6.3 12.1-13.3 12.1-7 0-12.1-4.9-13.3-12.1zM24 20.1v-2.1c-1.5-1.3-3.5-2.2-5.7-2.2-2.2 0-4.2.9-5.7 2.2v2.1c-1.1.9-1.8 2.2-1.8 3.7 0 1.5.7 2.8 1.8 3.7v5.1c0 .8.7 1.5 1.5 1.5h10c.8 0 1.5-.7 1.5-1.5v-5.1c1.1-.9 1.8-2.2 1.8-3.7 0-1.5-.7-2.8-1.8-3.7z"
              fill="#FFF"
            />
          </svg>
          <span className="text-teal-500 text-2xl font-bold">QuickTickets</span>
        </NavLink>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="custom-toast-container"
        />
        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6 text-lg">
            {[
              { name: "Dashboard", path: "/" },
              { name: "Users", path: "/user" },
              { name: "Movies", path: "/movie" },
              { name: "Show", path: "/showTime" },
              { name: "Seat", path: "/seat" },
              { name: "Bookings", path: "/booking" },
              { name: "Report", path: "/report" },
            ].map(({ name, path }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `hover:text-teal-500 ${
                      isActive ? "text-teal-600" : "text-gray-300"
                    }`
                  }
                >
                  {name}
                </NavLink>
              </li>
            ))}
            {/* Conditional Login/Logout */}
            {loading ? (
              <li className="text-gray-300">Loading...</li>
            ) : admin ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-teal-500 text-gray-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `hover:text-teal-500 ${
                      isActive ? "text-teal-600" : "text-gray-300"
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/feedback"
                className={({ isActive }) =>
                  `hover:text-teal-500 ${
                    isActive ? "text-teal-600" : "text-gray-300"
                  }`
                }
              >
                Feedback
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
      />
    </header>
  );
}

export default Header;
