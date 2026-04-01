import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    //stream video call ID
    callId:{
        type: String,
        default:"",
    },
    options: {
      chatEnabled: {
        type: Boolean,
        default: true,
      },
      raiseHandEnabled: {
        type: Boolean,
        default: true,
      },
      attendanceEnabled: {
        type: Boolean,
        default: true,
      },
      quizEnabled: {
        type: Boolean,
        default: false,
      },
    },
    attendees: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;