import { chatClient, streamClient } from "../lib/session.js";
import Class from "../models/Class.js";
import Session from "../models/Session.js";

export const createSession = async (req, res) => {
  try {
    const { classId, title, description, options } = req.body;

    // 1. Validate input
    if (!classId || !title) {
      return res.status(400).json({
        message: "Class and title are required",
      });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    if (classData.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to start a session for this class",
      });
    }

    const existingSession = await Session.findOne({
      class: classId,
      status: "active",
    });

    if (existingSession) {
      return res.status(400).json({
        message: "This class already has an active session",
      });
    }

    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // create Stream video call first
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: req.user._id.toString(),
        custom: {
          title,
        },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `Chat for ${title}`,
      members: [req.user._id.toString()],
      created_by_id: req.user._id.toString(),
    });

    await channel.create();

    // save to DB last
    const session = await Session.create({
      class: classId,
      lecturer: req.user._id,
      title,
      description,
      callId,
      status: "active",
      options: {
        chatEnabled: options?.chatEnabled ?? true,
        raiseHandEnabled: options?.raiseHandEnabled ?? true,
        attendanceEnabled: options?.attendanceEnabled ?? true,
        quizEnabled: options?.quizEnabled ?? false,
      },
    });

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller", error.message);
    res.status(500).json({ message: error.message || "Internal Server error" });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate({
        path: "class",
        select: "title courseCode students",
        populate: {
          path: "students",
          select: "name email role",
        },
      })
      .populate("lecturer", "name email role")
      .populate({
        path: "attendees.student",
        select: "name email role",
      });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const getMyRecentSession = async (req, res) => {
    try {
        const sessions = await Session.find({
            lecturer: req.user._id,
            status: "active",}).sort({createdAt: -1}).limit(5)

        res.status(200).json({sessions});   
    } catch (error) {
        console.log("Error in getMyRecentSessions controller", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

export const getActiveSessions = async (_, res)=> {
    try {
        const sessions = await Session.find({status: "active"})
        .populate("class", "title courseCode")
        .populate("lecturer", "name email")
        .sort({createdAt: -1})
        res.status(200).json({sessions});
    } catch (error) {
        console.log("Error in getActiveSessions controller", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

export const getActiveSessionByClass = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findOne({
      class: id,
      status: "active",
    }).populate("lecturer", "name");

    if (!session) {
      return res.status(200).json({
        session: null,
        message: "No active session",
      });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getActiveSessionByClass", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const joinSession = async (req, res) => {
  try {
    const { id } = req.params;

    let session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "active") {
      return res.status(400).json({ message: "Session is not active" });
    }

    const classData = await Class.findById(session.class);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const userId = req.user._id.toString();
    const isLecturer = session.lecturer.toString() === userId;
    const isStudentInClass = classData.students.some(
      (studentId) => studentId.toString() === userId
    );

    if (!isLecturer && !isStudentInClass) {
      return res.status(403).json({
        message: "You are not allowed to join this session",
      });
    }

    if (isLecturer) {
      return res.status(200).json({
        message: "Lecturer joined session successfully",
        session,
      });
    }

    const alreadyJoined = session.attendees.some(
      (attendee) => attendee.student.toString() === userId
    );

    if (alreadyJoined) {
      return res.status(200).json({
        message: "You already joined this session",
        session,
      });
    }

    if (classData.capacity > 0 && session.attendees.length >= classData.capacity) {
      return res.status(400).json({ message: "Class capacity exceeded" });
    }

    session = await Session.findById(id);

    const stillNotJoined = !session.attendees.some(
      (attendee) => attendee.student.toString() === userId
    );

    if (!stillNotJoined) {
      return res.status(200).json({
        message: "You already joined this session",
        session,
      });
    }

    session.attendees.push({
      student: req.user._id,
      joinedAt: new Date(),
    });

    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([userId]);

    return res.status(200).json({
      message: "Student joined session successfully",
      session,
    });
  } catch (error) {
    console.log("Error in joinSession controller", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const endSession = async (req, res) => {
    try {
        const {id} = req.params;

        const session = await Session.findById(id);

        if(!session)  return res.status(404).json({message: "Session not found"});

        if(session.lecturer.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "You are not allowed to end this session"});
        }

        //CHECK IF SESSION IS ALREADY completed
        if(session.status === "completed"){
            return res.status(400).json({message: "Session is already completed"});
        }

        //delete Stream video call
        const call =streamClient.video.call("default", session.callId);
        await call.delete({hard: true});

        //delete chat channel
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();

        session.status = "completed";
        await session.save();

        res.status(200).json({message: "Session ended successfully"});
    } catch (error) {
        console.log("Error in endSession controller", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

export const getStudentSessions = async (req, res) => {
  try {
    // find classes the student belongs to
    const studentClasses = await Class.find({
      students: req.user._id,
    }).select("_id");

    const classIds = studentClasses.map((cls) => cls._id);

    const sessions = await Session.find({
      class: { $in: classIds },
    })
      .populate("class", "title courseCode")
      .populate("lecturer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getStudentSessions controller", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};