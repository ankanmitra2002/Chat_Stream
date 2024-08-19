import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
  resetPassword,
  resetPasswordRequest,
  verifyOTP,
  resendOTP,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.post("/resetPasswordRequest", resetPasswordRequest);
router.post("/resetPassword", resetPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTP);
router.put("/update/:userId", protect, updateUserProfile);

export default router;
