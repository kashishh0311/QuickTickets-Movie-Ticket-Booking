import mongoose, { Schema } from "mongoose";

const seatTypePrices = {
  Regular: 190,
  Royal: 250,
  VIP: 300,
};
const seatSchema = new Schema(
  {
    show: {
      type: Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    seatType: {
      type: String,
      required: true,
      enum: Object.keys(seatTypePrices),
      default: "Regular",
    },
    seatNumber: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

seatSchema.virtual("price").get(function () {
  return seatTypePrices[this.seatType] || 0; // Return price based on seatType, default to 0 if not found
});

seatSchema.set("toJSON", { virtuals: true });
seatSchema.set("toObject", { virtuals: true });
// Ensure seat numbers are unique per show
seatSchema.index({ show: 1, seatNumber: 1 });
// , { unique: true });

export const Seat = mongoose.model("Seat", seatSchema);
