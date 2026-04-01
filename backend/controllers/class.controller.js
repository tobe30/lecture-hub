import Class from "../models/Class.js";
import Session from "../models/Session.js";

import mongoose from "mongoose";

export const createClass = async (req, res) => {
  try {
    const { title, courseCode, description, schedule, capacity } = req.body;

    if (!title || !courseCode || !description || !schedule || !capacity) {
      return res.status(400).json({
        message: "Title, course code, description, schedule and capacity are required",
      });
    }

    if (capacity < 1) {
      return res.status(400).json({
        message: "Capacity must be at least 1",
      });
    }

    // generate class join code
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newClass = await Class.create({
      title,
      courseCode,
      description,
      schedule,
      capacity,
      lecturer: req.user._id, // from auth middleware
      classCode,
    });

    return res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });

  } catch (error) {
    console.error("Error in createClass controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// Get all classes for a lecturer  ----todo
export const getLectureClasses = async (req, res) => {
  try {
    const classes = await Class.find({ lecturer: req.user._id }).sort({
      createdAt: -1,
    });

    const classIds = classes.map((cls) => cls._id);

    const sessions = await Session.find({
      class: { $in: classIds },
    }).select("class");

    const sessionCountMap = {};

    sessions.forEach((session) => {
      const classId = session.class.toString();
      sessionCountMap[classId] = (sessionCountMap[classId] || 0) + 1;
    });

    const classesWithSessionCount = classes.map((cls) => ({
      ...cls.toObject(),
      sessionCount: sessionCountMap[cls._id.toString()] || 0,
    }));

    return res.status(200).json({
      message: "Classes fetched successfully",
      classes: classesWithSessionCount,
    });
  } catch (error) {
    console.error("Error in getLectureClasses controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getStudentClasses = async (req, res) => {
  try {
    const classes = await Class.find({students: req.user._id,})
    .populate("lecturer", "name email")
    .sort({ createdAt: -1 });
    return res.status(200).json({ message: "Student Classes fetched successfully", classes });
  } catch (error) {
    console.error("Error in getStudentClasses controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const classData = await Class.findById(id).populate("lecturer", "name email");

    if(!classData){
      return res.status(404).json({message: "class not found"});
    }

      // ✅ Check if user is lecturer
    const isLecturer =
      classData.lecturer._id.toString() === userId.toString();

    // ✅ Check if user is student in class
    const isStudent = classData.students.some(
      (student) => student._id.toString() === userId.toString()
    );

    if (!isLecturer && !isStudent) {
      return res.status(403).json({
        message: "You are not allowed to access this class",
      });
    }
    res.status(200).json({classData});

  } catch (error) {
    console.error("Error in getClassById controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const joinClass = async (req, res) => {
  try {
    const { classCode} = req.body;

    if(!classCode){
      return res.status(400).json({message: "Class code and name are required"});
    }

    const classData = await Class.findOne({classCode: classCode.toUpperCase(), isActive: true});

    if(!classData){
      return res.status(404).json({message: "Class not found"});
    }

    if (classData.lecturer.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "Lecturer cannot join their own class as student",
      });
    }

     const alreadyJoined = classData.students.some(
      (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        message: "You have already joined this class",
      });
    }

    if (
      classData.capacity > 0 &&
      classData.students.length >= classData.capacity
    ) {
      return res.status(400).json({
        message: "Class is full",
      });
    }

    classData.students.push(req.user._id);
    await classData.save();

    const populatedClass = await Class.findById(classData._id)
      .populate("lecturer", "name email")
      .populate("students", "name email");

    return res.status(200).json({
      message: "Class joined successfully",
      class: populatedClass,
    });

  } catch (error) {
    console.error("Error in joinClass controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

//delete class
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const classData = await Class.findById(id);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classData.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to delete this class" });
    }

    await Class.findByIdAndDelete(id);

    return res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.log("Error in deleteClass controller", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, courseCode, description, schedule, capacity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class id" });
    }

    const classData = await Class.findById(id);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classData.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to edit this class" });
    }

    classData.title = title ?? classData.title;
    classData.courseCode = courseCode?.toUpperCase() ?? classData.courseCode;
    classData.description = description ?? classData.description;
    classData.schedule = schedule ?? classData.schedule;
    classData.capacity = capacity ?? classData.capacity;

    await classData.save();

    return res.status(200).json({
      message: "Class updated successfully",
      class: classData,
    });
  } catch (error) {
    console.log("Error in updateClass controller", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

//TODO
export const getLecturerStudents = async (req, res) => {
  try {
    const classes = await Class.find({ lecturer: req.user._id })
      .select("title courseCode students")
      .populate("students", "name email");

    const classIds = classes.map((cls) => cls._id);

    const sessions = await Session.find({
      class: { $in: classIds },
    }).select("class attendees");

    const totalSessions = sessions.length;

    const studentsMap = new Map();

    classes.forEach((cls) => {
      cls.students.forEach((student) => {
        const studentId = student._id.toString();

        if (!studentsMap.has(studentId)) {
          studentsMap.set(studentId, {
            _id: student._id,
            name: student.name,
            email: student.email,
            classes: [],
            attendedCount: 0,
            attendance: 0,
            status: "Active",
          });
        }

        studentsMap.get(studentId).classes.push(
          cls.courseCode || cls.title || "Class"
        );
      });
    });

    sessions.forEach((session) => {
      const uniqueAttendees = new Set();

      (session.attendees || []).forEach((attendee) => {
        const attendeeId =
          attendee?.student?.toString?.() ||
          attendee?.user?.toString?.() ||
          attendee?._id?.toString?.() ||
          attendee?.toString?.();

        if (attendeeId) {
          uniqueAttendees.add(attendeeId);
        }
      });

      uniqueAttendees.forEach((attendeeId) => {
        if (studentsMap.has(attendeeId)) {
          studentsMap.get(attendeeId).attendedCount += 1;
        }
      });
    });

    const students = Array.from(studentsMap.values()).map((student) => ({
      ...student,
      attendance: Math.min(
        100,
        totalSessions > 0
          ? Math.round((student.attendedCount / totalSessions) * 100)
          : 0
      ),
    }));

    return res.status(200).json({ students, totalSessions });
  } catch (error) {
    console.log("Error in getLecturerStudents:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Get attendance for lecturer's classes ----TODO-----
export const getLecturerAttendance = async (req, res) => {
  try {
    const classes = await Class.find({ lecturer: req.user._id })
      .select("title courseCode students");

    const classMap = new Map();

    classes.forEach((cls) => {
      classMap.set(cls._id.toString(), {
        title: cls.title,
        courseCode: cls.courseCode,
        totalStudents: cls.students.length,
      });
    });

    const classIds = classes.map((cls) => cls._id);

    const sessions = await Session.find({
      class: { $in: classIds },
    })
      .select("class title startTime attendees status createdAt")
      .sort({ createdAt: -1 });

    const attendanceData = sessions.map((session) => {
      const classInfo = classMap.get(session.class.toString());

      const uniqueAttendees = new Set();

      (session.attendees || []).forEach((attendee) => {
        const attendeeId =
          attendee?.student?.toString?.() ||
          attendee?.user?.toString?.() ||
          attendee?._id?.toString?.() ||
          attendee?.toString?.();

        if (attendeeId) {
          uniqueAttendees.add(attendeeId);
        }
      });

      const present = uniqueAttendees.size;
      const total = classInfo?.totalStudents || 0;
      const absent = Math.max(total - present, 0);
      const rate = total > 0 ? Math.round((present / total) * 100) : 0;

      return {
        _id: session._id,
        classTitle: classInfo?.title || session.title || "Class Session",
        code: classInfo?.courseCode || "N/A",
        date: session.startTime,
        time: session.startTime,
        total,
        present,
        absent,
        rate,
        status: session.status,
      };
    });

    return res.status(200).json({
      sessions: attendanceData,
    });
  } catch (error) {
    console.log("Error in getLecturerAttendance:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};