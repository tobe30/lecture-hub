import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key and secret are missing");
}

export const streamClient = new StreamClient(apiKey, apiSecret);
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async ({ id, name, role }) => {
  try {
    await chatClient.upsertUser({
      id,
      name,
      appRole: role,
    });

    console.log("Stream user upserted successfully", {
      id,
      name,
      appRole: role,
    });
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    throw error;
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};