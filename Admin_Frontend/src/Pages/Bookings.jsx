import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/admin/getAdminAllBookings", {
        headers: { "Content-Type": "application/json" },
      });
      // Sort bookings by bookingDate in descending order (newest first)
      const sortedBookings = (response.data.data || []).sort((a, b) => {
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      });
      setBookings(sortedBookings);
      toast.success("Bookings refreshed successfully!", { autoClose: 2000 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings =
    statusFilter === "All"
      ? bookings
      : bookings.filter((booking) => booking.bookingStatus === statusFilter);

  const BookingCard = ({ booking }) => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition-all duration-300 hover:shadow-lg hover:bg-teal-50 animate-slide-up">
      {/* Teal Accent Bar */}
      <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Left Section: Movie & User Details */}
        <div className="flex-1">
          <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[200px]">
              {booking.movie.title}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                booking.bookingStatus === "confirmed"
                  ? "bg-teal-100 text-teal-700"
                  : booking.bookingStatus === "pending" ||
                    booking.bookingStatus === "on-hold"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {booking.bookingStatus}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-teal-600">
              {booking.user.fullName}
            </span>{" "}
            • {booking.show.showTime} on{" "}
            {new Date(booking.show.showDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Ref: {booking.bookingId || booking._id} • Booked:{" "}
            {new Date(booking.bookingDate).toLocaleString()}
          </p>
        </div>

        {/* Right Section: Booking Info */}
        <div className="flex-1 text-left sm:text-right">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Seats:</span>{" "}
            {booking.seats.length}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Total:</span> $
            {booking.totalPrice}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Payment:</span>{" "}
            {booking.paymentStatus}{" "}
            {booking.transactionId ? `(${booking.transactionId})` : ""}
          </p>
          {booking.expiresAt && booking.bookingStatus === "pending" && (
            <p className="text-xs text-red-600">
              Expires: {new Date(booking.expiresAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-6 transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-screen`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-teal-800">🎟️ Filters</h2>
          <button
            className="md:hidden text-teal-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          {["All", "pending", "confirmed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setIsSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full text-left py-2 px-4 rounded-lg capitalize transition-all duration-200 ${
                statusFilter === status
                  ? "bg-teal-100 text-teal-700"
                  : "text-gray-600 hover:bg-teal-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64">
        <div
          className=" overflow-y-auto h-[95vh] "
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-teal-800 animate-fade-in">
              📋 Admin Bookings
            </h1>
            <div className="flex gap-4">
              <button
                className="md:hidden bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200"
                onClick={() => setIsSidebarOpen(true)}
              >
                Filters
              </button>
              <button
                onClick={fetchBookings}
                disabled={loading}
                className={`bg-teal-600 text-white px-4 py-2 rounded-lg transition-all duration-200 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-teal-700"
                }`}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

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

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center text-sm animate-slide-up">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-900 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600"></div>
            </div>
          )}

          {/* Vertical Bookings List */}
          {!loading && (
            <div className="space-y-6">
              {filteredBookings.length === 0 ? (
                <div className="text-center text-teal-600 py-10 animate-fade-in">
                  No bookings found for this filter
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))
              )}
            </div>
          )}
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>{" "}
    </div>
  );
}

export default AdminBookings;
