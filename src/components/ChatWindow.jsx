import { useEffect, useRef, useState } from "react";
import interceptor from "../middleware/axiosInterceptor";
import useThemeStyles from "../hooks/useThemeStyles";
import socket from "../utils/socket";
import { IoSettingsOutline } from "react-icons/io5";
import useAuthStore from "../store/authStore";
import { useParams } from "react-router-dom";

const API_BASE = "/api/chat";

export default function ChatWindow({ onOpenSettings }) {
  const { modalsBg, blueButtonBg, border, bgColor, grayText, tagsBg } = useThemeStyles();
  const { conversationId } = useParams();
  const { user } = useAuthStore();
  const myId = user?._id;

  const [messages, setMessages] = useState([]);
  const [peer, setPeer] = useState({});
  const [text, setText] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Connect socket and register user
  useEffect(() => {
    if (!myId) return;
    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      socket.emit("registerUser", myId);
    };

    socket.on("connect", handleConnect);
    return () => socket.off("connect", handleConnect);
  }, [myId]);

  // Join conversation
  useEffect(() => {
    socket.emit("joinConversation", conversationId);
    return () => socket.emit("leaveConversation", conversationId);
  }, [conversationId]);

  // Scroll to bottom on initial load
  const scrollToBottom = () => {
    if (!bottomRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Resolve peer label/avatar
  const renderPeer = async () => {
    try {
      const { data } = await interceptor.get(`${API_BASE}/${conversationId}/convo`);
      const otherUsers = data?.conversation?.participants?.filter(p => String(p._id || p) !== String(myId));
      setPeer({
        name: data?.conversation?.isGroup ? data?.conversation?.group_name : otherUsers?.[0]?.username,
        avatar: data?.conversation?.isGroup ? data?.conversation?.group_avatar : otherUsers?.[0]?.avatar,
        convoId: data?.conversation?._id
      })

    } catch (error) {
      console.log("Error getting peer:", error);
    }
  };
  useEffect(() => {
    if (peer && peer.name && peer.convoId === conversationId) return;
    renderPeer();
  }, [myId, conversationId, peer]);

  // Fetch messages (paginated)
  const fetchMessages = async (reset = false) => {
    if (!conversationId || (!hasMore && !reset)) return;
    setIsLoadingMessages(true);

    try {
      let params = { limit: 20 };

      if (!reset && messages.length > 0) {
        params.before = messages[0]._id;
      }

      const { data } = await interceptor.get(`${API_BASE}/${conversationId}`, { params });

      if (reset) {
        setMessages(data.messages || []);
      } else {
        setMessages(prev => [...data.messages.reverse(), ...prev]);
      }
      setHasMore((data.messages || []).length === 20);
    } catch (e) {
      console.error("Failed to fetch messages", e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Initial load + mark as read 
  useEffect(() => {
    if (!conversationId) return;
    fetchMessages(true);

    // mark as read
    (async () => {
      try {
        await interceptor.post(`${API_BASE}/${conversationId}/mark-as-read`);
      } catch (e) {
        console.error("Failed to mark as read", e);
      }
    })();

    // cleanup
    return () => { setMessages([]); setHasMore(true) };
  }, [conversationId]);

  // Socket: receive new messages
  useEffect(() => {
    const onNewMessage = (message) => {
      const cid = message.conversationId?._id || message.conversationId;
      if (String(cid) !== String(conversationId)) return;
      scrollToBottom();

      setMessages((prev) => {
        const filtered = prev.filter((m) => {
          const optimisticSenderId =
            typeof m.sender === "object" ? m.sender._id : m.sender;
          const newMsgSenderId =
            typeof message.sender === "object" ? message.sender._id : message.sender;

          return !(
            m.__optimistic &&
            m.text === message.text &&
            String(optimisticSenderId) === String(newMsgSenderId)
          );
        });
        return [...filtered, message];
      });
    };

    socket.on("newMessage", onNewMessage);
    return () => socket.off("newMessage", onNewMessage);
  }, [conversationId]);

  // Send message
  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || !conversationId) return;

    // optimistic add
    const temp = {
      _id: `tmp-${Date.now()}`,
      conversationId,
      sender: { _id: myId, username: user.username, avatar: user.avatar },
      text: trimmed,
      createdAt: new Date().toISOString(),
      __optimistic: true,
    };
    setMessages(prev => [...prev, temp]);
    setText("");

    try {
      await interceptor.post(`${API_BASE}/send-message`, { text: trimmed, conversationId });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Detect scroll to top & load more messages
  const handleScroll = () => {
    if (containerRef.current.scrollTop === 0 && hasMore) {
      fetchMessages();
    }
  };

  const isMine = (msg) => {
    const senderId = typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
    return myId && String(senderId) === String(myId);
  };


  return (
    <section className="w-full h-dvh flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${border} ${bgColor}`}>
        <div className="flex items-center gap-3 min-w-0">
          <img src={peer.avatar || "/placeholder-avatar.png"} alt={peer.name} className="w-8 h-8 rounded-full object-cover" />
          <h3 className="font-medium truncate">{peer.name}</h3>
        </div>

        {/* <button onClick={onOpenSettings} aria-label="Open chat settings">
          <IoSettingsOutline size={20} />
        </button> */}
      </div>

      {/* Chat box */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto px-4 py-4 ${modalsBg}`}
        data-lenis-prevent
      >
        {/* Loader for fetching older messages */}
        {isLoadingMessages && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className={`text-sm ${grayText}`}>Loading messages...</span>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages?.length > 0
          ?
          messages.map((msg) => (
            <div key={msg._id} className={`my-2 flex ${isMine(msg) ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[70%] ${isMine(msg) ? "bg-blue-500 text-white" : tagsBg}`}>
                {msg.text}
              </div>
            </div>
          ))
          :
          <p className={`${grayText} text-sm text-center truncate`}>No Chat history.</p>
        }

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t max-md:pb-14 flex items-center gap-2 ${border}`}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className={`flex-1 rounded-full px-4 py-2 border ${border} outline-none`}
          placeholder="Type a message..."
        />

        <button onClick={sendMessage} className={`${blueButtonBg} text-white px-4 py-2 rounded-full`}>
          Send
        </button>
      </div>
    </section>
  );
}
