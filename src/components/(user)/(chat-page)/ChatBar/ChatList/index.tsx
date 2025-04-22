import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/firebase/firebase.config";
import { ChatThread } from "@/interfaces/ chat.interface";
import { User } from "@/interfaces/user.interface";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const ChatList: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    const getUser = async (uid: string): Promise<User | null> => {
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) return null;
        const data = snap.data();
        return { uid: snap.id, ...data } as User;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    };

    const q = query(
      collection(db, "chat_threads"),
      where("participants", "array-contains", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const chatPromises = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const partnerId = data.participants.find(
              (uid: string) => uid !== user.uid
            );

            const partner = (await getUser(partnerId)) as User;

            return {
              cid: doc.id,
              user: partner,
              unread: data?.unread?.[user.uid],
              ...data,
            } as ChatThread;
          });

          const chatList = await Promise.all(chatPromises);
          setChats(chatList);
          setError(null);
        } catch (err) {
          console.error("Error processing chats:", err);
          setError("Failed to load chats");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Snapshot error:", err);
        setError("Failed to listen for chat updates");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  if (isLoading) {
    return <div className="p-4">Loading chats...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {chats.length === 0 ? (
        <p className="text-gray-500">No chats found</p>
      ) : (
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li key={chat.cid} className="flex items-center gap-4">
              <img
                className="size-10 object-cover rounded-full"
                src={chat.user?.photoURL || "/images/avatar.png"}
                alt={chat.user?.displayName || "Unknown user"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/avatar.png";
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xl truncate">
                  {chat.user?.displayName || "Unknown user"}
                </h3>
                {(chat?.unread as number) > 0 ? (
                  <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">
                      {chat?.message?.text || "No message yet"}
                    </p>
                    <span className="ml-2 bg-foreground text-background px-2 py-1 rounded">
                      {chat?.unread as number}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 truncate">
                    {chat?.message?.text || "No message yet"}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
