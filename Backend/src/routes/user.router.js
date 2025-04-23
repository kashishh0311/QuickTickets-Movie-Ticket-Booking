import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getuserDetails,
  updateAccountDetails,
  refreshAccessToken,
  deleteUserAccount,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  getAllSeats,
  getAvailableSeats,
} from "../controllers/seat.controller.js";
import {
  getAllShowTime,
  getShowTime,
} from "../controllers/showtime.controller.js";
import {
  createBooking,
  getAllBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  confirmBooking,
  cancelBooking,
} from "../controllers/booking.controller.js";
import {
  getAllMovies,
  getMoviebyTitle,
  getMovie,
} from "../controllers/movie.controller.js";
import {
  paymentSuccess,
  createPayment,
  getPayment,
  stripeWebhook,
} from "../controllers/payment.controller.js";
import {
  submitFeedback,
  getFeedbackByMovie,
  getAllFeedback,
} from "../controllers/feedbacke.controlller.js";

const router = Router();

router.route("/register").post(upload.single("profileImage"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/getuser").get(verifyJWT, getuserDetails);
router
  .route("/update")
  .put(verifyJWT, upload.single("profileImage"), updateAccountDetails);
router.route("/refresh").post(refreshAccessToken);
router.route("/delete").delete(verifyJWT, deleteUserAccount);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);

//movie
router.route("/getAllMovies").get(getAllMovies);
router.route("/getMoviebyTitle").get(getMoviebyTitle);
router.route("/getMovie/:id").get(getMovie);

//seat
router.route("/getAllSeats/:showId").get(getAllSeats);
// router.route("/getAvailableSeats").get(getAvailableSeats);

//shows
router.route("/getAllShowTime").get(getAllShowTime);
router.route("/getShowTime").get(getShowTime);

//booking
router.route("/createBooking").post(verifyJWT, createBooking);
router.route("/getAllBooking").get(verifyJWT, getAllBooking);

router.route("/getBooking/:bookingId").get(verifyJWT, getBooking); // GET /bookings/:bookingId - Get a specific booking (Confirmation Page)
router.route("/updateBooking/:bookingId").put(verifyJWT, updateBooking); // PUT /bookings/:bookingId - Update a booking
router.route("/deleteBooking/:bookingId").delete(verifyJWT, deleteBooking); // DELETE /bookings/:bookingId - Delete a booking
router.route("/:bookingId/cancel").post(verifyJWT, cancelBooking);

router
  .route("/confirmBooking/:bookingId/confirm")
  .post(verifyJWT, confirmBooking);

//payment
router.route("/createPayment").post(verifyJWT, createPayment);
router.route("/getPayment/:paymentId").get(verifyJWT, getPayment);
router.route("/paymentSuccess").post(verifyJWT, paymentSuccess);
router.route("/stripeWebhook").post(stripeWebhook);

// feedback
router.route("/submit").post(verifyJWT, submitFeedback);

router.route("/getFeedback/:movieId").get(getFeedbackByMovie);
router.route("/feedback").get(getAllFeedback); // Add this route
export default router;
