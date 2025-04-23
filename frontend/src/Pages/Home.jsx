// // // import React, { useState, useEffect } from "react";
// // // import { NavLink } from "react-router-dom";
// // // import axios from "axios";
// // // import "tailwindcss/tailwind.css";

// // // function Home() {
// // //   const [currentIndex, setCurrentIndex] = useState(0);
// // //   const [movies, setMovies] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   const fallbackImages = [
// // //     "https://i.ytimg.com/vi/T9qyV0rAOFI/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLBeHhjgAolvOz6TJMVXh66mU9E6Rg",
// // //     "https://i.ytimg.com/vi/bHKS-2MaukE/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDawyvBuCD28z6S0K3fkdA_DAHNnQ",
// // //     "https://i.ytimg.com/vi/PzzCsnqcl1A/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCCCGYl7LJs6ZINe689TYVabb37Wg",
// // //     "/godzilla_vs_kong_ver19_xxlg.jpg",
// // //   ];

// // //   // Fetch movies using Axios
// // //   useEffect(() => {
// // //     const fetchMovies = async () => {
// // //       try {
// // //         const response = await axios.get("/user/getAllMovies", {
// // //           withCredentials: true, // Include cookies if authenticated
// // //         });
// // //         setMovies(response.data.data.slice(0, 3)); // Take top 3 movies
// // //       } catch (err) {
// // //         console.error("Axios error fetching movies:", err);
// // //         setError("Failed to load movies. Using fallback data.");
// // //         setMovies([
// // //           {
// // //             title: "Fighter",
// // //             poster:
// // //               "https://content.tupaki.com/en/feeds/2024/01/25/264197-fighter.webp",
// // //           },
// // //           {
// // //             title: "Kaashi Raaghaw",
// // //             poster:
// // //               "https://assets-in.bmscdn.com/discovery-catalog/events/et00423687-gnpqsglkxg-landscape.jpg",
// // //           },
// // //           {
// // //             title: "Spider-Man: No Way Home",
// // //             poster:
// // //               "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqJlM7puWLR2r2JC2vWfh198ilC20tIYyTCg&s",
// // //           },
// // //         ]);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchMovies();

// // //     // Slider interval
// // //     const interval = setInterval(() => {
// // //       setCurrentIndex((prevIndex) => (prevIndex + 1) % fallbackImages.length);
// // //     }, 3000);
// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   return (
// // //     <div className="bg-gray-50">
// // //       {/* Movie Slider/Carousel */}
// // //       <div className="w-full overflow-hidden relative cursor-pointer">
// // //         <div
// // //           className="flex transition-transform duration-700 ease-in-out"
// // //           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
// // //         >
// // //           {fallbackImages.map((image, index) => (
// // //             <div className="w-full flex-shrink-0" key={index}>
// // //               <img
// // //                 src={image}
// // //                 alt={`Movie Poster ${index}`}
// // //                 className="w-full h-[500px] object-cover"
// // //                 onError={(e) => (e.target.src = "/fallback-poster.jpg")}
// // //               />
// // //             </div>
// // //           ))}
// // //         </div>
// // //         {/* Navigation Dots */}
// // //         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
// // //           {fallbackImages.map((_, index) => (
// // //             <button
// // //               key={index}
// // //               onClick={() => setCurrentIndex(index)}
// // //               className={`w-3 h-3 rounded-full ${
// // //                 currentIndex === index ? "bg-teal-500" : "bg-gray-300"
// // //               }`}
// // //             />
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Movie List (Featured Movies Section) */}
// // //       <div className="min-h-screen bg-white p-8">
// // //         <div className="max-w-7xl mx-auto">
// // //           <h1 className="text-5xl font-bold text-gray-800 text-center mb-12">
// // //             Featured Movies
// // //           </h1>
// // //           {loading ? (
// // //             <div className="flex justify-center items-center h-64">
// // //               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
// // //             </div>
// // //           ) : error ? (
// // //             <p className="text-center text-red-600">{error}</p>
// // //           ) : (
// // //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// // //               {movies.map((movie, index) => (
// // //                 <div
// // //                   key={movie._id || index}
// // //                   className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
// // //                 >
// // //                   <img
// // //                     src={movie.poster}
// // //                     alt={movie.title}
// // //                     className="w-full h-96 object-cover"
// // //                     onError={(e) => (e.target.src = "/fallback-poster.jpg")}
// // //                   />
// // //                   <div className="p-4">
// // //                     <h2 className="text-xl font-semibold text-gray-900">
// // //                       {movie.title}
// // //                     </h2>
// // //                     <NavLink to={`/movie/${movie._id || index}`}>
// // //                       <button className="mt-2 py-2 px-4 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-300">
// // //                         Book Now
// // //                       </button>
// // //                     </NavLink>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //           <div className="text-center mt-10">
// // //             <NavLink to="/MovieList">
// // //               <button className="py-3 px-6 text-white bg-gray-800 rounded-md text-lg font-semibold hover:bg-teal-700 transition duration-300">
// // //                 View More Movies
// // //               </button>
// // //             </NavLink>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Customer Reviews */}
// // //       <div className="bg-white py-12">
// // //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // //           <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
// // //             What Our Customers Say...
// // //           </h2>
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //             {[
// // //               {
// // //                 name: "Eva Elle",
// // //                 handle: "@evaelle",
// // //                 review:
// // //                   "The ticket booking experience was so seamless. I was able to get my tickets in seconds!",
// // //               },
// // //               {
// // //                 name: "John Doe",
// // //                 handle: "@johndoe",
// // //                 review:
// // //                   "A smooth and quick process! Loved booking my tickets to the latest blockbuster.",
// // //               },
// // //               {
// // //                 name: "Amy Smith",
// // //                 handle: "@amysmith",
// // //                 review:
// // //                   "Fantastic experience! Everything was easy to understand, and I found the perfect showtime.",
// // //               },
// // //             ].map((review, index) => (
// // //               <div key={index} className="bg-white rounded-lg shadow-md p-6">
// // //                 <div className="flex items-center mb-4">
// // //                   <div className="rounded-full bg-gray-200 h-12 w-12 mr-3" />
// // //                   <div>
// // //                     <h3 className="text-lg font-medium text-gray-800">
// // //                       {review.name}
// // //                     </h3>
// // //                     <p className="text-gray-600 text-sm">{review.handle}</p>
// // //                   </div>
// // //                 </div>
// // //                 <p className="text-gray-600">{review.review}</p>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Call to Action */}
// // //       <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
// // //         <div className="md:w-1/2 md:pr-8 flex flex-col justify-center">
// // //           <h2 className="text-5xl font-bold text-gray-800 mb-4">
// // //             Book Your Movie Tickets Today!
// // //           </h2>
// // //           <p className="text-gray-600 mb-6 text-2xl">
// // //             Reserve your spot for the best movies showing near you. Grab your
// // //             tickets before they sell out!
// // //           </p>
// // //           <NavLink to="/movielist">
// // //             <button className="py-2 px-6 text-white bg-gray-800 rounded-md text-sm font-semibold hover:bg-teal-500 hover:text-gray-900 transition duration-300">
// // //               Book Now
// // //             </button>
// // //           </NavLink>
// // //         </div>
// // //         <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg overflow-hidden mt-6 md:mt-0">
// // //           <img
// // //             src="https://moviemetropolis.net/wp-content/uploads/2024/04/evolution-of-special-effects-featured-image-768x432.jpg"
// // //             alt="Movie Experience"
// // //             className="h-full w-full object-cover"
// // //           />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default Home;
// // import React, { useState, useEffect } from "react";
// // import { NavLink } from "react-router-dom";
// // import axios from "axios";
// // import "tailwindcss/tailwind.css";

// // function Home() {
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [movies, setMovies] = useState([]);
// //   const [feedbacks, setFeedbacks] = useState([]); // State for feedback
// //   const [loading, setLoading] = useState(true);
// //   const [feedbackLoading, setFeedbackLoading] = useState(true); // Separate loading state for feedback
// //   const [error, setError] = useState(null);
// //   const [feedbackError, setFeedbackError] = useState(null); // Separate error state for feedback

// //   const fallbackImages = [
// //     "https://i.ytimg.com/vi/T9qyV0rAOFI/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLBeHhjgAolvOz6TJMVXh66mU9E6Rg",
// //     "https://i.ytimg.com/vi/bHKS-2MaukE/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDawyvBuCD28z6S0K3fkdA_DAHNnQ",
// //     "https://i.ytimg.com/vi/PzzCsnqcl1A/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCCCGYl7LJs6ZINe689TYVabb37Wg",
// //     "/godzilla_vs_kong_ver19_xxlg.jpg",
// //   ];

// //   // Fetch movies using Axios
// //   useEffect(() => {
// //     const fetchMovies = async () => {
// //       try {
// //         const response = await axios.get("/user/getAllMovies", {
// //           withCredentials: true,
// //         });
// //         setMovies(response.data.data.slice(0, 3));
// //       } catch (err) {
// //         console.error("Axios error fetching movies:", err);
// //         setError("Failed to load movies. Using fallback data.");
// //         setMovies([
// //           {
// //             title: "Fighter",
// //             poster:
// //               "https://content.tupaki.com/en/feeds/2024/01/25/264197-fighter.webp",
// //           },
// //           {
// //             title: "Kaashi Raaghaw",
// //             poster:
// //               "https://assets-in.bmscdn.com/discovery-catalog/events/et00423687-gnpqsglkxg-landscape.jpg",
// //           },
// //           {
// //             title: "Spider-Man: No Way Home",
// //             poster:
// //               "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqJlM7puWLR2r2JC2vWfh198ilC20tIYyTCg&s",
// //           },
// //         ]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     // Fetch feedback for booking system
// //     const fetchFeedback = async () => {
// //       try {
// //         const response = await axios.get("/user/getFeedback", {
// //           params: { category: "booking", limit: 3 }, // Fetch only booking feedback, limit to 3
// //           withCredentials: true,
// //         });
// //         setFeedbacks(response.data.data.feedback); // Assuming response follows ApiResponse structure
// //       } catch (err) {
// //         console.error("Axios error fetching feedback:", err);
// //         setFeedbackError("Failed to load feedback.");
// //         setFeedbacks([
// //           {
// //             user: { fullName: "Eva Elle" },
// //             message: "The ticket booking experience was so seamless!",
// //             bookingRating: 5,
// //           },
// //           {
// //             user: { fullName: "John Doe" },
// //             message: "A smooth and quick process!",
// //             bookingRating: 4,
// //           },
// //           {
// //             user: { fullName: "Amy Smith" },
// //             message: "Fantastic experience, easy to book!",
// //             bookingRating: 5,
// //           },
// //         ]); // Fallback feedback
// //       } finally {
// //         setFeedbackLoading(false);
// //       }
// //     };

// //     fetchMovies();
// //     fetchFeedback();

// //     // Slider interval
// //     const interval = setInterval(() => {
// //       setCurrentIndex((prevIndex) => (prevIndex + 1) % fallbackImages.length);
// //     }, 3000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   return (
// //     <div className="bg-gray-50">
// //       {/* Movie Slider/Carousel */}
// //       <div className="w-full overflow-hidden relative cursor-pointer">
// //         <div
// //           className="flex transition-transform duration-700 ease-in-out"
// //           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
// //         >
// //           {fallbackImages.map((image, index) => (
// //             <div className="w-full flex-shrink-0" key={index}>
// //               <img
// //                 src={image}
// //                 alt={`Movie Poster ${index}`}
// //                 className="w-full h-[500px] object-cover"
// //                 onError={(e) => (e.target.src = "/fallback-poster.jpg")}
// //               />
// //             </div>
// //           ))}
// //         </div>
// //         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
// //           {fallbackImages.map((_, index) => (
// //             <button
// //               key={index}
// //               onClick={() => setCurrentIndex(index)}
// //               className={`w-3 h-3 rounded-full ${
// //                 currentIndex === index ? "bg-teal-500" : "bg-gray-300"
// //               }`}
// //             />
// //           ))}
// //         </div>
// //       </div>

// //       {/* Movie List (Featured Movies Section) */}
// //       <div className="min-h-screen bg-white p-8">
// //         <div className="max-w-7xl mx-auto">
// //           <h1 className="text-5xl font-bold text-gray-800 text-center mb-12">
// //             Featured Movies
// //           </h1>
// //           {loading ? (
// //             <div className="flex justify-center items-center h-64">
// //               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
// //             </div>
// //           ) : error ? (
// //             <p className="text-center text-red-600">{error}</p>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //               {movies.map((movie, index) => (
// //                 <div
// //                   key={movie._id || index}
// //                   className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
// //                 >
// //                   <img
// //                     src={movie.poster}
// //                     alt={movie.title}
// //                     className="w-full h-96 object-cover"
// //                     onError={(e) => (e.target.src = "/fallback-poster.jpg")}
// //                   />
// //                   <div className="p-4">
// //                     <h2 className="text-xl font-semibold text-gray-900">
// //                       {movie.title}
// //                     </h2>
// //                     <NavLink to={`/movie/${movie._id || index}`}>
// //                       <button className="mt-2 py-2 px-4 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-300">
// //                         Book Now
// //                       </button>
// //                     </NavLink>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //           <div className="text-center mt-10">
// //             <NavLink to="/MovieList">
// //               <button className="py-3 px-6 text-white bg-gray-800 rounded-md text-lg font-semibold hover:bg-teal-700 transition duration-300">
// //                 View More Movies
// //               </button>
// //             </NavLink>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Customer Reviews */}
// //       <div className="bg-white py-12">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
// //             What Our Customers Say About Booking...
// //           </h2>
// //           {feedbackLoading ? (
// //             <div className="flex justify-center items-center h-32">
// //               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
// //             </div>
// //           ) : feedbackError ? (
// //             <p className="text-center text-red-600">{feedbackError}</p>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //               {feedbacks.map((feedback, index) => (
// //                 <div key={index} className="bg-white rounded-lg shadow-md p-6">
// //                   <div className="flex items-center mb-4">
// //                     <div className="rounded-full bg-gray-200 h-12 w-12 mr-3" />
// //                     <div>
// //                       <h3 className="text-lg font-medium text-gray-800">
// //                         {feedback.user?.fullName || "Anonymous"}
// //                       </h3>
// //                       <p className="text-gray-600 text-sm">
// //                         Rating: {feedback.bookingRating || "N/A"}/5
// //                       </p>
// //                     </div>
// //                   </div>
// //                   <p className="text-gray-600">{feedback.message}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Call to Action */}
// //       <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
// //         <div className="md:w-1/2 md:pr-8 flex flex-col justify-center">
// //           <h2 className="text-5xl font-bold text-gray-800 mb-4">
// //             Book Your Movie Tickets Today!
// //           </h2>
// //           <p className="text-gray-600 mb-6 text-2xl">
// //             Reserve your spot for the best movies showing near you. Grab your
// //             tickets before they sell out!
// //           </p>
// //           <NavLink to="/movielist">
// //             <button className="py-2 px-6 text-white bg-gray-800 rounded-md text-sm font-semibold hover:bg-teal-500 hover:text-gray-900 transition duration-300">
// //               Book Now
// //             </button>
// //           </NavLink>
// //         </div>
// //         <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg overflow-hidden mt-6 md:mt-0">
// //           <img
// //             src="https://moviemetropolis.net/wp-content/uploads/2024/04/evolution-of-special-effects-featured-image-768x432.jpg"
// //             alt="Movie Experience"
// //             className="h-full w-full object-cover"
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;
// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import axios from "axios";
// import "tailwindcss/tailwind.css";

// function Home() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [movies, setMovies] = useState([]);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [feedbackLoading, setFeedbackLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [feedbackError, setFeedbackError] = useState(null);

//   const fallbackImages = [
//     "https://i.ytimg.com/vi/T9qyV0rAOFI/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLBeHhjgAolvOz6TJMVXh66mU9E6Rg",
//     "https://i.ytimg.com/vi/bHKS-2MaukE/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDawyvBuCD28z6S0K3fkdA_DAHNnQ",
//     "https://i.ytimg.com/vi/PzzCsnqcl1A/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCCCGYl7LJs6ZINe689TYVabb37Wg",
//     "/godzilla_vs_kong_ver19_xxlg.jpg",
//   ];

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const response = await axios.get("/user/getAllMovies", {
//           withCredentials: true,
//         });
//         setMovies(response.data.data.slice(0, 3));
//       } catch (err) {
//         console.error("Axios error fetching movies:", err);
//         setError("Failed to load movies. Using fallback data.");
//         setMovies([
//           {
//             title: "Fighter",
//             poster:
//               "https://content.tupaki.com/en/feeds/2024/01/25/264197-fighter.webp",
//           },
//           {
//             title: "Kaashi Raaghaw",
//             poster:
//               "https://assets-in.bmscdn.com/discovery-catalog/events/et00423687-gnpqsglkxg-landscape.jpg",
//           },
//           {
//             title: "Spider-Man: No Way Home",
//             poster:
//               "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqJlM7puWLR2r2JC2vWfh198ilC20tIYyTCg&s",
//           },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchFeedback = async () => {
//       try {
//         const response = await axios.get("/user/feedback", {
//           params: { category: "booking", limit: 3 },
//           withCredentials: true,
//         });
//         setFeedbacks(response.data.data.feedback);
//       } catch (err) {
//         console.error("Axios error fetching feedback:", err);
//         setFeedbackError("Failed to load feedback.");
//         setFeedbacks([
//           {
//             user: { fullName: "Eva Elle" },
//             message: "The ticket booking experience was so seamless!",
//             bookingRating: 5,
//           },
//           {
//             user: { fullName: "John Doe" },
//             message: "A smooth and quick process!",
//             bookingRating: 4,
//           },
//           {
//             user: { fullName: "Amy Smith" },
//             message: "Fantastic experience, easy to book!",
//             bookingRating: 5,
//           },
//         ]);
//       } finally {
//         setFeedbackLoading(false);
//       }
//     };

//     fetchMovies();
//     fetchFeedback();

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % fallbackImages.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-gray-50">
//       {/* Movie Slider/Carousel */}
//       <div className="w-full overflow-hidden relative cursor-pointer">
//         <div
//           className="flex transition-transform duration-700 ease-in-out"
//           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//         >
//           {fallbackImages.map((image, index) => (
//             <div className="w-full flex-shrink-0" key={index}>
//               <img
//                 src={image}
//                 alt={`Movie Poster ${index}`}
//                 className="w-full h-[500px] object-cover"
//                 onError={(e) => (e.target.src = "/fallback-poster.jpg")}
//               />
//             </div>
//           ))}
//         </div>
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {fallbackImages.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               className={`w-3 h-3 rounded-full ${
//                 currentIndex === index ? "bg-teal-500" : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Movie List (Featured Movies Section) */}
//       <div className="min-h-screen bg-white p-8">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-5xl font-bold text-gray-800 text-center mb-12">
//             Featured Movies
//           </h1>
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
//             </div>
//           ) : error ? (
//             <p className="text-center text-red-600">{error}</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {movies.map((movie, index) => (
//                 <div
//                   key={movie._id || index}
//                   className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
//                 >
//                   <img
//                     src={movie.poster}
//                     alt={movie.title}
//                     className="w-full h-96 object-cover"
//                     onError={(e) => (e.target.src = "/fallback-poster.jpg")}
//                   />
//                   <div className="p-4">
//                     <h2 className="text-xl font-semibold text-gray-900">
//                       {movie.title}
//                     </h2>
//                     <NavLink to={`/movie/${movie._id || index}`}>
//                       <button className="mt-2 py-2 px-4 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-300">
//                         Book Now
//                       </button>
//                     </NavLink>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//           <div className="text-center mt-10">
//             <NavLink to="/MovieList">
//               <button className="py-3 px-6 text-white bg-gray-800 rounded-md text-lg font-semibold hover:bg-teal-700 transition duration-300">
//                 View More Movies
//               </button>
//             </NavLink>
//           </div>
//         </div>
//       </div>

//       {/* Customer Reviews */}
//       <div className="bg-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
//             What Our Customers Say About Booking...
//           </h2>
//           {feedbackLoading ? (
//             <div className="flex justify-center items-center h-32">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
//             </div>
//           ) : feedbackError ? (
//             <p className="text-center text-red-600">{feedbackError}</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {feedbacks.map((feedback, index) => (
//                 <div key={index} className="bg-white rounded-lg shadow-md p-6">
//                   <div className="flex items-center mb-4">
//                     <div className="rounded-full bg-gray-200 h-12 w-12 mr-3" />
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-800">
//                         {feedback.user?.fullName || "Anonymous"}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Rating: {feedback.bookingRating || "N/A"}/5
//                       </p>
//                     </div>
//                   </div>
//                   <p className="text-gray-600">{feedback.message}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Call to Action */}
//       <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
//         <div className="md:w-1/2 md:pr-8 flex flex-col justify-center">
//           <h2 className="text-5xl font-bold text-gray-800 mb-4">
//             Book Your Movie Tickets Today!
//           </h2>
//           <p className="text-gray-600 mb-6 text-2xl">
//             Reserve your spot for the best movies showing near you. Grab your
//             tickets before they sell out!
//           </p>
//           <NavLink to="/movielist">
//             <button className="py-2 px-6 text-white bg-gray-800 rounded-md text-sm font-semibold hover:bg-teal-500 hover:text-gray-900 transition duration-300">
//               Book Now
//             </button>
//           </NavLink>
//         </div>
//         <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg overflow-hidden mt-6 md:mt-0">
//           <img
//             src="https://moviemetropolis.net/wp-content/uploads/2024/04/evolution-of-special-effects-featured-image-768x432.jpg"
//             alt="Movie Experience"
//             className="h-full w-full object-cover"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "tailwindcss/tailwind.css";

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movies, setMovies] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackError, setFeedbackError] = useState(null);

  const fallbackImages = [
    "https://i.ytimg.com/vi/T9qyV0rAOFI/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLBeHhjgAolvOz6TJMVXh66mU9E6Rg",
    "https://i.ytimg.com/vi/bHKS-2MaukE/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDawyvBuCD28z6S0K3fkdA_DAHNnQ",
    "https://i.ytimg.com/vi/PzzCsnqcl1A/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCCCGYl7LJs6ZINe689TYVabb37Wg",
    "/godzilla_vs_kong_ver19_xxlg.jpg",
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/user/getAllMovies", {
          withCredentials: true,
        });
        setMovies(response.data.data.slice(0, 3));
      } catch (err) {
        console.error("Axios error fetching movies:", err);
        setError("Failed to load movies. Using fallback data.");
        setMovies([
          {
            title: "Fighter",
            poster:
              "https://content.tupaki.com/en/feeds/2024/01/25/264197-fighter.webp",
          },
          {
            title: "Kaashi Raaghaw",
            poster:
              "https://assets-in.bmscdn.com/discovery-catalog/events/et00423687-gnpqsglkxg-landscape.jpg",
          },
          {
            title: "Spider-Man: No Way Home",
            poster:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqJlM7puWLR2r2JC2vWfh198ilC20tIYyTCg&s",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedback = async () => {
      try {
        const response = await axios.get("/user/feedback", {
          params: { category: "booking", limit: 3 },
          withCredentials: true,
        });
        setFeedbacks(response.data.data.feedback);
      } catch (err) {
        console.error("Axios error fetching feedback:", err);
        setFeedbackError("Failed to load feedback.");
        setFeedbacks([
          {
            user: { fullName: "Eva Elle" },
            message: "The ticket booking experience was so seamless!",
            bookingRating: 5,
          },
          {
            user: { fullName: "John Doe" },
            message: "A smooth and quick process!",
            bookingRating: 4,
          },
          {
            user: { fullName: "Amy Smith" },
            message: "Fantastic experience, easy to book!",
            bookingRating: 5,
          },
        ]);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchMovies();
    fetchFeedback();

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % fallbackImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Function to render star ratings
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStar = "★";
    const emptyStar = "☆";
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          {i <= rating ? filledStar : emptyStar}
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="bg-gray-50">
      {/* Movie Slider/Carousel */}
      <div className="w-full overflow-hidden relative cursor-pointer">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {fallbackImages.map((image, index) => (
            <div className="w-full flex-shrink-0" key={index}>
              <img
                src={image}
                alt={`Movie Poster ${index}`}
                className="w-full h-[500px] object-cover"
                onError={(e) => (e.target.src = "/fallback-poster.jpg")}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {fallbackImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-teal-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Movie List (Featured Movies Section) */}
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 text-center mb-12">
            Featured Movies
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {movies.map((movie, index) => (
                <div
                  key={movie._id || index}
                  className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => (e.target.src = "/fallback-poster.jpg")}
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {movie.title}
                    </h2>
                    <NavLink to={`/movie/${movie._id || index}`}>
                      <button className="mt-2 py-2 px-4 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-300">
                        Book Now
                      </button>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <NavLink to="/MovieList">
              <button className="py-3 px-6 text-white bg-gray-800 rounded-md text-lg font-semibold hover:bg-teal-700 transition duration-300">
                View More Movies
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            What Our Customers Say About Booking...
          </h2>
          {feedbackLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
            </div>
          ) : feedbackError ? (
            <p className="text-center text-red-600">{feedbackError}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {feedbacks.map((feedback, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {feedback.user?.fullName || "Anonymous"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {renderStars(feedback.bookingRating || 0)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">{feedback.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
        <div className="md:w-1/2 md:pr-8 flex flex-col justify-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Book Your Movie Tickets Today!
          </h2>
          <p className="text-gray-600 mb-6 text-2xl">
            Reserve your spot for the best movies showing near you. Grab your
            tickets before they sell out!
          </p>
          <NavLink to="/movielist">
            <button className="py-2 px-6 text-white bg-gray-800 rounded-md text-sm font-semibold hover:bg-teal-500 hover:text-gray-900 transition duration-300">
              Book Now
            </button>
          </NavLink>
        </div>
        <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg overflow-hidden mt-6 md:mt-0">
          <img
            src="https://moviemetropolis.net/wp-content/uploads/2024/04/evolution-of-special-effects-featured-image-768x432.jpg"
            alt="Movie Experience"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
