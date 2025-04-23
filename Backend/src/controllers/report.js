import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Booking } from "../models/booking.models.js";
const getRevenueReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = {
    bookingStatus: "confirmed", // Only confirmed bookings count
  };

  if (startDate && endDate) {
    matchStage.bookingDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const revenueReport = await Booking.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$movie",
        totalRevenue: { $sum: "$totalPrice" },
        totalBookings: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "_id",
        as: "movieDetails",
      },
    },
    {
      $unwind: "$movieDetails",
    },
    {
      $project: {
        movieTitle: "$movieDetails.title",
        totalRevenue: 1,
        totalBookings: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, revenueReport, "Revenue report generated"));
});

export { getRevenueReport };
