import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendemail.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // small check for user existence
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "somthing went wrong");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  //validation
  if (
    [fullName, email, phone, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check user
  const existedUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existedUser) {
    throw new ApiError(401, "User Already Exist");
  }

  console.log("Uploaded File:", req.files); // Check if file is received
  console.log("Profile Image Path:", req.files?.profileImage?.[0]?.path);

  let profileImage;

  // const profileImageLocalPath = req.files?.profileImage?.[0]?.path;
  const profileImageLocalPath = req.file?.path;
  console.log(profileImageLocalPath);

  if (profileImageLocalPath) {
    try {
      profileImage = await uploadOnCloudinary(profileImageLocalPath);
    } catch (uploadError) {
      console.log("Cloudinary upload error:", uploadError);
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  //create user
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password,
    phone,
    profileImage: profileImage?.url || "",
  });

  // Retrieve created user without sensitive information

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    // if user creation fails ,delete uploaded image
    if (profileImage?.public_id) {
      await deleteFromCloudinary(profileImage.public_id);
    }
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "User Created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Email:", email);
  console.log("Password:", password);

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // valdate password
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Failed to login user");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthoried request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired ");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Inavlid refresh token");
  }
});

const getuserDetails = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fatched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, phone } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "Full name and email are required");
  }

  // Handle profile image upload if provided
  let profileImage;
  const profileImageLocalPath = req.file?.path; // Single file upload via multer
  if (profileImageLocalPath) {
    try {
      profileImage = await uploadOnCloudinary(profileImageLocalPath);
    } catch (uploadError) {
      console.log("Cloudinary upload error:", uploadError);
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  // Fetch current user to preserve existing image if not updated
  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
        phone,
        profileImage: profileImage?.url || currentUser.profileImage, // Keep old image if no new upload
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    if (profileImage?.public_id) {
      await deleteFromCloudinary(profileImage.public_id); // Cleanup on failure
    }
    throw new ApiError(500, "Failed to update account details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  try {
    await User.findOneAndDelete(req.user?._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "User deleted successfully"));
  } catch (error) {
    console.log("Error deleting user:", error);
    throw new ApiError(500, "Failed to delete user");
  }
});

// get all users by admin
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json(new ApiResponse(200, users, "users fetched successfully"));
  } catch (error) {
    console.log("Failed to get users", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while getting users"
    );
  }
});

// delete user || remove user by admin
const removeUser = asyncHandler(async (req, res) => {
  try {
    const removedUser = await User.findByIdAndDelete(req.params?._id);
    return res
      .status(200)
      .json(new ApiResponse(200, removedUser, "user deleted successfully"));
  } catch (error) {
    console.log("Failed to delete user", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while deleting user"
    );
  }
});

//get user by email by admin
const getUserByEmail = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body?.email });
    return res
      .status(200)
      .json(new ApiResponse(200, user, "user fetched successfully"));
  } catch (error) {
    console.log("Failed to get user", error);
    throw new ApiError(
      500,
      error?.message || "something went wrong while getting user"
    );
  }
});

// not used
const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Validate input
  if (!email || !oldPassword || !newPassword) {
    throw new ApiError(
      400,
      "Email, old password, and new password are required"
    );
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  // Verify old password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  // Update password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // Send response
  return res
    .status(200)
    .json(new ApiResponce(200, null, "Password changed successfully")); // Fixed typo: ApiResponce -> ApiResponse
});

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   // Validate email
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!email || !emailRegex.test(email)) {
//     throw new ApiError(400, "A valid email is required");
//   }

//   // Find user
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           null,
//           "If the email exists, a reset link has been sent"
//         )
//       );
//   }

//   // Generate and hash reset token
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   user.resetPasswordToken = hashedToken;
//   user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
//   await user.save({ validateBeforeSave: false });

//   // Send email
//   const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//   const message = `You (or someone else) requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 10 minutes.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Password Reset Request",
//       message,
//     });
//     return res
//       .status(200)
//       .json(new ApiResponse(200, null, "Email sent successfully"));
//   } catch (error) {
//     // Rollback on failure
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     console.log("Error sending email:", error);
//     throw new ApiError(500, "Failed to send email");
//   }
// });
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    throw new ApiError(400, "A valid email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If the email exists, a reset link has been sent"
        )
      );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `You (or someone else) requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Email sent successfully"));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    console.log("Error sending email:", error);
    throw new ApiError(500, "Failed to send email");
  }
});

// In controllers/authController.js
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params; // Token from URL
  const { password } = req.body; // New password from form

  // Validate input
  if (!password) {
    throw new ApiError(400, "New password is required");
  }

  // Hash the token to match the stored version
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user by token and check expiration
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }, // Ensure token hasn't expired
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // Update password (assuming you're using bcrypt for hashing)
  user.password = password;
  user.resetPasswordToken = undefined; // Clear token
  user.resetPasswordExpire = undefined; // Clear expiration
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getuserDetails,
  updateAccountDetails,
  deleteUserAccount,
  getAllUsers,
  removeUser,
  getUserByEmail,
  changePassword,
  forgotPassword,
  resetPassword,
};
