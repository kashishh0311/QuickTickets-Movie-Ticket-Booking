// // import React, { useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import axios from "axios";

// // function ResetPassword() {
// //   const [password, setPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const [successMessage, setSuccessMessage] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const navigate = useNavigate();
// //   const { token } = useParams(); // Capture reset token from URL

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!password || !confirmPassword) {
// //       setError("Both fields are required");
// //       return;
// //     }
// //     if (password.length < 6) {
// //       setError("Password must be at least 6 characters long");
// //       return;
// //     }
// //     if (password !== confirmPassword) {
// //       setError("Passwords do not match");
// //       return;
// //     }

// //     setIsLoading(true);
// //     setError("");
// //     setSuccessMessage("");

// //     try {
// //       const response = await axios.post(`/user/resetPassword/${token}`, {
// //         password,
// //       });
// //       setSuccessMessage(response.data.message || "Password reset successful!");
// //       setTimeout(() => navigate("/login"), 2000);
// //     } catch (error) {
// //       setError(
// //         error.response?.data?.message ||
// //           "Failed to reset password. Please try again."
// //       );
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="bg-gray-100 h-screen flex items-center justify-center">
// //       <div className="container mx-auto px-8 py-8 shadow-lg w-1/3 rounded-lg bg-white">
// //         <h2 className="text-3xl font-bold text-gray-700 text-center mb-4">
// //           Reset Password
// //         </h2>
// //         <p className="text-sm text-gray-600 text-center mb-6">
// //           Enter your new password below.
// //         </p>

// //         {successMessage && (
// //           <p className="text-green-600 text-center mb-4">{successMessage}</p>
// //         )}
// //         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

// //         <form onSubmit={handleSubmit}>
// //           <div className="mb-4">
// //             <label className="block text-gray-600 text-sm font-bold mb-2">
// //               New Password
// //             </label>
// //             <input
// //               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               placeholder="Enter new password"
// //               autoComplete="new-password"
// //               disabled={isLoading}
// //             />
// //           </div>

// //           <div className="mb-4">
// //             <label className="block text-gray-600 text-sm font-bold mb-2">
// //               Confirm Password
// //             </label>
// //             <input
// //               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
// //               type="password"
// //               value={confirmPassword}
// //               onChange={(e) => setConfirmPassword(e.target.value)}
// //               placeholder="Confirm new password"
// //               autoComplete="new-password"
// //               disabled={isLoading}
// //             />
// //           </div>

// //           <div className="text-center mt-4">
// //             <button
// //               type="submit"
// //               className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 disabled:bg-teal-400"
// //               disabled={isLoading}
// //             >
// //               {isLoading ? "Resetting..." : "Reset Password"}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default ResetPassword;

// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await axios.post(`/user/resetPassword/${token}`, {
//         password,
//       });
//       setSuccess(response.data.message);
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         {success && <p className="text-green-500 text-center">{success}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="password"
//             placeholder="New Password"
//             className="w-full p-2 border rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Confirm New Password"
//             className="w-full p-2 border rounded"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const { token } = useParams();
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 8; // Basic validation - adjust as needed
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!password) {
      setError("Please enter a new password");
      return;
    } else if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Updated API endpoint to match your backend route
      const response = await axios.post(`/user/resetPassword/${token}`, {
        password,
      });

      setSuccessMessage(response.data.message || "Password reset successful!");

      // Redirect to login after success
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reset password. The link may be invalid or expired."
      );
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-8 py-8 shadow-lg max-w-md rounded-lg bg-white">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-4">
          Reset Password
        </h2>

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isTokenValid ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 disabled:bg-teal-400"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center mb-4">
            <p className="mb-4">
              This password reset link is invalid or has expired.
            </p>
            <NavLink
              to="/forgot-password"
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 inline-block"
            >
              Request New Link
            </NavLink>
          </div>
        )}

        <div className="text-center mt-6">
          <NavLink
            to="/login"
            className="text-teal-600 text-sm font-semibold hover:underline"
          >
            Back to Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
