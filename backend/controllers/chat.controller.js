import { chatClient } from "../lib/session.js";

export async function getStreamToken(req, res) {
  try {
    const userId = req.user._id.toString();

    const token = chatClient.createToken(userId);

    res.status(200).json({
      token,
      userId,
      userName: req.user.name,
    });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}