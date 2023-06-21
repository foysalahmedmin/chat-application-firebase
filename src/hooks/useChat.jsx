import { useContext } from "react";
import { ChatContext } from "../provider/ChatProvider";


const useChat = () => {
    const chat = useContext(ChatContext)
    return chat ;
};

export default useChat;