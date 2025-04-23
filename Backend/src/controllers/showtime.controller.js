import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ShowTime } from "../models/showtime.models.js";
import { Movie } from "../models/movie.models.js";

//Create showtime
const createShowTime = asyncHandler(async (req, res) => {
  const { movieId, showDate, showTime } = req.body;

  // Validate required fields
  if (!movieId || !showDate || !showTime) {
    throw new ApiError(400, "Movie ID, show date, and show time are required");
  }

  // Find movie by ID
  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const show = await ShowTime.create({
    movie: movie._id,
    showDate: new Date(showDate),
    showTime,
  });

  return res
    .status(201) // 201 is more appropriate for creation
    .json(new ApiResponse(201, show, "Showtime created successfully"));
});

// update showtime
const updateShowTime = asyncHandler(async (req, res) => {
  try {
    const { showId, showDate, showTime } = req.body;
    // const show = await show.findById(showId);
    const show = await ShowTime.findById(showId);

    if (!show) {
      return res.status(404).json(new ApiResponse(404, "Show not found"));
    }

    if (showDate) show.showDate = showDate;
    if (showTime) show.showTime = showTime;

    await show.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Show updated successfully", show));
  } catch (error) {
    console.log("Failed to update showtime", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while creating showtime"
    );
  }
});

// Delete showtime
const deleteShowTime = asyncHandler(async (req, res) => {
  try {
    const removedShowTime = await ShowTime.findByIdAndDelete(req.body?._id);
    // console.log(req.body._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, removedShowTime, "showtime deleted successfully")
      );
  } catch (error) {
    console.log("Failed to delete showtime", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while deleting showtime"
    );
  }
});

const getAllShowTime = asyncHandler(async (req, res) => {
  const { movieId } = req.query;
  const query = movieId ? { movie: movieId } : {};
  const showtimes = await ShowTime.find(query).populate("movie", "title");
  return res
    .status(200)
    .json(new ApiResponse(200, showtimes, "showtimes fetched successfully"));
});

const getShowTime = asyncHandler(async (req, res) => {
  try {
    const showtime = await ShowTime.findById(req.body?.id);
    return res
      .status(200)
      .json(new ApiResponse(200, showtime, "showtime fetched successfully"));
  } catch (error) {
    console.log("Failed to get showtime", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while getting showtime"
    );
  }
});

export {
  createShowTime,
  updateShowTime,
  deleteShowTime,
  getAllShowTime,
  getShowTime,
};
