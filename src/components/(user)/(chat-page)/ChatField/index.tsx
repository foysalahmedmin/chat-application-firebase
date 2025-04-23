import { useAuth } from "@/components/providers/AuthProvider";
import { useChat } from "@/components/providers/ChatProvider";
import { db } from "@/firebase/firebase.config";
import { ChatMessage, ChatThread } from "@/interfaces/ chat.interface";
import {
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

const ChatField = () => {
  const { user } = useAuth();
  const { state } = useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages
  useEffect(() => {
    if (!user?.uid || !state?.cid) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "chats", state.cid, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const messages = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as ChatMessage)
          );
          setMessages(messages);
          setError(null);
        } catch (err) {
          console.error("Error processing messages:", err);
          setError("Failed to load messages");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Snapshot error:", err);
        setError("Failed to listen for messages");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [state?.cid, user?.uid]);

  // Mark messages as read
  useEffect(() => {
    if (!user?.uid || !state?.cid || !state.user?.uid) return;

    const markAsRead = async () => {
      try {
        const batch = writeBatch(db);

        // 1. Update messages
        const messagesRef = collection(db, "chats", state?.cid!, "messages");
        const messagesQuery = query(
          messagesRef,
          where("sender", "==", state?.user?.uid!),
          where("readers", "not-in", [user?.uid])
        );

        const messagesSnapshot = await getDocs(messagesQuery);
        messagesSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            readers: arrayUnion(user?.uid),
          });
        });

        // 2. Update thread unread count
        const threadRef = doc(db, "chat_threads", state?.cid!);
        batch.update(threadRef, {
          [`unread.${user?.uid}`]: deleteField(),
        });

        await batch.commit();
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    };

    markAsRead();
  }, [state?.cid, state.user?.uid, user?.uid]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim() || !user?.uid || !state?.cid || !state.user) return;

    try {
      const message: ChatMessage = {
        cid: state.cid,
        text: text.trim(),
        sender: user.uid,
        readers: [user.uid],
        timestamp: serverTimestamp(),
      };

      const thread: Partial<ChatThread> = {
        message: {
          text: text?.trim(),
          sender: user?.uid,
          timestamp: serverTimestamp(),
        },
        [`unread.${state?.user?.uid}`]: increment(1),
      };

      // Batch write
      const batch = writeBatch(db);

      // Add message
      batch.set(doc(collection(db, "chats", state?.cid, "messages")), message);

      // Update thread
      batch.set(doc(db, "chat_threads", state?.cid), thread, { merge: true });

      await batch.commit();
      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  if (!state.user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b h-16 w-full p-4 flex items-center gap-4">
        <img
          src={state.user.photoURL || "/images/avatar.png"}
          alt={state.user.displayName || "User"}
          className="w-10 h-10 rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/avatar.png";
          }}
        />
        <div>
          <h2 className="font-semibold">{state.user.displayName}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === user?.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                msg.sender === user?.uid
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-100 mr-auto"
              }`}
            >
              <p>{msg?.text}</p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="text-xs opacity-75">
                  {msg.timestamp &&
                    "toDate" in msg.timestamp &&
                    msg.timestamp.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
                {msg?.sender === user?.uid && (
                  <span className="text-xs">
                    {msg.readers?.includes(state.user?.uid!) ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="p-4 text-center text-gray-500">Loading messages...</div>
      )}
      {error && <div className="p-4 text-center text-red-500">{error}</div>}
    </div>
  );
};

export default ChatField;
