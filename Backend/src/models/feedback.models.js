import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // User who submitted the feedback

    message: {
      type: String,
      required: true,
    }, // Feedback message

    rating: {
      type: Number,
      min: 1,
      max: 5,
    }, // General rating (optional unless specified)

    movieRating: {
      type: Number,
      min: 1,
      max: 5,
    }, // Specific rating for movie (optional)

    bookingRating: {
      type: Number,
      min: 1,
      max: 5,
    }, // Specific rating for booking (optional)

    category: {
      type: [String], // Changed to array to support multiple categories
      enum: ["movie", "booking", "service", "other"],
      default: ["other"],
    }, // Categories of feedback (can include multiple)

    relatedMovie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      default: null,
    }, // Optional movie reference

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking", // Assuming you have a Booking model
      default: null,
    }, // Optional booking reference
  },
  { timestamps: true }
);

// Validation: Require movieRating if category includes "movie" and relatedMovie is set
feedbackSchema.pre("validate", function (next) {
  if (
    this.category.includes("movie") &&
    this.relatedMovie &&
    !this.movieRating
  ) {
    return next(new Error("Movie rating is required for movie feedback"));
  }
  if (
    this.category.includes("booking") &&
    this.booking &&
    !this.bookingRating
  ) {
    return next(new Error("Booking rating is required for booking feedback"));
  }
  next();
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
