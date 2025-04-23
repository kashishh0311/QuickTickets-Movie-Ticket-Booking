import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDiv, setShowDiv] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const { user, logout, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      if (searchQuery.trim() === "") {
        setSearchResult([]);
        setShowDiv(false);
        return;
      }
      try {
        const response = await axios.get("/user/getMoviebyTitle", {
          params: { title: searchQuery.trim() },
        });
        const movies = response.data.data;
        setSearchResult(movies);
        setShowDiv(movies.length > 0);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setSearchResult([]);
        setShowDiv(false);
      }
    };
    fetchMovies();
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div>
      <nav className="bg-gray-900 p-4 relative">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <NavLink to="/" className="flex items-center">
            {/* <a href="#" className="flex items-center"> */}
            <svg
              className="fill-current h-8 w-8 text-white mr-2"
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
            <span className="text-teal-600 text-2xl font-bold">
              QuickTickets
            </span>
            {/* </a> */}
          </NavLink>
          <div className="flex items-center">
            <ul className="flex space-x-4 mr-6">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `hover:text-teal-500 ${
                      isActive ? "text-teal-600" : "text-gray-300"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/movieList"
                  className={({ isActive }) =>
                    `hover:text-teal-500 ${
                      isActive ? "text-teal-600" : "text-gray-300"
                    }`
                  }
                >
                  Movie List
                </NavLink>
              </li>
              {isLoading ? (
                <li>Loading...</li>
              ) : user ? (
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
            </ul>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Movies.."
                className="bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-600 w-64"
              />
              <button
                type="submit"
                className="absolute text-teal-600 left-3 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showDiv && (
                <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-2 w-64 max-h-48 overflow-y-auto border border-gray-200 z-50 top-full left-0">
                  {searchResult.map((movie) => (
                    <NavLink to={`/movie/${movie._id}`} key={movie._id}>
                      <div
                        className="p-2 border-b hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          setSearchResult([]);
                          setShowDiv(false);
                          setSearchQuery("");
                        }}
                      >
                        <img
                          src={movie.poster || "https://via.placeholder.com/40"}
                          alt={movie.title}
                          className="h-10 w-10 rounded mr-2"
                        />
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {movie.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {movie.genre || "N/A"}
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
            {user && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `hover:text-teal-500 pl-5 ${
                    isActive ? "text-teal-600" : "text-gray-300"
                  }`
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12z"></path>
                  <path d="M4 21v-1.5c0-2.5 2-4.5 4.5-4.5h7c2.5 0 4.5 2 4.5 4.5V21"></path>
                </svg>
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;

// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useUser } from "../UserContext";

// function Header() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showDiv, setShowDiv] = useState(false);
//   const [searchResult, setSearchResult] = useState([]);
//   const { user, logout, isLoading } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMovies = async () => {
//       if (searchQuery.trim() === "") {
//         setSearchResult([]);
//         setShowDiv(false);
//         return;
//       }
//       try {
//         const response = await axios.get("/user/getMoviebyTitle", {
//           params: { title: searchQuery.trim() },
//         });
//         const movies = response.data.data;
//         setSearchResult(movies);
//         setShowDiv(movies.length > 0);
//       } catch (error) {
//         console.error("Error fetching movies:", error);
//         setSearchResult([]);
//         setShowDiv(false);
//       }
//     };
//     fetchMovies();
//   }, [searchQuery]);

//   const handleLogout = async () => {
//     await logout();
//     navigate("/");
//   };

//   return (
//     <nav className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-800 p-4 shadow-lg">
//       <div className="container mx-auto flex items-center justify-between">
//         {/* Logo */}
//         <NavLink to="/" className="flex items-center space-x-2">
//           <svg
//             className="h-8 w-8 text-indigo-400"
//             viewBox="0 0 54 54"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M13.5 22.1c1.2-7.2 6.3-12.1 13.3-12.1 7 0 12.1 4.9 13.3 12.1 1.2 7.2-6.3 12.1-13.3 12.1-7 0-12.1-4.9-13.3-12.1zM24 20.1v-2.1c-1.5-1.3-3.5-2.2-5.7-2.2-2.2 0-4.2.9-5.7 2.2v2.1c-1.1.9-1.8 2.2-1.8 3.7 0 1.5.7 2.8 1.8 3.7v5.1c0 .8.7 1.5 1.5 1.5h10c.8 0 1.5-.7 1.5-1.5v-5.1c1.1-.9 1.8-2.2 1.8-3.7 0-1.5-.7-2.8-1.8-3.7z"
//               fill="currentColor"
//             />
//           </svg>
//           <span className="text-2xl font-extrabold text-white tracking-tight">
//             QuickTickets
//           </span>
//         </NavLink>

//         {/* Navigation and Search */}
//         <div className="flex items-center space-x-8">
//           {/* Navigation Links */}
//           <ul className="flex space-x-6 text-gray-300">
//             <li>
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `font-medium transition-colors duration-200 ${
//                     isActive ? "text-indigo-400" : "hover:text-indigo-300"
//                   }`
//                 }
//               >
//                 Home
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/movieList"
//                 className={({ isActive }) =>
//                   `font-medium transition-colors duration-200 ${
//                     isActive ? "text-indigo-400" : "hover:text-indigo-300"
//                   }`
//                 }
//               >
//                 Movie List
//               </NavLink>
//             </li>
//             {isLoading ? (
//               <li className="text-gray-400">Loading...</li>
//             ) : user ? (
//               <li>
//                 <button
//                   onClick={handleLogout}
//                   className="font-medium hover:text-indigo-300 transition-colors duration-200"
//                 >
//                   Logout
//                 </button>
//               </li>
//             ) : (
//               <li>
//                 <NavLink
//                   to="/login"
//                   className={({ isActive }) =>
//                     `font-medium transition-colors duration-200 ${
//                       isActive ? "text-indigo-400" : "hover:text-indigo-300"
//                     }`
//                   }
//                 >
//                   Login
//                 </NavLink>
//               </li>
//             )}
//           </ul>

//           {/* Search Bar */}
//           <div className="relative">
//             <div className="flex items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 text-gray-400 absolute left-3"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search Movies..."
//                 className="bg-gray-800 bg-opacity-50 text-white rounded-full py-2 pl-10 pr-4 w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 placeholder-gray-400"
//               />
//             </div>
//             {showDiv && (
//               <div className="absolute top-full left-0 mt-2 w-72 bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 border border-gray-700">
//                 {searchResult.map((movie) => (
//                   <NavLink to={`/movie/${movie._id}`} key={movie._id}>
//                     <div
//                       className="p-3 hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-200"
//                       onClick={() => {
//                         setSearchResult([]);
//                         setShowDiv(false);
//                         setSearchQuery("");
//                       }}
//                     >
//                       <img
//                         src={movie.poster || "https://via.placeholder.com/40"}
//                         alt={movie.title}
//                         className="h-12 w-12 rounded-md object-cover"
//                       />
//                       <div>
//                         <p className="text-white font-semibold">
//                           {movie.title}
//                         </p>
//                         <p className="text-sm text-gray-400">
//                           {movie.genre || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   </NavLink>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Profile Icon */}
//           {user && (
//             <NavLink
//               to="/profile"
//               className={({ isActive }) =>
//                 `text-gray-300 hover:text-indigo-300 transition-colors duration-200 ${
//                   isActive ? "text-indigo-400" : ""
//                 }`
//               }
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="28"
//                 height="28"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12z"></path>
//                 <path d="M4 21v-1.5c0-2.5 2-4.5 4.5-4.5h7c2.5 0 4.5 2 4.5 4.5V21"></path>
//               </svg>
//             </NavLink>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Header;
