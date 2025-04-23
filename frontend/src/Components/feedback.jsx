// import React, { useState } from "react";
// import axios from "axios";

// const FeedbackSection = ({ bookingId, userToken, movieId }) => {
//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState("");
//   const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFeedback = async () => {
//     if (rating === 0 || feedbackSubmitted) return;
//     setError(null); // Reset error
//     try {
//       const feedbackData = {
//         bookingId,
//         rating,
//         message: review.trim() || "Inline star rating",
//         relatedMovie: movieId, // Pass movie ID
//       };
//       const response = await axios.post("/user/submit", feedbackData, {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       });
//       console.log("Feedback response:", response.data); // Debug log
//       setFeedbackSubmitted(true);
//       setTimeout(() => setFeedbackSubmitted(false), 2000);
//     } catch (err) {
//       console.error("Feedback submission failed:", err);
//       setError("Failed to submit feedback. Please try again.");
//     }
//   };

//   return (
//     <div className="mt-6 w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 border border-gray-200">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">
//         Rate your booking experience
//       </h3>
//       <div className="flex items-center gap-2 mb-4">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             onClick={() => setRating(star)}
//             disabled={feedbackSubmitted}
//             className={`text-2xl ${
//               rating >= star ? "text-yellow-400" : "text-gray-300"
//             } hover:text-yellow-500 transition-colors duration-200`}
//           >
//             ★
//           </button>
//         ))}
//         {feedbackSubmitted && (
//           <span className="ml-4 text-sm text-green-600 animate-fadeIn">
//             Thank you!
//           </span>
//         )}
//       </div>
//       <textarea
//         value={review}
//         onChange={(e) => setReview(e.target.value)}
//         placeholder="Add a review (optional)"
//         className="w-full p-3 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 resize-none"
//         rows="3"
//         disabled={feedbackSubmitted}
//       />
//       {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
//       <div className="flex justify-end mt-4">
//         <button
//           onClick={handleFeedback}
//           disabled={rating === 0 || feedbackSubmitted}
//           className={`px-4 py-2 rounded-md text-white ${
//             rating === 0 || feedbackSubmitted
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-teal-500 hover:bg-teal-600"
//           } transition-colors duration-200`}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// // Fade-in animation
// const styles = `
//   @keyframes fadeIn {
//     0% { opacity: 0; }
//     100% { opacity: 1; }
//   }
//   .animate-fadeIn {
//     animation: fadeIn 0.5s ease-in;
//   }
// `;
// const styleSheet = document.createElement("style");
// styleSheet.textContent = styles;
// document.head.appendChild(styleSheet);

// export default FeedbackSection;
import React, { useState } from "react";
import axios from "axios";

const FeedbackSection = ({ bookingId, userToken, movieId }) => {
  const [movieRating, setMovieRating] = useState(0);
  const [bookingRating, setBookingRating] = useState(0);
  const [review, setReview] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleFeedback = async () => {
    if ((movieRating === 0 && bookingRating === 0) || feedbackSubmitted) return;
    setError(null); // Reset error
    try {
      const feedbackData = {
        bookingId: bookingId || undefined,
        movieRating: movieRating > 0 ? movieRating : undefined,
        bookingRating: bookingRating > 0 ? bookingRating : undefined,
        message: review.trim() || "No detailed feedback provided",
        relatedMovie: movieId || undefined,
      };
      const response = await axios.post("/user/submit", feedbackData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Feedback response:", response.data); // Debug log
      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 2000);
    } catch (err) {
      console.error("Feedback submission failed:", err);
      setError("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="mt-6 w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Rate Your Experience
      </h3>

      {/* Movie Rating */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Rate the Movie
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`movie-${star}`}
              onClick={() => setMovieRating(star)}
              disabled={feedbackSubmitted}
              className={`text-2xl ${
                movieRating >= star ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-500 transition-colors duration-200`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Booking Rating */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Rate the Booking Experience
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`booking-${star}`}
              onClick={() => setBookingRating(star)}
              disabled={feedbackSubmitted}
              className={`text-2xl ${
                bookingRating >= star ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-500 transition-colors duration-200`}
            >
              ★
            </button>
          ))}
          {feedbackSubmitted && (
            <span className="ml-4 text-sm text-green-600 animate-fadeIn">
              Thank you!
            </span>
          )}
        </div>
      </div>

      {/* Review Textarea */}
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Add a review (optional)"
        className="w-full p-3 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 resize-none"
        rows="3"
        disabled={feedbackSubmitted}
      />
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleFeedback}
          disabled={
            (movieRating === 0 && bookingRating === 0) || feedbackSubmitted
          }
          className={`px-4 py-2 rounded-md text-white ${
            (movieRating === 0 && bookingRating === 0) || feedbackSubmitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600"
          } transition-colors duration-200`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// Fade-in animation
const styles = `
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in;
  }
`;
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default FeedbackSection;
