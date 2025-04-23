// // // // // frontend/src/pages/AllFeedback.jsx
// // // // import React, { useState, useEffect } from "react";
// // // // import axios from "axios";

// // // // const AllFeedback = () => {
// // // //   const [feedbackData, setFeedbackData] = useState(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);
// // // //   const [filters, setFilters] = useState({
// // // //     category: "",
// // // //     minRating: "",
// // // //     maxRating: "",
// // // //     page: 1,
// // // //   });

// // // //   useEffect(() => {
// // // //     fetchFeedback();
// // // //   }, [filters]);

// // // //   const fetchFeedback = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const response = await axios.get("/admin/getAllFeedback", {
// // // //         params: filters,
// // // //       });
// // // //       setFeedbackData(response.data.data);
// // // //     } catch (err) {
// // // //       setError(err.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleFilterChange = (e) => {
// // // //     setFilters({
// // // //       ...filters,
// // // //       [e.target.name]: e.target.value,
// // // //     });
// // // //   };

// // // //   if (loading) return <div>Loading...</div>;
// // // //   if (error) return <div>Error: {error}</div>;

// // // //   return (
// // // //     <div className="container mx-auto p-4">
// // // //       <h1 className="text-2xl font-bold mb-4">All Feedback</h1>

// // // //       {/* Filters */}
// // // //       <div className="mb-4 flex gap-4">
// // // //         <select
// // // //           name="category"
// // // //           value={filters.category}
// // // //           onChange={handleFilterChange}
// // // //           className="border p-2"
// // // //         >
// // // //           <option value="">All Categories</option>
// // // //           <option value="movie">Movie</option>
// // // //           <option value="booking">Booking</option>
// // // //           <option value="service">Service</option>
// // // //           <option value="other">Other</option>
// // // //         </select>

// // // //         <input
// // // //           type="number"
// // // //           name="minRating"
// // // //           value={filters.minRating}
// // // //           onChange={handleFilterChange}
// // // //           placeholder="Min Rating"
// // // //           min="1"
// // // //           max="5"
// // // //           className="border p-2"
// // // //         />

// // // //         <input
// // // //           type="number"
// // // //           name="maxRating"
// // // //           value={filters.maxRating}
// // // //           onChange={handleFilterChange}
// // // //           placeholder="Max Rating"
// // // //           min="1"
// // // //           max="5"
// // // //           className="border p-2"
// // // //         />
// // // //       </div>

// // // //       {/* Feedback List */}
// // // //       <div className="grid gap-4">
// // // //         {feedbackData.feedback.map((item) => (
// // // //           <div key={item._id} className="border p-4 rounded">
// // // //             <p>
// // // //               <strong>User:</strong> {item.user.fullName}
// // // //             </p>
// // // //             <p>
// // // //               <strong>Message:</strong> {item.message}
// // // //             </p>
// // // //             {item.rating && (
// // // //               <p>
// // // //                 <strong>Rating:</strong> {item.rating}/5
// // // //               </p>
// // // //             )}
// // // //             <p>
// // // //               <strong>Category:</strong> {item.category}
// // // //             </p>
// // // //             {item.relatedMovie && (
// // // //               <p>
// // // //                 <strong>Movie:</strong> {item.relatedMovie.title}
// // // //               </p>
// // // //             )}
// // // //             <p>
// // // //               <strong>Date:</strong>{" "}
// // // //               {new Date(item.createdAt).toLocaleDateString()}
// // // //             </p>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {/* Pagination */}
// // // //       {feedbackData.pagination && (
// // // //         <div className="mt-4">
// // // //           <p>
// // // //             Page {feedbackData.pagination.currentPage} of{" "}
// // // //             {feedbackData.pagination.totalPages}
// // // //           </p>
// // // //           <button
// // // //             onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
// // // //             disabled={filters.page === 1}
// // // //             className="mr-2 p-2 border"
// // // //           >
// // // //             Previous
// // // //           </button>
// // // //           <button
// // // //             onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
// // // //             disabled={filters.page === feedbackData.pagination.totalPages}
// // // //             className="p-2 border"
// // // //           >
// // // //             Next
// // // //           </button>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AllFeedback;
// // // import React, { useState, useEffect } from "react";
// // // import axios from "axios";

// // // const AllFeedback = () => {
// // //   const [feedbackData, setFeedbackData] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [filters, setFilters] = useState({
// // //     category: "",
// // //     minRating: "",
// // //     maxRating: "",
// // //     page: 1,
// // //   });

// // //   useEffect(() => {
// // //     fetchFeedback();
// // //   }, [filters]);

// // //   const fetchFeedback = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.get("/admin/getAllFeedback", {
// // //         params: filters,
// // //       });
// // //       setFeedbackData(response.data.data);
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleFilterChange = (e) => {
// // //     setFilters({
// // //       ...filters,
// // //       [e.target.name]: e.target.value,
// // //     });
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen">
// // //         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen">
// // //         <div className="text-red-500 text-xl font-semibold bg-red-100 p-4 rounded-lg">
// // //           Error: {error}
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="container mx-auto p-6 max-w-5xl">
// // //       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// // //         All Feedback
// // //       </h1>

// // //       {/* Filters */}
// // //       <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4">
// // //         <select
// // //           name="category"
// // //           value={filters.category}
// // //           onChange={handleFilterChange}
// // //           className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //         >
// // //           <option value="">All Categories</option>
// // //           <option value="movie">Movie</option>
// // //           <option value="booking">Booking</option>
// // //           <option value="service">Service</option>
// // //           <option value="other">Other</option>
// // //         </select>

// // //         <input
// // //           type="number"
// // //           name="minRating"
// // //           value={filters.minRating}
// // //           onChange={handleFilterChange}
// // //           placeholder="Min Rating (1-5)"
// // //           min="1"
// // //           max="5"
// // //           className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //         />

// // //         <input
// // //           type="number"
// // //           name="maxRating"
// // //           value={filters.maxRating}
// // //           onChange={handleFilterChange}
// // //           placeholder="Max Rating (1-5)"
// // //           min="1"
// // //           max="5"
// // //           className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //         />
// // //       </div>

// // //       {/* Feedback List */}
// // //       <div className="grid gap-6">
// // //         {feedbackData.feedback.map((item) => (
// // //           <div
// // //             key={item._id}
// // //             className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition-shadow duration-300"
// // //           >
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //               <div>
// // //                 <p className="text-gray-700">
// // //                   <strong className="text-gray-900">User:</strong>{" "}
// // //                   {item.user.fullName}
// // //                 </p>
// // //                 <p className="text-gray-700">
// // //                   <strong className="text-gray-900">Message:</strong>{" "}
// // //                   {item.message}
// // //                 </p>
// // //                 {item.rating && (
// // //                   <p className="text-gray-700">
// // //                     <strong className="text-gray-900">Rating:</strong>{" "}
// // //                     <span className="text-yellow-500">{item.rating}/5 ★</span>
// // //                   </p>
// // //                 )}
// // //               </div>
// // //               <div>
// // //                 <p className="text-gray-700">
// // //                   <strong className="text-gray-900">Category:</strong>{" "}
// // //                   <span className="capitalize">{item.category}</span>
// // //                 </p>
// // //                 {item.relatedMovie && (
// // //                   <p className="text-gray-700">
// // //                     <strong className="text-gray-900">Movie:</strong>{" "}
// // //                     {item.relatedMovie.title}
// // //                   </p>
// // //                 )}
// // //                 <p className="text-gray-600 text-sm">
// // //                   <strong className="text-gray-900">Date:</strong>{" "}
// // //                   {new Date(item.createdAt).toLocaleDateString()}
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Pagination */}
// // //       {feedbackData.pagination && (
// // //         <div className="mt-8 flex justify-center items-center gap-4">
// // //           <button
// // //             onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
// // //             disabled={filters.page === 1}
// // //             className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
// // //               filters.page === 1
// // //                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
// // //                 : "bg-blue-500 text-white hover:bg-blue-600"
// // //             }`}
// // //           >
// // //             Previous
// // //           </button>
// // //           <p className="text-gray-700">
// // //             Page {feedbackData.pagination.currentPage} of{" "}
// // //             {feedbackData.pagination.totalPages}
// // //           </p>
// // //           <button
// // //             onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
// // //             disabled={filters.page === feedbackData.pagination.totalPages}
// // //             className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
// // //               filters.page === feedbackData.pagination.totalPages
// // //                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
// // //                 : "bg-blue-500 text-white hover:bg-blue-600"
// // //             }`}
// // //           >
// // //             Next
// // //           </button>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default AllFeedback;
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";

// // const AllFeedback = () => {
// //   const [feedbackData, setFeedbackData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [filters, setFilters] = useState({
// //     category: "",
// //     minRating: "",
// //     maxRating: "",
// //     page: 1,
// //   });
// //   const [expandedFeedback, setExpandedFeedback] = useState(null); // Track expanded feedback

// //   useEffect(() => {
// //     fetchFeedback();
// //   }, [filters]);

// //   const fetchFeedback = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get("/admin/getAllFeedback", {
// //         params: filters,
// //       });
// //       setFeedbackData(response.data.data);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleFilterChange = (e) => {
// //     setFilters({
// //       ...filters,
// //       [e.target.name]: e.target.value,
// //       page: 1,
// //     });
// //   };

// //   const toggleExpand = (id) => {
// //     setExpandedFeedback(expandedFeedback === id ? null : id);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
// //         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
// //         <div className="bg-red-100 text-red-700 p-6 rounded-xl shadow-lg text-lg font-semibold animate-pulse">
// //           Error: {error}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-6xl mx-auto">
// //         <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center tracking-wide animate-fade-in">
// //           Feedback Spotlight
// //         </h1>

// //         {/* Filters */}
// //         <div className="bg-white rounded-xl p-6 mb-10 shadow-sm border border-gray-200 animate-slide-up">
// //           <h2 className="text-xl font-semibold text-gray-800 mb-4">
// //             Refine Your View
// //           </h2>
// //           <div className="flex flex-col sm:flex-row gap-4">
// //             <select
// //               name="category"
// //               value={filters.category}
// //               onChange={handleFilterChange}
// //               className="w-full sm:w-1/3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 transition-all duration-200"
// //             >
// //               <option value="">All Categories</option>
// //               <option value="movie">Movie</option>
// //               <option value="booking">Booking</option>
// //               <option value="service">Service</option>
// //               <option value="other">Other</option>
// //             </select>

// //             <input
// //               type="number"
// //               name="minRating"
// //               value={filters.minRating}
// //               onChange={handleFilterChange}
// //               placeholder="Min Rating (1-5)"
// //               min="1"
// //               max="5"
// //               className="w-full sm:w-1/3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 transition-all duration-200"
// //             />

// //             <input
// //               type="number"
// //               name="maxRating"
// //               value={filters.maxRating}
// //               onChange={handleFilterChange}
// //               placeholder="Max Rating (1-5)"
// //               min="1"
// //               max="5"
// //               className="w-full sm:w-1/3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 transition-all duration-200"
// //             />
// //           </div>
// //         </div>

// //         {/* Feedback List */}
// //         <div className="space-y-6">
// //           {feedbackData.feedback.length > 0 ? (
// //             feedbackData.feedback.map((item) => (
// //               <div
// //                 key={item._id}
// //                 className="bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-md animate-slide-up"
// //               >
// //                 <div className="flex flex-col">
// //                   {/* Header */}
// //                   <div
// //                     className="flex items-center justify-between cursor-pointer"
// //                     onClick={() => toggleExpand(item._id)}
// //                   >
// //                     <div className="flex items-center gap-4">
// //                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
// //                         {item.user.fullName.charAt(0)}
// //                       </div>
// //                       <div>
// //                         <h3 className="text-lg font-semibold text-gray-800">
// //                           {item.user.fullName}
// //                         </h3>
// //                         <p className="text-sm text-gray-500">
// //                           {new Date(item.createdAt).toLocaleDateString()}
// //                         </p>
// //                       </div>
// //                     </div>
// //                     <span
// //                       className={`text-indigo-600 transition-transform duration-300 ${
// //                         expandedFeedback === item._id ? "rotate-180" : ""
// //                       }`}
// //                     >
// //                       ▼
// //                     </span>
// //                   </div>

// //                   {/* Collapsible Content */}
// //                   {expandedFeedback === item._id && (
// //                     <div className="mt-4 animate-fade-in">
// //                       <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg">
// //                         "{item.message}"
// //                       </p>
// //                       <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                         <div>
// //                           {item.movieRating && (
// //                             <p className="text-gray-700">
// //                               <strong className="text-gray-900">
// //                                 Movie Rating:
// //                               </strong>{" "}
// //                               <span className="text-indigo-600">
// //                                 {item.movieRating}/5 ★
// //                               </span>
// //                             </p>
// //                           )}
// //                           {item.bookingRating && (
// //                             <p className="text-gray-700">
// //                               <strong className="text-gray-900">
// //                                 Booking Rating:
// //                               </strong>{" "}
// //                               <span className="text-indigo-600">
// //                                 {item.bookingRating}/5 ★
// //                               </span>
// //                             </p>
// //                           )}
// //                           {item.rating && (
// //                             <p className="text-gray-700">
// //                               <strong className="text-gray-900">
// //                                 General Rating:
// //                               </strong>{" "}
// //                               <span className="text-indigo-600">
// //                                 {item.rating}/5 ★
// //                               </span>
// //                             </p>
// //                           )}
// //                         </div>
// //                         <div>
// //                           <p className="text-gray-700">
// //                             <strong className="text-gray-900">
// //                               Categories:
// //                             </strong>{" "}
// //                             <span className="capitalize text-indigo-600">
// //                               {item.category.join(", ")}
// //                             </span>
// //                           </p>
// //                           {item.relatedMovie && (
// //                             <p className="text-gray-700">
// //                               <strong className="text-gray-900">Movie:</strong>{" "}
// //                               <span className="text-gray-600">
// //                                 {item.relatedMovie.title}
// //                               </span>
// //                             </p>
// //                           )}
// //                           {item.booking && (
// //                             <p className="text-gray-700">
// //                               <strong className="text-gray-900">
// //                                 Booking ID:
// //                               </strong>{" "}
// //                               <span className="text-gray-600">
// //                                 {item.booking.bookingId}
// //                               </span>
// //                             </p>
// //                           )}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             ))
// //           ) : (
// //             <div className="text-center text-gray-600 py-10 animate-fade-in">
// //               No feedback available for the current filters.
// //             </div>
// //           )}
// //         </div>

// //         {/* Pagination */}
// //         {feedbackData.pagination && feedbackData.pagination.totalPages > 1 && (
// //           <div className="mt-12 flex justify-center items-center gap-6 animate-slide-up">
// //             <button
// //               onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
// //               disabled={filters.page === 1}
// //               className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
// //                 filters.page === 1
// //                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
// //                   : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
// //               }`}
// //             >
// //               Previous
// //             </button>
// //             <p className="text-gray-700 font-medium bg-gray-100 px-4 py-2 rounded-full">
// //               Page {feedbackData.pagination.currentPage} of{" "}
// //               {feedbackData.pagination.totalPages}
// //             </p>
// //             <button
// //               onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
// //               disabled={filters.page === feedbackData.pagination.totalPages}
// //               className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
// //                 filters.page === feedbackData.pagination.totalPages
// //                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
// //                   : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
// //               }`}
// //             >
// //               Next
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AllFeedback;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AllFeedback = () => {
//   const [feedbackData, setFeedbackData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     category: "",
//     minRating: "",
//     maxRating: "",
//     page: 1,
//   });
//   const [expandedFeedback, setExpandedFeedback] = useState(null); // Track expanded feedback

//   useEffect(() => {
//     fetchFeedback();
//   }, [filters]);

//   const fetchFeedback = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/admin/getAllFeedback", {
//         params: filters,
//       });
//       setFeedbackData(response.data.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value,
//       page: 1,
//     });
//   };

//   const toggleExpand = (id) => {
//     setExpandedFeedback(expandedFeedback === id ? null : id);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
//         <div className="bg-red-100 text-red-700 p-6 rounded-xl shadow-lg text-lg font-semibold animate-pulse">
//           Error: {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-extrabold text-teal-800 mb-10 text-center tracking-wide animate-fade-in">
//           Feedback Spotlight
//         </h1>

//         {/* Filters */}
//         <div className="bg-white rounded-xl p-6 mb-10 shadow-sm border border-teal-200 animate-slide-up">
//           <h2 className="text-xl font-semibold text-teal-700 mb-4">
//             Refine Your View
//           </h2>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <select
//               name="category"
//               value={filters.category}
//               onChange={handleFilterChange}
//               className="w-full sm:w-1/3 p-3 bg-teal-50 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 transition-all duration-200"
//             >
//               <option value="">All Categories</option>
//               <option value="movie">Movie</option>
//               <option value="booking">Booking</option>
//               <option value="service">Service</option>
//               <option value="other">Other</option>
//             </select>

//             <input
//               type="number"
//               name="minRating"
//               value={filters.minRating}
//               onChange={handleFilterChange}
//               placeholder="Min Rating (1-5)"
//               min="1"
//               max="5"
//               className="w-full sm:w-1/3 p-3 bg-teal-50 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 transition-all duration-200"
//             />

//             <input
//               type="number"
//               name="maxRating"
//               value={filters.maxRating}
//               onChange={handleFilterChange}
//               placeholder="Max Rating (1-5)"
//               min="1"
//               max="5"
//               className="w-full sm:w-1/3 p-3 bg-teal-50 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 transition-all duration-200"
//             />
//           </div>
//         </div>

//         {/* Feedback List */}
//         <div className="space-y-6">
//           {feedbackData.feedback.length > 0 ? (
//             feedbackData.feedback.map((item) => (
//               <div
//                 key={item._id}
//                 className="bg-white rounded-xl border border-teal-200 p-6 transition-all duration-300 hover:shadow-md animate-slide-up"
//               >
//                 <div className="flex flex-col">
//                   {/* Header */}
//                   <div
//                     className="flex items-center justify-between cursor-pointer"
//                     onClick={() => toggleExpand(item._id)}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
//                         {item.user.fullName.charAt(0)}
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-800">
//                           {item.user.fullName}
//                         </h3>
//                         <p className="text-sm text-teal-500">
//                           {new Date(item.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <span
//                       className={`text-teal-600 transition-transform duration-300 ${
//                         expandedFeedback === item._id ? "rotate-180" : ""
//                       }`}
//                     >
//                       ▼
//                     </span>
//                   </div>

//                   {/* Collapsible Content */}
//                   {expandedFeedback === item._id && (
//                     <div className="mt-4 animate-fade-in">
//                       <p className="text-gray-600 italic bg-teal-50 p-3 rounded-lg">
//                         "{item.message}"
//                       </p>
//                       <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                           {item.movieRating && (
//                             <p className="text-gray-700">
//                               <strong className="text-gray-900">
//                                 Movie Rating:
//                               </strong>{" "}
//                               <span className="text-teal-600">
//                                 {item.movieRating}/5 ★
//                               </span>
//                             </p>
//                           )}
//                           {item.bookingRating && (
//                             <p className="text-gray-700">
//                               <strong className="text-gray-900">
//                                 Booking Rating:
//                               </strong>{" "}
//                               <span className="text-teal-600">
//                                 {item.bookingRating}/5 ★
//                               </span>
//                             </p>
//                           )}
//                           {item.rating && (
//                             <p className="text-gray-700">
//                               <strong className="text-gray-900">
//                                 General Rating:
//                               </strong>{" "}
//                               <span className="text-teal-600">
//                                 {item.rating}/5 ★
//                               </span>
//                             </p>
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-gray-700">
//                             <strong className="text-gray-900">
//                               Categories:
//                             </strong>{" "}
//                             <span className="capitalize text-teal-600">
//                               {item.category.join(", ")}
//                             </span>
//                           </p>
//                           {item.relatedMovie && (
//                             <p className="text-gray-700">
//                               <strong className="text-gray-900">Movie:</strong>{" "}
//                               <span className="text-teal-500">
//                                 {item.relatedMovie.title}
//                               </span>
//                             </p>
//                           )}
//                           {item.booking && (
//                             <p className="text-gray-700">
//                               <strong className="text-gray-900">
//                                 Booking ID:
//                               </strong>{" "}
//                               <span className="text-teal-500">
//                                 {item.booking.bookingId}
//                               </span>
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-teal-600 py-10 animate-fade-in">
//               No feedback available for the current filters.
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {feedbackData.pagination && feedbackData.pagination.totalPages > 1 && (
//           <div className="mt-12 flex justify-center items-center gap-6 animate-slide-up">
//             <button
//               onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//               disabled={filters.page === 1}
//               className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
//                 filters.page === 1
//                   ? "bg-teal-200 text-teal-400 cursor-not-allowed"
//                   : "bg-teal-600 text-white hover:bg-teal-700 shadow-md"
//               }`}
//             >
//               Previous
//             </button>
//             <p className="text-gray-700 font-medium bg-teal-50 px-4 py-2 rounded-full">
//               Page {feedbackData.pagination.currentPage} of{" "}
//               {feedbackData.pagination.totalPages}
//             </p>
//             <button
//               onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//               disabled={filters.page === feedbackData.pagination.totalPages}
//               className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
//                 filters.page === feedbackData.pagination.totalPages
//                   ? "bg-teal-200 text-teal-400 cursor-not-allowed"
//                   : "bg-teal-600 text-white hover:bg-teal-700 shadow-md"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllFeedback;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllFeedback = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    minRating: "",
    maxRating: "",
    page: 1,
  });

  useEffect(() => {
    fetchFeedback();
  }, [filters]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/getAllFeedback", {
        params: filters,
      });
      setFeedbackData(response.data.data);
      toast.success("Feedback loaded successfully!", { autoClose: 2000 });
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const FeedbackCard = ({ item }) => {
    return (
      <div className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
        {/* Teal Accent Bar */}
        <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold">
                {item.user.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.user.fullName}
                </h3>
                <p className="text-sm text-teal-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-600 italic bg-teal-50 p-3 rounded-lg mb-4">
            "{item.message}"
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              {item.movieRating && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    Movie Rating:
                  </span>{" "}
                  <span className="text-teal-600">{item.movieRating}/5 ★</span>
                </p>
              )}
              {item.bookingRating && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    Booking Rating:
                  </span>{" "}
                  <span className="text-teal-600">
                    {item.bookingRating}/5 ★
                  </span>
                </p>
              )}
              {item.rating && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    General Rating:
                  </span>{" "}
                  <span className="text-teal-600">{item.rating}/5 ★</span>
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Categories:</span>{" "}
                <span className="capitalize text-teal-600">
                  {item.category.join(", ")}
                </span>
              </p>
              {item.relatedMovie && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Movie:</span>{" "}
                  <span className="text-teal-500">
                    {item.relatedMovie.title}
                  </span>
                </p>
              )}
              {item.booking && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Booking ID:</span>{" "}
                  <span className="text-teal-500">
                    {item.booking.bookingId}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br  min-h-screen">
      <h1 className="text-4xl font-extrabold text-teal-800 mb-8 text-center animate-fade-in">
        📣 Feedback Dashboard
      </h1>

      {/* Toast Container */}
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between animate-slide-up">
          {error}
          <button onClick={() => setError(null)} className="text-red-700">
            ×
          </button>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 animate-slide-up">
        <h2 className="text-xl font-semibold text-teal-700 mb-4">
          🔍 Filter Feedback
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-3 bg-teal-50 border border-teal-300 rounded-lg w-full focus:ring focus:ring-teal-400 text-gray-700 transition-all duration-200"
              disabled={loading}
            >
              <option value="">All Categories</option>
              <option value="movie">Movie</option>
              <option value="booking">Booking</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <input
              type="number"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              placeholder="Min Rating (1-5)"
              min="1"
              max="5"
              className="p-3 bg-teal-50 border border-teal-300 rounded-lg w-full focus:ring focus:ring-teal-400 text-gray-700 transition-all duration-200"
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="number"
              name="maxRating"
              value={filters.maxRating}
              onChange={handleFilterChange}
              placeholder="Max Rating (1-5)"
              min="1"
              max="5"
              className="p-3 bg-teal-50 border border-teal-300 rounded-lg w-full focus:ring focus:ring-teal-400 text-gray-700 transition-all duration-200"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Feedback Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {feedbackData?.feedback?.length > 0 ? (
            feedbackData.feedback.map((item) => (
              <FeedbackCard key={item._id} item={item} />
            ))
          ) : (
            <div className="col-span-full text-center text-teal-600 py-10 animate-fade-in">
              No feedback available.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {feedbackData?.pagination && feedbackData.pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-6 animate-slide-up">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1 || loading}
            className={`bg-teal-600 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
              filters.page === 1 || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-teal-700"
            }`}
          >
            Previous
          </button>
          <p className="text-teal-700 font-medium bg-teal-50 px-4 py-2 rounded-lg">
            Page {feedbackData.pagination.currentPage} of{" "}
            {feedbackData.pagination.totalPages}
          </p>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={
              filters.page === feedbackData.pagination.totalPages || loading
            }
            className={`bg-teal-600 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
              filters.page === feedbackData.pagination.totalPages || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-teal-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllFeedback;
