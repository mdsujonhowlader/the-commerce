import { RouterProvider } from "react-router";
import { router } from "./router";
import { useBootstapAuth } from "./features/auth/useBootstrapAuth";

export default function App() {
  useBootstapAuth()
  return <RouterProvider router={router} />;
}
