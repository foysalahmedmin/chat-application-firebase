import React, { createContext, useReducer } from 'react';
import useAuth from '../hooks/useAuth';

export const ChatContext = createContext(null);
const ChatProvider = ({children}) => {
    const {user} = useAuth()
    const INITIAL_STATE = {
        chatId: "null",
        user: {}
    }
    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: user.uid > action.payload.uid
                    ? user.uid + action.payload.uid
                    : action.payload.uid + user.uid
                };
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)
    return (
        <ChatContext.Provider value={{data:state, dispatch}}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;