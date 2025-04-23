import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.models.js";
import { Payment } from "../models/payment.models.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import { Seat } from "../models/seat.models.js"; // Adjust path to your Seat model

// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment (Initiate Stripe Checkout)
const createPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const userId = req.user._id; // From verifyJWT middleware

  // Validate bookingId
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid bookingId");
  }

  // Fetch the booking
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new ApiError(404, "Booking not found or you don’t own it");
  }

  if (booking.bookingStatus !== "pending") {
    throw new ApiError(400, "Booking is not in a pending state");
  }

  if (booking.expiresAt && booking.expiresAt < new Date()) {
    throw new ApiError(410, "Booking has expired");
  }

  // Check if payment already exists for this booking
  const existingPayment = await Payment.findOne({ booking: bookingId });
  if (existingPayment) {
    throw new ApiError(409, "Payment already initiated for this booking");
  }

  // Create a Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `Movie Ticket - Booking #${bookingId}`,
            description: `Show: ${booking.show} | Seats: ${booking.seats.length}`,
          },
          unit_amount: booking.totalPrice * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // success_url: `http://localhost:5174/booking-success?bookingId=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
    success_url: `http://localhost:5174/booking-success?bookingId=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:5174/booking/${bookingId}`,

    metadata: {
      bookingId: bookingId.toString(),
      userId: userId.toString(),
    },
  });

  // Create a payment record in the database
  const payment = await Payment.create({
    booking: bookingId,
    user: userId,
    totalAmount: booking.totalPrice,
    method: "credit_card", // Assuming card payment via Stripe
    status: "pending",
    transactionId: session.id, // Use Stripe session ID as transactionId initially
  });

  // Update booking with payment reference
  booking.payment = payment._id;
  await booking.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sessionId: session.id,
        paymentId: payment._id,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      },
      "Payment session created successfully. Redirect to Stripe Checkout."
    )
  );
});

const paymentSuccess = asyncHandler(async (req, res) => {
  const { session_id, bookingId } = req.body; // Changed from req.query to req.body

  if (!session_id || !bookingId) {
    throw new ApiError(400, "Session ID and Booking ID are required");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid") {
    throw new ApiError(400, "Payment not completed");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new ApiError(404, "Payment record not found");
  }

  payment.status = "completed";
  payment.transactionId = session.payment_intent;
  await payment.save();

  booking.paymentStatus = "paid";
  booking.bookingStatus = "confirmed";
  booking.expiresAt = undefined;
  await Seat.updateMany({ _id: { $in: booking.seats } }, { isBooked: true });
  await booking.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { booking, payment },
        "Payment successful. Booking confirmed."
      )
    );
});

// Get Payment Details (User-Side)
const getPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, "Invalid paymentId");
  }

  const payment = await Payment.findOne({ _id: paymentId, user: userId })
    .populate("booking", "show seats totalPrice bookingStatus")
    .populate("user", "name email");

  if (!payment) {
    throw new ApiError(404, "Payment not found or you don’t own it");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, payment, "Payment details fetched successfully")
    );
});

// Optional: Stripe Webhook Handler (for robust payment confirmation)
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // Set this in .env

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    throw new ApiError(400, `Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;

    const booking = await Booking.findById(bookingId);
    const payment = await Payment.findOne({ booking: bookingId });

    if (booking && payment) {
      payment.status = "completed";
      payment.transactionId = session.payment_intent;
      await payment.save();

      booking.paymentStatus = "paid";
      booking.bookingStatus = "confirmed";
      booking.expiresAt = undefined;
      await Seat.updateMany(
        { _id: { $in: booking.seats } },
        { isBooked: true }
      );
      await booking.save();
    }
  }

  res.status(200).json({ received: true });
});

export { createPayment, paymentSuccess, getPayment, stripeWebhook };
