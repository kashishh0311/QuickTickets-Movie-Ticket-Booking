import { Router } from "express";
import {
  getAllSeats,
  getAvailableSeats,
} from "../controllers/seat.controller.js";

const router = Router();

router.route("/getAllSeats/:showId").get(getAllSeats);
router.route("/getAvailableSeats").get(getAvailableSeats);

export default router;
