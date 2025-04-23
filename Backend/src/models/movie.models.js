import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      required: true,
    },

    duration: {
      type: Number,
      min: 1,
      required: true,
    }, // Duration in minutes

    genre: {
      type: String,
      enum: ["action", "comedy", "thriller", "horror", "sci-Fi"],
      required: true,
    }, // Reference to genres

    category: {
      type: String,
      enum: ["Hollywood", "Bollywood", "Gujrati", "Animation"],
      required: true,
    },

    language: {
      type: String,
      trim: true,
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    poster: {
      type: String,
      required: true,
      // match: /^(https?:\/\/.*\.(?:.png|.jpg|.jpeg))$/,
    }, // URL for the movie poster

    trailer: {
      type: String,
      required: true,
      // match: /^(https?:\/\/.*\.(?:.mp4|.mov|.avi|.mkv|.webm|.flv|.m3u8))$/,
    }, // URL for the trailer video

    cast: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        role: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    crew: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        role: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    rating: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ], // IMDb-style rating

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ], // Reviews for the movie
  },
  { timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
