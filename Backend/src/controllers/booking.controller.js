import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/booking.models.js";
import { Seat } from "../models/seat.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Create Booking (Seat Selection - User-Side)
const createBooking = asyncHandler(async (req, res) => {
  const { showId, seatIds, movieId } = req.body;
  const userId = req.user._id;

  // Validate seats are available and not reserved by another pending booking
  const seats = await Seat.find({ _id: { $in: seatIds }, isBooked: false });
  if (seats.length !== seatIds.length) {
    throw new ApiError(400, "Some seats do not exist or are already booked");
  }

  // Check for existing pending bookings with these seats
  const existingBookings = await Booking.find({
    seats: { $in: seatIds },
    bookingStatus: "pending",
    expiresAt: { $gt: new Date() }, // Only active pending bookings
  });

  if (existingBookings.length > 0) {
    const reservedSeats = existingBookings.flatMap((b) =>
      b.seats.map((s) => s.toString())
    );
    const conflictingSeats = seatIds.filter((id) => reservedSeats.includes(id));
    if (conflictingSeats.length > 0) {
      const seatDetails = await Seat.find({ _id: { $in: conflictingSeats } });
      throw new ApiError(
        409,
        `Seats already reserved in pending bookings: ${seatDetails
          .map((s) => s.seatNumber)
          .join(", ")}`
      );
    }
  }

  // Calculate total price using virtual price field
  const seatTypePrices = { Regular: 190, Royal: 250, VIP: 300 };
  const totalPrice = seats.reduce(
    (sum, seat) => sum + (seatTypePrices[seat.seatType] || 0),
    0
  );

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const booking = await Booking.create({
    user: userId,
    show: showId,
    seats: seatIds, // Array of ObjectIds
    movie: movieId,
    totalPrice,
    expiresAt,
    bookingStatus: "pending",
  });

  console.log("Booking created:", booking); // Debug
  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});

// Get All Bookings (User’s Bookings - User-Side)
const getAllBooking = asyncHandler(async (req, res) => {
  const userId = req.user._id; // From verifyJWT

  const bookings = await Booking.find({ user: userId })
    .populate("user", "name email")
    // .populate("show", "date time")
    .populate("show", "showDate showTime")
    .populate("seats", "seatNumber price seatType")
    .populate("payment", "amount status")
    .populate("movie", "title");

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "Your bookings fetched successfully"));
});

// Get Booking by ID (User’s Booking - User-Side)
const getBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  console.log("Fetching booking:", bookingId, "for user:", userId);
  const booking = await Booking.findOne({ _id: bookingId, user: userId })
    .populate("user", "name email")
    .populate("show", "showDate showTime")
    .populate({
      path: "seats",
      select: "seatNumber seatType isBooked",
      options: { toJSON: { virtuals: true } }, // Include virtual price
    })
    .populate("movie", "title");

  if (!booking) {
    console.log("Booking not found for ID:", bookingId);
    throw new ApiError(404, "Booking not found or you don’t own it");
  }

  console.log("Booking found:", booking);
  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

// Update Booking (User’s Booking - User-Side)
const updateBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;
  const { paymentId, transactionId, bookingStatus } = req.body;

  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new ApiError(404, "Booking not found or you don’t own it");
  }

  if (booking.bookingStatus !== "pending") {
    throw new ApiError(
      400,
      "Booking cannot be updated; it’s already processed"
    );
  }

  if (booking.expiresAt && booking.expiresAt < new Date()) {
    await Seat.updateMany({ _id: { $in: booking.seats } }, { isBooked: false });
    booking.bookingStatus = "expired";
    await booking.save();
    throw new ApiError(410, "Booking has expired");
  }

  // Update booking status and payment details
  booking.bookingStatus = bookingStatus || "confirmed";
  booking.payment = { paymentId, transactionId, status: "completed" };
  booking.expiresAt = undefined; // Clear expiration on confirmation

  // Mark seats as booked only if confirmed
  if (booking.bookingStatus === "confirmed") {
    await Seat.updateMany({ _id: { $in: booking.seats } }, { isBooked: true });
  }

  await booking.save();

  const updatedBooking = await Booking.findById(bookingId)
    .populate("user", "name email")
    .populate("show", "showDate showTime")
    .populate({
      path: "seats",
      select: "seatNumber seatType isBooked",
      options: { toJSON: { virtuals: true } },
    })
    .populate("movie", "title");

  console.log("Updated booking:", updatedBooking);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedBooking, "Booking updated successfully"));
});

// Delete Booking (User’s Booking - User-Side)
const deleteBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id; // From verifyJWT

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid bookingId");
  }

  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new ApiError(404, "Booking not found or you don’t own it");
  }

  // Free up seats
  await Seat.updateMany({ _id: { $in: booking.seats } }, { isBooked: false });

  await Booking.deleteOne({ _id: bookingId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Booking deleted successfully"));
});

// Confirm Booking (Payment - User-Side)
const confirmBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id; // From verifyJWT
  const { paymentId, transactionId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid bookingId");
  }

  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new ApiError(404, "Booking not found or you don’t own it");
  }

  if (booking.bookingStatus !== "pending") {
    throw new ApiError(400, "Booking is not in a pending state");
  }
  if (booking.expiresAt && booking.expiresAt < new Date()) {
    throw new ApiError(410, "Booking has expired");
  }

  // Update booking with payment details
  booking.payment =
    paymentId && mongoose.Types.ObjectId.isValid(paymentId)
      ? paymentId
      : undefined;
  booking.transactionId = transactionId || undefined;
  booking.paymentStatus = "paid";
  booking.bookingStatus = "confirmed";
  booking.expiresAt = undefined;

  await booking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking confirmed successfully"));
});

// admin side get all booking
const getAdminAllBookings = async (req, res) => {
  // This is a placeholder - replace with your actual database query
  const bookings = await Booking.find()
    .populate("user", "fullName") // Fetch user name
    .populate("movie", "title") // Fetch movie title
    .populate("show", "showTime showDate") // Fetch show time and date
    .populate("seats", "seatNumber price"); // Fetch seat details (optional)

  if (!bookings.length) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "No bookings found",
    });
  }
  res.status(200).json({
    success: true,
    data: bookings,
    message: "Bookings retrieved successfully",
  });
};

// Cancel Booking (User's Booking - User-Side)
const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;
  const { cancellationReason } = req.body;

  // Validate bookingId
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  // Find booking and verify ownership
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new ApiError(404, "Booking not found or you don't own it");
  }

  // Check if booking can be cancelled based on status
  if (booking.bookingStatus === "cancelled") {
    throw new ApiError(400, "Booking is already cancelled");
  }

  // Implement cancellation policy
  // Example: Only allow cancellation if show hasn't started
  const show = await mongoose.model("ShowTime").findById(booking.show);
  if (show) {
    const showDateTime = new Date(show.showDate);
    showDateTime.setHours(
      parseInt(show.showTime.split(":")[0]),
      parseInt(show.showTime.split(":")[1])
    );

    // If show time has passed, disallow cancellation
    if (showDateTime < new Date()) {
      throw new ApiError(400, "Cannot cancel booking after show has started");
    }

    // Example: Set cancellation window (e.g., 3 hours before show)
    const cancellationDeadline = new Date(showDateTime);
    cancellationDeadline.setHours(cancellationDeadline.getHours() - 3);

    if (new Date() > cancellationDeadline) {
      throw new ApiError(
        400,
        "Cancellation is only allowed up to 3 hours before show time"
      );
    }
  }

  // Apply refund policy based on payment status
  let refundAmount = 0;
  let refundStatus = "not_applicable";

  if (booking.paymentStatus === "paid") {
    // Example: Calculate refund amount (e.g., 85% refund)
    refundAmount = Math.floor(booking.totalPrice * 0.85);
    refundStatus = "processing";

    // Here you would integrate with payment provider for actual refund
    // This is a placeholder for the refund logic
    console.log(
      `Processing refund of ${refundAmount} for booking ${bookingId}`
    );
  }

  // Update booking status
  booking.bookingStatus = "cancelled";
  booking.cancelledAt = new Date();
  booking.cancellationReason =
    cancellationReason || "User requested cancellation";
  booking.refundAmount = refundAmount;
  booking.refundStatus = refundStatus;

  // Release reserved seats
  await Seat.updateMany({ _id: { $in: booking.seats } }, { isBooked: false });

  await booking.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        booking: {
          _id: booking._id,
          status: booking.bookingStatus,
          refundAmount,
          refundStatus,
        },
      },
      "Booking cancelled successfully"
    )
  );
});

export {
  createBooking,
  getAllBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  confirmBooking,
  getAdminAllBookings,
  cancelBooking,
};
