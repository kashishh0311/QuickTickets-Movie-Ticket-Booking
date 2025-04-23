import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1024kb" }));
app.use(express.urlencoded({ extended: true, limit: "1024kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "../src/routes/user.router.js";
app.use("/api/v1/user", userRouter);
import adminRouter from "../src/routes/admin.router.js";
app.use("/api/v1/admin", adminRouter);
import showTime from "../src/routes/showtime.router.js";
app.use("/api/v1/showTime", showTime);
import seatRouter from "../src/routes/seat.router.js";
app.use("/api/v1/seat", seatRouter);

export { app };
