import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [backendError, setBackendError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup
  const navigate = useNavigate();
  const { login } = useUser();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleValidation = () => {
    let newErrors = { email: "", password: "" };
    if (!email) newErrors.email = "*Please enter your email";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "*Please enter your password";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    setBackendError("");
    const success = await login(email, password);
    if (success) {
      setShowSuccessPopup(true); // Show popup on success
      setTimeout(() => {
        setShowSuccessPopup(false); // Hide popup after 2 seconds
        navigate("/"); // Navigate to homepage
      }, 2000);
    } else {
      setBackendError("Invalid email or password");
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="container mx-auto px-8 py-8 shadow-lg w-1/3 rounded-lg bg-white relative">
        <h2 className="text-4xl font-bold text-gray-700 text-center mb-4">
          Login
        </h2>
        {backendError && (
          <p className="text-red-500 text-center mb-4">{backendError}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
            >
              Login
            </button>
          </div>
          <div className="flex mt-5 justify-between">
            <NavLink
              to="/signup"
              className="font-semibold text-teal-600 hover:underline text-sm"
            >
              New User? Register
            </NavLink>
            <NavLink
              to="/forgot"
              className="font-semibold text-teal-600 hover:underline text-sm"
            >
              Forgot Password?
            </NavLink>
          </div>
        </form>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Login Successful!
              </h3>
              <p className="text-gray-600">Redirecting to homepage...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;

// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useUser } from "../UserContext";

// function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({ email: "", password: "" });
//   const [backendError, setBackendError] = useState("");
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useUser();

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleValidation = () => {
//     let newErrors = { email: "", password: "" };
//     if (!email) newErrors.email = "*Please enter your email";
//     else if (!validateEmail(email)) newErrors.email = "Invalid email format";
//     if (!password) newErrors.password = "*Please enter your password";
//     setErrors(newErrors);
//     return !newErrors.email && !newErrors.password;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!handleValidation()) return;
//     setBackendError("");
//     const success = await login(email, password);
//     if (success) {
//       setShowSuccessPopup(true);
//       setTimeout(() => {
//         setShowSuccessPopup(false);
//         navigate("/");
//       }, 2000);
//     } else {
//       setBackendError("Invalid email or password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 p-4">
//       <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-700">
//         <h2 className="text-4xl font-extrabold text-white text-center mb-6">
//           Welcome Back
//         </h2>
//         {backendError && (
//           <p className="text-red-400 text-center mb-4 font-medium">
//             {backendError}
//           </p>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-300 mb-2">
//               Email
//             </label>
//             <input
//               className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               autoComplete="email"
//             />
//             {errors.email && (
//               <p className="text-red-400 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-300 mb-2">
//               Password
//             </label>
//             <input
//               className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               autoComplete="current-password"
//             />
//             {errors.password && (
//               <p className="text-red-400 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>
//           <div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
//             >
//               Login
//             </button>
//           </div>
//           <div className="flex justify-between text-sm">
//             <NavLink
//               to="/signup"
//               className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
//             >
//               New User? Register
//             </NavLink>
//             <NavLink
//               to="/forgot"
//               className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
//             >
//               Forgot Password?
//             </NavLink>
//           </div>
//         </form>

//         {/* Success Popup */}
//         {showSuccessPopup && (
//           <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
//             <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl shadow-2xl w-full max-w-sm text-center transform scale-100 transition-transform duration-300">
//               <h3 className="text-2xl font-bold text-white mb-2">
//                 Login Successful!
//               </h3>
//               <p className="text-gray-100">Redirecting to homepage...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LoginPage;
