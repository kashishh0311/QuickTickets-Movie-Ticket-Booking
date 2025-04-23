import React from "react";

function BookingSum({
  movie,
  userInfo,
  tickets,
  totalPrice,
  selectedSeats,
  onConfirm,
  onCancel,
  bookingStatus,
}) {
  return (
    <main>
      <div className="p-6 rounded-lg shadow-lg w-fit mx-auto mt-8">
        <h2 className="text-4xl font-semibold text-gray-900 text-center mb-6">
          Booking Summary
        </h2>
        <h2 className="text-3xl text-center mb-4 font-semibold text-teal-500">
          {movie.title}
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-start mt-8">
          {/* Movie Poster Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-auto h-96 mx-auto">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-auto h-full object-cover rounded-lg"
            />
          </div>

          {/* Booking Details Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-fit mx-auto">
            <div className="mb-5">
              <h3 className="text-xl mb-1 font-semibold text-teal-500">
                User Information
              </h3>
              <p className="text-gray-600">Name: {userInfo.name}</p>
              <p className="text-gray-600">Email: {userInfo.email}</p>
            </div>

            {/* Show Time and Number of Tickets */}
            <div className="mb-5">
              <h3 className="text-xl mb-1 font-semibold text-teal-500">
                Booking Details
              </h3>
              <p className="text-gray-600">Show Time: {userInfo.showtime}</p>
              <p className="text-gray-600">Tickets: {tickets} Tickets</p>
              <p className="text-gray-600">Seats: {selectedSeats.join(", ")}</p>
            </div>

            {/* Price Calculation */}
            <div className="mb-5">
              <h3 className="text-xl mb-1 font-semibold text-teal-500">
                Price Details
              </h3>
              <p className="text-gray-600">
                Price per Ticket: ${(totalPrice / tickets).toFixed(2)}
              </p>
              <p className="text-gray-600">Total: ${totalPrice.toFixed(2)}</p>
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-4 space-y-2">
              <button
                onClick={onConfirm}
                disabled={
                  bookingStatus === "confirmed" || bookingStatus === "cancelled"
                }
                className={`w-full py-2 px-4 text-white rounded-md text-sm font-medium transition duration-300 focus:outline-none ${
                  bookingStatus === "confirmed" || bookingStatus === "cancelled"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-teal-400 hover:text-gray-800"
                }`}
              >
                {bookingStatus === "confirmed"
                  ? "Booking Confirmed"
                  : "Confirm Booking"}
              </button>
              <button
                onClick={onCancel}
                disabled={
                  bookingStatus === "cancelled" || bookingStatus === "confirmed"
                }
                className={`w-full py-2 px-4 text-white rounded-md text-sm font-medium transition duration-300 focus:outline-none ${
                  bookingStatus === "cancelled" || bookingStatus === "confirmed"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {bookingStatus === "cancelled"
                  ? "Booking Cancelled"
                  : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BookingSum;
