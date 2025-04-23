import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext";

export default function Seat() {
  const { id: movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set Axios base URL and credentials
  useEffect(() => {
    axios.defaults.withCredentials = true; // For cookie-based auth
  }, []);

  // Fetch movie details from location state or localStorage
  useEffect(() => {
    if (location.state?.movie) {
      setMovie(location.state.movie);
    } else {
      const storedMovie = localStorage.getItem("selectedMovie");
      if (storedMovie) {
        setMovie(JSON.parse(storedMovie));
      }
    }
  }, [location]);

  // Fetch showtimes for the movie
  useEffect(() => {
    if (!movieId) return;

    const fetchShowtimes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/user/getAllShowTime", {
          params: { movieId },
        });
        setShowtimes(response.data.data || []);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        setError("Failed to load showtimes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimes();
  }, [movieId]);

  // Fetch seats when a showtime is selected
  useEffect(() => {
    if (!selectedShowId) return;

    const fetchSeats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/getAllSeats/${selectedShowId}`);
        console.log("Seats API response:", response.data.data);
        setSeats(response.data.data || []);
      } catch (error) {
        console.error("Error fetching seats:", error);
        setError("Failed to load seats. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [selectedShowId]);

  // Extract unique dates from showtimes
  const getAvailableDates = () => {
    return [
      ...new Set(
        showtimes.map(
          (show) => new Date(show.showDate).toISOString().split("T")[0]
        )
      ),
    ];
  };

  // Handle date selection
  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setSelectedShowId(null);
    setSeats([]);
    setSelectedSeats(new Set());
  };

  // Handle showtime selection
  const handleTimeSelection = (show) => {
    setSelectedTime(show.showTime);
    setSelectedShowId(show._id);
    setSelectedSeats(new Set());
  };

  // Transform seat number to display only row and number (e.g., B10)
  const getDisplaySeatNumber = (seatNumber) => {
    const parts = seatNumber.split("-");
    return parts.length > 1 ? parts[1] : seatNumber; // Take the part after the prefix
  };

  // Toggle seat selection
  const toggleSeat = (seatId) => {
    if (!selectedTime || !selectedDate) return;
    const seat = seats.find((s) => s._id === seatId);
    if (seat?.isBooked) return;

    const newSelection = new Set(selectedSeats);
    const seatKey = seatId;
    if (newSelection.has(seatKey)) {
      newSelection.delete(seatKey);
    } else {
      newSelection.add(seatKey);
    }
    setSelectedSeats(newSelection);
  };

  // Organize seats by seatType with gaps and natural sorting
  const organizeSeats = () => {
    const sections = {};
    seats.forEach((seat) => {
      const seatType = seat.seatType || "Unknown";
      const rowLetter = getDisplaySeatNumber(seat.seatNumber)[0]; // Use first letter of display number
      if (!sections[seatType]) {
        sections[seatType] = {};
      }
      if (!sections[seatType][rowLetter]) {
        sections[seatType][rowLetter] = [];
      }
      sections[seatType][rowLetter].push(seat);
    });

    Object.keys(sections).forEach((seatType) => {
      Object.keys(sections[seatType]).forEach((row) => {
        sections[seatType][row].sort((a, b) => {
          const numA = parseInt(
            getDisplaySeatNumber(a.seatNumber).slice(1),
            10
          );
          const numB = parseInt(
            getDisplaySeatNumber(b.seatNumber).slice(1),
            10
          );
          return numA - numB;
        });
        const rowSeats = sections[seatType][row];
        const patternedSeats = [];
        rowSeats.forEach((seat, index) => {
          patternedSeats.push(seat);
          if (index === 2 || index === 15) {
            patternedSeats.push(null);
          }
        });
        sections[seatType][row] = patternedSeats;
      });
    });

    return sections;
  };

  // Calculate total price based on backend-provided seat prices
  const calculateTotalPrice = () => {
    return Array.from(selectedSeats).reduce((total, seatId) => {
      const seat = seats.find((s) => s._id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  // Get seat type prices for display in headers
  const getSeatTypePrices = () => {
    const seatTypePrices = {};
    seats.forEach((seat) => {
      if (!seatTypePrices[seat.seatType]) {
        seatTypePrices[seat.seatType] = seat.price;
      }
    });
    return seatTypePrices;
  };

  // Handle booking creation and redirection
  const handleProceedToPay = async () => {
    if (!user) {
      setError("Please log in to proceed.");
      navigate("/login");
      return;
    }

    if (selectedSeats.size === 0 || !selectedShowId) {
      setError("Please select seats and a showtime.");
      return;
    }

    try {
      const bookingData = {
        showId: selectedShowId,
        seatIds: Array.from(selectedSeats),
        movieId,
      };
      console.log("Creating booking with data:", bookingData);
      const response = await axios.post("/user/createBooking", bookingData, {
        withCredentials: true,
      });
      const bookingId = response.data.data._id;
      console.log("Booking created, ID:", bookingId);
      navigate(`/booking/${bookingId}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      setError(error.response?.data?.message || "Failed to create booking.");
    }
  };

  if (loading || !movie) {
    return <p className="text-center text-xl mt-10">Loading...</p>;
  }
  if (error) {
    return <p className="text-center text-xl mt-10 text-red-500">{error}</p>;
  }

  const availableDates = getAvailableDates();
  const availableShowtimes = showtimes.filter(
    (show) =>
      new Date(show.showDate).toISOString().split("T")[0] === selectedDate
  );
  const organizedSeats = organizeSeats();
  const totalPrice = calculateTotalPrice();
  const seatTypePrices = getSeatTypePrices();

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen max-w-screen flex flex-col items-center">
      {/* Movie Details */}
      <h1 className="text-3xl font-extrabold mb-4 text-teal-500">
        {movie.title}
      </h1>
      <p className="mb-6 text-lg text-gray-300">
        {movie.cinema || "Ariesplex SL Cinemas"}
      </p>

      {/* Date Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-teal-400">
          Choose Date:
        </h3>
        <div className="flex gap-4 flex-wrap">
          {availableDates.map((date) => (
            <button
              key={date}
              className={`px-4 py-2 rounded-lg text-lg font-medium transition-all ${
                selectedDate === date
                  ? "bg-green-500 text-white scale-110"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
              onClick={() => handleDateSelection(date)}
            >
              {new Date(date).toDateString()}
            </button>
          ))}
        </div>
      </div>

      {/* Showtime Selection */}
      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-teal-400">
            Choose Showtime:
          </h3>
          <div className="flex gap-4 flex-wrap">
            {availableShowtimes.length > 0 ? (
              availableShowtimes.map((show) => (
                <button
                  key={show._id}
                  className={`px-4 py-2 rounded-lg text-lg font-medium transition-all ${
                    selectedTime === show.showTime
                      ? "bg-green-500 text-white scale-110"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                  onClick={() => handleTimeSelection(show)}
                >
                  {show.showTime}
                </button>
              ))
            ) : (
              <p className="text-gray-300">No showtimes available</p>
            )}
          </div>
        </div>
      )}

      {/* Seat Selection */}
      {selectedShowId && seats.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg w-full shadow-lg">
          <p className="text-center mb-4 text-xl font-semibold">Screen</p>
          <div className="bg-gray-700 h-2 w-3/4 mx-auto mb-4 rounded-full"></div>

          <div className="space-y-6">
            {Object.entries(organizedSeats).map(([seatType, rows]) => (
              <div key={seatType}>
                <h3 className="text-xl font-semibold mb-4 uppercase text-blue-300">
                  {seatType} - ₹{seatTypePrices[seatType] || "N/A"}
                </h3>
                {Object.entries(rows).map(([row, rowSeats]) => (
                  <div key={row} className="flex gap-3 mb-3 items-center">
                    <span className="font-bold w-6 text-green-400">{row}</span>
                    {rowSeats.map((seat, idx) =>
                      seat ? (
                        <button
                          key={seat._id}
                          className={`w-12 h-12 text-sm flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                            seat.isBooked
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500"
                              : selectedSeats.has(seat._id)
                              ? "bg-green-500 text-white border-green-700 scale-110"
                              : "bg-gray-700 hover:bg-gray-600 border-gray-500"
                          }`}
                          onClick={() => toggleSeat(seat._id)}
                          disabled={
                            seat.isBooked || !selectedDate || !selectedTime
                          }
                        >
                          <span className="font-semibold">
                            {getDisplaySeatNumber(seat.seatNumber)}
                          </span>
                        </button>
                      ) : (
                        <div key={`gap-${idx}`} className="w-12 h-12" />
                      )
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Price and Proceed to Payment */}
      {selectedSeats.size > 0 && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-lg font-semibold mb-2">
            Total Price: ₹{totalPrice}
          </p>
          <button
            onClick={handleProceedToPay}
            className="inline-block bg-red-500 hover:bg-red-600 px-6 py-3 text-lg rounded-lg"
          >
            Proceed to Pay
          </button>
        </div>
      )}
    </div>
  );
}
