import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast styling

function SeatManagement() {
  const [shows, setShows] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState("");
  const [seats, setSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newSeat, setNewSeat] = useState({
    show: "",
    totalSeats: "",
    seatType: "Regular",
    seatsPerRow: 19,
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all shows
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/getAllShowTime");
      setShows(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch shows");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all seats for a show
  const fetchAllSeats = async () => {
    if (!selectedShowId) {
      setError("Please select a show!");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/admin/getAllSeats/${selectedShowId}`);
      setSeats(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch seats");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available seats for a show
  const fetchAvailableSeats = async () => {
    if (!selectedShowId) {
      setError("Please select a show!");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/admin/getAvailableSeats/${selectedShowId}`
      );
      setAvailableSeats(response.data.data.seats || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch available seats"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setNewSeat({ ...newSeat, [e.target.name]: e.target.value });
  };

  // Create seats
  const handleAddSeats = async () => {
    if (!newSeat.show || !newSeat.totalSeats || !newSeat.seatType) {
      toast.error("Please fill all fields!");
      return;
    }

    const requestedSeats = parseInt(newSeat.totalSeats);
    if (isNaN(requestedSeats) || requestedSeats <= 0 || requestedSeats > 200) {
      toast.error("Total seats must be between 1 and 200!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        show: newSeat.show,
        totalSeats: requestedSeats,
        seatType: newSeat.seatType,
        config: { seatsPerRow: parseInt(newSeat.seatsPerRow) },
      };
      const response = await axios.post("/admin/createSeat", payload);
      toast.success(`Successfully created ${response.data.data.total} seats`);
      setNewSeat({
        show: "",
        totalSeats: "",
        seatType: "Regular",
        seatsPerRow: 19,
      });
      if (newSeat.show === selectedShowId) fetchAllSeats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add seats");
    } finally {
      setLoading(false);
    }
  };

  // Update seat status
  const handleUpdateSeatStatus = async (seatId, currentStatus) => {
    setLoading(true);
    setError(null);
    try {
      const newStatus = !currentStatus;
      const response = await axios.put(`/admin/updateSeat/${seatId}`, {
        isBooked: newStatus,
      });
      toast.success("Seat status updated successfully");
      setSeats(
        seats.map((seat) => (seat._id === seatId ? response.data.data : seat))
      );
      fetchAvailableSeats();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update seat status"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete seat
  const handleRemove = async (seatId) => {
    if (!window.confirm("Are you sure you want to delete this seat?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete("/admin/deleteSeat", {
        data: { _id: seatId },
      });
      toast.success("Seat deleted successfully");
      setSeats(seats.filter((seat) => seat._id !== seatId));
      fetchAvailableSeats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete seat");
    } finally {
      setLoading(false);
    }
  };

  // Transform seat number for display (e.g., "9011-B10" -> "B10")
  const getDisplaySeatNumber = (seatNumber) => {
    const parts = seatNumber.split("-");
    return parts.length > 1 ? parts[1] : seatNumber;
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🪑 Manage Seats</h1>

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
      />

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-700">
            ×
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          ➕ Add New Seats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="show"
            value={newSeat.show}
            onChange={handleChange}
            className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
            disabled={loading}
          >
            <option value="">🎬 Select Show</option>
            {shows.map((show) => (
              <option key={show._id} value={show._id}>
                {show.movie?.title} -{" "}
                {new Date(show.showDate).toLocaleDateString()} {show.showTime}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="totalSeats"
            value={newSeat.totalSeats}
            onChange={handleChange}
            placeholder="🔢 Total Seats (max 200)"
            min="1"
            max="200"
            className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
            disabled={loading}
          />
          <select
            name="seatType"
            value={newSeat.seatType}
            onChange={handleChange}
            className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
            disabled={loading}
          >
            <option value="Regular">🪑 Regular (₹190)</option>
            <option value="Royal">👑 Royal (₹250)</option>
            <option value="VIP">🌟 VIP (₹300)</option>
          </select>
          <input
            type="number"
            name="seatsPerRow"
            value={newSeat.seatsPerRow}
            onChange={handleChange}
            placeholder="🔢 Seats Per Row"
            min="1"
            className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleAddSeats}
          disabled={loading}
          className={`mt-5 bg-slate-700 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
          }`}
        >
          🪑 Add Seats
        </button>
      </div>

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          🔍 Fetch Seats
        </h2>
        <div className="flex gap-4">
          <select
            value={selectedShowId}
            onChange={(e) => setSelectedShowId(e.target.value)}
            className="p-2 border rounded-lg w-full max-w-md focus:ring focus:ring-blue-300"
            disabled={loading}
          >
            <option value="">🎬 Select Show</option>
            {shows.map((show) => (
              <option key={show._id} value={show._id}>
                {show.movie?.title} -{" "}
                {new Date(show.showDate).toLocaleDateString()} {show.showTime}
              </option>
            ))}
          </select>
          <button
            onClick={fetchAllSeats}
            disabled={loading}
            className={`px-6 py-2 bg-slate-700 text-white rounded-lg transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
            }`}
          >
            📋 Fetch All Seats
          </button>
          <button
            onClick={fetchAvailableSeats}
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            ✅ Fetch Available Seats
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-700">Loading seats...</div>
      ) : (
        <>
          {seats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {seats.map((seat) => (
                <div
                  key={seat._id}
                  className="bg-white shadow-lg rounded-lg p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    🪑 {getDisplaySeatNumber(seat.seatNumber)}
                  </h2>
                  <p className="text-gray-700 mb-1">🎭 Type: {seat.seatType}</p>
                  <p className="text-gray-700 mb-1">💰 Price: ₹{seat.price}</p>
                  <p className="text-gray-700 mb-1">
                    ✅ Status: {seat.isBooked ? "Booked" : "Available"}
                  </p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={() =>
                        handleUpdateSeatStatus(seat._id, seat.isBooked)
                      }
                      className={`bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {seat.isBooked ? "🔓 Unbook" : "🔒 Book"}
                    </button>
                    <button
                      onClick={() => handleRemove(seat._id)}
                      className={`bg-slate-800 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-all duration-200 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {availableSeats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableSeats.map((seat) => (
                <div
                  key={seat._id}
                  className="bg-white shadow-lg rounded-lg p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    🪑 {getDisplaySeatNumber(seat.seatNumber)}
                  </h2>
                  <p className="text-gray-700 mb-1">🎭 Type: {seat.seatType}</p>
                  <p className="text-gray-700 mb-1">💰 Price: ₹{seat.price}</p>
                  <p className="text-gray-700 mb-1">✅ Status: Available</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SeatManagement;
