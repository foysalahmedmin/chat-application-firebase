import ChatsUsers from "./ChatsUsers";
import Navbar from "./Navbar";
import Search from "./Search";

const ChatsBar = () => {
    return (
        <section>
            <Navbar />
            <Search />
            <ChatsUsers />
        </section>
    );
};

export default ChatsBar;