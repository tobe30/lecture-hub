import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { getStreamToken } from "../lib/api";

function useStreamClient(session, loadingSession, currentUserId, canJoin, chatEnabled = true) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);
  const [chatError, setChatError] = useState("");

  useEffect(() => {
    let isMounted = true;
    let videoClientInstance = null;
    let videoCallInstance = null;
    let chatClientInstance = null;

    const initCall = async () => {
      if (loadingSession) return;
      if (!session?.callId) {
        if (isMounted) setIsInitializingCall(false);
        return;
      }

      if (!canJoin) {
        if (isMounted) setIsInitializingCall(false);
        return;
      }

      if (session?.status === "completed") {
        if (isMounted) setIsInitializingCall(false);
        return;
      }

      try {
        setIsInitializingCall(true);
        setChatError("");

        const { token, userId, userName } = await getStreamToken();

        if (!isMounted) return;

        videoClientInstance = await initializeStreamClient(
          {
            id: userId,
            name: userName,
          },
          token
        );

        if (!isMounted) return;
        setStreamClient(videoClientInstance);

        videoCallInstance = videoClientInstance.call("default", session.callId);

        await videoCallInstance.join({
          create: true,
        });

        if (!isMounted) return;
        setCall(videoCallInstance);

        // enable media after join
        try {
          await videoCallInstance.camera.enable();
        } catch (error) {
          console.error("Camera enable failed:", error);
        }

        try {
          await videoCallInstance.microphone.enable();
        } catch (error) {
          console.error("Microphone enable failed:", error);
        }

        // chat init should not block video
        if (chatEnabled) {
          try {
            const apiKey = import.meta.env.VITE_STREAM_API_KEY;
            chatClientInstance = StreamChat.getInstance(apiKey);

            await chatClientInstance.connectUser(
              {
                id: userId,
                name: userName,
                image: "",
              },
              token
            );

            if (!isMounted) return;
            setChatClient(chatClientInstance);

            const chatChannel = chatClientInstance.channel("messaging", session.callId);
            await chatChannel.watch();

            if (!isMounted) return;
            setChannel(chatChannel);
          } catch (error) {
            console.error("Chat initialization failed:", error);
            if (isMounted) {
              setChatError("Video connected, but chat failed to load.");
            }
          }
        }
      } catch (error) {
        console.error("Error initializing Stream:", error);
        toast.error("Failed to connect to live session");
      } finally {
        if (isMounted) setIsInitializingCall(false);
      }
    };

    initCall();

    return () => {
      isMounted = false;

      (async () => {
        try {
          if (videoCallInstance) {
            try {
              await videoCallInstance.leave();
            } catch (error) {
              console.error("Error leaving call:", error);
            }
          }

          if (chatClientInstance) {
            try {
              await chatClientInstance.disconnectUser();
            } catch (error) {
              console.error("Error disconnecting chat user:", error);
            }
          }

          try {
            await disconnectStreamClient();
          } catch (error) {
            console.error("Error disconnecting Stream client:", error);
          }
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session?.callId, session?.status, loadingSession, currentUserId, canJoin, chatEnabled]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    chatError,
    isInitializingCall,
  };
}

export default useStreamClient;