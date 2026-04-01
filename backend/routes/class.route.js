import express from "express";
import { createClass, deleteClass, getClassById, getLectureClasses, getLecturerAttendance, getLecturerStudents, getStudentClasses, joinClass, updateClass } from "../controllers/class.controller.js";
import { protectRoute, verifyLecturer } from "../middleware/protectRoute.js";


const router = express.Router();


router.post("/create", protectRoute, verifyLecturer, createClass);
router.get("/lecturer", protectRoute, verifyLecturer, getLectureClasses);
router.get("/student", protectRoute, getStudentClasses);
router.get("/student/:id", protectRoute, getClassById);
router.post("/join", protectRoute, joinClass);
router.delete("/:id", protectRoute, verifyLecturer, deleteClass);
router.put("/:id", protectRoute, verifyLecturer, updateClass);
router.get("/students", protectRoute, verifyLecturer, getLecturerStudents);
router.get("/attendance", protectRoute, verifyLecturer, getLecturerAttendance);


export default router;