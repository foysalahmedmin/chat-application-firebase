import { RouterProvider } from "react-router";
import { AuthProvider } from "./components/providers/AuthProvider";
import { ChatProvider } from "./components/providers/ChatProvider";
import { router } from "./routes";

const App = () => {
  return (
    <>
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </AuthProvider>
    </>
  );
};

export default App;
