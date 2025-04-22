import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useRef, useState } from "react";

const Topbar: React.FC = () => {
  const [showSignOut, setShowSignOut] = useState<boolean>(false);
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleSignOut = () => setShowSignOut((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSignOut(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) return null;

  return (
    <header className="flex justify-between items-center bg-foreground/25 p-4 shadow-sm">
      <div className="flex gap-2 items-center">
        <img
          className="w-8 h-8 md:w-10 md:h-10"
          src="/images/logo.svg"
          alt="ChatMiN logo"
          width={40}
          height={40}
        />
        <h1 className="flex items-end gap-1 text-lg md:text-xl">
          <span className="font-semibold">Chat</span>
          <span className="font-bold text-primary">MiN</span>
        </h1>
      </div>

      <div
        ref={dropdownRef}
        className="relative flex items-center gap-2 border-2 border-transparent hover:border-primary/30 rounded-full p-1 transition-all duration-200"
      >
        <span className="pl-3 font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-[160px]">
          {user.displayName || "User"}
        </span>

        <button
          onClick={handleToggleSignOut}
          className="focus:outline-none"
          aria-label="User menu"
        >
          <img
            src={user.photoURL || "/images/avatar.png"}
            alt={user.displayName || "User avatar"}
            className="size-8 md:size-9 rounded-full object-cover border-2 border-primary/20"
            width={36}
            height={36}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/avatar.png";
            }}
          />
        </button>

        {showSignOut && (
          <div className="absolute right-0 top-12 z-10 bg-background shadow-lg rounded-md p-2 w-32">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/10 rounded"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
