// import { Feedback } from "../models/feedback.models.js";
// import { ApiError } from "../utils/ApiError.js"; // Single import (removed duplicate)
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// const submitFeedback = asyncHandler(async (req, res) => {
//   const { bookingId, rating, message, relatedMovie } = req.body;
//   const userId = req.user?._id; // Safe access to user ID

//   // Validation
//   if (!userId) {
//     throw new ApiError(401, "Unauthorized: User not authenticated");
//   }
//   if (!bookingId) {
//     throw new ApiError(400, "Booking ID is required");
//   }
//   if (!rating || rating < 1 || rating > 5) {
//     throw new ApiError(400, "Rating must be between 1 and 5");
//   }

//   const feedbackData = {
//     user: userId,
//     message: message || "Inline star rating",
//     rating,
//     category: relatedMovie ? "movie" : "booking", // Dynamic category
//     relatedMovie: relatedMovie || null,
//   };

//   const feedback = new Feedback(feedbackData);
//   await feedback.save();

//   console.log("Feedback saved:", feedback); // Debug log
//   return res
//     .status(201)
//     .json(new ApiResponse(201, feedback, "Feedback submitted successfully"));
// });

// const getFeedbackByMovie = asyncHandler(async (req, res) => {
//   const { movieId } = req.params;

//   // Validation
//   if (!movieId) {
//     throw new ApiError(400, "Movie ID is required");
//   }

//   const feedback = await Feedback.find({ relatedMovie: movieId })
//     .populate("user", "fullName") // Populate username
//     .sort({ createdAt: -1 }); // Newest first

//   console.log("Feedback fetched for movie:", movieId, feedback); // Debug log
//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         feedback || [],
//         feedback?.length ? "Feedback fetched successfully" : "No feedback found"
//       )
//     );
// });

// const getAllFeedback = asyncHandler(async (req, res) => {
//   // Optional query parameters for filtering and pagination
//   const {
//     category,
//     minRating,
//     maxRating,
//     page = 1,
//     limit = 10,
//     sortBy = "createdAt",
//     sortOrder = "desc",
//   } = req.query;

//   // Build query object
//   const query = {};

//   // Filter by category if provided
//   if (category) {
//     query.category = category;
//   }

//   // Filter by rating range if provided
//   if (minRating || maxRating) {
//     query.rating = {};
//     if (minRating) query.rating.$gte = Number(minRating);
//     if (maxRating) query.rating.$lte = Number(maxRating);
//   }

//   // Calculate pagination
//   const skip = (Number(page) - 1) * Number(limit);

//   // Execute query
//   const feedback = await Feedback.find(query)
//     .populate("user", "fullName email") // Populate user details
//     .populate("relatedMovie", "title") // Populate movie title if exists
//     .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
//     .skip(skip)
//     .limit(Number(limit));

//   // Get total count for pagination
//   const totalFeedback = await Feedback.countDocuments(query);

//   // Prepare response data
//   const responseData = {
//     feedback,
//     pagination: {
//       currentPage: Number(page),
//       totalPages: Math.ceil(totalFeedback / limit),
//       totalItems: totalFeedback,
//       itemsPerPage: Number(limit),
//     },
//   };

//   console.log("All feedback fetched:", {
//     count: feedback.length,
//     total: totalFeedback,
//     page: Number(page),
//   }); // Debug log

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         responseData,
//         feedback.length
//           ? "All feedback fetched successfully"
//           : "No feedback found"
//       )
//     );
// });

// export { submitFeedback, getFeedbackByMovie, getAllFeedback };
import { Feedback } from "../models/feedback.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitFeedback = asyncHandler(async (req, res) => {
  const { bookingId, movieRating, bookingRating, message, relatedMovie } =
    req.body;
  const userId = req.user?._id; // Safe access to user ID

  // Validation
  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not authenticated");
  }

  // Determine categories based on input
  const categories = [];
  if (relatedMovie) categories.push("movie");
  if (bookingId) categories.push("booking");
  if (categories.length === 0) {
    throw new ApiError(400, "Must provide feedback for movie or booking");
  }

  // Validate ratings based on categories
  if (
    categories.includes("movie") &&
    (!movieRating || movieRating < 1 || movieRating > 5)
  ) {
    throw new ApiError(400, "Movie rating must be between 1 and 5");
  }
  if (
    categories.includes("booking") &&
    (!bookingRating || bookingRating < 1 || bookingRating > 5)
  ) {
    throw new ApiError(400, "Booking rating must be between 1 and 5");
  }

  const feedbackData = {
    user: userId,
    message: message || "No detailed feedback provided",
    movieRating: movieRating || null,
    bookingRating: bookingRating || null,
    category: categories,
    relatedMovie: relatedMovie || null,
    booking: bookingId || null,
  };

  const feedback = new Feedback(feedbackData);
  await feedback.save();

  console.log("Feedback saved:", feedback); // Debug log
  return res
    .status(201)
    .json(new ApiResponse(201, feedback, "Feedback submitted successfully"));
});

const getFeedbackByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  if (!movieId) {
    throw new ApiError(400, "Movie ID is required");
  }

  const feedback = await Feedback.find({ relatedMovie: movieId })
    .populate("user", "fullName")
    .populate("booking", "bookingId") // Populate booking if needed
    .sort({ createdAt: -1 });

  console.log("Feedback fetched for movie:", movieId, feedback); // Debug log
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        feedback || [],
        feedback?.length ? "Feedback fetched successfully" : "No feedback found"
      )
    );
});

const getAllFeedback = asyncHandler(async (req, res) => {
  const {
    category,
    minRating,
    maxRating,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build query object
  const query = {};

  // Filter by category if provided (supports multiple categories)
  if (category) {
    query.category = { $in: [category] }; // Match any feedback with this category
  }

  // Filter by movieRating or bookingRating range if provided
  if (minRating || maxRating) {
    query.$or = [
      minRating ? { movieRating: { $gte: Number(minRating) } } : {},
      minRating ? { bookingRating: { $gte: Number(minRating) } } : {},
    ];
    if (maxRating) {
      query.$or[0].movieRating = {
        ...query.$or[0].movieRating,
        $lte: Number(maxRating),
      };
      query.$or[1].bookingRating = {
        ...query.$or[1].bookingRating,
        $lte: Number(maxRating),
      };
    }
  }

  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Execute query
  const feedback = await Feedback.find(query)
    .populate("user", "fullName email")
    .populate("relatedMovie", "title")
    .populate("booking", "bookingId") // Populate booking details if applicable
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(Number(limit));

  // Get total count for pagination
  const totalFeedback = await Feedback.countDocuments(query);

  // Prepare response data
  const responseData = {
    feedback,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalFeedback / limit),
      totalItems: totalFeedback,
      itemsPerPage: Number(limit),
    },
  };

  console.log("All feedback fetched:", {
    count: feedback.length,
    total: totalFeedback,
    page: Number(page),
  }); // Debug log

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responseData,
        feedback.length
          ? "All feedback fetched successfully"
          : "No feedback found"
      )
    );
});

export { submitFeedback, getFeedbackByMovie, getAllFeedback };
