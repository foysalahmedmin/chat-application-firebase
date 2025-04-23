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
import { SearchIcon } from "lucide-react";
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
    <div className={cn("border-b")}>
      <div className="relative">
        <div className="form-control !border-b-0 bg-muted w-full">
          <SearchIcon className="size-5 shrink-0" />
          <input
            type="text"
            name="searchUser"
            placeholder="Search User"
            className="flex-1 h-full outline-0 appearance-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSearching}
          />
        </div>
        {isSearching && (
          <span className="absolute right-4 top-4 loading loading-spinner loading-xs" />
        )}
      </div>

      {error && (
        <p className="text-red-500 px-4 text-sm font-medium my-2">{error}</p>
      )}

      {results?.length > 0 && (
        <ul className="divide-y mt-4">
          {results?.map((user) => (
            <li key={user.uid}>
              <button
                onClick={() => handleSelect(user)}
                className="flex items-center gap-4 w-full px-4 py-2 rounded hover:bg-base-300 transition-colors"
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
