import express from "express"
import { createSession, endSession, getActiveSessionByClass, getActiveSessions, getMyRecentSession, getSessionById, getStudentSessions, joinSession } from "../controllers/session.controller.js";
import { protectRoute, verifyLecturer } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, verifyLecturer, createSession);
router.get("/my-recent", protectRoute, verifyLecturer, getMyRecentSession);
router.get("/student", protectRoute, getStudentSessions);
router.get("/active", protectRoute, getActiveSessions);
router.get("/class/:id", protectRoute, getActiveSessionByClass);
router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession)


export default router