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
interface ChatUser {
  uid: string;
  displayName?: string;
  photoURL?: string;
  [key: string]: unknown;
}

interface ChatState {
  chatId: string;
  user: ChatUser | null;
}

type ChatAction = { type: "CHANGE_USER"; payload: ChatUser };

interface ChatContextType {
  data: ChatState;
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
    chatId: "null",
    user: null,
  };

  const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    if (!user) return state;
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            user.uid > action.payload.uid
              ? user.uid + action.payload.uid
              : action.payload.uid + user.uid,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
