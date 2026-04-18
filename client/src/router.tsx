import { createBrowserRouter } from "react-router";
import CustomerLayout from "./components/layout/CustomerLayout";
import StoreHomePage from "./pages/customer/StoreHomePage";
import { PublicLayout } from "./components/auth/PublicLayout";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { ProtectedLayout } from "./components/auth/ProtectedLayout";
import CustoemrProfilePage from "./pages/customer/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <StoreHomePage />,
      },
      {
        element: <PublicLayout />,
        children: [
          {
            path: "sign-in/*",
            element: <SignInPage />,
          },
          {
            path: "sign-up/*",
            element: <SignUpPage />,
          },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "profile",
            element: <CustoemrProfilePage />,
          },
        ],
      },
    ],
  },
]);
