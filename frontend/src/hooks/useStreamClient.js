import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { getStreamToken } from "../lib/api";
import { disconnectStreamClient, initializeStreamClient } from "../lib/stream";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);
  const [chatError, setChatError] = useState("");

  useEffect(() => {
    let videoCall = null;
    let videoClient = null;
    let chatClientInstance = null;
    let isMounted = true;

    const initCall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session?.status === "completed") return;

      setIsInitializingCall(true);

      try {
        const { token, userId, userName } = await getStreamToken();

        // VIDEO
        videoClient = await initializeStreamClient(
          {
            id: userId,
            name: userName,
          },
          token
        );

        if (!isMounted) return;
        setStreamClient(videoClient);

        videoCall = videoClient.call("default", session.callId);

        if (isHost) {
          await videoCall.getOrCreate({
            data: {
              created_by_id: userId,
            },
          });
        }

        await videoCall.join();

        try {
          await videoCall.camera.enable();
          await videoCall.microphone.enable();
        } catch (mediaError) {
          console.log("Media enable warning:", mediaError);
        }

        if (!isMounted) return;
        setCall(videoCall);
      } catch (error) {
        console.error("Video init error:", error);
        toast.error("Failed to join video call");
        setIsInitializingCall(false);
        return;
      }

      try {
        // CHAT
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey, 
          {
            timeout: 6000,
            enableWSFallback: true,
          }
        );

        const { token, userId, userName } = await getStreamToken();

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
          },
          token
        );

        if (!isMounted) return;
        setChatClient(chatClientInstance);

       const memberIds = [
  session?.lecturer?._id,
  ...(session?.class?.students || []).map((student) => student?._id),
].filter(Boolean);

const chatChannelId = `${session.callId}-chat-v2`;

const chatChannel = chatClientInstance.channel("messaging", chatChannelId, {
  members: memberIds,
});

console.log("Current user:", userId);
console.log("Channel members:", memberIds);
console.log("Chat channel id:", chatChannelId);

await chatChannel.watch();

if (!isMounted) return;
        setChannel(chatChannel);
      } catch (error) {
      console.error("Chat init error:", error);
      setChatError(error.message || "Failed to load chat");

      } finally {
        if (isMounted) setIsInitializingCall(false);
      }
    };

    if (!loadingSession) initCall();

    return () => {
      isMounted = false;

      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session?.callId, session?.status, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
    chatError, // add this
  };
}

export default useStreamClient;