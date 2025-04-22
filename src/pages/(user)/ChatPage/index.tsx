import ChatBar from "@/components/(user)/(chat-page)/ChatBar";
import ChatField from "@/components/(user)/(chat-page)/ChatField";

const ChatPage = () => {
  return (
    <main className="h-[calc(100vh-0rem)] flex">
      <aside className="w-60 md:w-80">
        <ChatBar />
      </aside>
      <section className="flex-1">
        <ChatField />
      </section>
    </main>
  );
};

export default ChatPage;
