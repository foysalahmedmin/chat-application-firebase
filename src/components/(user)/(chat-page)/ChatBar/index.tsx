import ChatList from "./ChatList";
import Search from "./Search";
import Topbar from "./Topbar";

const ChatBar = () => {
  return (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="sticky flex items-center top-0 border-b h-16">
        <Topbar />
      </div>
      <Search />
      <ChatList />
    </div>
  );
};

export default ChatBar;
