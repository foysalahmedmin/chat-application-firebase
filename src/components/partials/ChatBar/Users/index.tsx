import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/firebase/firebase.config";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface UserInfo {
  displayName: string;
  photoURL: string;
}

interface LastMessage {
  text?: string;
}

interface ChatData {
  userInfo: UserInfo;
  lastMessage?: LastMessage;
}

type ChatsMap = Record<string, ChatData>;

const Users: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatsMap>({});

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(
      doc(db, "userChats", user.uid),
      (docSnap) => {
        setChats(docSnap.data() as ChatsMap);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="p-4 space-y-4">
      {Object.entries(chats).map(([chatId, chat]) => (
        <div key={chatId} className="flex items-center gap-4">
          <img
            className="size-10 object-cover rounded-full"
            src={chat.userInfo.photoURL}
            alt={chat.userInfo.displayName}
          />
          <div>
            <h3 className="font-semibold text-xl">
              {chat.userInfo.displayName}
            </h3>
            <p className="text-gray-600">
              {chat.lastMessage?.text || "No message yet"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Users;
