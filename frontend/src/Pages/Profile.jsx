import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import {
  FaUser,
  FaTicketAlt,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimesCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import axios from "axios";

function Profile() {
  const { user, setUser, logout } = useUser();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState("userInfo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all"); // Filter state: 'all', 'booked', 'canceled'
  const ticketsPerPage = 3;

  useEffect(() => {
    if (user) {
      setUserData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setPreviewImage(user.profileImage || "/profile1.png");
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    if (!user?.token) {
      setError("Please log in to view tickets");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("/user/getAllBooking", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // Sort tickets by createdAt in descending order (newest first)
      const sortedTickets = (response.data.data || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setTickets(sortedTickets);
      setCurrentPage(1); // Reset to first page on new fetch
    } catch (err) {
      console.error("Fetch tickets error:", err);
      setError(err.response?.data?.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await axios.put("/user/update", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setUser(response.data.data);
      setIsEditing(false);
      setProfileImage(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Function to check if cancellation is allowed
  const isCancellationAllowed = (bookingData) => {
    if (!bookingData) {
      console.log("No booking data");
      return false;
    }
    if (bookingData.bookingStatus === "cancelled") {
      console.log("Booking already cancelled");
      return false;
    }
    const showDate = new Date(bookingData.show.showDate);
    const [hours, minutes] = bookingData.show.showTime.split(":").map(Number);
    showDate.setHours(hours, minutes);
    if (isNaN(showDate.getTime())) {
      console.log("Invalid show date/time:", bookingData.show);
      return false;
    }
    const now = new Date();
    const threeHoursBeforeShow = new Date(
      showDate.getTime() - 3 * 60 * 60 * 1000
    );
    console.log("Now:", now, "Cutoff:", threeHoursBeforeShow);
    return now < threeHoursBeforeShow;
  };

  const handleCancelBooking = async (bookingId) => {
    setLoading(true);
    try {
      console.log("Cancel URL:", `/api/bookings/${bookingId}/cancel`);
      const response = await axios.post(
        `/user/${bookingId}/cancel`,
        { cancellationReason: cancelReason || "User requested cancellation" },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === bookingId
            ? {
                ...ticket,
                bookingStatus: "cancelled",
                refundAmount: response.data.data.booking.refundAmount,
                refundStatus: response.data.data.booking.refundStatus,
              }
            : ticket
        )
      );
      setError(null);
      setShowCancelModal(null);
      setCancelReason("");
    } catch (err) {
      console.error("Cancel error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on filter state
  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    if (filter === "booked") return ticket.bookingStatus !== "cancelled";
    if (filter === "canceled") return ticket.bookingStatus === "cancelled";
    return true;
  });

  // Pagination logic for filtered tickets
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-teal-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-teal-500">
              <img
                src={previewImage}
                alt="User Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="ml-4 text-2xl font-bold text-gray-800">
              {user?.fullName || "My Account"}
            </h2>
          </div>
          <nav className="space-y-3">
            <button
              onClick={() => setSelected("userInfo")}
              className={`w-full flex items-center p-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                selected === "userInfo"
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-teal-100"
              }`}
              disabled={loading}
            >
              <FaUser className="mr-3" /> Profile
            </button>
            <button
              onClick={() => setSelected("userOrders")}
              className={`w-full flex items-center p-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                selected === "userOrders"
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-teal-100"
              }`}
              disabled={loading}
            >
              <FaTicketAlt className="mr-3" /> My Tickets
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-lg text-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md"
              disabled={loading}
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          ) : selected === "userInfo" ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  Profile Details
                </h1>
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className={`flex items-center px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                    isEditing
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                  disabled={loading}
                >
                  {isEditing ? (
                    <>
                      <FaSave className="mr-2" /> Save
                    </>
                  ) : (
                    <>
                      <FaEdit className="mr-2" /> Edit
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={userData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                        isEditing
                          ? "bg-white border-teal-500"
                          : "bg-gray-100 border-gray-300"
                      }`}
                      disabled={!isEditing || loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                        isEditing
                          ? "bg-white border-teal-500"
                          : "bg-gray-100 border-gray-300"
                      }`}
                      disabled={!isEditing || loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone"
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                        isEditing
                          ? "bg-white border-teal-500"
                          : "bg-gray-100 border-gray-300"
                      }`}
                      disabled={!isEditing || loading}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden ring-4 ring-teal-500 transform hover:scale-105 transition-transform duration-300 mb-4">
                    <img
                      src={previewImage}
                      alt="User Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                        Change Profile Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded-lg text-gray-700"
                        disabled={loading}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Tickets</h1>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFilterChange("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      filter === "all"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    disabled={loading}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange("booked")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      filter === "booked"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    disabled={loading}
                  >
                    Booked
                  </button>
                  <button
                    onClick={() => handleFilterChange("canceled")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      filter === "canceled"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    disabled={loading}
                  >
                    Canceled
                  </button>
                </div>
              </div>
              {filteredTickets.length > 0 ? (
                <div>
                  <div className="space-y-6">
                    {currentTickets.map((ticket) => {
                      const showtime =
                        ticket.show?.showTime && ticket.show?.showDate
                          ? (() => {
                              try {
                                const date = new Date(ticket.show.showDate);
                                if (isNaN(date.getTime())) {
                                  return `${ticket.show.showTime}, Invalid Date`;
                                }
                                return `${
                                  ticket.show.showTime
                                }, ${date.toDateString()}`;
                              } catch (error) {
                                console.error("Date parsing error:", error);
                                return `${ticket.show.showTime}, Date Parsing Failed`;
                              }
                            })()
                          : "N/A";
                      const selectedSeats = ticket.seats?.length
                        ? ticket.seats
                            .map((seat) => seat.seatNumber || "N/A")
                            .join(", ")
                        : "N/A";
                      return (
                        <div
                          key={ticket._id}
                          className="ticket bg-white rounded-lg shadow-lg overflow-hidden flex border border-gray-200 transition-shadow duration-200 hover:shadow-xl"
                        >
                          <div className="bg-gradient-to-b from-teal-500 to-teal-700 p-6 w-1/3 text-white flex flex-col justify-between">
                            <div>
                              <h2 className="text-xl font-bold uppercase tracking-wide">
                                {ticket.movie?.title || "Unknown Movie"}
                              </h2>
                              <p className="text-sm mt-1 opacity-80">
                                Movie Ticket
                              </p>
                            </div>
                            <p className="text-xs">Enjoy the show!</p>
                          </div>
                          <div className="p-6 w-2/3 text-gray-800">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 uppercase">
                                  Showtime
                                </p>
                                <p className="text-sm font-semibold">
                                  {showtime}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase">
                                  Seats
                                </p>
                                <p className="text-sm font-semibold">
                                  {selectedSeats}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase">
                                  Total Paid
                                </p>
                                <p className="text-sm font-semibold">
                                  ₹
                                  {ticket.totalPrice != null
                                    ? ticket.totalPrice.toFixed(2)
                                    : "0.00"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase">
                                  Booking ID
                                </p>
                                <p className="text-sm font-semibold">
                                  {ticket._id}
                                </p>
                              </div>
                              {ticket.bookingStatus === "cancelled" ? (
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">
                                    Status
                                  </p>
                                  <p className="text-sm font-semibold text-red-600">
                                    Cancelled
                                    {ticket.refundAmount > 0 && (
                                      <span>
                                        {" "}
                                        (Refund: ₹{ticket.refundAmount})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              ) : isCancellationAllowed(ticket) ? (
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">
                                    Action
                                  </p>
                                  <button
                                    onClick={() =>
                                      setShowCancelModal(ticket._id)
                                    }
                                    className="flex items-center text-sm font-semibold text-red-600 hover:text-red-800"
                                    disabled={loading}
                                  >
                                    <FaTimesCircle className="mr-1" /> Cancel
                                    Booking
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">
                                    Action
                                  </p>
                                  <p className="text-sm font-semibold text-gray-500">
                                    Cancellation Not Allowed
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Pagination Controls */}
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        currentPage === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      <FaArrowLeft className="mr-2" /> Previous
                    </button>
                    <span className="text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        currentPage === totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      Next <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 py-10">
                  <FaTicketAlt className="mx-auto text-4xl text-teal-500 mb-4" />
                  <p className="text-lg">
                    {filter === "all"
                      ? "No tickets yet. Book a show to see your tickets here!"
                      : filter === "booked"
                      ? "No booked tickets found."
                      : "No canceled tickets found."}
                  </p>
                </div>
              )}
            </div>
          )}
          {/* Cancel Booking Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Cancel Booking
                </h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel this booking? Please provide a
                  reason (optional).
                </p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason (optional)"
                  className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCancelModal(null);
                      setCancelReason("");
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    disabled={loading}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleCancelBooking(showCancelModal)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? "Cancelling..." : "Confirm Cancel"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
