import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: ["credit_card", "debit_card", "upi", "wallet"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    transactionId: {
      type: String,
      unique: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure totalAmount matches the booking price
paymentSchema.pre("save", async function (next) {
  const booking = await mongoose.model("Booking").findById(this.booking);
  if (booking && this.totalAmount !== booking.totalPrice) {
    return next(new Error("Total amount does not match booking price"));
  }
  next();
});

// Ensure completed payments have a transaction ID
paymentSchema.pre("validate", function (next) {
  if (this.status === "completed" && !this.transactionId) {
    return next(new Error("Transaction ID is required for completed payments"));
  }
  next();
});

export const Payment = mongoose.model("Payment", paymentSchema);
