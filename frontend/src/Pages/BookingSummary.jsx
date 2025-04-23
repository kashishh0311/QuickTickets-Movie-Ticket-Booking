// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useUser } from "../UserContext";
// // import FeedbackSection from "../Components/feedback";

// // const BookingSuccess = () => {
// //   const { user } = useUser();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [bookingData, setBookingData] = useState(null);

// //   const queryParams = new URLSearchParams(location.search);
// //   const bookingId = queryParams.get("bookingId");
// //   const sessionId = queryParams.get("session_id");

// //   const confirmPaymentAndFetchBooking = async () => {
// //     try {
// //       if (!sessionId || !bookingId) {
// //         throw new Error("Session ID or Booking ID is missing");
// //       }

// //       const paymentResponse = await axios.post(
// //         "/user/paymentSuccess",
// //         { session_id: sessionId, bookingId },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${user.token}`,
// //           },
// //         }
// //       );
// //       console.log("Payment success response:", paymentResponse.data);

// //       const bookingResponse = await axios.get(`user/getbooking/${bookingId}`, {
// //         headers: {
// //           Authorization: `Bearer ${user.token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });
// //       setBookingData(bookingResponse.data.data);
// //     } catch (err) {
// //       console.error("Error:", err);
// //       setError(
// //         err.response?.data?.message ||
// //           "Failed to confirm payment or fetch booking details. Please contact support."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (!user) {
// //       navigate("/login");
// //       return;
// //     }

// //     if (!sessionId || !bookingId) {
// //       setError("Session ID or Booking ID is missing from the URL.");
// //       setLoading(false);
// //       return;
// //     }

// //     confirmPaymentAndFetchBooking();
// //   }, [user, navigate]);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen bg-gray-50">
// //         <p className="text-gray-700 text-lg">Getting your ticket ready...</p>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex justify-center items-center h-screen bg-gray-50">
// //         <p className="text-red-500 text-lg font-semibold">{error}</p>
// //       </div>
// //     );
// //   }

// //   if (!bookingData) {
// //     return (
// //       <div className="flex justify-center items-center h-screen bg-gray-50">
// //         <p className="text-gray-700 text-lg">No booking data available.</p>
// //       </div>
// //     );
// //   }

// //   const { movie, seats, totalPrice, show } = bookingData;
// //   const showtime = `${show.showTime}, ${new Date(
// //     show.showDate
// //   ).toDateString()}`;
// //   const selectedSeats = seats.map((seat) => seat.seatNumber).join(", ");

// //   return (
// //     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
// //       <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden flex border border-gray-200">
// //         <div className="bg-gradient-to-b from-teal-500 to-teal-700 p-6 w-1/3 text-white flex flex-col justify-between">
// //           <div>
// //             <h2 className="text-xl font-bold uppercase tracking-wide">
// //               {movie.title}
// //             </h2>
// //             <p className="text-sm mt-1 opacity-80">Movie Ticket</p>
// //           </div>
// //           <p className="text-xs">Enjoy the show!</p>
// //         </div>
// //         <div className="p-6 w-2/3 text-gray-800">
// //           <div className="grid grid-cols-2 gap-4">
// //             <div>
// //               <p className="text-xs text-gray-500 uppercase">Showtime</p>
// //               <p className="text-sm font-semibold">{showtime}</p>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-500 uppercase">Seats</p>
// //               <p className="text-sm font-semibold">{selectedSeats}</p>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-500 uppercase">Total Paid</p>
// //               <p className="text-sm font-semibold">₹{totalPrice.toFixed(2)}</p>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-500 uppercase">Booking ID</p>
// //               <p className="text-sm font-semibold">{bookingId}</p>
// //             </div>
// //           </div>
// //           <p className="text-xs text-gray-600 mt-4 text-center">
// //             Present this ticket at the entrance
// //           </p>
// //           <div className="mt-6 flex justify-end gap-4">
// //             <button
// //               onClick={() => navigate("/profile")}
// //               className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-md hover:bg-teal-600 transition duration-200"
// //             >
// //               Profile
// //             </button>
// //             <button
// //               onClick={() => window.print()}
// //               className="px-4 py-2 bg-teal-700 text-white text-sm font-semibold rounded-md hover:bg-teal-800 transition duration-200"
// //             >
// //               Print
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       <FeedbackSection
// //         bookingId={bookingId}
// //         userToken={user.token}
// //         movieId={movie._id} // Pass movie ID
// //       />
// //     </div>
// //   );
// // };

// // export default BookingSuccess;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useUser } from "../UserContext";
// import FeedbackSection from "../Components/feedback";

// const BookingSuccess = () => {
//   const { user } = useUser();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bookingData, setBookingData] = useState(null);

//   const queryParams = new URLSearchParams(location.search);
//   const bookingId = queryParams.get("bookingId");
//   const sessionId = queryParams.get("session_id");

//   const confirmPaymentAndFetchBooking = async () => {
//     try {
//       if (!sessionId || !bookingId) {
//         throw new Error("Session ID or Booking ID is missing");
//       }

//       const paymentResponse = await axios.post(
//         "/user/paymentSuccess",
//         { session_id: sessionId, bookingId },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       console.log("Payment success response:", paymentResponse.data);

//       const bookingResponse = await axios.get(`user/getbooking/${bookingId}`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       setBookingData(bookingResponse.data.data);
//     } catch (err) {
//       console.error("Error:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to confirm payment or fetch booking details. Please contact support."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     if (!sessionId || !bookingId) {
//       setError("Session ID or Booking ID is missing from the URL.");
//       setLoading(false);
//       return;
//     }

//     confirmPaymentAndFetchBooking();
//   }, [user, navigate]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="text-gray-700 text-lg">Getting your ticket ready...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="text-red-500 text-lg font-semibold">{error}</p>
//       </div>
//     );
//   }

//   if (!bookingData) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="text-gray-700 text-lg">No booking data available.</p>
//       </div>
//     );
//   }

//   const { movie, seats, totalPrice, show } = bookingData;
//   const showtime = `${show.showTime}, ${new Date(
//     show.showDate
//   ).toDateString()}`;
//   const selectedSeats = seats.map((seat) => seat.seatNumber).join(", ");

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
//       <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden flex border border-gray-200">
//         <div className="bg-gradient-to-b from-teal-500 to-teal-700 p-6 w-1/3 text-white flex flex-col justify-between">
//           <div>
//             <h2 className="text-xl font-bold uppercase tracking-wide">
//               {movie.title}
//             </h2>
//             <p className="text-sm mt-1 opacity-80">Movie Ticket</p>
//           </div>
//           <p className="text-xs">Enjoy the show!</p>
//         </div>
//         <div className="p-6 w-2/3 text-gray-800">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-xs text-gray-500 uppercase">Showtime</p>
//               <p className="text-sm font-semibold">{showtime}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 uppercase">Seats</p>
//               <p className="text-sm font-semibold">{selectedSeats}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 uppercase">Total Paid</p>
//               <p className="text-sm font-semibold">₹{totalPrice.toFixed(2)}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 uppercase">Booking ID</p>
//               <p className="text-sm font-semibold">{bookingId}</p>
//             </div>
//           </div>
//           <p className="text-xs text-gray-600 mt-4 text-center">
//             Present this ticket at the entrance
//           </p>
//           <div className="mt-6 flex justify-end gap-4">
//             <button
//               onClick={() => navigate("/profile")}
//               className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-md hover:bg-teal-600 transition duration-200"
//             >
//               Profile
//             </button>
//             <button
//               onClick={() => window.print()}
//               className="px-4 py-2 bg-teal-700 text-white text-sm font-semibold rounded-md hover:bg-teal-800 transition duration-200"
//             >
//               Print
//             </button>
//           </div>
//         </div>
//       </div>

//       <FeedbackSection
//         bookingId={bookingId}
//         userToken={user.token}
//         movieId={movie._id} // Pass movie ID
//       />
//     </div>
//   );
// };

// export default BookingSuccess;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import FeedbackSection from "../Components/feedback";

const BookingSuccess = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");
  const sessionId = queryParams.get("session_id");

  const confirmPaymentAndFetchBooking = async () => {
    try {
      if (!sessionId || !bookingId) {
        throw new Error("Session ID or Booking ID is missing");
      }

      const paymentResponse = await axios.post(
        "/user/paymentSuccess",
        { session_id: sessionId, bookingId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Payment success response:", paymentResponse.data);

      const bookingResponse = await axios.get(`/user/getbooking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      setBookingData(bookingResponse.data.data);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to confirm payment or fetch booking details. Please contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  // New function to handle booking cancellation
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    setCancelError(null);

    try {
      // Call the cancel booking API endpoint
      const response = await axios.post(
        `/user/${bookingId}/cancel`,
        { cancellationReason: cancelReason },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCancelSuccess(true);
      // Update booking data to reflect cancellation
      setBookingData((prev) => ({
        ...prev,
        bookingStatus: "cancelled",
        refundAmount: response.data.data.booking.refundAmount,
        refundStatus: response.data.data.booking.refundStatus,
      }));

      // Close the dialog after successful cancellation
      setTimeout(() => {
        setCancelDialogOpen(false);
      }, 3000);
    } catch (err) {
      console.error("Cancellation error:", err);
      setCancelError(
        err.response?.data?.message ||
          "Failed to cancel booking. Please try again or contact support."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  // Function to check if cancellation is allowed
  const isCancellationAllowed = () => {
    if (!bookingData) return false;

    // Don't allow cancellation if already cancelled
    if (bookingData.bookingStatus === "cancelled") return false;

    // Parse show date and time
    const showDate = new Date(bookingData.show.showDate);
    const [hours, minutes] = bookingData.show.showTime.split(":").map(Number);
    showDate.setHours(hours, minutes);

    // Get current time
    const now = new Date();

    // Allow cancellation only if show time is at least 3 hours in the future
    const threeHoursBeforeShow = new Date(
      showDate.getTime() - 3 * 60 * 60 * 1000
    );
    return now < threeHoursBeforeShow;
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!sessionId || !bookingId) {
      setError("Session ID or Booking ID is missing from the URL.");
      setLoading(false);
      return;
    }

    confirmPaymentAndFetchBooking();
  }, [user, navigate]);

  // Cancel Dialog Component
  const CancelDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {cancelSuccess ? "Booking Cancelled" : "Cancel Booking"}
        </h3>

        {cancelSuccess ? (
          <div className="mb-4">
            <p className="text-green-600 mb-2">
              Your booking has been successfully cancelled.
            </p>
            {bookingData.refundAmount > 0 && (
              <p className="text-gray-700">
                A refund of ₹{bookingData.refundAmount.toFixed(2)} will be
                processed to your original payment method. Refund status:{" "}
                <span className="font-medium">{bookingData.refundStatus}</span>
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? Cancellation is only
              allowed up to 3 hours before showtime.
            </p>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {cancelError}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="cancelReason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for cancellation (optional)
              </label>
              <textarea
                id="cancelReason"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please tell us why you're cancelling"
              ></textarea>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 mt-5">
          {cancelSuccess ? (
            <button
              onClick={() => setCancelDialogOpen(false)}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700"
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300"
                disabled={cancelLoading}
              >
                No, keep booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                disabled={cancelLoading}
              >
                {cancelLoading ? "Cancelling..." : "Yes, cancel booking"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">Getting your ticket ready...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">No booking data available.</p>
      </div>
    );
  }

  const { movie, seats, totalPrice, show, bookingStatus } = bookingData;
  const showtime = `${show.showTime}, ${new Date(
    show.showDate
  ).toDateString()}`;
  const selectedSeats = seats.map((seat) => seat.seatNumber).join(", ");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
      {cancelDialogOpen && <CancelDialog />}

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden flex border border-gray-200">
        <div
          className={`bg-gradient-to-b ${
            bookingStatus === "cancelled"
              ? "from-gray-500 to-gray-700"
              : "from-teal-500 to-teal-700"
          } p-6 w-1/3 text-white flex flex-col justify-between`}
        >
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide">
              {movie.title}
            </h2>
            <p className="text-sm mt-1 opacity-80">Movie Ticket</p>
            {bookingStatus === "cancelled" && (
              <div className="mt-3 py-1 px-2 bg-red-500 text-white text-xs font-bold rounded-md inline-block">
                CANCELLED
              </div>
            )}
          </div>
          <p className="text-xs">
            {bookingStatus === "cancelled"
              ? "Booking cancelled"
              : "Enjoy the show!"}
          </p>
        </div>
        <div className="p-6 w-2/3 text-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Showtime</p>
              <p className="text-sm font-semibold">{showtime}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Seats</p>
              <p className="text-sm font-semibold">{selectedSeats}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Paid</p>
              <p className="text-sm font-semibold">₹{totalPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Booking ID</p>
              <p className="text-sm font-semibold">{bookingId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <p
                className={`text-sm font-semibold ${
                  bookingStatus === "cancelled"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {bookingStatus === "cancelled" ? "Cancelled" : "Confirmed"}
              </p>
            </div>
            {bookingData.refundAmount > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase">Refund</p>
                <p className="text-sm font-semibold">
                  ₹{bookingData.refundAmount.toFixed(2)} (
                  {bookingData.refundStatus})
                </p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-4 text-center">
            {bookingStatus === "cancelled"
              ? "This booking has been cancelled"
              : "Present this ticket at the entrance"}
          </p>
          <div className="mt-6 flex justify-end gap-4">
            {bookingStatus !== "cancelled" && isCancellationAllowed() && (
              <button
                onClick={() => setCancelDialogOpen(true)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition duration-200"
              >
                Cancel Booking
              </button>
            )}
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-md hover:bg-teal-600 transition duration-200"
            >
              Profile
            </button>
            {bookingStatus !== "cancelled" && (
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-teal-700 text-white text-sm font-semibold rounded-md hover:bg-teal-800 transition duration-200"
              >
                Print
              </button>
            )}
          </div>
        </div>
      </div>

      {bookingStatus !== "cancelled" && (
        <FeedbackSection
          bookingId={bookingId}
          userToken={user.token}
          movieId={movie._id}
        />
      )}
    </div>
  );
};

export default BookingSuccess;
