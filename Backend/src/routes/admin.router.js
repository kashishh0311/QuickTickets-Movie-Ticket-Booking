import { Router } from "express";
import {
  getAllUsers,
  removeUser,
  getUserByEmail,
} from "../controllers/user.controller.js";
import {
  addMovie,
  deleteMovie,
  updateMovieDetails,
  getAllMovies,
} from "../controllers/movie.controller.js";
import {
  createShowTime,
  updateShowTime,
  deleteShowTime,
  getAllShowTime,
} from "../controllers/showtime.controller.js";
import {
  createSeat,
  updateSeatStatus,
  deleteSeat,
  getAllSeats,
  getAvailableSeats,
  // create,
} from "../controllers/seat.controller.js";
import { getAdminAllBookings } from "../controllers/booking.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyAdminJWT } from "../middlewares/auth.middlewares.js";
import {
  // loginAdmin,
  // adminLogout,
  // fetchAdmin,
  // loginAdmin,
  // adminLogout,
  // fetchAdmin,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { getAllFeedback } from "../controllers/feedbacke.controlller.js";
import {
  loginAdmin,
  adminLogout,
  fetchAdmin,
} from "../controllers/admin.controller.js";
import { getRevenueReport } from "../controllers/report.js";

const router = Router();

// // admin
// router.route("/loginAdmin").post(verifyAdminJWT, loginAdmin);
// router.route("/adminLogout").post(verifyAdminJWT, adminLogout);
// router.route("/fetchAdmin").get(fetchAdmin);

router.route("/getDashboardStats").get(getDashboardStats);

router.route("/getRevenueReport").get(getRevenueReport);
// for movies
router.route("/getAllMovies").get(getAllMovies);

router.route("/addMovie").post(upload.single("poster"), addMovie);
router.route("/deleteMovie/:_id").delete(deleteMovie);
router.route("/updateMovie").put(upload.single("poster"), updateMovieDetails);

// for users
router.route("/getAllUsers").get(getAllUsers);
router.route("/removeUser/:_id").delete(removeUser);
router.route("/getUserByEmail").get(getUserByEmail);

// for shows
router.route("/createShowTime").post(createShowTime);
router.route("/updateShowTime").put(updateShowTime);
router.route("/deleteShowTime").delete(deleteShowTime);
router.route("/getAllShowTime").get(getAllShowTime);

// router.route("/getAllShowTime").get(getAllShowTime);
// router.route("/getShowTime").get(getShowTime);

// for seat
router.route("/createSeat").post(createSeat);
router.route("/updateSeatStatus").put(updateSeatStatus);
router.route("/deleteSeat").delete(deleteSeat);

router.route("/getAllSeats/:showId").get(getAllSeats);
router.route("/getAvailableSeats/:showId").get(getAvailableSeats);

//booking
router.route("/getAdminAllBookings").get(getAdminAllBookings);

//feedback
router.route("/getAllFeedback").get(getAllFeedback);

//Admin
router.route("/loginAdmin").post(loginAdmin);
router.route("/adminLogout").post(adminLogout);
router.route("/fetchAdmin").get(verifyAdminJWT, fetchAdmin);

export default router;
