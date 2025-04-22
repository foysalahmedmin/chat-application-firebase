import ChatList from "./ChatList";
import Search from "./Search";
import Topbar from "./Topbar";

const ChatBar = () => {
  return (
    <div>
      <Topbar />
      <Search />
      <ChatList />
    </div>
  );
};

export default ChatBar;
