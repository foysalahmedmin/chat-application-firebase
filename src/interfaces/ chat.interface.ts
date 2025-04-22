import { FieldValue, Timestamp } from "firebase/firestore";
import { User } from "./user.interface";

export interface ChatState {
  cid: string | null;
  user: User | null;
}

export interface ChatThread {
  id?: string;
  cid?: string;
  participants: string[];
  message?: {
    text: string;
    sender: string;
    timestamp: Timestamp | FieldValue;
  };
  unread?:
    | {
        [userId: string]: number;
      }
    | number;
  user?: User;
  [key: string]: unknown;
}

export interface ChatMessage {
  id?: string;
  cid?: string;
  text?: string;
  timestamp?: Timestamp | FieldValue;
  sender?: string;
  readers?: string[];
  [key: string]: unknown;
}
