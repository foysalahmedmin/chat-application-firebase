import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/firebase/firebase.config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Search as SearchIcon } from "lucide-react";
import React, { useState } from "react";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

const Search: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchTerm)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot?.empty) {
        const matchedDoc = querySnapshot.docs[0];
        setFoundUser(matchedDoc.data() as User);
        setError("");
      } else {
        setFoundUser(null);
        setError("No user found.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while searching.");
      }
    }
  };

  const handleSelect = async () => {
    if (!user || !foundUser) return;

    const combinedId =
      user.uid > foundUser?.uid
        ? user.uid + foundUser?.uid
        : foundUser?.uid + user?.uid;

    try {
      const chatRef = doc(db, "chats", combinedId);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        await setDoc(chatRef, { messages: [] });

        const currentUserRef = doc(db, "userChats", user?.uid);
        const otherUserRef = doc(db, "userChats", foundUser?.uid);

        await updateDoc(currentUserRef, {
          [`${combinedId}.userInfo`]: {
            uid: foundUser.uid,
            displayName: foundUser.displayName,
            photoURL: foundUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateDoc(otherUserRef, {
          [`${combinedId}.userInfo`]: {
            uid: user?.uid,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while selecting user.");
      }
    }

    setSearchTerm("");
    setFoundUser(null);
  };

  return (
    <div className={`${foundUser ? "border-b-2" : ""} p-4`}>
      <div className="mb-4 relative">
        <input
          type="text"
          name="searchUser"
          placeholder="Search User"
          className="input border-0 border-b-2 border-primary rounded-none w-full pr-10"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          onClick={handleSearch}
          className="absolute right-4 top-0 bottom-0 my-auto text-xl text-primary"
        >
          <SearchIcon />
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium mb-2">{error}</p>
      )}

      {foundUser && (
        <div
          onClick={handleSelect}
          className="flex items-center gap-4 cursor-pointer hover:bg-base-300 p-2 rounded"
        >
          <img
            className="size-10 object-cover rounded-full"
            src={foundUser?.photoURL}
            alt={foundUser?.displayName}
          />
          <div>
            <h3 className="font-semibold text-xl">{foundUser?.displayName}</h3>
            <p className="text-sm text-gray-500">Start a chat</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
