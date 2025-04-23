import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || // Check Authorization header first
      req.body?.accessToken ||
      req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyJWT };

// export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
//   try {
//     const token = req.body?.accessToken || req.cookies?.accessToken;

//     if (!token) {
//       throw new ApiError(401, "Unauthorized: No token provided");
//     }

//     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     // Check if the token belongs to the admin
//     if (decodeToken.id !== "admin_unique_id") {
//       throw new ApiError(403, "Forbidden: Admin access required");
//     }

//     req.admin = {
//       _id: "admin_unique_id",
//       email: process.env.ADMIN_EMAIL,
//     };

//     next();
//   } catch (error) {
//     throw new ApiError(401, "Invalid or expired admin access token");
//   }
// });
// export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
//   try {
//     const token = req.body?.accessToken || req.cookies?.accessToken;

//     if (!token) {
//       throw new ApiError(401, "Unauthorized: No token provided");
//     }

//     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     // Check if the token belongs to the admin
//     if (decodeToken.id !== "admin_unique_id") {
//       throw new ApiError(403, "Forbidden: Admin access required");
//     }

//     req.admin = {
//       _id: "admin_unique_id",
//       email: process.env.ADMIN_EMAIL,
//     };

//     next();
//   } catch (error) {
//     throw new ApiError(401, "Invalid or expired admin access token");
//   }
// });

export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.body?.accessToken || req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if the token belongs to the admin
    if (decodeToken.id !== "admin_unique_id") {
      throw new ApiError(403, "Forbidden: Admin access required");
    }

    req.admin = {
      _id: "admin_unique_id",
      email: process.env.ADMIN_EMAIL,
    };

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired admin access token");
  }
});
