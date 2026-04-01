import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Class title is required"],
    },

    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      uppercase: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    schedule: {
      type: String,
      default: "",
    },

    capacity: {
      type: Number,
      default: 0,
      min: [1, "Capacity must be at least 1"],
    },

    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    classCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

export default Class;