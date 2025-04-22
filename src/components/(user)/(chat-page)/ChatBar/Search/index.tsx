import { useChat } from "@/components/providers/ChatProvider";
import { db } from "@/firebase/firebase.config";
import { User } from "@/interfaces/user.interface";
import { cn } from "@/lib/utils";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Search: React.FC = () => {
  const { dispatch } = useChat();
  const [text, setText] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    const searchUsers = async () => {
      try {
        if (!text.trim()) {
          setResults([]);
          setError(null);
          return;
        }

        setIsSearching(true);
        setError(null);

        const q = query(
          collection(db, "users"),
          orderBy("search"),
          startAt(text.toLowerCase()),
          endAt(text.toLowerCase() + "\uf8ff")
        );

        const snapshot = await getDocs(q);
        const users = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as User[];

        setResults(users);
      } catch (error) {
        console.error("Search error:", error);
        setError("Failed to search users");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchUsers, 300);

    return () => clearTimeout(timer);
  }, [text]);

  const handleSelect = (user: User) => {
    if (!user.uid) {
      console.error("Selected user has no UID");
      return;
    }

    dispatch({ type: "CHANGE_USER", payload: user });
    setResults([]);
    setText("");
  };

  return (
    <div className={cn("p-4", { "border-b": results.length > 0 })}>
      <div className="mb-4 relative">
        <input
          type="text"
          name="searchUser"
          placeholder="Search User"
          className="input border-0 border-b-2 border-primary rounded-none w-full pr-10"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSearching}
        />
        {isSearching && (
          <span className="absolute right-3 top-3 loading loading-spinner loading-xs" />
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium mb-2">{error}</p>
      )}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((user) => (
            <li key={user.uid}>
              <button
                onClick={() => handleSelect(user)}
                className="flex items-center gap-4 w-full p-2 rounded hover:bg-base-300 transition-colors"
                aria-label={`Select ${user.displayName}`}
              >
                <img
                  className="size-10 object-cover rounded-full"
                  src={user.photoURL || "/images/avatar.png"}
                  alt={user.displayName || "User"}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/images/avatar.png";
                  }}
                />
                <div className="text-left">
                  <h3 className="font-semibold text-xl truncate">
                    {user.displayName || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500">Start a chat</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
