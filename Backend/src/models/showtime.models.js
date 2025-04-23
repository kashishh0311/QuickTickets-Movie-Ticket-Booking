import mongoose, { Schema } from "mongoose";
const showSchema = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    showDate: {
      type: Date,
      required: true,
    },

    showTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // Validates HH:mm format
    },
  },
  { timestamps: true }
);

export const ShowTime = mongoose.model("ShowTime", showSchema);
