import { RouterProvider } from "react-router";
import { router } from "./router";
import { useBootstapAuth } from "./features/auth/useBootstrapAuth";
import { Toaster } from "sonner";

export default function App() {
  useBootstapAuth()
  return <div>
    <Toaster position="top-center"/>
    <RouterProvider router={router} />
   
  </div>
}
