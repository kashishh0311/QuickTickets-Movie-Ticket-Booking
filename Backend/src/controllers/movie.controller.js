import { Movie } from "../models/movie.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadCloudinary.js";

// add movie by admin
const addMovie = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    duration,
    genre,
    category,
    language,
    releaseDate,
    // poster,
    trailer,
    cast,
    crew,
  } = req.body;

  // Validate required fields
  if (
    [
      title,
      description,
      duration,
      genre,
      category,
      language,
      releaseDate,
      // poster,
      trailer,
      cast,
      crew,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if movie already exists
  const existedMovie = await Movie.findOne({ title });
  if (existedMovie) {
    throw new ApiError(400, "Movie already exists");
  }

  console.log("Uploaded File:", req.files); // Check if file is received
  console.log("Poster Image Path:", req.files?.poster?.[0]?.path);

  let poster;

  const posterImageLocalPath = req.file?.path; // Get the local path of the uploaded poster ImageLocalPath
  // const posterImageLocalPath = req.files?.poster?.[0]?.path;

  console.log(posterImageLocalPath);

  if (posterImageLocalPath) {
    try {
      poster = await uploadOnCloudinary(posterImageLocalPath);
    } catch (uploadError) {
      console.log("Error clouidinary uploading poster:", error);
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  // create movie
  const movie = await Movie.create({
    title,
    description,
    duration,
    genre,
    category,
    language,
    releaseDate,
    poster: poster?.url,
    trailer,
    cast: JSON.parse(req.body.cast),
    crew: JSON.parse(req.body.crew),
  });

  const addedMovie = await Movie.findById(movie._id);

  if (!addedMovie) {
    // if user creation fails ,delete uploaded image
    if (poster?.public_id) {
      await deleteFromCloudinary(poster.public_id);
    }
    throw new ApiError(500, "Failed to add movie");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, addedMovie, "movie added successfully"));
});

// update movie by admin
const updateMovieDetails = asyncHandler(async (req, res) => {
  const { title, description, language, trailer, cast, crew } = req.body;

  let poster;

  const posterImageLocalPath = req.file?.path;

  console.log(posterImageLocalPath);

  if (posterImageLocalPath) {
    try {
      poster = await uploadOnCloudinary(posterImageLocalPath);
    } catch (uploadError) {
      console.log("Error clouidinary uploading poster:", error);
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.body?._id,
      {
        $set: {
          title,
          description,
          language,
          trailer,
          cast,
          crew,
          poster: poster?.url,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, updatedMovie, "movie updated successfully"));
  } catch (error) {
    console.log("Failed to update movie", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while updating movie"
    );
  }
});

// delete movie by admin
const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const removedMovie = await Movie.findByIdAndDelete(req.params._id);
    return res
      .status(200)
      .json(new ApiResponse(200, removedMovie, "movie deleted successfully"));
  } catch (error) {
    console.log("Failed to delete movie", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while deleting movie"
    );
  }
});

// Get all movies
const getAllMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.find();
    return res
      .status(200)
      .json(new ApiResponse(200, movies, "movies fetched successfully"));
  } catch (error) {
    console.log("Failed to get movies", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while getting movies"
    );
  }
});

const getMoviebyTitle = asyncHandler(async (req, res) => {
  try {
    const { title } = req.query; // Get title from query params (e.g., ?title=Avengers)
    if (!title) {
      throw new ApiError(400, "Title query parameter is required");
    }

    // Search movies with a case-insensitive partial match
    const movies = await Movie.find({
      title: { $regex: title, $options: "i" }, // 'i' for case-insensitive
    });

    return res
      .status(200)
      .json(new ApiResponse(200, movies, "Movies fetched successfully"));
  } catch (error) {
    console.log("Failed to get movie", error);
    throw new ApiError(
      500,
      error?.message || "Something went wrong while getting movies"
    );
  }
});
// get movie by id
const getMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Movie ID is required");
  }
  const movie = await Movie.findById(id);
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, movie, "Movie fetched successfully"));
});

export {
  addMovie,
  getMoviebyTitle,
  deleteMovie,
  updateMovieDetails,
  getAllMovies,
  getMovie,
};
