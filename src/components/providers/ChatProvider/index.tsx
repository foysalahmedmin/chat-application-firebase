import { ChatState } from "@/interfaces/ chat.interface";
import { User } from "@/interfaces/user.interface";
import { generateChatId } from "@/utils/generateChatId";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { useAuth } from "../AuthProvider";

// ----------------------
// Type Definitions
// ----------------------
type ChatAction = { type: "CHANGE_USER"; payload: User };

interface ChatContextType {
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
}

interface ChatProviderProps {
  children: ReactNode;
}

// ----------------------
// Context & Hook
// ----------------------
export const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = (): ChatContextType => {
  const chat = useContext(ChatContext);
  if (!chat) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return chat;
};

// ----------------------
// Provider
// ----------------------
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const INITIAL_STATE: ChatState = {
    cid: null,
    user: null,
  };

  const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    if (!user) return state;
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          cid: generateChatId(user?.uid, action?.payload?.uid),
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
