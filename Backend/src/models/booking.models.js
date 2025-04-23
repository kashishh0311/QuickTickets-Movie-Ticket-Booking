// import mongoose, { Schema } from "mongoose";

// const bookingSchema = new Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true, // Index for frequent user-based queries
//     },

//     show: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ShowTime",
//       required: true,
//       index: true, // Index for show-based queries
//     },

//     movie: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Movie",
//       required: true, // Optional, if shows are tied to movies
//     },

//     seats: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Seat",
//         required: true,
//       },
//     ], // Now references Seat model instead of embedding

//     totalPrice: {
//       type: Number,
//       required: true,
//       validate: {
//         validator: async function (value) {
//           const seats = await mongoose
//             .model("Seat")
//             .find({ _id: { $in: this.seats } });
//           const calculatedPrice = seats.reduce(
//             (sum, seat) => sum + seat.price,
//             0
//           );
//           return value === calculatedPrice;
//         },
//         message: "totalPrice must match the sum of seat prices",
//       },
//     },

//     payment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Payment",
//       required: false, // Optional until confirmed
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["pending", "paid", "failed"],
//       default: "pending",
//     },
//     bookingStatus: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled"],
//       default: "pending",
//     },

//     bookingDate: {
//       type: Date,
//       default: Date.now,
//     },

//     expiresAt: {
//       type: Date,
//       index: { expireAfterSeconds: 0 }, // TTL index for auto-deletion
//     },

//     transactionId: {
//       type: String,
//       required: false, // For external payment reference
//     },
//   },
//   { timestamps: true }
// );

// // Pre-save hook to set expiresAt for pending bookings (e.g., 15 minutes)
// bookingSchema.pre("save", function (next) {
//   if (this.bookingStatus === "pending" && !this.expiresAt) {
//     this.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
//   }
//   next();
// });

// // bookingSchema.index({ show: 1, seats: 1 });

// export const Booking = mongoose.model("Booking", bookingSchema);
import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for frequent user-based queries
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
      index: true, // Index for show-based queries
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true, // Optional, if shows are tied to movies
    },

    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true,
      },
    ], // Now references Seat model instead of embedding

    totalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: async function (value) {
          const seats = await mongoose
            .model("Seat")
            .find({ _id: { $in: this.seats } });
          const calculatedPrice = seats.reduce(
            (sum, seat) => sum + seat.price,
            0
          );
          return value === calculatedPrice;
        },
        message: "totalPrice must match the sum of seat prices",
      },
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: false, // Optional until confirmed
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired"],
      default: "pending",
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 }, // TTL index for auto-deletion
    },

    transactionId: {
      type: String,
      required: false, // For external payment reference
    },

    // New fields for cancellation
    cancelledAt: {
      type: Date,
      required: false,
    },

    cancellationReason: {
      type: String,
      required: false,
    },

    refundAmount: {
      type: Number,
      required: false,
    },

    refundStatus: {
      type: String,
      enum: ["not_applicable", "processing", "completed", "failed"],
      required: false,
    },

    refundTransactionId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook to set expiresAt for pending bookings (e.g., 15 minutes)
bookingSchema.pre("save", function (next) {
  if (this.bookingStatus === "pending" && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }
  next();
});

// bookingSchema.index({ show: 1, seats: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
