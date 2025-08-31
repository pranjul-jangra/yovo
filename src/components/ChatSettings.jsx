import { useEffect, useState } from "react";
import interceptor from "../middleware/axiosInterceptor";
import useThemeStyles from "../hooks/useThemeStyles";

const API_BASE = "/api/chat";

export default function ChatSettings({ onBack, onAfterAction }) {
  const { bgColor, border, grayText } = useThemeStyles();
  const [isGroup, setIsGroup] = useState(false);
  const [name, setName] = useState("");

  let conversation;

  useEffect(() => {
    if (conversation) {
      setIsGroup(!!conversation.isGroup);
      setName(conversation.name || "");
    }
  }, [conversation]);

  const conversationId = conversation?._id;

  const hideConversation = async () => {
    try {
      await interceptor.post(`${API_BASE}/conversation/hide`, { conversationId });
      onBack?.();
    } catch (e) {
      console.error("Hide failed", e);
    }
  };

  const unhideConversation = async () => {
    try {
      await interceptor.post(`${API_BASE}/conversation/unhide`, { conversationId });
      onBack?.();
    } catch (e) {
      console.error("Unhide failed", e);
    }
  };

  const renameGroup = async () => {
    try {
      const { data } = await interceptor.post(`${API_BASE}/group/rename`, { conversationId, name });
      onAfterAction?.(data);
    } catch (e) {
      console.error("Rename failed", e);
    }
  };

  const leaveGroup = async () => {
    try {
      const raw = localStorage.getItem("user");
      const me = raw ? JSON.parse(raw) : null;
      await interceptor.post(`${API_BASE}/group/leave`, { conversationId, userId: me?._id });
      onBack?.();
    } catch (e) {
      console.error("Leave failed", e);
    }
  };

  const deleteGroup = async () => {
    try {
      const raw = localStorage.getItem("user");
      const me = raw ? JSON.parse(raw) : null;
      await interceptor.post(`${API_BASE}/group/delete`, { conversationId, userId: me?._id });
      onBack?.();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <div className="w-full md:w-2/3 h-dvh flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${border} ${bgColor}`}>
        <h3 className="font-medium">Chat Settings</h3>
        <button onClick={onBack} className="text-sm text-blue-500">Back</button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Hide / Unhide */}
        <div className="space-y-2">
          <h4 className="font-semibold">Visibility</h4>
          <div className="flex gap-2">
            <button onClick={hideConversation} className="px-3 py-2 border rounded-lg">Hide Conversation</button>
            <button onClick={unhideConversation} className="px-3 py-2 border rounded-lg">Unhide</button>
          </div>
          <p className={`${grayText} text-xs`}>Hidden chats won’t appear in your list until a new message arrives or you unhide.</p>
        </div>

        {/* Group controls */}
        {isGroup && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Group Name</h4>
              <div className="flex gap-2">
                <input
                  className="border rounded-lg px-3 py-2 flex-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter group name"
                />
                <button onClick={renameGroup} className="px-3 py-2 border rounded-lg">Rename</button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={leaveGroup} className="px-3 py-2 border rounded-lg text-red-500">Leave Group</button>
              <button onClick={deleteGroup} className="px-3 py-2 border rounded-lg text-red-600">Delete Group</button>
            </div>
          </div>
        )}

        {!isGroup && (
          <div className={`${grayText} text-sm`}>
            No special settings for direct messages beyond hide/unhide.
          </div>
        )}
      </div>
    </div>
  );
}
