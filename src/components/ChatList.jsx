import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { LuMessageSquareOff } from "react-icons/lu";
import interceptor from "../middleware/axiosInterceptor";
import useThemeStyles from "../hooks/useThemeStyles";
import socket from "../utils/socket";
import useAuthStore from "../store/authStore";

const API_BASE = "/api/chat";

export default function ChatList({ setShowSettings }) {
  const { grayText, border, shadow, selectedContainerBg, hoverBg } = useThemeStyles();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const myId = user?._id;

  const [chats, setChats] = useState([]);
  const [onlineIds, setOnlineIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // When a conversation is selected from ChatList
  const onSelectChat = (convo) => {
    if (!convo._id) return;
    setShowSettings(false);
    navigate(`/messages/${convo?._id}`);
  };

  // Load conversations
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await interceptor.get(`${API_BASE}/`);
        setChats(data?.conversations || []);
      } catch (e) {
        console.error("Failed to load conversations", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Presence
  useEffect(() => {
    const onOnline = (ids) => setOnlineIds(ids);  // Array of online users

    socket.on("onlineUsers", onOnline);
    socket.emit("getOnlineUsers"); // request snapshot
    return () => socket.off("onlineUsers", onOnline);
  }, []);

  // New messages
  useEffect(() => {
    const onNewMessage = (message) => {
      setChats(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(c => String(c?._id) === String(message.conversationId?._id || message.conversationId));

        if (idx >= 0) {
          const c = { ...copy[idx] };
          c.lastMessage = {
            _id: message._id,
            text: message.text,
            sender: message.sender,
            createdAt: message.createdAt,
          };
          c.updatedAt = message.createdAt;

          const senderId = typeof message.sender === "object" ? message.sender?._id : message?.sender;
          const isOpen = conversationId === c?._id;

          // New message from another user when chat window is close
          if (!isOpen && senderId !== myId) {
            c.unreadCount = (c.unreadCount || 0) + 1;
          }
          copy[idx] = c;

        } else {
          copy.unshift({
            _id: message.conversationId,
            participants: [message.sender, myId],
            lastMessage: {
              _id: message._id,
              text: message.text,
              sender: message.sender,
              createdAt: message.createdAt,
            },
            unreadCount: 1,
            updatedAt: message.createdAt,
          });
        }
        return copy;
      });
    };

    // Receive newMessage event
    socket.on("newMessage", onNewMessage);
    return () => socket.off("newMessage", onNewMessage);
  }, [conversationId, myId]);

  // Mark as read when selected
  useEffect(() => {
    if (!conversationId) return;
    setChats(prev => prev.map(c => c?._id === conversationId ? { ...c, unreadCount: 0 } : c));
  }, [conversationId]);

  // Helper: determine display name + avatar
  const renderLabel = (c) => {
    if (c.isGroup) return { name: c.group_name || "Group", avatar: c.group_avatar || "/group-avatar.png" };

    const others = (c.participants || []).filter(p => {
      const id = typeof p === "object" ? p?._id : p;
      // Neglact my own id
      return String(id) !== String(myId);
    });
    const other = others[0] || {};

    return {
      name: other.profile_name || other.username || "Direct Message",
      avatar: other.avatar || ""
    };
  };

  // Sort chats
  const list = useMemo(() => {
    return (chats || []).slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [chats]);

  const renderLastMessage = (chat) => {
    const msg = chat.lastMessage;
    if (!msg) return "";
    return msg.text || "";
  };


  return (
    <section className={`w-full border-r ${border} ${shadow} flex flex-col`}>
      <h2 className="text-xl font-bold p-4">Messages</h2>

      <div className="overflow-y-auto flex-1">
        {list.length > 0
          ?
          list.map((chat) => {
            const { name, avatar } = renderLabel(chat);

            const unread = chat.unreadCount || 0;
            const isOnline = (!chat.isGroup &&
              (onlineIds || []).some(id => {
                const others = (chat.participants || []).filter(p => String(p?._id || p) !== String(myId)); // Neglact my id
                const otherId = others[0]?._id || others[0];
                return String(id) === String(otherId);
              })
            );

            // Conversation card
            return (
              <div
                key={chat?._id}
                onClick={() => onSelectChat(chat)}
                className={`cursor-pointer px-4 py-3 border-b ${border} ${conversationId === chat?._id ? selectedContainerBg : hoverBg}`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar + online marker */}
                  <div className="relative">
                    <img src={avatar || "/user.png"} alt={name} className="w-8 h-8 rounded-full object-cover" />

                    {!chat?.isGroup && isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  {/* Username + unread count marker + last message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="truncate pr-2">{name}</span>
                      {unread > 0 && (
                        <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{unread}</span>
                      )}
                    </div>
                    <p className={`${grayText} text-sm truncate`}>
                      {renderLastMessage(chat)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
          :
          loading
            ?
            <div className={`w-8 h-8 mx-auto rounded-full border-2 border-dotted ${border} animate-spin`}></div>
            :
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <LuMessageSquareOff className="w-20 h-20 opacity-40" />
              <p className={`${grayText} mt-2`}>No conversations yet</p>
            </div>
        }
      </div>
    </section>
  );
}
