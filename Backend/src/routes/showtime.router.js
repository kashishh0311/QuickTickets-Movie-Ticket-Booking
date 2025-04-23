import { Router } from "express";
import {
  getAllShowTime,
  getShowTime,
} from "../controllers/showtime.controller.js";

const router = Router();

router.route("/getAllShowTime").get(getAllShowTime);
router.route("/getShowTime").get(getShowTime);

export default router;
