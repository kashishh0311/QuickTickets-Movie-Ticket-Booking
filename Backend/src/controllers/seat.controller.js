import { Seat } from "../models/seat.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.models.js";
import { ShowTime } from "../models/showtime.models.js";
import mongoose from "mongoose";

//  😜Create Seats for a Show

const createSeat = asyncHandler(async (req, res) => {
  const { show, totalSeats, seatType, config = {} } = req.body;
  const { seatsPerRow = 19 } = config;

  // Validate required fields
  if (!show || !totalSeats || !seatType) {
    throw new ApiError(400, "Show, totalSeats, and seatType are required");
  }

  if (!mongoose.Types.ObjectId.isValid(show)) {
    throw new ApiError(400, "Invalid show ID");
  }

  if (totalSeats > 200 || totalSeats <= 0) {
    throw new ApiError(400, "Total seats must be between 1 and 200");
  }

  const validSeatTypes = ["Royal", "Regular", "VIP"];
  if (!validSeatTypes.includes(seatType)) {
    throw new ApiError(
      400,
      `Invalid seatType. Must be one of: ${validSeatTypes.join(", ")}`
    );
  }

  // Check if show exists
  const showExists = await ShowTime.findById(show);
  if (!showExists) {
    throw new ApiError(404, "Show not found");
  }

  // Generate seat numbers with a prefix based on show ID to ensure uniqueness
  const generateSeatNumbers = async (showId, totalSeats, seatsPerRow) => {
    const seatNumbers = [];
    const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const showPrefix = showId.toString().slice(-4); // Use last 4 digits of show ID as prefix

    // Check existing seats for this show
    const existingSeats = await Seat.find({ show: showId }).select(
      "seatNumber"
    );
    const existingSeatNumbers = new Set(
      existingSeats.map((seat) => seat.seatNumber)
    );

    let generatedCount = 0;
    let rowIndex = 0;
    let seatInRow = 0;

    while (generatedCount < totalSeats) {
      const rowLetter = rowLetters[rowIndex];
      if (!rowLetter) {
        throw new ApiError(
          400,
          "Too many seats requested; exceeds row limit (Z)"
        );
      }

      seatInRow++;
      if (seatInRow > seatsPerRow) {
        seatInRow = 1;
        rowIndex++;
      }

      const seatNumber = `${showPrefix}-${rowLetter}${seatInRow}`;
      if (!existingSeatNumbers.has(seatNumber)) {
        seatNumbers.push(seatNumber);
        generatedCount++;
      }
    }

    return seatNumbers;
  };

  try {
    // Generate unique seat numbers for this show
    const seatNumbers = await generateSeatNumbers(
      show,
      totalSeats,
      seatsPerRow
    );

    // Check for any unexpected duplicates (safety net)
    const existingSeats = await Seat.find({
      show,
      seatNumber: { $in: seatNumbers },
    });

    if (existingSeats.length > 0) {
      throw new ApiError(
        409,
        `Seat numbers already exist: ${existingSeats
          .map((s) => s.seatNumber)
          .join(", ")}`
      );
    }

    // Create seat documents
    const seatsToCreate = seatNumbers.map((seatNumber) => ({
      show,
      totalSeats, // Represents the total seats in this creation batch
      seatType,
      seatNumber,
      isBooked: false,
    }));

    // Bulk insert seats with a retry mechanism
    let createdSeats;
    try {
      createdSeats = await Seat.insertMany(seatsToCreate, { ordered: false });
    } catch (insertError) {
      if (insertError.code === 11000) {
        throw new ApiError(
          409,
          "Duplicate seat numbers detected during insertion"
        );
      }
      throw insertError;
    }

    // Optional: Update totalSeats for consistency (if needed)
    const allSeatsForShow = await Seat.countDocuments({ show });
    await Seat.updateMany({ show }, { totalSeats: allSeatsForShow });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { seats: createdSeats, total: createdSeats.length },
          `Successfully created ${seatType} seats for show ${show}`
        )
      );
  } catch (error) {
    console.error("Error in createSeat:", error); // Add logging for debugging
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error creating seats"
    );
  }
});

// get all seats for show
// const getAllSeats = asyncHandler(async (req, res) => {
//   try {
//     const { showId } = req.body;
//     const seats = await Seat.find({ show: showId })
//       .populate({
//         path: "show",
//         select: "movie showDate showTime",
//         populate: {
//           path: "movie", // Nested population for the movie reference
//           select: "title", // Adjust this based on your Movie schema's field for name
//         },
//       })
//       .sort({ seatNumber: 1 });

//     return res
//       .status(200)
//       .json(new ApiResponse(200, seats, "seats fetched successfully"));
//   } catch (error) {
//     console.log("Failed to get seats", error);
//     throw new ApiError(
//       500,
//       error?.message || "something went wrong while getting seats"
//     );
//   }
// });

// //get available seat
// const getAvailableSeats =asyncHandler(async (req, res) => {
//   const { showId } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(showId)) {
//     throw new ApiError(400, "Invalid show ID");
//   }

//   const seats = await Seat.find({
//     show: showId,
//     isBooked: false,
//   })
//     .populate("show", "movie theater showTime")
//     .sort({ seatNumber: 1 });

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { seats, total: seats.length },
//         "Available seats retrieved successfully"
//       )
//     );
// });

// Get All Seats for a Show dont remove
// const getAllSeats = asyncHandler(async (req, res) => {
//   const { showId } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(showId)) {
//     throw new ApiError(400, "Invalid show ID");
//   }

//   const seats = await Seat.find({ show: showId })
//     .populate({
//       path: "show",
//       select: "movie showDate showTime",
//       populate: { path: "movie", select: "title" },
//     })
//     .sort({ seatNumber: 1 });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, seats, "seats fetched successfully"));
// });

// Get Available Seats
const getAvailableSeats = asyncHandler(async (req, res) => {
  const { showId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(showId)) {
    throw new ApiError(400, "Invalid show ID");
  }

  const seats = await Seat.find({ show: showId, isBooked: false })
    .populate("show", "movie theater showTime")
    .sort({ seatNumber: 1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { seats, total: seats.length },
        "available seats retrieved successfully"
      )
    );
});

// // update seat status    Booked || NotBooked
// const updateSeatStatus = asyncHandler(async (req, res) => {
//   try {
//     const { isBooked } = req.body;
//     const updatedSeat = await Seat.findOneAndUpdate(
//       req.seat?._id,
//       { isBooked },
//       { new: true }
//     );
//     if (!updatedSeat) {
//       throw new ApiError(404, "Seat not found");
//     }
//     return res
//       .status(200)
//       .json(new ApiResponse(200, updatedSeat, "seat status updated"));
//   } catch (error) {
//     console.log("Failed to update seat status", error);
//     throw new ApiError(
//       500,
//       error?.message || "something went wrong while updating seat status"
//     );
//   }
// });

// controllers/seat.controllers.js

const getAllSeats = asyncHandler(async (req, res) => {
  const { showId } = req.params;

  // Find all confirmed bookings for this show
  const bookings = await Booking.find({
    show: showId,
    bookingStatus: "confirmed",
  });
  const bookedSeatIds = bookings.flatMap((booking) =>
    booking.seats.map((seat) => seat.toString())
  );

  // Fetch all seats for the show
  const seats = await Seat.find({ show: showId }).select(
    "seatNumber seatType isBooked show"
  );

  // Convert to JSON with virtuals to include price
  const availableSeats = seats.map((seat) => {
    const seatObj = seat.toJSON({ virtuals: true }); // Include virtual price field
    return {
      _id: seatObj._id,
      seatNumber: seatObj.seatNumber,
      seatType: seatObj.seatType,
      price: seatObj.price, // Virtual price based on seatType
      isBooked: bookedSeatIds.includes(seat._id.toString()) || seatObj.isBooked,
      show: seatObj.show,
    };
  });

  console.log("Seats returned with prices:", availableSeats); // Debug
  return res
    .status(200)
    .json(new ApiResponse(200, availableSeats, "Seats fetched successfully"));
});
const updateSeatStatus = asyncHandler(async (req, res) => {
  const { seatId } = req.params; // Changed to use URL param
  const { isBooked } = req.body;

  if (!seatId) throw new ApiError(400, "Seat ID is required");

  const updatedSeat = await Seat.findOneAndUpdate(
    { _id: seatId, isBooked: false }, // Prevent double-booking
    { isBooked },
    { new: true }
  );

  if (!updatedSeat) {
    throw new ApiError(409, "Seat already booked or not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSeat, "seat status updated"));
});

// delete seat
const deleteSeat = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    const deletedSeat = await Seat.findByIdAndDelete(_id);
    if (!deletedSeat) {
      throw new ApiError(404, "Seat not found");
    }

    // Update totalSeats for remaining seats in the show
    const remainingSeats = await Seat.find({ show: deletedSeat.show });
    if (remainingSeats.length > 0) {
      await Seat.updateMany(
        { show: deletedSeat.show },
        { totalSeats: remainingSeats.length }
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, deletedSeat, "seat deleted successfully"));
  } catch (error) {
    console.log("Failed to delete seat", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while deleting seat"
    );
  }
});

export {
  createSeat,
  getAllSeats,
  updateSeatStatus,
  deleteSeat,
  getAvailableSeats,
};
