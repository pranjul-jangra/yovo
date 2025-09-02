import { useEffect, useMemo, useState, lazy } from "react";
import { useParams } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import socket from "../utils/socket";
import useAuthStore from "../store/authStore";
import interceptor from "../middleware/axiosInterceptor";
const ChatSettings = lazy(() => import("../components/ChatSettings"));


export default function MessagesPage() {
  const { bgColor, grayText, border } = useThemeStyles();
  const { conversationId } = useParams();
  const { user, setUser } = useAuthStore();
  const myId = user?._id;

  const [showSettings, setShowSettings] = useState(false);

  // Fetch my profile info 
  const fetchMyProfile = async () => {
    try {
      const res = await interceptor.get(`/api/profile/me`);
      setUser(res.data?.user);

    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  useEffect(() => {
    if (!user?._id || !user?.username || !user?.email) fetchMyProfile();
  }, []);

  // Connect socket and register user
  useEffect(() => {
    if (!myId) return;
    if (!socket.connected) socket.connect();
    socket.emit("registerUser", myId);
  }, [myId]);

  const rightPane = useMemo(() => {
    if (!conversationId) {
      return (
        <div className={`flex-1 hidden md:flex items-center justify-center text-sm ${grayText} mt-4`}>
          Select a chat to start messaging
        </div>
      );
    }

    if (showSettings) {
      return <ChatSettings onBack={() => setShowSettings(false)} onAfterAction={() => alert("")} />;
    }

    return <ChatWindow myId={myId} onOpenSettings={() => setShowSettings(true)} />;
  }, [conversationId, showSettings, myId]);

  return (
    <main className={`${bgColor} min-h-screen flex`}>
      <Sidebar />

      {/* ChatList: hidden on small screens if a chat is open */}
      <div className={`${conversationId ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r ${border}`} >
        <ChatList
          myId={myId}
          setShowSettings={setShowSettings}
          selectedConversationId={conversationId || null}
        />
      </div>

      {/* Right Pane: takes full width on mobile when a chat is open */}
      <div className="flex-1">{rightPane}</div>
    </main>
  );
}
