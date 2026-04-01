import express from "express";
import { Login, logout, Register } from "../controllers/auth.controller.js";
import { protectRoute, verifyLecturer } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/register", Register)
router.post("/login", Login)
router.post("/logout", logout)

// Route to get currently logged-in user
router.get("/me", protectRoute, (req, res)=>{
    res.status(200).json({ success: true, user: req.user});
})

// admin-only route example
router.get("/lecturer", protectRoute, verifyLecturer, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;