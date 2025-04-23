import AuthenticationLayout from "@/components/layouts/AuthenticationLayout";
import RootLayout from "@/components/layouts/RootLayout";
import UserLayout from "@/components/layouts/UserLayout";
import AuthWrapper from "@/components/wrappers/AuthWrapper";
import SignInPage from "@/pages/(authentication)/SignInPage";
import SignUpPage from "@/pages/(authentication)/SignUpPage";
import ErrorPage from "@/pages/(common)/ErrorPage";
import NotFoundPage from "@/pages/(common)/NotFoundPage";
import ChatPage from "@/pages/(user)/ChatPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: (
          <AuthWrapper>
            <UserLayout />
          </AuthWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <AuthWrapper>
                <ChatPage />
              </AuthWrapper>
            ),
          },
          {
            path: "profile",
            element: (
              <AuthWrapper>
                <ProfilePage />
              </AuthWrapper>
            ),
          },
        ],
      },
      {
        path: "authentication",
        element: <AuthenticationLayout />,
        children: [
          { path: "sign-in", element: <SignInPage /> },
          { path: "sign-up", element: <SignUpPage /> },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
