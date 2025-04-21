import { useAuth } from "@/components/providers/AuthProvider";
import { useState } from "react";

const Topbar: React.FC = () => {
  const [showSignOut, setShowSignOut] = useState<boolean>(false);
  const { user, signOut } = useAuth();

  const handleToggleSignOut = () => setShowSignOut((prev) => !prev);

  return (
    <header className="flex justify-between bg-foreground/25 p-4 items-center">
      <div className="flex gap-1 items-center">
        <img className="w-10" src="/images/logo.svg" alt="chat-min logo" />
        <p className="flex items-end gap-1">
          <span className="font-semibold">Chat</span>
          <span className="font-bold text-xl text-primary">MiN</span>
        </p>
      </div>

      {user && (
        <div className="flex items-center gap-4 border-2 rounded-full p-1 h-auto">
          {showSignOut ? (
            <button onClick={signOut} className="btn btn-xs rounded-full">
              Sign Out
            </button>
          ) : (
            <p className="uppercase pl-4 font-medium">
              {user?.displayName || "User"}
            </p>
          )}

          <img
            onClick={handleToggleSignOut}
            src={user?.photoURL || "/images/avatar.png"}
            alt={user?.displayName || "User Avatar"}
            title={user?.displayName || "User"}
            className="size-8 rounded-full object-cover cursor-pointer"
          />
        </div>
      )}
    </header>
  );
};

export default Topbar;
