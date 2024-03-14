import express from "express";
import {
  recoveryController,
  resetPasswordController,
} from "../controllers/recovery.controller.js";
import { verifyRecoveryToken } from "../utils/verifyRecoveryToken.js";
const router = express.Router();
router.post("/send_recovery_email", recoveryController);
router.put("/reset_password", verifyRecoveryToken, resetPasswordController);
export default router;
